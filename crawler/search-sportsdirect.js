const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// 우선순위 제품 로드
const { priority } = JSON.parse(
    fs.readFileSync('crawler/products-without-sportsdirect.json', 'utf8')
);

async function searchProduct(product) {
    try {
        // 팀 이름으로 검색 (예: "Manchester United Home 2024")
        const searchQuery = `${product.team} ${product.kit_type} ${product.season}`.replace(/\//g, ' ');
        const encodedQuery = encodeURIComponent(searchQuery);

        console.log(`\n🔍 검색: "${searchQuery}"`);

        const url = `https://www.sportsdirect.com/search?descriptionfilter=${encodedQuery}`;

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const results = [];

        // 검색 결과에서 제품 찾기
        $('.s-productthumbbox').each((i, elem) => {
            const $product = $(elem);

            const name = $product.find('.s-productbox-title a').text().trim();
            const productLink = $product.find('.s-productbox-title a').attr('href');
            const priceText = $product.find('.s-now-price').text().trim();

            if (name && productLink) {
                const fullUrl = productLink.startsWith('http')
                    ? productLink
                    : `https://www.sportsdirect.com${productLink}`;

                const price = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '')) : null;

                results.push({
                    name,
                    url: fullUrl,
                    price
                });
            }
        });

        if (results.length > 0) {
            console.log(`   ✅ ${results.length}개 검색 결과 발견`);
            results.slice(0, 3).forEach((r, i) => {
                console.log(`      ${i + 1}. ${r.name} - £${r.price || 'N/A'}`);
            });
            return results[0]; // 첫 번째 결과 반환
        } else {
            console.log(`   ❌ 검색 결과 없음`);
            return null;
        }

    } catch (error) {
        console.error(`   ❌ 검색 오류: ${error.message}`);
        return null;
    }
}

async function main() {
    console.log('🚀 스포츠다이렉트 제품 검색 시작\n');
    console.log(`검색할 제품 수: ${priority.length}개\n`);

    const results = [];

    for (let i = 0; i < Math.min(priority.length, 10); i++) { // 일단 10개만 테스트
        const product = priority[i];
        console.log(`\n[${i + 1}/10] ${product.team} ${product.season} ${product.kit_type}`);

        const searchResult = await searchProduct(product);

        if (searchResult) {
            results.push({
                original: product,
                found: searchResult
            });
        }

        // 요청 간 딜레이
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n\n📊 검색 완료!');
    console.log('='.repeat(60));
    console.log(`총 ${results.length}개 제품 발견`);

    results.forEach((r, i) => {
        console.log(`\n${i + 1}. ${r.original.team} ${r.original.season} ${r.original.kit_type}`);
        console.log(`   → ${r.found.name}`);
        console.log(`   → ${r.found.url}`);
    });

    fs.writeFileSync(
        'crawler/search-results.json',
        JSON.stringify(results, null, 2)
    );

    console.log('\n✅ 저장: crawler/search-results.json');
}

main().catch(console.error);
