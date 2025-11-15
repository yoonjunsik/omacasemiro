const puppeteer = require('puppeteer');
const admin = require('firebase-admin');
const serviceAccount = require('../omacasemiro-8fd4c-firebase-adminsdk-fbsvc-8c438c494c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://omacasemiro-8fd4c-default-rtdb.firebaseio.com"
});

const db = admin.database();

const kitbagUrls = [
    'https://www.kitbag.com/en/premier-league/manchester-united/manchester-united-adidas-third-shirt-2025-26/o-32754873+t-69318957+p-24335431299+z-9-1571159626',
    'https://www.kitbag.com/en/premier-league/liverpool/liverpool-adidas-third-shirt-2025-26/o-98755973+t-58751129+p-4699269393+z-8-60273370',
    'https://www.kitbag.com/en/premier-league/manchester-city/manchester-city-puma-away-shirt-2024-25/o-21209395+t-70192388+p-79773225394+z-9-3052911132',
    'https://www.kitbag.com/en/premier-league/manchester-city/manchester-city-puma-home-shirt-2025-26/o-32866062+t-92317899+p-46445255253+z-9-3156113284',
    'https://www.kitbag.com/en/premier-league/manchester-united/manchester-united-adidas-home-shirt-2025-26/o-32868251+t-81979046+p-02885579438+z-9-218282672',
    'https://www.kitbag.com/en/premier-league/manchester-city/manchester-city-puma-home-shirt-2024-25/o-10754828+t-92759055+p-80442778543+z-9-4265275630',
    'https://www.kitbag.com/en/premier-league/tottenham-hotspur/tottenham-hotspur-nike-home-stadium-shirt-2025-26/o-32084839+t-36865258+p-80115547490+z-9-2884896066'
];

// URL에서 팀 정보 추출
function parseKitbagUrl(url) {
    const teamMap = {
        'manchester-united': '맨체스터 유나이티드',
        'liverpool': '리버풀',
        'manchester-city': '맨체스터 시티',
        'tottenham-hotspur': '토트넘'
    };

    const seasonMap = {
        '2024-25': '24/25',
        '2025-26': '25/26'
    };

    const kitTypeMap = {
        'home': '홈킷',
        'away': '어웨이킷',
        'third': '써드킷'
    };

    for (const [urlTeam, koreanTeam] of Object.entries(teamMap)) {
        if (url.includes(urlTeam)) {
            for (const [urlSeason, season] of Object.entries(seasonMap)) {
                if (url.includes(urlSeason)) {
                    for (const [urlKit, kitType] of Object.entries(kitTypeMap)) {
                        if (url.includes(urlKit)) {
                            return { team: koreanTeam, season, kitType };
                        }
                    }
                }
            }
        }
    }
    return null;
}

async function fetchKitbagProduct(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        console.log(`📄 로드 중: ${url.substring(0, 80)}...`);

        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        await page.waitForTimeout(2000);

        const productData = await page.evaluate(() => {
            // 가격 추출
            const priceEl = document.querySelector('.price-sales, .price, [data-testid="product-price"]');
            const regularPriceEl = document.querySelector('.price-standard, .price-original, .price-was');

            let salePrice = '';
            let regularPrice = '';

            if (priceEl) {
                salePrice = priceEl.textContent.trim();
            }

            if (regularPriceEl) {
                regularPrice = regularPriceEl.textContent.trim();
            } else if (salePrice) {
                regularPrice = salePrice; // 세일가만 있으면 그것을 정가로
            }

            return {
                salePrice,
                regularPrice
            };
        });

        await browser.close();
        return productData;

    } catch (error) {
        console.error(`❌ 오류 (${url}):`, error.message);
        await browser.close();
        return null;
    }
}

async function addKitbagToDatabase() {
    console.log('🔵 Kitbag 제품 추가 시작...\n');

    // Firebase에서 기존 데이터 가져오기
    const ref = db.ref('uniformData');
    const snapshot = await ref.once('value');
    const uniformData = snapshot.val() || [];

    console.log(`📊 현재 데이터베이스: ${uniformData.length}개 제품\n`);

    let addedCount = 0;
    let skippedCount = 0;

    for (const url of kitbagUrls) {
        const urlInfo = parseKitbagUrl(url);

        if (!urlInfo) {
            console.log(`⚠️ URL 파싱 실패: ${url}`);
            skippedCount++;
            continue;
        }

        console.log(`\n🔍 ${urlInfo.team} ${urlInfo.season} ${urlInfo.kitType}`);

        // 기존 제품 찾기
        const existingProduct = uniformData.find(p =>
            p && p.team === urlInfo.team &&
            p.season === urlInfo.season &&
            p.kit_type === urlInfo.kitType
        );

        if (!existingProduct) {
            console.log(`   ❌ 데이터베이스에 해당 제품 없음`);
            skippedCount++;
            continue;
        }

        console.log(`   ✅ 매칭 제품: ${existingProduct.model_code} - ${existingProduct.name}`);

        // Kitbag에서 가격 정보 가져오기
        const priceData = await fetchKitbagProduct(url);

        if (!priceData) {
            console.log(`   ❌ 가격 정보 가져오기 실패`);
            skippedCount++;
            continue;
        }

        // 가격 파싱 (£ 제거하고 숫자만)
        const parsePrice = (priceStr) => {
            if (!priceStr) return 0;
            const match = priceStr.match(/[\d,.]+/);
            return match ? parseFloat(match[0].replace(',', '')) : 0;
        };

        const salePrice = parsePrice(priceData.salePrice);
        const regularPrice = parsePrice(priceData.regularPrice);
        const discountRate = regularPrice > 0 ? Math.round((1 - salePrice / regularPrice) * 100) : 0;

        console.log(`   💰 가격: £${regularPrice} → £${salePrice} (${discountRate}% 할인)`);

        // site_offers에 Kitbag 추가
        if (!existingProduct.site_offers) {
            existingProduct.site_offers = [];
        }

        // 이미 Kitbag이 있는지 확인
        const kitbagIndex = existingProduct.site_offers.findIndex(o => o.site_name === 'Kitbag');

        const kitbagOffer = {
            site_name: 'Kitbag',
            regular_price: regularPrice,
            sale_price: salePrice,
            discount_rate: discountRate,
            currency: 'GBP',
            affiliate_link: url,
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
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
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

addKitbagToDatabase().catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
