const fs = require('fs');

// data.js 로드
function loadDataJS() {
    const dataPath = 'js/data.js';
    const dataContent = fs.readFileSync(dataPath, 'utf8');
    const uniformMatch = dataContent.match(/const uniformData = (\[[\s\S]*?\]);/);
    return eval(uniformMatch[1]);
}

// 크롤링된 제품 로드
function loadCrawledProducts() {
    const crawledPath = 'crawler/sportsdirect-products.json';
    const content = fs.readFileSync(crawledPath, 'utf8');
    return JSON.parse(content);
}

// 팀명 정규화 (비교를 위해)
function normalizeTeamName(name) {
    return name.toLowerCase().replace(/\s+/g, '');
}

// 제품 매칭
function matchProducts(existingProducts, crawledProducts) {
    const matches = [];
    const newProducts = [];

    for (const crawled of crawledProducts) {
        let matched = false;

        for (const existing of existingProducts) {
            // 매칭 조건: 팀명, 시즌, 키트 타입이 모두 일치
            const teamMatch = normalizeTeamName(existing.team) === normalizeTeamName(crawled.team);
            const seasonMatch = existing.season === crawled.season;
            const kitMatch = existing.kit_type === crawled.kitType;
            const versionMatch = existing.version === crawled.version;

            if (teamMatch && seasonMatch && kitMatch && versionMatch) {
                matches.push({
                    existing: existing,
                    crawled: crawled,
                    hasSDLink: existing.site_offers && existing.site_offers.some(s =>
                        s.affiliate_link && s.affiliate_link.includes('sportsdirect.com')
                    )
                });
                matched = true;
                break;
            }
        }

        if (!matched) {
            newProducts.push(crawled);
        }
    }

    return { matches, newProducts };
}

// 메인
function main() {
    console.log('🔍 제품 매칭 시작\n');

    const existingProducts = loadDataJS();
    const crawledProducts = loadCrawledProducts();

    console.log(`📊 기존 제품: ${existingProducts.length}개`);
    console.log(`🕷️  크롤링된 제품: ${crawledProducts.length}개\n`);

    const { matches, newProducts } = matchProducts(existingProducts, crawledProducts);

    console.log('='.repeat(60));
    console.log(`✅ 매칭된 제품: ${matches.length}개`);
    console.log(`🆕 신규 제품: ${newProducts.length}개\n`);

    // 매칭된 제품 중 스포츠다이렉트 링크가 없는 것
    const needsSDLink = matches.filter(m => !m.hasSDLink);
    console.log(`🔗 스포츠다이렉트 링크 추가 필요: ${needsSDLink.length}개\n`);

    if (needsSDLink.length > 0) {
        console.log('📋 링크 추가가 필요한 제품:');
        needsSDLink.forEach((m, i) => {
            console.log(`\n${i + 1}. ${m.existing.team} - ${m.existing.kit_type} (${m.existing.season}) ${m.existing.version}`);
            console.log(`   모델코드: ${m.existing.model_code}`);
            console.log(`   크롤링된 가격: £${m.crawled.currentPrice}`);
            console.log(`   URL: ${m.crawled.productUrl}`);
        });
    }

    if (newProducts.length > 0) {
        console.log('\n\n🆕 신규 제품 목록:');
        newProducts.forEach((p, i) => {
            console.log(`\n${i + 1}. ${p.team} - ${p.kitType} (${p.season}) ${p.version}`);
            console.log(`   제품명: ${p.name}`);
            console.log(`   브랜드: ${p.brand}`);
            console.log(`   가격: £${p.currentPrice}`);
            console.log(`   URL: ${p.productUrl}`);
        });
    }

    // 결과 저장
    const result = {
        summary: {
            totalExisting: existingProducts.length,
            totalCrawled: crawledProducts.length,
            matched: matches.length,
            needsSDLink: needsSDLink.length,
            newProducts: newProducts.length
        },
        needsSDLink: needsSDLink.map(m => ({
            team: m.existing.team,
            kitType: m.existing.kit_type,
            season: m.existing.season,
            version: m.existing.version,
            modelCode: m.existing.model_code,
            crawledPrice: m.crawled.currentPrice,
            crawledRegularPrice: m.crawled.regularPrice,
            productUrl: m.crawled.productUrl,
            productId: m.crawled.productId
        })),
        newProducts: newProducts
    };

    fs.writeFileSync('crawler/match-result.json', JSON.stringify(result, null, 2));
    console.log(`\n\n✅ 매칭 결과 저장: crawler/match-result.json`);
}

main();
