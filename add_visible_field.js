// 모든 제품에 visible 필드 추가 스크립트
const fs = require('fs');

// data.js 파일 읽기
const dataFile = fs.readFileSync('./js/data.js', 'utf8');

// uniformData 배열 추출
const dataMatch = dataFile.match(/const uniformData = (\[[\s\S]*\]);/);
if (!dataMatch) {
    console.error('uniformData를 찾을 수 없습니다.');
    process.exit(1);
}

const uniformData = JSON.parse(dataMatch[1]);

// 모든 제품에 visible: true 추가 (이미 있으면 유지)
uniformData.forEach(product => {
    if (product.visible === undefined) {
        product.visible = true;
    }
});

// 파일 내용 생성
const newContent = `// 유니폼 데이터
const uniformData = ${JSON.stringify(uniformData, null, 4)};
`;

// 파일 저장
fs.writeFileSync('./js/data.js', newContent, 'utf8');

console.log(`✅ 완료! 총 ${uniformData.length}개 제품에 visible 필드가 추가되었습니다.`);
