const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// 매칭된 제품 로드
const matches = JSON.parse(fs.readFileSync('crawler/unisportstore-matches.json', 'utf8'));

console.log(`📦 매칭된 제품: ${matches.length}개`);

// 키즈/롱슬리브 제외 필터
const adultShortSleeve = matches.filter(m => {
    const name = m.unisportProduct.name.toLowerCase();
    return !name.includes('kids') &&
           !name.includes('long sleeves') &&
           !name.includes('long-sleeves') &&
           !name.includes('mini-kit') &&
           !name.includes('women');
});

console.log(`🔍 성인 반팔 제품: ${adultShortSleeve.length}개\n`);

// 제품 상세 정보 크롤링
async function crawlProductDetails(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 15000
        });

        const $ = cheerio.load(response.data);

        // 스타일 코드 찾기
        let styleCode = null;
        const bodyText = $('body').text();

        // "Style: XXXXX" 패턴
        let match = bodyText.match(/Style:\s*([A-Z0-9\-]+)/);
        if (match) {
            styleCode = match[1];
        }

        // JSON-LD 구조화 데이터에서 가격 찾기
        let salePrice = null;
        let regularPrice = null;

        $('script[type="application/ld+json"]').each((i, elem) => {
            try {
                const jsonText = $(elem).html();
                const jsonData = JSON.parse(jsonText);

                if (jsonData['@type'] === 'Product' && jsonData.offers) {
                    const offer = jsonData.offers;
                    salePrice = parseFloat(offer.price);

                    // highPrice가 있으면 그게 정가
                    if (offer.highPrice) {
                        regularPrice = parseFloat(offer.highPrice);
                    }
                }
            } catch (e) {}
        });

        // 정가를 못찾았으면 판매가를 정가로
        if (!regularPrice && salePrice) {
            regularPrice = salePrice;
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
        console.error(`   ❌ 오류: ${error.message}`);
        return null;
    }
}

// 메인 크롤링
async function main() {
    const results = [];

    for (let i = 0; i < adultShortSleeve.length; i++) {
        const match = adultShortSleeve[i];
        console.log(`[${i+1}/${adultShortSleeve.length}] ${match.dataProduct.name}`);
        console.log(`   → ${match.unisportProduct.name}`);

        const details = await crawlProductDetails(match.unisportProduct.url);

        if (details && details.salePrice) {
            results.push({
                ...match,
                styleCode: details.styleCode,
                salePrice: details.salePrice,
                regularPrice: details.regularPrice,
                discount: details.discount,
                url: match.unisportProduct.url
            });

            console.log(`   ✅ €${details.salePrice} (${details.discount}% 할인) ${details.styleCode || ''}`);
        } else {
            console.log(`   ⚠️  가격 정보 없음`);
        }

        // 딜레이
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    console.log(`\n📊 가격 정보 수집 완료: ${results.length}/${adultShortSleeve.length}개`);

    // 저장
    fs.writeFileSync(
        'crawler/unisportstore-with-prices.json',
        JSON.stringify(results, null, 2)
    );

    console.log('✅ 저장: crawler/unisportstore-with-prices.json');

    // 통계
    const withStyle = results.filter(r => r.styleCode);
    console.log(`📊 스타일 코드 발견: ${withStyle.length}/${results.length}개`);
}

main().catch(console.error);
