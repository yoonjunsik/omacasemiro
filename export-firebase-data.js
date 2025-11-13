const fs = require('fs');

// data.js 파일 로드
const dataJsContent = fs.readFileSync('js/data.js', 'utf8');

// uniformData 추출
const uniformMatch = dataJsContent.match(/const uniformData = (\[[\s\S]*?\]);/);
if (!uniformMatch) {
    console.error('❌ uniformData를 찾을 수 없습니다.');
    process.exit(1);
}

// blackFridaySites 추출
const bfMatch = dataJsContent.match(/const blackFridaySites = (\[[\s\S]*?\]);/);
if (!bfMatch) {
    console.error('❌ blackFridaySites를 찾을 수 없습니다.');
    process.exit(1);
}

// 데이터 파싱
const uniformData = eval(uniformMatch[1]);
const blackFridaySites = eval(bfMatch[1]);

// JSON 파일 생성
const firebaseData = {
    uniformData: uniformData,
    blackFridaySites: blackFridaySites
};

fs.writeFileSync('firebase-data.json', JSON.stringify(firebaseData, null, 2));

console.log('✅ firebase-data.json 생성 완료!');
console.log(`📦 제품 수: ${uniformData.length}개`);
console.log(`🔥 블프 사이트 수: ${blackFridaySites.length}개`);
console.log('\n👉 다음 단계:');
console.log('1. 관리자 페이지(admin.html)에서 브라우저 개발자 도구(F12) 열기');
console.log('2. Console 탭에서 다음 명령어 실행:\n');
console.log('   fetch("/firebase-data.json").then(r => r.json()).then(async data => {');
console.log('     const uniformRef = window.firebaseDBRef(window.firebaseDB, "uniformData");');
console.log('     await window.firebaseDBSet(uniformRef, data.uniformData);');
console.log('     const bfRef = window.firebaseDBRef(window.firebaseDB, "blackFridaySites");');
console.log('     await window.firebaseDBSet(bfRef, data.blackFridaySites);');
console.log('     console.log("✅ Firebase 업로드 완료!");');
console.log('   });\n');
