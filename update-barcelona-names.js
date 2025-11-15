const admin = require('firebase-admin');
const serviceAccount = require('./omacasemiro-8fd4c-firebase-adminsdk-fbsvc-8c438c494c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://omacasemiro-8fd4c-default-rtdb.firebaseio.com"
});

const db = admin.database();

// 업데이트할 제품명 매핑
const nameUpdates = {
  'HJ4590': '바르셀로나 2025/26 홈 유니폼',
  'HJ4554': '바르셀로나 2025/26 어웨이 유니폼 (코비 에디션)',
  'HM3193': '바르셀로나 2025/26 써드 유니폼 (T90)'
};

async function updateProductNames() {
  try {
    console.log('🔵 Firebase에서 데이터 가져오는 중...');
    const ref = db.ref('uniformData');
    const snapshot = await ref.once('value');
    const currentData = snapshot.val() || [];
    
    console.log('📊 현재 제품 수:', currentData.length);
    
    let updatedCount = 0;
    
    // 제품명 업데이트
    const updatedData = currentData.map(product => {
      if (nameUpdates[product.model_code]) {
        const oldName = product.name;
        const newName = nameUpdates[product.model_code];
        
        console.log(`\n✏️  ${product.model_code}`);
        console.log(`   이전: ${oldName}`);
        console.log(`   변경: ${newName}`);
        
        updatedCount++;
        return {
          ...product,
          name: newName
        };
      }
      return product;
    });
    
    if (updatedCount === 0) {
      console.log('\n⚠️  업데이트할 제품을 찾을 수 없습니다.');
      process.exit(0);
    }
    
    console.log(`\n💾 Firebase에 업데이트 저장 중... (${updatedCount}개 제품)`);
    await ref.set(updatedData);
    
    console.log('\n✅ 바르셀로나 제품명 업데이트 완료!');
    console.log(`📊 총 ${updatedCount}개 제품 업데이트됨`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 오류 발생:', error);
    process.exit(1);
  }
}

updateProductNames();
