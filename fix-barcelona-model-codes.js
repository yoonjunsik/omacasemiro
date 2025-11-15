const admin = require('firebase-admin');
const serviceAccount = require('./omacasemiro-8fd4c-firebase-adminsdk-fbsvc-8c438c494c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://omacasemiro-8fd4c-default-rtdb.firebaseio.com"
});

const db = admin.database();

// 모델 코드 수정 매핑
const codeUpdates = {
  'HJ4590': 'HJ4590-456',
  'HJ4554': 'HJ4554-784',
  'HM3193': 'HM3193-855'
};

async function fixModelCodes() {
  try {
    console.log('🔧 바르셀로나 모델 코드 수정 중...\n');
    const ref = db.ref('uniformData');
    const snapshot = await ref.once('value');
    const products = snapshot.val() || [];
    
    let updatedCount = 0;
    
    const updatedProducts = products.map(product => {
      if (codeUpdates[product.model_code]) {
        const oldCode = product.model_code;
        const newCode = codeUpdates[oldCode];
        
        console.log(`✏️  ${oldCode} → ${newCode}`);
        console.log(`   ${product.name}\n`);
        
        updatedCount++;
        return {
          ...product,
          model_code: newCode
        };
      }
      return product;
    });
    
    if (updatedCount === 0) {
      console.log('⚠️  수정할 제품을 찾을 수 없습니다.');
      process.exit(0);
    }
    
    console.log(`💾 Firebase에 저장 중... (${updatedCount}개 제품)\n`);
    await ref.set(updatedProducts);
    
    console.log('✅ 모델 코드 수정 완료!');
    console.log(`📊 총 ${updatedCount}개 제품 업데이트됨\n`);
    
    console.log('새로운 URL:');
    Object.entries(codeUpdates).forEach(([old, newCode]) => {
      console.log(`  https://omacasemiro.shop/product.html?id=${newCode}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류:', error);
    process.exit(1);
  }
}

fixModelCodes();
