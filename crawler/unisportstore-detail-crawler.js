const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// 크롤링한 제품 목록 로드
const products = JSON.parse(fs.readFileSync('crawler/unisportstore-products.json', 'utf8'));

// 제품 상세 페이지에서 정보 추출
async function crawlProductDetail(productUrl) {
    try {
        const response = await axios.get(productUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);

        // 스타일 코드 찾기 (여러 패턴 시도)
        let styleCode = null;

        // 패턴 1: "Style: XXXXX" 텍스트에서
        const bodyText = $('body').text();
        const styleMatch = bodyText.match(/Style:\s*([A-Z0-9\-]+)/i);
        if (styleMatch) {
            styleCode = styleMatch[1];
        }

        // 패턴 2: 제품 정보 테이블에서
        if (!styleCode) {
            $('table tr, .product-info, .specifications').each((i, elem) => {
                const text = $(elem).text();
                const match = text.match(/Style[:\s]+([A-Z0-9\-]+)/i);
                if (match) {
                    styleCode = match[1];
                    return false;
                }
            });
        }

        // 가격 정보
        let salePrice = null;
        let regularPrice = null;

        // 할인 가격
        const salePriceText = $('.price-sale, [class*="sale"], [class*="offer"]').first().text();
        const salePriceMatch = salePriceText.match(/[€$£]\s*([\d,\.]+)/);
        if (salePriceMatch) {
            salePrice = parseFloat(salePriceMatch[1].replace(',', ''));
        }

        // 정가
        const regularPriceText = $('.price-regular, [class*="original"], [class*="before"]').first().text();
        const regularPriceMatch = regularPriceText.match(/[€$£]\s*([\d,\.]+)/);
        if (regularPriceMatch) {
            regularPrice = parseFloat(regularPriceMatch[1].replace(',', ''));
        }

        // 가격이 하나만 있으면 그게 판매가
        if (!salePrice && !regularPrice) {
            const anyPriceText = $('[class*="price"]').first().text();
            const anyPriceMatch = anyPriceText.match(/[€$£]\s*([\d,\.]+)/);
            if (anyPriceMatch) {
                salePrice = parseFloat(anyPriceMatch[1].replace(',', ''));
                regularPrice = salePrice;
            }
        }

        // 할인율 계산
        let discount = 0;
        if (salePrice && regularPrice && regularPrice > salePrice) {
            discount = Math.round(((regularPrice - salePrice) / regularPrice) * 100);
        }

        return {
            styleCode,
            salePrice,
            regularPrice,
            discount
        };

    } catch (error) {
        console.error(`   ❌ ${productUrl} 오류:`, error.message);
        return { styleCode: null, salePrice: null, regularPrice: null, discount: 0 };
    }
}

// 메인 함수
async function main() {
    console.log(`🚀 ${products.length}개 제품 상세 정보 크롤링 시작\n`);

    const results = [];
    let count = 0;

    // 처음 50개 제품만 테스트 (전체는 시간이 너무 오래 걸림)
    const testProducts = products.slice(0, 50);

    for (const product of testProducts) {
        count++;
        console.log(`[${count}/${testProducts.length}] ${product.name}`);

        const details = await crawlProductDetail(product.productUrl);

        results.push({
            ...product,
            styleCode: details.styleCode,
            salePrice: details.salePrice,
            regularPrice: details.regularPrice,
            discount: details.discount
        });

        if (details.styleCode) {
            console.log(`   ✅ Style: ${details.styleCode}, €${details.salePrice}`);
        } else {
            console.log(`   ⚠️  스타일 코드 없음`);
        }

        // 딜레이 (서버 부하 방지)
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // 저장
    fs.writeFileSync(
        'crawler/unisportstore-detailed.json',
        JSON.stringify(results, null, 2)
    );

    console.log(`\n✅ 완료: crawler/unisportstore-detailed.json`);

    // 스타일 코드가 있는 제품 통계
    const withStyle = results.filter(p => p.styleCode);
    console.log(`📊 스타일 코드 발견: ${withStyle.length}/${results.length}개`);
}

main().catch(console.error);
