const puppeteer = require('puppeteer');
const fs = require('fs');

async function crawlCapoStore() {
    console.log('🏪 Starting Capo Store crawler...\n');

    const browser = await puppeteer.launch({
        headless: 'new',
        defaultViewport: { width: 1920, height: 1080 },
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu'
        ]
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        const allProducts = [];
        const maxPages = 5; // Testing with first 5 pages (change to 22 for full crawl)

        for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
            console.log(`📄 Crawling page ${pageNum}/${maxPages}...`);

            const url = `https://www.capostore.co.kr/goods/goods_list.php?cateCd=052005&page=${pageNum}`;
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

            // 페이지 로딩 대기
            await page.waitForTimeout(2000);

            // 제품 추출
            const products = await page.evaluate(() => {
                const items = [];
                const productElements = document.querySelectorAll('.item_gallery_type');

                productElements.forEach(el => {
                    try {
                        // 제품명에서 모델 코드 추출
                        const nameElement = el.querySelector('.item_name a');
                        const fullName = nameElement ? nameElement.textContent.trim() : '';

                        // 모델 코드는 괄호 안에 있음: 예) "맨체스터 시티 24-25 쇼트 (77511405)"
                        const modelMatch = fullName.match(/\(([A-Z0-9\-]+)\)/);
                        const modelCode = modelMatch ? modelMatch[1].replace(/-/g, '') : ''; // 하이픈 제거

                        // 브랜드
                        const brandElement = el.querySelector('.item_brand a');
                        const brand = brandElement ? brandElement.textContent.trim() : '';

                        // 가격
                        const salePriceElement = el.querySelector('.sale_price');
                        const salePrice = salePriceElement ? parseInt(salePriceElement.textContent.replace(/[^\d]/g, '')) : 0;

                        const originalPriceElement = el.querySelector('.consumer_price');
                        const originalPrice = originalPriceElement ? parseInt(originalPriceElement.textContent.replace(/[^\d]/g, '')) : salePrice;

                        // URL
                        const linkElement = el.querySelector('.item_photo_box a');
                        const productUrl = linkElement ? linkElement.getAttribute('href') : '';
                        const fullUrl = productUrl ? `https://www.capostore.co.kr/goods/${productUrl}` : '';

                        // 이미지
                        const imgElement = el.querySelector('.item_photo_box img');
                        const imageUrl = imgElement ? imgElement.getAttribute('src') : '';

                        if (modelCode && fullName) {
                            items.push({
                                name: fullName,
                                modelCode: modelCode,
                                brand: brand,
                                originalPrice: originalPrice,
                                salePrice: salePrice,
                                discountRate: originalPrice > 0 ? Math.round((1 - salePrice / originalPrice) * 100) : 0,
                                url: fullUrl,
                                image: imageUrl
                            });
                        }
                    } catch (err) {
                        console.error('Error parsing product:', err);
                    }
                });

                return items;
            });

            console.log(`   ✓ Found ${products.length} products`);
            allProducts.push(...products);

            // 다음 페이지로 가기 전 대기
            await page.waitForTimeout(1000);
        }

        console.log(`\n✅ Total products collected: ${allProducts.length}`);

        // 결과 저장
        const outputPath = 'crawler/capostore-products.json';
        fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2));
        console.log(`💾 Saved to ${outputPath}`);

        // 모델 코드별 그룹화
        const byModelCode = {};
        allProducts.forEach(product => {
            if (!byModelCode[product.modelCode]) {
                byModelCode[product.modelCode] = [];
            }
            byModelCode[product.modelCode].push(product);
        });

        // 중복 모델 코드 확인
        const duplicates = Object.entries(byModelCode).filter(([code, products]) => products.length > 1);
        if (duplicates.length > 0) {
            console.log(`\n⚠️  Found ${duplicates.length} duplicate model codes`);
        }

        // 샘플 출력
        console.log('\n📦 Sample products:');
        allProducts.slice(0, 5).forEach((p, i) => {
            console.log(`${i + 1}. ${p.name}`);
            console.log(`   Model: ${p.modelCode} | Brand: ${p.brand}`);
            console.log(`   Price: ${p.originalPrice.toLocaleString()}원 → ${p.salePrice.toLocaleString()}원 (${p.discountRate}% off)`);
            console.log(`   URL: ${p.url}`);
        });

        return allProducts;

    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    } finally {
        await browser.close();
    }
}

// 실행
crawlCapoStore()
    .then(() => console.log('\n✨ Crawling completed successfully!'))
    .catch(err => console.error('\n💥 Crawling failed:', err));
