const fs = require('fs');

// 기존 데이터 로드
const dataFileContent = fs.readFileSync('js/data.js', 'utf8');
const uniformDataMatch = dataFileContent.match(/const uniformData = (\[[\s\S]*?\]);/);
const uniformData = uniformDataMatch ? JSON.parse(uniformDataMatch[1]) : [];
const capoProducts = JSON.parse(fs.readFileSync('crawler/capostore-products.json', 'utf8'));

console.log('🔍 Starting Capo Store matching...\n');
console.log(`📊 Uniform data: ${uniformData.length} items`);
console.log(`🏪 Capo Store: ${capoProducts.length} products\n`);

// 모델 코드로 카포스토어 제품 인덱스 생성
const capoByModel = {};
capoProducts.forEach(product => {
    const normalizedCode = product.modelCode.toUpperCase().replace(/[-_]/g, '');
    capoByModel[normalizedCode] = product;
});

console.log(`📋 Capo Store products indexed by ${Object.keys(capoByModel).length} unique model codes\n`);

// 환율 (KRW to GBP, USD 등)
const KRW_TO_USD = 1 / 1300; // 대략적인 환율

let matchedCount = 0;
let addedCount = 0;
let updatedCount = 0;

// 각 유니폼 데이터와 매칭
uniformData.forEach(uniform => {
    if (!uniform.model_code) return;

    // 모델 코드 정규화 (하이픈, 언더스코어 제거)
    const normalizedCode = uniform.model_code.toUpperCase().replace(/[-_]/g, '');

    const capoProduct = capoByModel[normalizedCode];

    if (capoProduct) {
        matchedCount++;

        // 이미 카포스토어 제품이 있는지 확인
        const existingCapo = uniform.site_offers.find(offer => offer.site_name === '카포스토어');

        if (existingCapo) {
            // 가격 업데이트
            existingCapo.regular_price_krw = capoProduct.originalPrice;
            existingCapo.sale_price_krw = capoProduct.salePrice;
            existingCapo.discount_rate = capoProduct.discountRate;
            existingCapo.affiliate_link = capoProduct.url;
            updatedCount++;
            console.log(`✏️  Updated: ${uniform.name} (${uniform.model_code})`);
        } else {
            // 새로 추가
            uniform.site_offers.push({
                site_name: '카포스토어',
                currency: 'KRW',
                regular_price: Math.round(capoProduct.originalPrice * KRW_TO_USD),
                sale_price: Math.round(capoProduct.salePrice * KRW_TO_USD),
                regular_price_krw: capoProduct.originalPrice,
                sale_price_krw: capoProduct.salePrice,
                discount_rate: capoProduct.discountRate,
                affiliate_link: capoProduct.url
            });
            addedCount++;
            console.log(`✅ Added: ${uniform.name} (${uniform.model_code})`);
            console.log(`   Capo: ${capoProduct.name}`);
            console.log(`   Price: ${capoProduct.originalPrice.toLocaleString()}원 → ${capoProduct.salePrice.toLocaleString()}원 (${capoProduct.discountRate}% off)`);
        }

        // visible을 true로 설정 (판매처가 생겼으므로)
        if (!uniform.visible) {
            uniform.visible = true;
        }
    }
});

console.log('\n📊 Matching Results:');
console.log(`   ✅ Matched: ${matchedCount} products`);
console.log(`   ➕ Added new: ${addedCount} offers`);
console.log(`   ✏️  Updated existing: ${updatedCount} offers`);

// 결과를 새 파일로 저장
const outputData = `// 유니폼 데이터
const uniformData = ${JSON.stringify(uniformData, null, 4)};
`;

fs.writeFileSync('js/data-new.js', outputData);
console.log('\n💾 Saved updated data to: js/data-new.js');

// 매칭 통계
const withCapo = uniformData.filter(u => u.site_offers.some(o => o.site_name === '카포스토어'));
console.log(`\n📈 Total uniforms with Capo Store: ${withCapo.length}`);

// 매칭되지 않은 카포스토어 제품들
const unmatchedCapo = capoProducts.filter(capo => {
    const normalizedCode = capo.modelCode.toUpperCase().replace(/[-_]/g, '');
    return !uniformData.some(u => {
        const uCode = (u.model_code || '').toUpperCase().replace(/[-_]/g, '');
        return uCode === normalizedCode;
    });
});

console.log(`\n⚠️  Unmatched Capo Store products: ${unmatchedCapo.length}`);
if (unmatchedCapo.length > 0 && unmatchedCapo.length <= 20) {
    console.log('\nSample unmatched products:');
    unmatchedCapo.slice(0, 10).forEach(p => {
        console.log(`   - ${p.name} (${p.modelCode})`);
    });
}

console.log('\n✨ Done!');
console.log('Next steps:');
console.log('1. Review js/data-new.js');
console.log('2. If everything looks good, run: mv js/data-new.js js/data.js');
