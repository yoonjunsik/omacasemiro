const fs = require('fs');

// 데이터 로드
const dataFileContent = fs.readFileSync('js/data.js', 'utf8');
const uniformDataMatch = dataFileContent.match(/const uniformData = (\[[\s\S]*?\]);/);
const uniformData = uniformDataMatch ? JSON.parse(uniformDataMatch[1]) : [];

console.log('🔍 Generating search URLs for Korean stores...\n');

// 한국 주요 온라인 쇼핑몰
const koreanStores = {
    '무신사': {
        search_url: 'https://www.musinsa.com/search/musinsa/goods?q=',
        name: '무신사'
    },
    '29CM': {
        search_url: 'https://www.29cm.co.kr/search?keyword=',
        name: '29CM'
    },
    'W컨셉': {
        search_url: 'https://www.wconcept.co.kr/Search?keyword=',
        name: 'W컨셉'
    },
    '카카오톡 선물하기': {
        search_url: 'https://gift.kakao.com/search?q=',
        name: '카카오톡 선물하기'
    },
    '쿠팡': {
        search_url: 'https://www.coupang.com/np/search?q=',
        name: '쿠팡'
    },
    'G마켓': {
        search_url: 'http://browse.gmarket.co.kr/search?keyword=',
        name: 'G마켓'
    },
    '11번가': {
        search_url: 'https://search.11st.co.kr/Search.tmall?kwd=',
        name: '11번가'
    },
    '신세계몰': {
        search_url: 'https://www.ssg.com/search.ssg?query=',
        name: '신세계몰'
    },
    '롯데온': {
        search_url: 'https://www.lotteon.com/search/search/search.ecn?render=search&platform=pc&q=',
        name: '롯데온'
    }
};

// 브랜드/팀별 키워드 매핑
const searchKeywords = {
    '맨체스터 유나이티드': ['맨유', '맨체스터 유나이티드', 'Manchester United'],
    '맨체스터 시티': ['맨시티', '맨체스터 시티', 'Manchester City'],
    '리버풀': ['리버풀', 'Liverpool'],
    '첼시': ['첼시', 'Chelsea'],
    '아스널': ['아스널', 'Arsenal'],
    '토트넘': ['토트넘', 'Tottenham'],
    '레알 마드리드': ['레알 마드리드', '레알', 'Real Madrid'],
    '바르셀로나': ['바르셀로나', '바르샤', 'Barcelona'],
    'PSG': ['PSG', '파리생제르맹'],
    '바이에른 뮌헨': ['바이에른', 'Bayern'],
    '유벤투스': ['유벤투스', 'Juventus'],
    'AC 밀란': ['AC밀란', 'AC Milan'],
    '인터 밀란': ['인터', 'Inter Milan']
};

// 검색 URL 생성
const searchResults = [];

uniformData.forEach(product => {
    if (!product.visible || !product.model_code) return;

    const teamKeywords = searchKeywords[product.team] || [product.team];
    const modelCode = product.model_code.replace('-AUTH', '');

    const productSearch = {
        model_code: modelCode,
        team: product.team,
        season: product.season,
        kit_type: product.kit_type,
        name: product.name,
        search_urls: {}
    };

    // 각 스토어별로 검색 URL 생성
    Object.entries(koreanStores).forEach(([storeName, storeInfo]) => {
        // 팀명 + 모델 코드로 검색
        const searchQuery = `${teamKeywords[0]} ${modelCode}`;
        productSearch.search_urls[storeName] = storeInfo.search_url + encodeURIComponent(searchQuery);
    });

    searchResults.push(productSearch);
});

console.log(`✅ Generated search URLs for ${searchResults.length} products\n`);

// 검색 가이드 출력
console.log('📋 Search Guide:\n');
console.log('=' .repeat(80));

searchResults.slice(0, 5).forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.name} (${result.model_code})`);
    console.log('   Search URLs:');
    Object.entries(result.search_urls).forEach(([store, url]) => {
        console.log(`   - ${store}: ${url}`);
    });
    console.log('-'.repeat(80));
});

console.log(`\n... and ${searchResults.length - 5} more products\n`);

// JSON 파일로 저장
fs.writeFileSync('crawler/korean-stores-search-urls.json', JSON.stringify(searchResults, null, 2));
console.log('💾 Saved all search URLs to: crawler/korean-stores-search-urls.json');

// 판매처 정보 입력 템플릿 생성
const dataTemplate = searchResults.map(result => ({
    model_code: result.model_code,
    team: result.team,
    name: result.name,
    found_in_stores: []  // 여기에 발견한 스토어 정보를 추가
}));

fs.writeFileSync('crawler/korean-stores-data-template.json', JSON.stringify(dataTemplate, null, 2));
console.log('💾 Saved data template to: crawler/korean-stores-data-template.json');

console.log('\n💡 Next Steps:');
console.log('1. Open crawler/korean-stores-search-urls.json');
console.log('2. Visit each search URL and find products');
console.log('3. Fill in crawler/korean-stores-data-template.json with found data');
console.log('4. Run add-korean-stores.js to apply the data');
