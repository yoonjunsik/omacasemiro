const puppeteer = require('puppeteer');
const fs = require('fs');

// 크리스마스 샵 URL 목록
const christmasShops = [
    {
        name: 'Arsenal',
        url: 'https://arsenaldirect.arsenal.com/Christmas-Shop/c/christmas'
    },
    {
        name: 'Chelsea',
        url: 'https://store.chelseafc.com/en/c-7104'
    },
    {
        name: 'Tottenham',
        url: 'https://shop.tottenhamhotspur.com/spurs-christmas'
    },
    {
        name: 'Manchester United',
        url: 'https://store.manutd.com/en/c/christmas'
    },
    {
        name: 'Manchester City',
        url: 'https://shop.mancity.com/ca/en/christmas/featured/christmas-essentials/'
    },
    {
        name: 'Barcelona',
        url: 'https://store.fcbarcelona.com/ko-kr/search?q=christmas&options%5Bprefix%5D=last'
    },
    {
        name: 'Bayern Munich',
        url: 'https://fcbayern.com/store/en-zz/c/specials/x-mas-world'
    },
    {
        name: 'Borussia Dortmund',
        url: 'https://shop.bvb.de/en-de/christmas'
    }
];

async function crawlChristmasProducts(club) {
    console.log(`\n🎄 Crawling ${club.name}...`);
    console.log(`URL: ${club.url}`);

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

        console.log('Loading page...');
        await page.goto(club.url, {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        // 페이지 로딩 대기
        await page.waitForTimeout(5000);

        // 스크롤해서 이미지 로딩
        await autoScroll(page);

        // 제품 추출 - 다양한 셀렉터 시도
        const products = await page.evaluate(() => {
            const productElements = [];

            // 일반적인 제품 카드 셀렉터들
            const selectors = [
                '.product-tile',
                '.product-card',
                '.product-item',
                '.product',
                '[data-product]',
                '.grid-tile',
                '.c-product-tile',
                'article[class*="product"]',
                'div[class*="product-card"]',
                'div[class*="ProductCard"]',
                '.ProductListItem'
            ];

            let foundElements = [];

            for (const selector of selectors) {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    console.log(`Found ${elements.length} products with selector: ${selector}`);
                    foundElements = Array.from(elements);
                    break;
                }
            }

            if (foundElements.length === 0) {
                console.log('No products found with standard selectors');
                return [];
            }

            return foundElements.slice(0, 20).map((el, index) => {
                try {
                    // 이미지 찾기
                    let image = el.querySelector('img');
                    let imageSrc = '';

                    if (image) {
                        imageSrc = image.src || image.dataset.src || image.dataset.lazySrc || '';
                        // srcset도 확인
                        if (!imageSrc && image.srcset) {
                            const srcsetArray = image.srcset.split(',');
                            if (srcsetArray.length > 0) {
                                imageSrc = srcsetArray[0].trim().split(' ')[0];
                            }
                        }
                    }

                    // 링크 찾기
                    let link = el.querySelector('a');
                    let productUrl = '';

                    if (link) {
                        productUrl = link.href;
                    } else if (el.tagName === 'A') {
                        productUrl = el.href;
                    }

                    // 제품명 찾기
                    let name = '';
                    const nameSelectors = [
                        '.product-name',
                        '.product-title',
                        '[class*="product-name"]',
                        '[class*="ProductName"]',
                        'h2', 'h3', 'h4',
                        '.title'
                    ];

                    for (const sel of nameSelectors) {
                        const nameEl = el.querySelector(sel);
                        if (nameEl && nameEl.textContent.trim()) {
                            name = nameEl.textContent.trim();
                            break;
                        }
                    }

                    return {
                        name: name || `Product ${index + 1}`,
                        image: imageSrc,
                        url: productUrl
                    };
                } catch (err) {
                    console.error('Error extracting product:', err);
                    return null;
                }
            }).filter(p => p && p.image && p.url);
        });

        console.log(`✅ Found ${products.length} products`);

        // 결과 저장
        const outputPath = `crawler/christmas-${club.name.toLowerCase().replace(/\s+/g, '-')}.json`;
        fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
        console.log(`💾 Saved to ${outputPath}`);

        // 샘플 출력
        if (products.length > 0) {
            console.log('\n📦 Sample products:');
            products.slice(0, 3).forEach((p, i) => {
                console.log(`${i + 1}. ${p.name}`);
                console.log(`   Image: ${p.image.substring(0, 80)}...`);
                console.log(`   URL: ${p.url}`);
            });
        }

        return products;

    } catch (error) {
        console.error(`❌ Error crawling ${club.name}:`, error.message);
        return [];
    } finally {
        await browser.close();
    }
}

// 자동 스크롤 함수
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

// 메인 실행
async function main() {
    console.log('🎄 Starting Christmas Products Crawler...\n');

    const allResults = {};

    for (const club of christmasShops) {
        const products = await crawlChristmasProducts(club);
        allResults[club.name] = products;

        // 다음 크롤링 전 대기
        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // 전체 결과 저장
    fs.writeFileSync('crawler/christmas-all-products.json', JSON.stringify(allResults, null, 2));
    console.log('\n\n✅ All done! Results saved to crawler/christmas-all-products.json');

    // 요약 출력
    console.log('\n📊 Summary:');
    for (const [club, products] of Object.entries(allResults)) {
        console.log(`${club}: ${products.length} products`);
    }
}

main().catch(console.error);
