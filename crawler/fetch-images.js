const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// 이미지가 없는 제품들의 URL
const productsToFetch = [
    {
        team: "첼시",
        kitType: "홈킷",
        season: "25/26",
        url: "https://www.sportsdirect.com/nike-chelsea-home-shirt-2025-2026-adults-377323"
    },
    {
        team: "첼시",
        kitType: "어웨이킷",
        season: "25/26",
        url: "https://www.sportsdirect.com/nike-chelsea-away-shirt-2025-2026-adults-377356"
    },
    {
        team: "첼시",
        kitType: "써드킷",
        season: "25/26",
        url: "https://www.sportsdirect.com/nike-chelsea-third-shirt-2025-2026-adults-377013"
    },
    {
        team: "리버풀",
        kitType: "써드킷",
        season: "25/26",
        url: "https://www.sportsdirect.com/adidas-liverpool-third-shirt-2025-2026-adults-378759"
    },
    {
        team: "벤피카",
        kitType: "홈킷",
        season: "25/26",
        url: "https://www.sportsdirect.com/puma-manchester-city-away-shirt-2024-2025-adults-377811"
    },
    {
        team: "아약스",
        kitType: "써드킷",
        season: "25/26",
        url: "https://www.sportsdirect.com/puma-manchester-city-third-shirt-2024-2025-adults-377805"
    },
    {
        team: "알 나스르",
        kitType: "홈킷",
        season: "25/26",
        url: "https://www.sportsdirect.com/adidas-arsenal-home-shirt-2025-2026-adults-377827"
    },
    {
        team: "아스널",
        kitType: "써드킷",
        season: "25/26",
        url: "https://www.sportsdirect.com/adidas-arsenal-third-shirt-2025-2026-adults-377828"
    }
];

async function fetchImageUrl(url) {
    try {
        console.log(`🔍 크롤링: ${url}`);

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(response.data);

        // 메인 이미지 찾기 (여러 방법 시도)
        let imageUrl = null;

        // 방법 1: JSON-LD에서 추출
        $('script[type="application/ld+json"]').each((i, elem) => {
            try {
                const jsonData = JSON.parse($(elem).html());
                const data = Array.isArray(jsonData) ? jsonData[0] : jsonData;
                if (data && data['@type'] === 'Product' && data.image) {
                    imageUrl = data.image;
                }
            } catch (e) {}
        });

        // 방법 2: og:image 메타 태그
        if (!imageUrl) {
            imageUrl = $('meta[property="og:image"]').attr('content');
        }

        // 방법 3: 제품 이미지 클래스
        if (!imageUrl) {
            imageUrl = $('.productImage img').first().attr('src');
        }

        // 방법 4: data-zoom-image 속성
        if (!imageUrl) {
            imageUrl = $('img[data-zoom-image]').first().attr('data-zoom-image');
        }

        // URL이 상대 경로면 절대 경로로 변환
        if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = 'https://www.sportsdirect.com' + imageUrl;
        }

        console.log(`   ✅ 이미지: ${imageUrl}`);
        return imageUrl;

    } catch (error) {
        console.error(`   ❌ 오류: ${error.message}`);
        return null;
    }
}

async function main() {
    console.log('🚀 이미지 URL 크롤러 시작\n');

    const results = [];

    for (const product of productsToFetch) {
        const imageUrl = await fetchImageUrl(product.url);
        results.push({
            ...product,
            imageUrl: imageUrl
        });

        // 요청 간 딜레이
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n📊 크롤링 완료!');
    console.log('='.repeat(60));

    results.forEach(r => {
        console.log(`${r.team} ${r.kitType} (${r.season})`);
        console.log(`   ${r.imageUrl || '❌ 이미지 없음'}\n`);
    });

    // 결과 저장
    fs.writeFileSync(
        'crawler/image-urls.json',
        JSON.stringify(results, null, 2)
    );
    console.log('✅ 저장: crawler/image-urls.json');
}

main().catch(console.error);
