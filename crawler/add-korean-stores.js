const fs = require('fs');

// 데이터 로드
const dataFileContent = fs.readFileSync('js/data.js', 'utf8');
const uniformDataMatch = dataFileContent.match(/const uniformData = (\[[\s\S]*?\]);/);
const uniformData = uniformDataMatch ? JSON.parse(uniformDataMatch[1]) : [];

console.log('🏪 Adding Korean Store Data...\n');

// 추가할 판매처 데이터 (웹 검색으로 찾은 정보)
const newStoreData = {
    // 맨유 홈킷 JI7428
    'JI7428': [
        {
            site_name: '무신사',
            currency: 'KRW',
            regular_price: 119000,
            sale_price: 119000,
            regular_price_krw: 119000,
            sale_price_krw: 119000,
            discount_rate: 0,
            affiliate_link: 'https://www.musinsa.com/products/5180206'
        },
        {
            site_name: '지그재그',
            currency: 'KRW',
            regular_price: 119000,
            sale_price: 97000,
            regular_price_krw: 119000,
            sale_price_krw: 97000,
            discount_rate: 18,
            affiliate_link: 'https://zigzag.kr/catalog/products/163384852'
        },
        {
            site_name: 'GS SHOP',
            currency: 'KRW',
            regular_price: 106000,
            sale_price: 98580,
            regular_price_krw: 106000,
            sale_price_krw: 98580,
            discount_rate: 7,
            affiliate_link: 'https://m.gsshop.com/search/searchSect.gs?tq=맨유유니폼&mseq=406355'
        }
    ]
};

let updatedCount = 0;
let addedCount = 0;

// 각 제품에 판매처 정보 추가
uniformData.forEach(product => {
    const storeInfo = newStoreData[product.model_code];

    if (storeInfo && Array.isArray(storeInfo)) {
        storeInfo.forEach(store => {
            // 이미 해당 사이트가 있는지 확인
            const existingStore = product.site_offers.find(offer => offer.site_name === store.site_name);

            if (existingStore) {
                // 기존 정보 업데이트
                Object.assign(existingStore, store);
                updatedCount++;
                console.log(`✏️  Updated: ${product.name} - ${store.site_name}`);
            } else {
                // 새로 추가
                product.site_offers.push(store);
                addedCount++;
                console.log(`✅ Added: ${product.name} - ${store.site_name}`);
                console.log(`   Price: ${store.regular_price_krw.toLocaleString()}원 → ${store.sale_price_krw.toLocaleString()}원 (${store.discount_rate}% off)`);
            }
        });

        // visible 설정
        if (product.site_offers.length > 0 && !product.visible) {
            product.visible = true;
        }
    }
});

console.log(`\n\n📊 Results:`);
console.log(`   ✅ Added: ${addedCount} offers`);
console.log(`   ✏️  Updated: ${updatedCount} offers`);

// 결과 저장
if (addedCount > 0 || updatedCount > 0) {
    const outputData = `// 유니폼 데이터\nconst uniformData = ${JSON.stringify(uniformData, null, 4)};\n`;

    fs.writeFileSync('js/data-with-korean-stores.js', outputData);
    console.log('\n💾 Saved to: js/data-with-korean-stores.js');
    console.log('\nNext steps:');
    console.log('1. Review js/data-with-korean-stores.js');
    console.log('2. If everything looks good, run: mv js/data-with-korean-stores.js js/data.js');
} else {
    console.log('\n⚠️  No changes made');
}
