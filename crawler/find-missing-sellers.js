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

const { data: uniformData } = loadDataJS();

console.log('🔍 스포츠다이렉트 판매처가 없는 제품 찾기\n');
console.log(`전체 제품 수: ${uniformData.length}개\n`);

const productsWithoutSD = [];
const productsWithSD = [];

uniformData.forEach(product => {
    const hasSD = product.site_offers && product.site_offers.some(offer =>
        offer.site_name === '스포츠다이렉트' ||
        (offer.affiliate_link && offer.affiliate_link.includes('sportsdirect.com'))
    );

    if (hasSD) {
        productsWithSD.push(product);
    } else {
        productsWithoutSD.push(product);
    }
});

console.log(`✅ 스포츠다이렉트 판매처 있음: ${productsWithSD.length}개`);
console.log(`❌ 스포츠다이렉트 판매처 없음: ${productsWithoutSD.length}개\n`);

console.log('='.repeat(60));
console.log('스포츠다이렉트 판매처가 없는 제품 목록:');
console.log('='.repeat(60));

// 시즌별, 팀별로 그룹화
const bySeasonAndTeam = {};

productsWithoutSD.forEach(p => {
    const key = `${p.season} ${p.team}`;
    if (!bySeasonAndTeam[key]) {
        bySeasonAndTeam[key] = [];
    }
    bySeasonAndTeam[key].push(p);
});

// 최신 시즌부터 정렬
const sortedKeys = Object.keys(bySeasonAndTeam).sort((a, b) => {
    const seasonA = a.split(' ')[0];
    const seasonB = b.split(' ')[0];
    return seasonB.localeCompare(seasonA);
});

sortedKeys.forEach(key => {
    const products = bySeasonAndTeam[key];
    console.log(`\n📦 ${key} (${products.length}개)`);
    products.forEach(p => {
        const visible = p.visible ? '👁️ ' : '🚫';
        console.log(`   ${visible} ${p.kit_type} (${p.version}) - ${p.model_code}`);
    });
});

// 25/26, 24/25 시즌 visible 제품만 필터링
const priorityProducts = productsWithoutSD.filter(p =>
    p.visible && (p.season === '25/26' || p.season === '24/25')
);

console.log('\n\n='.repeat(60));
console.log(`🎯 우선순위 제품 (25/26, 24/25 시즌 & 노출 중): ${priorityProducts.length}개`);
console.log('='.repeat(60));

priorityProducts.forEach((p, i) => {
    console.log(`${i + 1}. ${p.team} ${p.season} ${p.kit_type} (${p.version}) - ${p.model_code}`);
});

// JSON 저장
fs.writeFileSync(
    'crawler/products-without-sportsdirect.json',
    JSON.stringify({
        summary: {
            total: uniformData.length,
            withSD: productsWithSD.length,
            withoutSD: productsWithoutSD.length,
            priority: priorityProducts.length
        },
        allMissing: productsWithoutSD,
        priority: priorityProducts
    }, null, 2)
);

console.log('\n✅ 저장: crawler/products-without-sportsdirect.json');
