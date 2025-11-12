// 확인된 제품 외 판매처 제거 스크립트
const fs = require('fs');

// 방금 확인되어 판매처를 유지할 제품 모델 코드
const verifiedProducts = [
    'JI7428',           // 맨유 25/26 홈 레플리카
    'GM4545',          // 맨유 22/23 홈 레플리카
    'LFC-2526',        // 리버풀 25/26 홈 레플리카
    '775075-01',       // 맨시티 24/25 홈 레플리카
    'JJ5114',          // 벤피카 24/25 써드 레플리카
    'FN8786-839',      // 첼시 24/25 어웨이 레플리카
    'IU5011-AUTH'      // 레알 마드리드 24/25 홈 어센틱
];

// data.js 파일 읽기
const dataFile = fs.readFileSync('./js/data.js', 'utf8');
const dataMatch = dataFile.match(/const uniformData = (\[[\s\S]*\]);/);

if (!dataMatch) {
    console.error('uniformData를 찾을 수 없습니다.');
    process.exit(1);
}

const uniformData = JSON.parse(dataMatch[1]);

// 판매처 정리
let cleanedCount = 0;
let keptCount = 0;

uniformData.forEach(product => {
    if (verifiedProducts.includes(product.model_code)) {
        // 확인된 제품 - 판매처 유지
        keptCount++;
        console.log(`✅ 유지: ${product.name} - ${product.site_offers.length}개 판매처`);
    } else {
        // 확인되지 않은 제품 - 판매처 제거
        if (product.site_offers && product.site_offers.length > 0) {
            product.site_offers = [];
            cleanedCount++;
            console.log(`🧹 정리: ${product.name}`);
        }
    }
});

// 파일 저장
const newContent = `// 유니폼 데이터
const uniformData = ${JSON.stringify(uniformData, null, 4)};
`;

fs.writeFileSync('./js/data.js', newContent, 'utf8');

console.log(`\n✨ 완료!`);
console.log(`📦 유지: ${keptCount}개 제품 (총 판매처 있음)`);
console.log(`🧹 정리: ${cleanedCount}개 제품 (판매처 제거됨)`);
console.log(`📊 총 ${uniformData.length}개 제품 중 ${keptCount}개만 판매처 정보 보유`);
