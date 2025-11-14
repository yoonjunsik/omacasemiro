const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// 문제가 있는 제품들의 URL
const productsToFix = [
    { url: "https://www.sportsdirect.com/nike-chelsea-home-shirt-2025-2026-adults-377323", team: "첼시", kit: "홈킷", season: "25/26" },
    { url: "https://www.sportsdirect.com/nike-chelsea-away-shirt-2025-2026-adults-377356", team: "첼시", kit: "어웨이킷", season: "25/26" },
    { url: "https://www.sportsdirect.com/nike-chelsea-third-shirt-2025-2026-adults-377013", team: "첼시", kit: "써드킷", season: "25/26" },
    { url: "https://www.sportsdirect.com/adidas-arsenal-third-shirt-2025-2026-adults-377828", team: "아스널", kit: "써드킷", season: "25/26" },
    { url: "https://www.sportsdirect.com/adidas-arsenal-home-shirt-2025-2026-adults-377838", team: "아스널", kit: "홈킷", season: "25/26" },
    { url: "https://www.sportsdirect.com/adidas-arsenal-away-shirt-2025-2026-adults-377831", team: "아스널", kit: "어웨이킷", season: "25/26" },
    { url: "https://www.sportsdirect.com/adidas-liverpool-third-shirt-2025-2026-adults-378759", team: "리버풀", kit: "써드킷", season: "25/26" },
    { url: "https://www.sportsdirect.com/adidas-al-nassr-home-shirt-2024-2025-adults-367573", team: "알 나스르", kit: "홈킷", season: "24/25" }
];

async function extractModelCode(url) {
    try {
        console.log(`🔍 ${url}`);

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(response.data);

        // 방법 1: 제품 설명에서 찾기
        let modelCode = null;

        // Style/Model/Article 번호 찾기
        $('.productInformationContent, .productdescription, .productDetails').each((i, elem) => {
            const text = $(elem).text();

            // 다양한 패턴으로 모델 코드 찾기
            const patterns = [
                /Style\s*:?\s*([A-Z0-9\-]+)/i,
                /Model\s*:?\s*([A-Z0-9\-]+)/i,
                /Article\s*:?\s*([A-Z0-9\-]+)/i,
                /Product\s*Code\s*:?\s*([A-Z0-9\-]+)/i,
                /Item\s*Code\s*:?\s*([A-Z0-9\-]+)/i,
                /SKU\s*:?\s*([A-Z0-9\-]+)/i
            ];

            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match && match[1] && match[1].length >= 5) {
                    modelCode = match[1].trim();
                    break;
                }
            }
        });

        // 방법 2: JSON-LD에서 SKU 찾기
        if (!modelCode) {
            $('script[type="application/ld+json"]').each((i, elem) => {
                try {
                    const jsonData = JSON.parse($(elem).html());
                    const data = Array.isArray(jsonData) ? jsonData[0] : jsonData;
                    if (data && data['@type'] === 'Product' && data.sku) {
                        modelCode = data.sku;
                    }
                } catch (e) {}
            });
        }

        // 방법 3: GTIN에서 추출 (마지막 수단)
        if (!modelCode) {
            $('script[type="application/ld+json"]').each((i, elem) => {
                try {
                    const jsonData = JSON.parse($(elem).html());
                    const data = Array.isArray(jsonData) ? jsonData[0] : jsonData;
                    if (data && data['@type'] === 'Product' && data.gtin13) {
                        modelCode = `GTIN-${data.gtin13.slice(-6)}`;
                    }
                } catch (e) {}
            });
        }

        if (modelCode) {
            console.log(`   ✅ 모델 코드: ${modelCode}`);
        } else {
            console.log(`   ❌ 모델 코드를 찾을 수 없음`);
        }

        return modelCode;

    } catch (error) {
        console.error(`   ❌ 오류: ${error.message}`);
        return null;
    }
}

async function main() {
    console.log('🚀 모델 코드 추출 시작\n');

    const results = [];

    for (const product of productsToFix) {
        const modelCode = await extractModelCode(product.url);

        results.push({
            ...product,
            modelCode: modelCode || `SD-${product.url.match(/(\d+)$/)[1]}`
        });

        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n\n📊 결과:');
    console.log('='.repeat(60));
    results.forEach(r => {
        console.log(`${r.team} ${r.season} ${r.kit}: ${r.modelCode}`);
    });

    fs.writeFileSync(
        'crawler/model-codes.json',
        JSON.stringify(results, null, 2)
    );

    console.log('\n✅ 저장: crawler/model-codes.json');
}

main().catch(console.error);
