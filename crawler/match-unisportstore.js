const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// data.js의 제품 로드 (간단히 파싱)
const dataContent = fs.readFileSync('js/data.js', 'utf8');
const uniformDataMatch = dataContent.match(/const uniformData = (\[[\s\S]*?\]);/);
const uniformData = eval(uniformDataMatch[1]);

// Unisportstore 크롤링 제품 로드
const unisportProducts = JSON.parse(fs.readFileSync('crawler/unisportstore-products.json', 'utf8'));

console.log(`📦 data.js: ${uniformData.length}개 제품`);
console.log(`📦 Unisportstore: ${unisportProducts.length}개 제품\n`);

// 팀 이름 매칭 맵 (한글 -> 영어)
const teamNameMap = {
    '맨체스터 유나이티드': ['Manchester United', 'Man United', 'Man Utd'],
    '리버풀': ['Liverpool'],
    '맨체스터 시티': ['Manchester City', 'Man City'],
    '첼시': ['Chelsea'],
    '아스널': ['Arsenal'],
    '토트넘': ['Tottenham', 'Spurs'],
    '뉴캐슬 유나이티드': ['Newcastle', 'Newcastle United'],
    '레알 마드리드': ['Real Madrid'],
    '바르셀로나': ['Barcelona', 'Barca'],
    '유벤투스': ['Juventus', 'Juve'],
    '인터 밀란': ['Inter', 'Inter Milan'],
    'AC 밀란': ['AC Milan', 'Milan'],
    '바이에른 뮌헨': ['Bayern', 'Bayern Munich'],
    'PSG': ['PSG', 'Paris'],
    '벤피카': ['Benfica'],
    '알 나스르': ['Al Nassr', 'Al-Nassr']
};

// 키트 타입 매칭
const kitTypeMap = {
    '홈킷': ['Home'],
    '어웨이킷': ['Away'],
    '써드킷': ['3rd', 'Third']
};

// 시즌 매칭
const seasonMap = {
    '25/26': ['2025/26', '2025-26', '25/26'],
    '24/25': ['2024/25', '2024-25', '24/25'],
    '23/24': ['2023/24', '2023-24', '23/24']
};

// 버전 매칭
const versionMap = {
    '레플리카': ['Stadium', 'Replica', 'Fan'],
    '어센틱': ['Authentic', 'Vapor', 'Match']
};

// 제품명으로 매칭 시도
function matchProducts(dataProduct, unisportProduct) {
    // 팀 이름 체크
    const teamNames = teamNameMap[dataProduct.team] || [];
    const teamMatch = teamNames.some(name =>
        unisportProduct.name.toLowerCase().includes(name.toLowerCase())
    );

    if (!teamMatch) return false;

    // 시즌 체크
    const seasons = seasonMap[dataProduct.season] || [];
    const seasonMatch = seasons.some(season =>
        unisportProduct.name.includes(season)
    );

    if (!seasonMatch) return false;

    // 키트 타입 체크
    const kitTypes = kitTypeMap[dataProduct.kit_type] || [];
    const kitMatch = kitTypes.some(kit =>
        unisportProduct.name.toLowerCase().includes(kit.toLowerCase())
    );

    if (!kitMatch) return false;

    // 버전 체크 (선택사항)
    if (dataProduct.version) {
        const versions = versionMap[dataProduct.version] || [];
        const versionMatch = versions.some(ver =>
            unisportProduct.name.toLowerCase().includes(ver.toLowerCase())
        );

        // 버전이 맞지 않으면 스킵 (단, 어센틱/레플리카 구분 없는 경우 제외)
        if (!versionMatch && unisportProduct.name.match(/authentic|vapor|stadium/i)) {
            return false;
        }
    }

    return true;
}

// 매칭 시작
const matches = [];

for (const dataProduct of uniformData) {
    // visible이 false인 제품은 스킵
    if (dataProduct.visible === false) continue;

    // 이미 Unisportstore 판매처가 있으면 스킵
    const hasUnisport = dataProduct.site_offers?.some(offer =>
        offer.site_name === '유니스포츠'
    );
    if (hasUnisport) continue;

    for (const uniProduct of unisportProducts) {
        if (matchProducts(dataProduct, uniProduct)) {
            matches.push({
                dataProduct: {
                    team: dataProduct.team,
                    kit_type: dataProduct.kit_type,
                    season: dataProduct.season,
                    version: dataProduct.version,
                    name: dataProduct.name,
                    model_code: dataProduct.model_code
                },
                unisportProduct: {
                    name: uniProduct.name,
                    url: uniProduct.productUrl
                }
            });
        }
    }
}

console.log(`\n🎯 매칭된 제품: ${matches.length}개\n`);

// 매칭 결과 출력
matches.slice(0, 20).forEach((match, i) => {
    console.log(`${i+1}. ${match.dataProduct.name}`);
    console.log(`   → ${match.unisportProduct.name}`);
    console.log(`   → ${match.unisportProduct.url}\n`);
});

if (matches.length > 20) {
    console.log(`... 그외 ${matches.length - 20}개 더\n`);
}

// 저장
fs.writeFileSync(
    'crawler/unisportstore-matches.json',
    JSON.stringify(matches, null, 2)
);

console.log('✅ 저장: crawler/unisportstore-matches.json');
