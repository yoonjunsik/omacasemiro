const fs = require('fs');

// data.js 로드
function loadDataJS() {
    const dataPath = 'js/data.js';
    const dataContent = fs.readFileSync(dataPath, 'utf8');
    const uniformMatch = dataContent.match(/const uniformData = (\[[\s\S]*?\]);/);
    return {
        content: dataContent,
        data: eval(uniformMatch[1])
    };
}

// match-result.json 로드
function loadMatchResult() {
    const content = fs.readFileSync('crawler/match-result.json', 'utf8');
    return JSON.parse(content);
}

// 원화 환율 (참고용, 실제로는 site_offers에 이미 있음)
const GBP_TO_KRW = 1670;

// 판매처 정보 추가
function addSellersToExisting(uniformData, needsSDLink) {
    let updateCount = 0;

    needsSDLink.forEach(item => {
        // 매칭되는 제품 찾기
        const product = uniformData.find(p =>
            p.team === item.team &&
            p.season === item.season &&
            p.kit_type === item.kitType &&
            p.version === item.version
        );

        if (product) {
            // 스포츠다이렉트 판매처가 이미 있는지 확인
            const hasSD = product.site_offers && product.site_offers.some(s =>
                s.affiliate_link && s.affiliate_link.includes('sportsdirect.com')
            );

            if (!hasSD) {
                // site_offers 배열이 없으면 생성
                if (!product.site_offers) {
                    product.site_offers = [];
                }

                // 스포츠다이렉트 판매처 추가
                product.site_offers.push({
                    site_name: '스포츠다이렉트',
                    currency: 'GBP',
                    regular_price: item.crawledRegularPrice,
                    sale_price: item.crawledPrice,
                    regular_price_krw: Math.round(item.crawledRegularPrice * GBP_TO_KRW),
                    sale_price_krw: Math.round(item.crawledPrice * GBP_TO_KRW),
                    discount_rate: Math.round((1 - item.crawledPrice / item.crawledRegularPrice) * 100),
                    affiliate_link: item.productUrl
                });

                updateCount++;
                console.log(`   ✅ ${product.team} - ${product.kit_type} (${product.season}) ${product.version}`);
            }
        }
    });

    return updateCount;
}

// 신규 제품 추가
function addNewProducts(uniformData, newProducts) {
    newProducts.forEach(item => {
        // 모델 코드 생성 (간단히 브랜드 + Product ID)
        const modelCode = `${item.brand.toUpperCase()}-${item.productId || 'UNKNOWN'}`;

        const newProduct = {
            team: item.team,
            kit_type: item.kitType,
            season: item.season,
            version: item.version,
            name: `${item.team} ${item.season} ${item.kitType} (${item.version})`,
            model_code: modelCode,
            image: '', // 이미지는 나중에 수동으로 추가
            site_offers: [{
                site_name: '스포츠다이렉트',
                currency: item.currency,
                regular_price: item.regularPrice,
                sale_price: item.currentPrice,
                regular_price_krw: Math.round(item.regularPrice * GBP_TO_KRW),
                sale_price_krw: Math.round(item.currentPrice * GBP_TO_KRW),
                discount_rate: item.discountRate,
                affiliate_link: item.productUrl
            }],
            visible: true
        };

        uniformData.push(newProduct);
        console.log(`   ✅ ${newProduct.name}`);
    });

    return newProducts.length;
}

// data.js 저장
function saveDataJS(content, uniformData) {
    // uniformData를 JSON 문자열로 변환
    const dataString = JSON.stringify(uniformData, null, 4);

    // const uniformData = [...] 부분을 교체
    const newContent = content.replace(
        /const uniformData = \[[\s\S]*?\];/,
        `const uniformData = ${dataString};`
    );

    // 백업 생성
    fs.writeFileSync('js/data.js.backup', content);
    console.log('   💾 백업 생성: js/data.js.backup');

    // 새 파일 저장
    fs.writeFileSync('js/data.js', newContent);
    console.log('   💾 data.js 업데이트 완료');
}

// 메인
function main() {
    console.log('🚀 data.js 업데이트 시작\n');

    // 1. 데이터 로드
    const { content, data: uniformData } = loadDataJS();
    const matchResult = loadMatchResult();

    console.log(`📦 기존 제품: ${uniformData.length}개`);
    console.log(`🔗 판매처 추가: ${matchResult.needsSDLink.length}개`);
    console.log(`🆕 신규 제품: ${matchResult.newProducts.length}개\n`);

    // 2. 판매처 정보 추가
    if (matchResult.needsSDLink.length > 0) {
        console.log('='.repeat(60));
        console.log('1️⃣  판매처 정보 추가');
        console.log('='.repeat(60));
        const updateCount = addSellersToExisting(uniformData, matchResult.needsSDLink);
        console.log(`\n   총 ${updateCount}개 제품에 판매처 추가됨\n`);
    }

    // 3. 신규 제품 추가
    if (matchResult.newProducts.length > 0) {
        console.log('='.repeat(60));
        console.log('2️⃣  신규 제품 추가');
        console.log('='.repeat(60));
        const addCount = addNewProducts(uniformData, matchResult.newProducts);
        console.log(`\n   총 ${addCount}개 신규 제품 추가됨\n`);
    }

    // 4. 저장
    console.log('='.repeat(60));
    console.log('3️⃣  파일 저장');
    console.log('='.repeat(60));
    saveDataJS(content, uniformData);

    console.log('\n✅ 업데이트 완료!');
    console.log(`   최종 제품 수: ${uniformData.length}개\n`);
}

main();
