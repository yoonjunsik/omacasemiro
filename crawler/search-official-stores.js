const fs = require('fs');

// 데이터 로드
const dataFileContent = fs.readFileSync('js/data.js', 'utf8');
const uniformDataMatch = dataFileContent.match(/const uniformData = (\[[\s\S]*?\]);/);
const uniformData = uniformDataMatch ? JSON.parse(uniformDataMatch[1]) : [];

console.log('🔍 Extracting model codes and searching official stores...\n');
console.log(`📊 Total products: ${uniformData.length}\n`);

// 모델 코드별로 그룹화
const modelCodes = {};
uniformData.forEach(product => {
    if (product.model_code && product.visible) {
        const baseCode = product.model_code.replace('-AUTH', '');
        if (!modelCodes[baseCode]) {
            modelCodes[baseCode] = {
                code: baseCode,
                team: product.team,
                season: product.season,
                kit_type: product.kit_type,
                products: []
            };
        }
        modelCodes[baseCode].products.push(product);
    }
});

// 브랜드별 공식 스토어 URL
const officialStores = {
    'adidas': {
        kr: 'https://www.adidas.co.kr',
        global: 'https://www.adidas.com'
    },
    'nike': {
        kr: 'https://www.nike.com/kr',
        global: 'https://www.nike.com'
    },
    'puma': {
        kr: 'https://kr.puma.com',
        global: 'https://www.puma.com'
    }
};

// 구단별 공식 스토어
const clubStores = {
    '맨체스터 유나이티드': 'https://store.manutd.com',
    '맨체스터 시티': 'https://shop.mancity.com',
    '리버풀': 'https://store.liverpoolfc.com',
    '첼시': 'https://www.chelseamegastore.com',
    '아스널': 'https://arsenaldirect.arsenal.com',
    '토트넘': 'https://shop.tottenhamhotspur.com',
    '레알 마드리드': 'https://shop.realmadrid.com',
    '바르셀로나': 'https://store.fcbarcelona.com',
    '바이에른 뮌헨': 'https://fcbayern.com/shop',
    '유벤투스': 'https://store.juventus.com',
    'AC 밀란': 'https://store.acmilan.com',
    '인터 밀란': 'https://store.inter.it',
    'PSG': 'https://store.psg.fr'
};

// 검색 URL 생성
console.log('📋 Search URLs for each product:\n');
console.log('=' .repeat(80));

Object.values(modelCodes).forEach(item => {
    console.log(`\n🔍 ${item.team} ${item.season} ${item.kit_type}`);
    console.log(`   Model Code: ${item.code}`);
    console.log(`   Products: ${item.products.length}`);

    // 아디다스 제품인지 확인 (대부분 아디다스)
    console.log(`\n   📍 Search URLs:`);
    console.log(`   - Adidas Korea: https://www.adidas.co.kr/search?q=${item.code}`);
    console.log(`   - Adidas Global: https://www.adidas.com/us/search?q=${item.code}`);

    // 구단 스토어
    const clubStore = clubStores[item.team];
    if (clubStore) {
        console.log(`   - ${item.team} Official: ${clubStore}/search?q=${item.code}`);
    }

    console.log('-'.repeat(80));
});

console.log(`\n\n✅ Total unique model codes: ${Object.keys(modelCodes).length}`);
console.log(`\n💡 Next steps:`);
console.log('1. Open each search URL above');
console.log('2. Find the product and copy the price + product URL');
console.log('3. Run the add-store-data.js script to add the information');

// 검색 결과를 저장할 템플릿 생성
const searchResults = Object.values(modelCodes).map(item => ({
    model_code: item.code,
    team: item.team,
    season: item.season,
    kit_type: item.kit_type,
    search_urls: {
        adidas_kr: `https://www.adidas.co.kr/search?q=${item.code}`,
        adidas_global: `https://www.adidas.com/us/search?q=${item.code}`,
        club_store: clubStores[item.team] ? `${clubStores[item.team]}/search?q=${item.code}` : null
    },
    found_stores: []  // 여기에 수동으로 발견한 스토어 정보를 추가
}));

fs.writeFileSync('crawler/search-results-template.json', JSON.stringify(searchResults, null, 2));
console.log('\n💾 Search template saved to: crawler/search-results-template.json');
