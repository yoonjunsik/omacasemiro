const fs = require('fs');

// data.js 로드
const dataContent = fs.readFileSync('js/data.js', 'utf8');
const uniformDataMatch = dataContent.match(/const uniformData = (\[[\s\S]*?\]);/);
let uniformData = eval(uniformDataMatch[1]);

// Unisportstore 크롤링 데이터 로드
const unisportProducts = JSON.parse(fs.readFileSync('crawler/bigclub-detailed.json', 'utf8'));

console.log(`📦 기존 data.js: ${uniformData.length}개 제품`);
console.log(`📦 Unisportstore: ${unisportProducts.length}개 제품\n`);

// 팀 이름 매핑
const teamNameMap = {
    'Real Madrid': '레알 마드리드',
    'Arsenal': '아스널',
    'Liverpool': '리버풀',
    'Tottenham': '토트넘',
    'Manchester City': '맨체스터 시티',
    'Manchester United': '맨체스터 유나이티드',
    'Milan': 'AC 밀란',
    'Chelsea': '첼시',
    'Juventus': '유벤투스',
    'Inter': '인터 밀란',
    'Bayern': '바이에른 뮌헨',
    'Barcelona': '바르셀로나',
    'PSG': 'PSG',
    'Paris': 'PSG'
};

// 키트 타입 매핑
const kitTypeMap = {
    'Home': '홈킷',
    'Away': '어웨이킷',
    'Third': '써드킷',
    '3rd': '써드킷',
    'Goalkeeper': '골키퍼'
};

// 시즌 추출
function extractSeason(name) {
    const match = name.match(/(\d{4})\/(\d{2,4})/);
    if (match) {
        const year1 = match[1].slice(-2);
        const year2 = match[2].length === 2 ? match[2] : match[2].slice(-2);
        return `${year1}/${year2}`;
    }
    return null;
}

// 팀 이름 추출
function extractTeam(name) {
    for (const [eng, kor] of Object.entries(teamNameMap)) {
        if (name.includes(eng)) {
            return kor;
        }
    }
    return null;
}

// 키트 타입 추출
function extractKitType(name) {
    for (const [eng, kor] of Object.entries(kitTypeMap)) {
        if (name.toLowerCase().includes(eng.toLowerCase())) {
            return kor;
        }
    }
    return '홈킷'; // 기본값
}

// 버전 추출
function extractVersion(name) {
    if (name.toLowerCase().includes('authentic') || name.toLowerCase().includes('vapor')) {
        return '어센틱';
    }
    return '레플리카';
}

// EUR to KRW (환율: 1700원)
const EUR_TO_KRW = 1700;

// 매칭 시도
let matchedCount = 0;
let newProductsCount = 0;
const newProducts = [];

for (const uniProduct of unisportProducts) {
    const team = extractTeam(uniProduct.name);
    const season = extractSeason(uniProduct.name);
    const kitType = extractKitType(uniProduct.name);
    const version = extractVersion(uniProduct.name);

    if (!team || !season) {
        console.log(`⚠️  매칭 실패 (팀/시즌 없음): ${uniProduct.name}`);
        continue;
    }

    // 스타일 코드로 먼저 매칭 시도
    let matched = false;
    if (uniProduct.styleCode) {
        const existingProduct = uniformData.find(p =>
            p.model_code === uniProduct.styleCode
        );

        if (existingProduct) {
            // 이미 유니스포츠 판매처가 있는지 확인
            const hasUnisport = existingProduct.site_offers?.some(offer =>
                offer.site_name === '유니스포츠'
            );

            if (!hasUnisport) {
                if (!existingProduct.site_offers) {
                    existingProduct.site_offers = [];
                }

                existingProduct.site_offers.push({
                    site_name: '유니스포츠',
                    currency: 'EUR',
                    regular_price: uniProduct.regularPrice,
                    sale_price: uniProduct.salePrice,
                    regular_price_krw: Math.round(uniProduct.regularPrice * EUR_TO_KRW),
                    sale_price_krw: Math.round(uniProduct.salePrice * EUR_TO_KRW),
                    discount_rate: uniProduct.discount,
                    affiliate_link: uniProduct.productUrl
                });

                console.log(`✅ 판매처 추가: ${existingProduct.name}`);
                matchedCount++;
                matched = true;
            } else {
                console.log(`⏭️  이미 등록됨: ${existingProduct.name}`);
                matched = true;
            }
        }
    }

    // 스타일 코드로 매칭 안되면 팀/시즌/키트/버전으로 매칭
    if (!matched) {
        const existingProduct = uniformData.find(p =>
            p.team === team &&
            p.season === season &&
            p.kit_type === kitType &&
            p.version === version
        );

        if (existingProduct) {
            const hasUnisport = existingProduct.site_offers?.some(offer =>
                offer.site_name === '유니스포츠'
            );

            if (!hasUnisport) {
                if (!existingProduct.site_offers) {
                    existingProduct.site_offers = [];
                }

                existingProduct.site_offers.push({
                    site_name: '유니스포츠',
                    currency: 'EUR',
                    regular_price: uniProduct.regularPrice,
                    sale_price: uniProduct.salePrice,
                    regular_price_krw: Math.round(uniProduct.regularPrice * EUR_TO_KRW),
                    sale_price_krw: Math.round(uniProduct.salePrice * EUR_TO_KRW),
                    discount_rate: uniProduct.discount,
                    affiliate_link: uniProduct.productUrl
                });

                console.log(`✅ 판매처 추가 (이름매칭): ${existingProduct.name}`);
                matchedCount++;
                matched = true;
            }
        }
    }

    // 매칭 안되면 신규 제품으로 추가
    if (!matched) {
        newProducts.push({
            team,
            kit_type: kitType,
            season,
            version,
            name: `${team} ${season} ${kitType} (${version})`,
            model_code: uniProduct.styleCode || `UNI-${uniProduct.productUrl.match(/\/(\d+)\//)?.[1]}`,
            image: `https://thumblr.uniid.it/product/${uniProduct.productUrl.match(/\/(\d+)\//)?.[1]}/thumb.jpg`,
            site_offers: [{
                site_name: '유니스포츠',
                currency: 'EUR',
                regular_price: uniProduct.regularPrice,
                sale_price: uniProduct.salePrice,
                regular_price_krw: Math.round(uniProduct.regularPrice * EUR_TO_KRW),
                sale_price_krw: Math.round(uniProduct.salePrice * EUR_TO_KRW),
                discount_rate: uniProduct.discount,
                affiliate_link: uniProduct.productUrl
            }],
            visible: true
        });

        console.log(`➕ 신규 제품: ${team} ${season} ${kitType} (${version})`);
        newProductsCount++;
    }
}

// 신규 제품 추가
uniformData = uniformData.concat(newProducts);

console.log(`\n📊 결과:`);
console.log(`   기존 제품에 판매처 추가: ${matchedCount}개`);
console.log(`   신규 제품 추가: ${newProductsCount}개`);
console.log(`   총 제품 수: ${uniformData.length}개\n`);

// data.js 저장
const newDataContent = dataContent.replace(
    /const uniformData = \[[\s\S]*?\];/,
    `const uniformData = ${JSON.stringify(uniformData, null, 4)};`
);

fs.writeFileSync('js/data.js', newDataContent);
console.log('✅ js/data.js 업데이트 완료');

// 통계 저장
fs.writeFileSync('crawler/unisportstore-stats.json', JSON.stringify({
    matchedCount,
    newProductsCount,
    totalProducts: uniformData.length,
    newProducts
}, null, 2));

console.log('✅ crawler/unisportstore-stats.json 저장');
