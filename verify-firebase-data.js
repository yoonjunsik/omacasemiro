const admin = require('firebase-admin');
const serviceAccount = require('./omacasemiro-8fd4c-firebase-adminsdk-fbsvc-8c438c494c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://omacasemiro-8fd4c-default-rtdb.firebaseio.com"
});

const db = admin.database();

async function verifyData() {
  try {
    console.log('🔍 Firebase 데이터 확인 중...\n');
    const ref = db.ref('uniformData');
    const snapshot = await ref.once('value');
    const products = snapshot.val() || [];

    console.log(`📊 총 제품 수: ${products.length}\n`);

    // 바르셀로나 25/26 제품 찾기
    const barcelona2526 = products.filter(p =>
      p && p.team === '바르셀로나' && p.season === '25/26'
    );

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('바르셀로나 25/26 시즌 제품:\n');

    if (barcelona2526.length === 0) {
      console.log('❌ 바르셀로나 25/26 제품을 찾을 수 없습니다!');
    } else {
      barcelona2526.forEach((product, i) => {
        console.log(`[${i + 1}] ${product.model_code}`);
        console.log(`    이름: ${product.name}`);
        console.log(`    팀: ${product.team}`);
        console.log(`    시즌: ${product.season}`);
        console.log(`    키트: ${product.kit_type}`);
        console.log(`    버전: ${product.version}`);
        console.log(`    이미지: ${product.image ? '있음' : '없음'}`);
        console.log(`    판매처: ${product.site_offers ? product.site_offers.length + '개' : '0개'}`);
        console.log(`    visible: ${product.visible}`);
        console.log(`    URL: https://omacasemiro.shop/product.html?id=${product.model_code}\n`);
      });
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 특정 모델 코드로 검색
    const searchCodes = ['HJ4590-456', 'HJ4554-784', 'HM3193-855'];
    console.log('특정 모델 코드 검색:\n');

    searchCodes.forEach(code => {
      const found = products.find(p => p && p.model_code === code);
      if (found) {
        console.log(`✅ ${code}: 발견됨 - ${found.name}`);
      } else {
        console.log(`❌ ${code}: 찾을 수 없음`);
      }
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ 오류:', error);
    process.exit(1);
  }
}

verifyData();
