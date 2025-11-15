const puppeteer = require('puppeteer');
const fs = require('fs');

async function crawlKitbag() {
    console.log('🔵 Kitbag 크롤링 시작...\n');

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,  // headless 모드로 변경
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process'
            ]
        });

        const page = await browser.newPage();

        // 에러 핸들링 추가
        page.on('error', err => {
            console.error('❌ Page error:', err);
        });

        page.on('pageerror', err => {
            console.error('❌ Page error:', err);
        });

        // User agent 설정
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        console.log('📄 페이지 로드 중...');
        await page.goto('https://www.kitbag.com/en/football-kits-sale-items/d-6738104948+os-23+z-8055-2188889755?_ref=p-OSLP:m-SIDE_NAV', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        console.log('⏳ 제품 로딩 대기 중...');
        await page.waitForTimeout(3000);

        // 제품 정보 추출
        const products = await page.evaluate(() => {
            const productElements = document.querySelectorAll('.product-card, [data-testid="product-card"], .product-item, .product');
            const results = [];

            productElements.forEach(el => {
                try {
                    // 다양한 셀렉터 시도
                    const nameEl = el.querySelector('.product-card__title, .product-name, h3, h4, [data-testid="product-title"]');
                    const linkEl = el.querySelector('a[href*="/p/"]');
                    const priceEl = el.querySelector('.product-card__price, .price, [data-testid="product-price"]');
                    const salePriceEl = el.querySelector('.product-card__sale-price, .sale-price, .price-sale');
                    const imageEl = el.querySelector('img');

                    if (nameEl && linkEl) {
                        const name = nameEl.textContent.trim();
                        const url = linkEl.href;

                        // 가격 추출
                        let regularPrice = '';
                        let salePrice = '';

                        if (priceEl) {
                            const priceText = priceEl.textContent.trim();
                            regularPrice = priceText;
                        }

                        if (salePriceEl) {
                            salePrice = salePriceEl.textContent.trim();
                        }

                        results.push({
                            name,
                            url,
                            regularPrice,
                            salePrice,
                            image: imageEl ? imageEl.src : ''
                        });
                    }
                } catch (err) {
                    console.error('제품 파싱 오류:', err);
                }
            });

            return results;
        });

        console.log(`\n✅ ${products.length}개 제품 발견\n`);

        // 제품 정보 출력
        products.forEach((product, i) => {
            console.log(`[${i + 1}] ${product.name}`);
            console.log(`    가격: ${product.regularPrice}${product.salePrice ? ' → ' + product.salePrice : ''}`);
            console.log(`    URL: ${product.url}`);
            console.log('');
        });

        // 파일로 저장
        const outputPath = './crawler/kitbag-products.json';
        fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
        console.log(`💾 ${outputPath}에 저장 완료`);

        // 스크린샷 저장
        await page.screenshot({ path: './crawler/kitbag-screenshot.png', fullPage: true });
        console.log('📸 스크린샷 저장: ./crawler/kitbag-screenshot.png');

    } catch (error) {
        console.error('❌ 오류 발생:', error);
        console.error(error.stack);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

crawlKitbag().catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
