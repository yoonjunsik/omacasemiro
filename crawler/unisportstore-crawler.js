const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Unisportstore 블랙프라이데이 페이지 크롤링
async function crawlUnisportstoreBF() {
    const results = [];
    const baseUrl = 'https://www.unisportstore.com';

    // 7페이지 모두 크롤링
    for (let page = 1; page <= 7; page++) {
        console.log(`\n📄 페이지 ${page}/7 크롤링 중...`);

        const url = `https://www.unisportstore.com/black-friday-football-shirts/?page=${page}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            const $ = cheerio.load(response.data);

            // 제품 카드 선택자 찾기 (여러 패턴 시도)
            const possibleSelectors = [
                '.product-item',
                '.product-card',
                '.product',
                'article',
                '[data-product]',
                '.item'
            ];

            let productElements = null;
            let usedSelector = '';

            for (const selector of possibleSelectors) {
                const elements = $(selector);
                if (elements.length > 0) {
                    productElements = elements;
                    usedSelector = selector;
                    break;
                }
            }

            if (!productElements || productElements.length === 0) {
                // 모든 링크에서 /football-shirts/ 포함된 것 찾기
                console.log('   기본 선택자로 제품을 찾지 못함. 링크 기반으로 시도...');

                $('a[href*="/football-shirts/"]').each((i, elem) => {
                    const $elem = $(elem);
                    const href = $elem.attr('href');

                    // 중복 방지 및 유효한 제품 URL만
                    if (!href || href.includes('?') || results.find(p => p.productUrl === href)) {
                        return;
                    }

                    const $parent = $elem.closest('div').parent();

                    // 제품 이름
                    const name = $elem.find('img').attr('alt') ||
                                $elem.text().trim() ||
                                $elem.attr('title') || '';

                    if (!name) return;

                    // 가격 정보
                    const priceText = $parent.find('[class*="price"]').text().trim();
                    const prices = priceText.match(/[€$£]\s*[\d,\.]+/g) || [];

                    let salePrice = null;
                    let regularPrice = null;

                    if (prices.length > 0) {
                        const price1 = parseFloat(prices[0].replace(/[€$£,]/g, ''));
                        salePrice = price1;

                        if (prices.length > 1) {
                            const price2 = parseFloat(prices[1].replace(/[€$£,]/g, ''));
                            regularPrice = Math.max(price1, price2);
                            salePrice = Math.min(price1, price2);
                        } else {
                            regularPrice = price1;
                        }
                    }

                    // 할인율
                    const discountText = $parent.find('[class*="discount"], [class*="percent"]').text().trim();
                    const discountMatch = discountText.match(/(\d+)%/);
                    const discount = discountMatch ? parseInt(discountMatch[1]) : 0;

                    // 이미지
                    const image = $elem.find('img').attr('src') || '';

                    results.push({
                        name: name.trim(),
                        productUrl: href.startsWith('http') ? href : baseUrl + href,
                        salePrice,
                        regularPrice,
                        discount,
                        image,
                        currency: 'EUR'
                    });
                });

                console.log(`   ✅ ${results.length}개 제품 발견 (누적)`);
            } else {
                console.log(`   선택자 "${usedSelector}" 사용, ${productElements.length}개 제품 발견`);

                productElements.each((i, elem) => {
                    const $elem = $(elem);

                    // 제품 링크
                    const $link = $elem.find('a').first();
                    const href = $link.attr('href');

                    if (!href) return;

                    // 제품 이름
                    const name = $link.find('img').attr('alt') ||
                                $link.attr('title') ||
                                $elem.find('[class*="title"], [class*="name"]').text().trim() ||
                                $link.text().trim();

                    // 가격
                    const priceText = $elem.find('[class*="price"]').text().trim();
                    const prices = priceText.match(/[€$£]\s*[\d,\.]+/g) || [];

                    let salePrice = null;
                    let regularPrice = null;

                    if (prices.length > 0) {
                        const price1 = parseFloat(prices[0].replace(/[€$£,]/g, ''));
                        salePrice = price1;

                        if (prices.length > 1) {
                            const price2 = parseFloat(prices[1].replace(/[€$£,]/g, ''));
                            regularPrice = Math.max(price1, price2);
                            salePrice = Math.min(price1, price2);
                        } else {
                            regularPrice = price1;
                        }
                    }

                    // 할인율
                    const discountText = $elem.find('[class*="discount"], [class*="percent"]').text().trim();
                    const discountMatch = discountText.match(/(\d+)%/);
                    const discount = discountMatch ? parseInt(discountMatch[1]) : 0;

                    // 이미지
                    const image = $link.find('img').attr('src') || '';

                    results.push({
                        name: name.trim(),
                        productUrl: href.startsWith('http') ? href : baseUrl + href,
                        salePrice,
                        regularPrice,
                        discount,
                        image,
                        currency: 'EUR'
                    });
                });

                console.log(`   ✅ ${productElements.length}개 제품 추가 (누적: ${results.length})`);
            }

            // 페이지 간 딜레이
            await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
            console.error(`   ❌ 페이지 ${page} 크롤링 실패:`, error.message);
        }
    }

    console.log(`\n📊 총 ${results.length}개 제품 크롤링 완료`);

    // 중복 제거
    const uniqueResults = results.filter((product, index, self) =>
        index === self.findIndex(p => p.productUrl === product.productUrl)
    );

    console.log(`🔍 중복 제거 후: ${uniqueResults.length}개 제품`);

    // 저장
    fs.writeFileSync(
        'crawler/unisportstore-products.json',
        JSON.stringify(uniqueResults, null, 2)
    );

    console.log('✅ 저장 완료: crawler/unisportstore-products.json');

    return uniqueResults;
}

// 실행
crawlUnisportstoreBF().catch(console.error);
