const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require('./omacasemiro-8fd4c-firebase-adminsdk-fbsvc-8c438c494c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://omacasemiro-8fd4c-default-rtdb.firebaseio.com"
});

const db = admin.database();

async function syncFirebaseToDataJS() {
  try {
    console.log('🔵 Firebase에서 데이터 가져오는 중...\n');
    const ref = db.ref('uniformData');
    const snapshot = await ref.once('value');
    const uniformData = snapshot.val() || [];

    console.log(`📊 총 ${uniformData.length}개 제품 발견\n`);

    // data.js 파일 생성
    const dataJsContent = `// 유니폼 데이터 (Firebase와 동기화됨)
// 마지막 동기화: ${new Date().toLocaleString('ko-KR')}
const uniformData = ${JSON.stringify(uniformData, null, 2)};
`;

    fs.writeFileSync('./js/data.js', dataJsContent, 'utf8');

    console.log('✅ js/data.js 파일 업데이트 완료!\n');

    // 바르셀로나 제품 확인
    const barcelona = uniformData.filter(p =>
      p && p.team === '바르셀로나'
    );

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('바르셀로나 제품 확인:\n');
    barcelona.forEach(p => {
      console.log(`✅ ${p.model_code} - ${p.name}`);
      console.log(`   시즌: ${p.season}, 키트: ${p.kit_type}`);
      console.log(`   URL: https://omacasemiro.shop/product.html?id=${p.model_code}\n`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ 오류:', error);
    process.exit(1);
  }
}

syncFirebaseToDataJS();
