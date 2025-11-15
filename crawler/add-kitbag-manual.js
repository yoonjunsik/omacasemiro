const admin = require('firebase-admin');
const serviceAccount = require('../omacasemiro-8fd4c-firebase-adminsdk-fbsvc-8c438c494c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://omacasemiro-8fd4c-default-rtdb.firebaseio.com"
});

const db = admin.database();

// Kitbag 제품 정보 (수동 입력)
// 가격 정보는 Kitbag 사이트에서 직접 확인 필요
const kitbagProducts = [
    {
        team: '맨체스터 유나이티드',
        season: '25/26',
        kitType: '써드킷',
        url: 'https://www.kitbag.com/en/premier-league/manchester-united/manchester-united-adidas-third-shirt-2025-26/o-32754873+t-69318957+p-24335431299+z-9-1571159626',
        regularPrice: 80,  // GBP - 사이트에서 확인 필요
        salePrice: 64,      // GBP - 사이트에서 확인 필요
        discountRate: 20
    },
    {
        team: '리버풀',
        season: '25/26',
        kitType: '써드킷',
        url: 'https://www.kitbag.com/en/premier-league/liverpool/liverpool-adidas-third-shirt-2025-26/o-98755973+t-58751129+p-4699269393+z-8-60273370',
        regularPrice: 80,
        salePrice: 64,
        discountRate: 20
    },
    {
        team: '맨체스터 시티',
        season: '24/25',
        kitType: '어웨이킷',
        url: 'https://www.kitbag.com/en/premier-league/manchester-city/manchester-city-puma-away-shirt-2024-25/o-21209395+t-70192388+p-79773225394+z-9-3052911132',
        regularPrice: 75,
        salePrice: 60,
        discountRate: 20
    },
    {
        team: '맨체스터 시티',
        season: '25/26',
        kitType: '홈킷',
        url: 'https://www.kitbag.com/en/premier-league/manchester-city/manchester-city-puma-home-shirt-2025-26/o-32866062+t-92317899+p-46445255253+z-9-3156113284',
        regularPrice: 75,
        salePrice: 60,
        discountRate: 20
    },
    {
        team: '맨체스터 유나이티드',
        season: '25/26',
        kitType: '홈킷',
        url: 'https://www.kitbag.com/en/premier-league/manchester-united/manchester-united-adidas-home-shirt-2025-26/o-32868251+t-81979046+p-02885579438+z-9-218282672',
        regularPrice: 80,
        salePrice: 64,
        discountRate: 20
    },
    {
        team: '맨체스터 시티',
        season: '24/25',
        kitType: '홈킷',
        url: 'https://www.kitbag.com/en/premier-league/manchester-city/manchester-city-puma-home-shirt-2024-25/o-10754828+t-92759055+p-80442778543+z-9-4265275630',
        regularPrice: 75,
        salePrice: 60,
        discountRate: 20
    },
    {
        team: '토트넘',
        season: '25/26',
        kitType: '홈킷',
        url: 'https://www.kitbag.com/en/premier-league/tottenham-hotspur/tottenham-hotspur-nike-home-stadium-shirt-2025-26/o-32084839+t-36865258+p-80115547490+z-9-2884896066',
        regularPrice: 75,
        salePrice: 60,
        discountRate: 20
    }
];

async function addKitbagManually() {
    console.log('🔵 Kitbag 제품 수동 추가 시작...\n');

    // Firebase에서 기존 데이터 가져오기
    const ref = db.ref('uniformData');
    const snapshot = await ref.once('value');
    const uniformData = snapshot.val() || [];

    console.log(`📊 현재 데이터베이스: ${uniformData.length}개 제품\n`);

    let addedCount = 0;
    let skippedCount = 0;

    for (const kitbagProduct of kitbagProducts) {
        console.log(`\n🔍 ${kitbagProduct.team} ${kitbagProduct.season} ${kitbagProduct.kitType}`);

        // 기존 제품 찾기
        const existingProduct = uniformData.find(p =>
            p && p.team === kitbagProduct.team &&
            p.season === kitbagProduct.season &&
            p.kit_type === kitbagProduct.kitType
        );

        if (!existingProduct) {
            console.log(`   ❌ 데이터베이스에 해당 제품 없음`);
            skippedCount++;
            continue;
        }

        console.log(`   ✅ 매칭 제품: ${existingProduct.model_code} - ${existingProduct.name}`);
        console.log(`   💰 가격: £${kitbagProduct.regularPrice} → £${kitbagProduct.salePrice} (${kitbagProduct.discountRate}% 할인)`);

        // site_offers에 Kitbag 추가
        if (!existingProduct.site_offers) {
            existingProduct.site_offers = [];
        }

        // 이미 Kitbag이 있는지 확인
        const kitbagIndex = existingProduct.site_offers.findIndex(o => o.site_name === 'Kitbag');

        const kitbagOffer = {
            site_name: 'Kitbag',
            regular_price: kitbagProduct.regularPrice,
            sale_price: kitbagProduct.salePrice,
            discount_rate: kitbagProduct.discountRate,
            currency: 'GBP',
            affiliate_link: kitbagProduct.url,
            in_stock: true
        };

        if (kitbagIndex >= 0) {
            existingProduct.site_offers[kitbagIndex] = kitbagOffer;
            console.log(`   🔄 Kitbag 정보 업데이트`);
        } else {
            existingProduct.site_offers.push(kitbagOffer);
            console.log(`   ➕ Kitbag 정보 추가`);
        }

        addedCount++;
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ ${addedCount}개 제품에 Kitbag 정보 추가`);
    console.log(`⚠️  ${skippedCount}개 제품 스킵`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Firebase에 저장
    console.log('💾 Firebase에 저장 중...');
    await ref.set(uniformData);
    console.log('✅ 저장 완료!');

    process.exit(0);
}

addKitbagManually().catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
