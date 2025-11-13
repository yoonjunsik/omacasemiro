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

// match-result.json에 있는 제품 + 새로 크롤링한 제품
const crawledProducts = JSON.parse(fs.readFileSync('crawler/manual-crawl-results.json', 'utf8'));

const { content, data: uniformData } = loadDataJS();

console.log('🔍 제품 매칭 시작\n');
console.log(`기존 제품: ${uniformData.length}개`);
console.log(`크롤링된 제품: ${crawledProducts.length}개\n`);

const GBP_TO_KRW = 1670; // 파운드 환율

let matchedCount = 0;
let skippedCount = 0;
let failedCount = 0;

crawledProducts.forEach(crawled => {
    // team이 null인 경우 스킵
    if (!crawled.team || !crawled.season || !crawled.kitType) {
        console.log(`⚠️ 스킵: ${crawled.name} (팀/시즌/키트타입 정보 없음)`);
        skippedCount++;
        return;
    }

    // 매칭되는 제품 찾기
    const product = uniformData.find(p =>
        p.team === crawled.team &&
        p.season === crawled.season &&
        p.kit_type === crawled.kitType &&
        p.version === crawled.version
    );

    if (product) {
        // 이미 스포츠다이렉트 판매처가 있는지 확인
        const hasSD = product.site_offers && product.site_offers.some(s =>
            s.affiliate_link && s.affiliate_link.includes('sportsdirect.com')
        );

        if (hasSD) {
            console.log(`⏭️  이미 있음: ${product.team} ${product.season} ${product.kit_type} (${product.version})`);
            skippedCount++;
        } else {
            // site_offers 배열이 없으면 생성
            if (!product.site_offers) {
                product.site_offers = [];
            }

            // 스포츠다이렉트 판매처 추가
            product.site_offers.push({
                site_name: '스포츠다이렉트',
                currency: 'GBP',
                regular_price: crawled.regularPrice,
                sale_price: crawled.currentPrice,
                regular_price_krw: Math.round(crawled.regularPrice * GBP_TO_KRW),
                sale_price_krw: Math.round(crawled.currentPrice * GBP_TO_KRW),
                discount_rate: crawled.discountRate,
                affiliate_link: crawled.productUrl
            });

            console.log(`✅ 추가: ${product.team} ${product.season} ${product.kit_type} (${product.version}) - £${crawled.currentPrice}`);
            matchedCount++;
        }
    } else {
        console.log(`❌ 매칭 실패: ${crawled.team} ${crawled.season} ${crawled.kitType} (${crawled.version})`);
        failedCount++;
    }
});

console.log('\n📊 매칭 결과:');
console.log(`   ✅ 매칭 성공 (판매처 추가): ${matchedCount}개`);
console.log(`   ⏭️  스킵 (이미 있음 또는 정보 부족): ${skippedCount}개`);
console.log(`   ❌ 매칭 실패 (데이터에 없음): ${failedCount}개`);

if (matchedCount > 0) {
    // uniformData를 JSON 문자열로 변환
    const dataString = JSON.stringify(uniformData, null, 4);

    // const uniformData = [...] 부분을 교체
    const newContent = content.replace(
        /const uniformData = \[[\s\S]*?\];/,
        `const uniformData = ${dataString};`
    );

    // 백업 생성
    fs.writeFileSync('js/data.js.backup', content);
    console.log('\n💾 백업 생성: js/data.js.backup');

    // 새 파일 저장
    fs.writeFileSync('js/data.js', newContent);
    console.log('💾 data.js 업데이트 완료');
    console.log(`\n✅ 총 ${matchedCount}개 제품에 스포츠다이렉트 판매처 추가됨!`);
} else {
    console.log('\n⚠️ 추가할 판매처가 없습니다.');
}
