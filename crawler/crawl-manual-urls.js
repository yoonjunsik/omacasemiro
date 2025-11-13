const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// 팀명 매핑
const teamNameMapping = {
    'manchester united': '맨체스터 유나이티드',
    'man utd': '맨체스터 유나이티드',
    'liverpool': '리버풀',
    'manchester city': '맨체스터 시티',
    'man city': '맨체스터 시티',
    'chelsea': '첼시',
    'arsenal': '아스널',
    'tottenham': '토트넘',
    'spurs': '토트넘',
    'real madrid': '레알 마드리드',
    'barcelona': '바르셀로나',
    'barca': '바르셀로나',
    'psg': 'PSG',
    'paris saint germain': 'PSG',
    'paris saint-germain': 'PSG',
    'benfica': '벤피카',
    'al nassr': '알 나스르',
    'ajax': '아약스',
    'bayern': '바이에른 뮌헨',
    'bayern munich': '바이에른 뮌헨',
    'juventus': '유벤투스',
    'inter': '인테르 밀란',
    'inter milan': '인테르 밀란',
    'ac milan': 'AC 밀란',
    'milan': 'AC 밀란',
    'newcastle': '뉴캐슬',
    'newcastle united': '뉴캐슬'
};

function extractTeamFromName(productName) {
    const lowerName = productName.toLowerCase();
    for (const [eng, kor] of Object.entries(teamNameMapping)) {
        if (lowerName.includes(eng)) {
            return kor;
        }
    }
    return null;
}

function parseProductInfo(name) {
    const seasonPatterns = [
        /(20\d{2})[\/\s\-](20\d{2})/,
        /(20\d{2})[\/\s\-](\d{2})/,
        /(\d{2})[\/\s\-](\d{2})/
    ];

    let season = null;
    for (const pattern of seasonPatterns) {
        const match = name.match(pattern);
        if (match) {
            const year1 = match[1].length === 4 ? match[1].slice(-2) : match[1];
            const year2 = match[2].length === 4 ? match[2].slice(-2) : match[2];
            season = `${year1}/${year2}`;
            break;
        }
    }

    let kitType = null;
    if (name.match(/\bhome\b/i)) kitType = '홈킷';
    else if (name.match(/\baway\b/i)) kitType = '어웨이킷';
    else if (name.match(/\bthird\b/i)) kitType = '써드킷';

    let version = '레플리카';
    if (name.match(/authentic|player\s+(?:issue|version)|match/i)) {
        version = '어센틱';
    }

    const teamName = extractTeamFromName(name);

    return { season, kitType, version, teamName };
}

async function crawlProductPage(url) {
    try {
        console.log(`   🔍 크롤링: ${url}`);

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(response.data);

        // JSON-LD에서 제품 정보 추출
        let productData = null;
        $('script[type="application/ld+json"]').each((i, elem) => {
            try {
                const jsonData = JSON.parse($(elem).html());
                const data = Array.isArray(jsonData) ? jsonData[0] : jsonData;
                if (data && data['@type'] === 'Product') {
                    productData = data;
                }
            } catch (e) {}
        });

        if (!productData || !productData.offers) {
            console.log(`   ⚠️  제품 정보 없음`);
            return null;
        }

        const offer = Array.isArray(productData.offers)
            ? productData.offers[0]
            : productData.offers;

        const currentPrice = parseFloat(offer.price);
        const currency = offer.priceCurrency;

        // RRP (정가) 찾기
        let regularPrice = currentPrice;
        const variantsSpan = $('.ProductDetailsVariants');
        if (variantsSpan.length > 0) {
            const variantsData = variantsSpan.attr('data-variants');
            if (variantsData) {
                try {
                    const decodedData = variantsData
                        .replace(/&quot;/g, '"')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>');
                    const variants = JSON.parse(decodedData);
                    if (variants && variants[0] && variants[0].ProdVarPrices) {
                        regularPrice = variants[0].ProdVarPrices.RefPriceRaw || currentPrice;
                    }
                } catch (e) {}
            }
        }

        const discountRate = regularPrice > currentPrice
            ? Math.round((1 - currentPrice / regularPrice) * 100)
            : 0;

        // 이미지 URL
        let imageUrl = productData.image || null;
        if (!imageUrl) {
            imageUrl = $('meta[property="og:image"]').attr('content');
        }

        const { season, kitType, version, teamName } = parseProductInfo(productData.name);

        console.log(`   ✅ ${teamName} ${season} ${kitType} (${version}) - £${currentPrice} (정가 £${regularPrice}, ${discountRate}% 할인)`);

        return {
            name: productData.name,
            team: teamName,
            kitType,
            season,
            version,
            productUrl: url,
            currentPrice,
            regularPrice,
            discountRate,
            currency,
            imageUrl
        };

    } catch (error) {
        console.error(`   ❌ 오류: ${error.message}`);
        return null;
    }
}

async function main() {
    console.log('🚀 수동 URL 목록 크롤링 시작\n');

    const urlList = JSON.parse(fs.readFileSync('crawler/extracted-urls.json', 'utf8'));

    console.log(`총 ${urlList.length}개 URL 크롤링\n`);

    const products = [];

    for (let i = 0; i < urlList.length; i++) {
        console.log(`\n[${i + 1}/${urlList.length}]`);
        const product = await crawlProductPage(urlList[i]);

        if (product) {
            products.push(product);
        }

        // 요청 간 딜레이
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n\n📊 크롤링 완료!');
    console.log('='.repeat(60));
    console.log(`총 ${products.length}개 제품 수집`);

    // 팀별 통계
    const byTeam = {};
    products.forEach(p => {
        if (!byTeam[p.team]) byTeam[p.team] = [];
        byTeam[p.team].push(p);
    });

    console.log('\n🏆 팀별:');
    Object.entries(byTeam)
        .sort((a, b) => b[1].length - a[1].length)
        .forEach(([team, prods]) => {
            console.log(`   ${team}: ${prods.length}개`);
        });

    // 저장
    fs.writeFileSync(
        'crawler/manual-crawl-results.json',
        JSON.stringify(products, null, 2)
    );

    console.log(`\n✅ 저장: crawler/manual-crawl-results.json`);
}

main().catch(console.error);
