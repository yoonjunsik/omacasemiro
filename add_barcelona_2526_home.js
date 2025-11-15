const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://omacasemiro-8fd4c-default-rtdb.firebaseio.com"
});

const db = admin.database();

const newProduct = {
  model_code: "HJ4590",
  name: "FC Barcelona 2025/26 Stadium Home Jersey",
  team: "바르셀로나",
  kit_type: "홈킷",
  season: "25/26",
  version: "레플리카",
  image: "https://thumblr.uniid.it/product/393279/0aa8d4376cb4.jpg",
  visible: true,
  site_offers: [
    {
      site_name: "Unisport",
      regular_price: 99.95,
      sale_price: 99.95,
      discount_rate: 0,
      currency: "EUR",
      affiliate_link: "https://www.unisportstore.com/football-shirts/barcelona-home-shirt-202526/393279/"
    },
    {
      site_name: "신세계백화점",
      regular_price: 138000,
      sale_price: 126960,
      discount_rate: 8,
      currency: "KRW",
      sale_price_krw: 126960,
      affiliate_link: "https://department.ssg.com/search.ssg?query=바르셀로나유니폼"
    }
  ]
};

async function addProduct() {
  try {
    const ref = db.ref('uniformData');
    const snapshot = await ref.once('value');
    const currentData = snapshot.val() || [];
    
    // 중복 체크
    const exists = currentData.some(p => p.model_code === newProduct.model_code);
    if (exists) {
      console.log('❌ 이미 존재하는 제품입니다:', newProduct.model_code);
      process.exit(1);
    }
    
    // 새 제품 추가
    currentData.push(newProduct);
    
    await ref.set(currentData);
    console.log('✅ 바르셀로나 25/26 홈 유니폼 추가 완료!');
    console.log('📊 총 제품 수:', currentData.length);
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

addProduct();
