const admin = require('firebase-admin');
const serviceAccount = require('./omacasemiro-8fd4c-firebase-adminsdk-fbsvc-8c438c494c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://omacasemiro-8fd4c-default-rtdb.firebaseio.com"
});

const db = admin.database();

async function checkProductLinks() {
  try {
    console.log('🔍 모든 제품 링크 확인 중...\n');
    const ref = db.ref('uniformData');
    const snapshot = await ref.once('value');
    const products = snapshot.val() || [];
    
    // 브랜드별 모델 코드 패턴
    const brandPatterns = {
      'Adidas': /^[A-Z]{2}\d{4,5}$/,  // IU1397, JI7428 등
      'Nike': /^[A-Z]{2}\d{4,5}(-\d{3})?$/,  // HJ4590, HJ4554-456 등
      'Puma': /^\d{6}$/  // 숫자 6자리
    };
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('제품 코드 검증 결과\n');
    
    let issues = [];
    
    products.forEach((product, index) => {
      if (!product || !product.model_code) return;
      
      const modelCode = product.model_code;
      const name = product.name || 'Unknown';
      const team = product.team || 'Unknown';
      
      // 나이키 제품인지 확인 (이름에 Nike, Barcelona 등)
      const isNike = name.includes('Nike') || name.includes('Barcelona') || name.includes('바르셀로나');
      const isAdidas = name.includes('Adidas') || name.includes('아디다스');
      const isPuma = name.includes('Puma') || name.includes('푸마');
      
      // 코드 형식 확인
      const looksLikeAdidas = /^[A-Z]{2}\d{4}$/.test(modelCode);
      const looksLikeNike = /^[A-Z]{2}\d{4}(-\d{3})?$/.test(modelCode) && modelCode.length <= 7;
      
      // 불일치 확인
      if (isNike && looksLikeAdidas && modelCode.length === 6) {
        issues.push({
          index,
          modelCode,
          name,
          team,
          issue: '나이키 제품인데 아디다스 코드 형식'
        });
      } else if (isAdidas && modelCode.startsWith('H') && modelCode.length === 6) {
        issues.push({
          index,
          modelCode,
          name,
          team,
          issue: '아디다스 제품인데 의심스러운 코드'
        });
      }
    });
    
    if (issues.length === 0) {
      console.log('✅ 모든 제품 코드가 정상입니다!\n');
    } else {
      console.log(`⚠️  ${issues.length}개 제품에 문제가 발견되었습니다:\n`);
      
      issues.forEach(issue => {
        console.log(`[${issue.index}] ${issue.modelCode}`);
        console.log(`    팀: ${issue.team}`);
        console.log(`    이름: ${issue.name}`);
        console.log(`    문제: ${issue.issue}`);
        console.log(`    URL: https://omacasemiro.shop/product.html?id=${issue.modelCode}\n`);
      });
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n바르셀로나 제품 상세 확인:\n');
    
    const barcelonaProducts = products.filter(p => 
      p && (p.team === '바르셀로나' || (p.name && p.name.includes('Barcelona')))
    );
    
    barcelonaProducts.forEach(product => {
      console.log(`${product.model_code} - ${product.name}`);
      console.log(`  시즌: ${product.season}, 키트: ${product.kit_type}`);
      
      // 판매처 확인
      if (product.site_offers && product.site_offers.length > 0) {
        product.site_offers.forEach(offer => {
          // URL에서 실제 제품 코드 추출 시도
          const url = offer.affiliate_link;
          if (url.includes('unisportstore.com')) {
            const match = url.match(/\/(\d+)\//);
            if (match) {
              console.log(`  Unisport 제품 ID: ${match[1]}`);
            }
          }
        });
      }
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류:', error);
    process.exit(1);
  }
}

checkProductLinks();
