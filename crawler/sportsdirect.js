const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// data.js 파일 읽기
function loadDataJS() {
    const dataPath = path.join(__dirname, '../js/data.js');
    const dataContent = fs.readFileSync(dataPath, 'utf8');
    const uniformMatch = dataContent.match(/const uniformData = (\[[\s\S]*?\]);/);
    return eval(uniformMatch[1]);
}

// 스포츠다이렉트 제품 페이지 크롤링
async function crawlSportsDirectProduct(url) {
    try {
        console.log(`🔍 크롤링 중: ${url}`);

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);

        // JSON-LD 구조화 데이터에서 가격 정보 추출
        let productData = null;
        $('script[type="application/ld+json"]').each((i, elem) => {
            try {
                const jsonData = JSON.parse($(elem).html());
                // JSON-LD는 배열일 수도 있음
                const data = Array.isArray(jsonData) ? jsonData[0] : jsonData;
                if (data && data['@type'] === 'Product') {
                    productData = data;
                }
            } catch (e) {
                // JSON 파싱 실패 시 무시
            }
        });

        if (!productData || !productData.offers) {
            console.log('⚠️  가격 정보를 찾을 수 없습니다.');
            return null;
        }

        // offers가 배열이면 첫 번째 요소 사용
        const offer = Array.isArray(productData.offers)
            ? productData.offers[0]
            : productData.offers;

        const currentPrice = parseFloat(offer.price);
        const currency = offer.priceCurrency;

        // RRP (정가) 찾기 - HTML 내 JSON 데이터에서 추출
        let regularPrice = currentPrice;

        // ProductDetailsVariants hidden span에서 가격 정보 추출
        const variantsSpan = $('.ProductDetailsVariants');
        if (variantsSpan.length > 0) {
            const variantsData = variantsSpan.attr('data-variants');
            if (variantsData) {
                try {
                    // HTML entities 디코딩
                    const decodedData = variantsData
                        .replace(/&quot;/g, '"')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>');
                    const variants = JSON.parse(decodedData);
                    if (variants && variants[0] && variants[0].ProdVarPrices) {
                        regularPrice = variants[0].ProdVarPrices.RefPriceRaw || currentPrice;
                    }
                } catch (e) {
                    console.log('   ⚠️  RRP 파싱 실패, 현재가를 정가로 사용');
                }
            }
        }

        // 할인율 계산
        const discountRate = regularPrice > currentPrice
            ? Math.round((1 - currentPrice / regularPrice) * 100)
            : 0;

        return {
            name: productData.name,
            currency: currency,
            currentPrice: currentPrice,
            regularPrice: regularPrice,
            discountRate: discountRate,
            inStock: offer.availability === 'http://schema.org/InStock'
        };

    } catch (error) {
        console.error(`❌ 크롤링 실패: ${error.message}`);
        return null;
    }
}

// 메인 함수
async function main() {
    console.log('🚀 스포츠다이렉트 크롤러 시작\n');

    const uniformData = loadDataJS();

    // 스포츠다이렉트 링크가 있는 제품 필터링
    const sportsDirectProducts = uniformData.filter(product =>
        product.site_offers && product.site_offers.some(offer =>
            offer.affiliate_link && offer.affiliate_link.includes('sportsdirect.com')
        )
    );

    console.log(`📊 크롤링 대상: ${sportsDirectProducts.length}개 제품\n`);

    const results = [];

    for (const product of sportsDirectProducts) {
        const sdOffer = product.site_offers.find(s =>
            s.affiliate_link && s.affiliate_link.includes('sportsdirect.com')
        );

        console.log(`\n📦 ${product.team} - ${product.kit_type} (${product.season})`);
        console.log(`   모델코드: ${product.model_code}`);
        console.log(`   현재 data.js 가격: £${sdOffer.sale_price} (정가 £${sdOffer.regular_price})`);

        // 크롤링 실행
        const crawledData = await crawlSportsDirectProduct(sdOffer.affiliate_link);

        if (crawledData) {
            console.log(`   크롤링된 가격: £${crawledData.currentPrice} (정가 £${crawledData.regularPrice})`);
            console.log(`   재고 상태: ${crawledData.inStock ? '✅ 있음' : '❌ 없음'}`);

            // 가격 변동 확인
            const priceChanged = sdOffer.sale_price !== crawledData.currentPrice;
            const regularPriceChanged = sdOffer.regular_price !== crawledData.regularPrice;

            if (priceChanged || regularPriceChanged) {
                console.log(`   🔥 가격 변동 감지!`);
                if (priceChanged) {
                    console.log(`      세일가: £${sdOffer.sale_price} → £${crawledData.currentPrice}`);
                }
                if (regularPriceChanged) {
                    console.log(`      정가: £${sdOffer.regular_price} → £${crawledData.regularPrice}`);
                }
            } else {
                console.log(`   ✅ 가격 변동 없음`);
            }

            results.push({
                product: product,
                crawled: crawledData,
                priceChanged: priceChanged,
                regularPriceChanged: regularPriceChanged
            });
        }

        // Rate limiting - 요청 간 2초 대기
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 결과 요약
    console.log('\n\n📈 크롤링 결과 요약');
    console.log('='.repeat(60));
    const changedProducts = results.filter(r => r.priceChanged || r.regularPriceChanged);
    console.log(`총 ${results.length}개 제품 중 ${changedProducts.length}개 가격 변동`);

    if (changedProducts.length > 0) {
        console.log('\n🔥 가격 변동 제품 목록:');
        changedProducts.forEach((result, index) => {
            console.log(`\n${index + 1}. ${result.product.team} - ${result.product.kit_type}`);
            console.log(`   모델코드: ${result.product.model_code}`);
            if (result.priceChanged) {
                const oldOffer = result.product.site_offers.find(s => s.site_name === '스포츠다이렉트');
                console.log(`   세일가: £${oldOffer.sale_price} → £${result.crawled.currentPrice}`);
            }
            if (result.regularPriceChanged) {
                const oldOffer = result.product.site_offers.find(s => s.site_name === '스포츠다이렉트');
                console.log(`   정가: £${oldOffer.regular_price} → £${result.crawled.regularPrice}`);
            }
        });
    }

    console.log('\n✅ 크롤링 완료!');
}

// 실행
main().catch(console.error);
