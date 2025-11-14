const fs = require('fs');

// 데이터 로드
const dataFileContent = fs.readFileSync('js/data.js', 'utf8');
const uniformDataMatch = dataFileContent.match(/const uniformData = (\[[\s\S]*?\]);/);
const uniformData = uniformDataMatch ? JSON.parse(uniformDataMatch[1]) : [];
const capoProducts = JSON.parse(fs.readFileSync('crawler/capostore-products.json', 'utf8'));

console.log('🔍 Starting model code verification...\n');
console.log(`📊 Uniform data: ${uniformData.length} items`);
console.log(`🏪 Capo Store: ${capoProducts.length} products\n`);

// 카포스토어 제품을 팀/시즌/키트타입별로 인덱싱
const capoByTeamSeasonKit = {};
capoProducts.forEach(product => {
    const key = `${product.name}`.toLowerCase();
    if (!capoByTeamSeasonKit[key]) {
        capoByTeamSeasonKit[key] = [];
    }
    capoByTeamSeasonKit[key].push(product);
});

// 팀명 매핑 (한글 <-> 카포스토어)
const teamMapping = {
    '맨체스터 유나이티드': ['맨체스터 유나이티드', 'manchester united', '맨유'],
    '맨체스터 시티': ['맨체스터 시티', 'manchester city', '맨시티'],
    '리버풀': ['리버풀', 'liverpool'],
    '첼시': ['첼시', 'chelsea'],
    '아스널': ['아스널', 'arsenal'],
    '토트넘': ['토트넘', 'tottenham'],
    '레알 마드리드': ['레알 마드리드', 'real madrid', '레알'],
    '바르셀로나': ['바르셀로나', 'barcelona', '바르샤'],
    'PSG': ['psg', '파리 생제르맹'],
    '바이에른 뮌헨': ['바이에른 뮌헨', 'bayern'],
    '유벤투스': ['유벤투스', 'juventus'],
    '인터 밀란': ['인터 밀란', 'inter milan', '인터'],
    'AC 밀란': ['ac 밀란', 'ac milan']
};

// 시즌 매핑
const seasonMapping = {
    '24/25': ['24-25', '2024-2025', '2024 2025'],
    '25/26': ['25-26', '2025-2026', '2025 2026'],
    '23/24': ['23-24', '2023-2024', '2023 2024']
};

// 키트 타입 매핑
const kitMapping = {
    '홈킷': ['홈', 'home'],
    '어웨이킷': ['어웨이', 'away'],
    '써드킷': ['써드', 'third', '3rd']
};

// 유니폼 데이터와 카포스토어 제품 매칭 시도
const fixes = [];
const missingInCapo = [];
const suggestions = [];

uniformData.forEach(uniform => {
    if (!uniform.team || !uniform.season || !uniform.kit_type) return;

    // 스포츠다이렉트 전용 코드(SD-로 시작)나 모델 코드가 없는 경우 체크
    const hasOnlySDCode = uniform.model_code && uniform.model_code.startsWith('SD-');
    const hasNoModelCode = !uniform.model_code || uniform.model_code === '';

    if (!hasOnlySDCode && !hasNoModelCode) return;

    // 카포스토어에서 동일한 제품 찾기
    const teamVariants = teamMapping[uniform.team] || [uniform.team.toLowerCase()];
    const seasonVariants = seasonMapping[uniform.season] || [uniform.season];
    const kitVariants = kitMapping[uniform.kit_type] || [uniform.kit_type.toLowerCase()];

    let foundMatch = null;

    // 카포스토어 제품과 매칭
    for (const capo of capoProducts) {
        const capoNameLower = capo.name.toLowerCase();

        // 팀명 체크
        const teamMatch = teamVariants.some(variant =>
            capoNameLower.includes(variant.toLowerCase())
        );
        if (!teamMatch) continue;

        // 시즌 체크
        const seasonMatch = seasonVariants.some(variant =>
            capoNameLower.includes(variant.toLowerCase())
        );
        if (!seasonMatch) continue;

        // 키트 타입 체크
        const kitMatch = kitVariants.some(variant =>
            capoNameLower.includes(variant.toLowerCase())
        );
        if (!kitMatch) continue;

        // 버전 체크 (레플리카 vs 어센틱)
        const isAuth = uniform.version === '어센틱';
        const capoIsAuth = capoNameLower.includes('authentic') || capoNameLower.includes('어센틱');

        if (isAuth !== capoIsAuth) continue;

        // 소매 길이 체크 (유니폼 이름에서 추출)
        // 우리 제품명에 롱슬리브/긴팔이 명시되어 있으면 L/S만 매칭
        const isLongSleeve = uniform.name.toLowerCase().includes('롱슬리브') ||
                           uniform.name.toLowerCase().includes('긴팔') ||
                           uniform.name.toLowerCase().includes('long sleeve');
        const capoIsLongSleeve = capoNameLower.includes('l/s') || capoNameLower.includes('긴팔');
        const capoIsShortSleeve = capoNameLower.includes('s/s') || capoNameLower.includes('반팔');

        // 롱슬리브 제품은 L/S만, 일반 제품은 S/S만 매칭
        if (isLongSleeve && !capoIsLongSleeve) continue;
        if (!isLongSleeve && capoIsLongSleeve) continue;

        foundMatch = capo;
        break;
    }

    if (foundMatch) {
        fixes.push({
            uniform: uniform,
            oldModelCode: uniform.model_code,
            newModelCode: foundMatch.modelCode,
            capoProduct: foundMatch,
            action: hasNoModelCode ? 'ADD_MODEL_CODE' : 'FIX_MODEL_CODE'
        });

        console.log(`\n✅ MATCH FOUND:`);
        console.log(`   Our product: ${uniform.name}`);
        console.log(`   Old code: ${uniform.model_code || 'NONE'}`);
        console.log(`   Capo product: ${foundMatch.name}`);
        console.log(`   Correct code: ${foundMatch.modelCode}`);
        console.log(`   Price: ${foundMatch.salePrice.toLocaleString()}원 (${foundMatch.discountRate}% off)`);
    } else {
        missingInCapo.push(uniform);
    }
});

console.log('\n\n📊 VERIFICATION RESULTS:');
console.log(`   ✅ Fixable products: ${fixes.length}`);
console.log(`   ⚠️  Not found in Capo Store: ${missingInCapo.length}`);

if (fixes.length > 0) {
    console.log('\n\n🔧 FIXES TO APPLY:');
    fixes.forEach((fix, i) => {
        console.log(`\n${i + 1}. ${fix.uniform.name}`);
        console.log(`   Action: ${fix.action}`);
        console.log(`   Old: ${fix.oldModelCode || 'NONE'}`);
        console.log(`   New: ${fix.newModelCode}`);
    });

    // 자동 수정 적용
    console.log('\n\n🚀 Applying fixes...');

    fixes.forEach(fix => {
        const uniform = uniformData.find(u => u.model_code === fix.oldModelCode ||
            (u.name === fix.uniform.name && u.team === fix.uniform.team && u.season === fix.uniform.season));

        if (uniform) {
            // 모델 코드 수정
            uniform.model_code = fix.newModelCode;

            // 카포스토어 판매처 추가 또는 업데이트
            const existingCapo = uniform.site_offers.find(offer => offer.site_name === '카포스토어');

            if (existingCapo) {
                existingCapo.regular_price = fix.capoProduct.originalPrice;
                existingCapo.sale_price = fix.capoProduct.salePrice;
                existingCapo.regular_price_krw = fix.capoProduct.originalPrice;
                existingCapo.sale_price_krw = fix.capoProduct.salePrice;
                existingCapo.discount_rate = fix.capoProduct.discountRate;
                existingCapo.affiliate_link = fix.capoProduct.url;
            } else {
                uniform.site_offers.push({
                    site_name: '카포스토어',
                    currency: 'KRW',
                    regular_price: fix.capoProduct.originalPrice,
                    sale_price: fix.capoProduct.salePrice,
                    regular_price_krw: fix.capoProduct.originalPrice,
                    sale_price_krw: fix.capoProduct.salePrice,
                    discount_rate: fix.capoProduct.discountRate,
                    affiliate_link: fix.capoProduct.url
                });
            }

            // visible 설정
            if (!uniform.visible) {
                uniform.visible = true;
            }
        }
    });

    // 결과 저장
    const outputData = `// 유니폼 데이터
const uniformData = ${JSON.stringify(uniformData, null, 4)};
`;

    fs.writeFileSync('js/data-fixed.js', outputData);
    console.log('\n💾 Saved to: js/data-fixed.js');
    console.log(`✅ Fixed ${fixes.length} products`);
}

if (missingInCapo.length > 0) {
    console.log('\n\n⚠️  PRODUCTS NOT FOUND IN CAPO STORE:');
    missingInCapo.slice(0, 10).forEach(u => {
        console.log(`   - ${u.name} (${u.model_code || 'NO CODE'})`);
    });
    if (missingInCapo.length > 10) {
        console.log(`   ... and ${missingInCapo.length - 10} more`);
    }
}

console.log('\n✨ Done!');
console.log('\nNext steps:');
console.log('1. Review js/data-fixed.js');
console.log('2. If everything looks good, run: mv js/data-fixed.js js/data.js');
