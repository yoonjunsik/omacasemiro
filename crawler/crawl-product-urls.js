const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// sportsdirect.js의 크롤링 함수 재사용
async function crawlProductPage(url) {
    try {
        console.log(`🔍 크롤링: ${url}`);

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
            console.log('   ⚠️  제품 정보를 찾을 수 없습니다.');
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

        const inStock = offer.availability === 'http://schema.org/InStock' ||
                        offer.availability === 'https://schema.org/InStock';

        console.log(`   ✅ £${currentPrice} (정가 £${regularPrice}, ${discountRate}% 할인)`);

        return {
            name: productData.name,
            brand: productData.brand || 'Unknown',
            gtin: productData.gtin13 || null,
            currency: currency,
            currentPrice: currentPrice,
            regularPrice: regularPrice,
            discountRate: discountRate,
            inStock: inStock,
            url: url
        };

    } catch (error) {
        console.error(`   ❌ 오류: ${error.message}`);
        return null;
    }
}

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
    'real madrid': '레알 마드리드',
    'barcelona': '바르셀로나',
    'barca': '바르셀로나',
    'psg': 'PSG',
    'paris saint germain': 'PSG',
    'benfica': '벤피카',
    'al nassr': '알 나스르',
    'ajax': '아약스',
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
        /(\d{4})[\s/\-](\d{4})/,
        /(\d{2})[\s/\-](\d{2})/
    ];

    let season = null;
    for (const pattern of seasonPatterns) {
        const match = name.match(pattern);
        if (match) {
            season = match[1].length === 4
                ? `${match[1].slice(-2)}/${match[2].slice(-2)}`
                : `${match[1]}/${match[2]}`;
            break;
        }
    }

    let kitType = null;
    if (name.match(/\bhome\b/i)) kitType = '홈킷';
    else if (name.match(/\baway\b/i)) kitType = '어웨이킷';
    else if (name.match(/\bthird\b/i)) kitType = '써드킷';
    else if (name.match(/training|pre[-\s]?match/i)) kitType = '트레이닝';

    let version = '레플리카';
    if (name.match(/authentic|player\s+(?:issue|version)|match/i)) version = '어센틱';

    const teamName = extractTeamFromName(name);

    return { season, kitType, version, teamName };
}

async function main() {
    console.log('🚀 제품 URL 크롤러 시작\n');

    // 1. 기존 제품 로드 (있으면)
    let existingProducts = [];
    try {
        existingProducts = JSON.parse(
            fs.readFileSync('crawler/sportsdirect-products.json', 'utf8')
        );
    } catch (e) {
        console.log('기존 제품 파일 없음, 새로 시작합니다.');
    }

    // 2. 추가 제품 URL - JSON 파일에서 로드
    const urlData = JSON.parse(
        fs.readFileSync('crawler/additional-urls.json', 'utf8')
    );

    const additionalUrls = [];
    urlData.forEach(group => {
        additionalUrls.push(...group.urls);
    });

    console.log(`📦 기존 제품: ${existingProducts.length}개`);
    console.log(`➕ 추가 URL: ${additionalUrls.length}개\n`);

    const allProducts = [];

    // 기존 제품은 스킵하고 추가 URL만 크롤링
    if (existingProducts.length > 0) {
        console.log('기존 제품 ${existingProducts.length}개는 그대로 유지합니다.\n');
        allProducts.push(...existingProducts);
    }

    // 추가 URL 크롤링
    console.log('='.repeat(60));
    console.log('추가 제품 크롤링');
    console.log('='.repeat(60));

    for (const url of additionalUrls) {
        const details = await crawlProductPage(url);

        if (details) {
            const { season, kitType, version, teamName } = parseProductInfo(details.name);

            // Product ID 추출 (URL에서)
            const productIdMatch = url.match(/-(\d+)/);
            const productId = productIdMatch ? productIdMatch[1] : null;

            // 중복 체크
            if (allProducts.find(p => p.productUrl === url)) {
                console.log('   ⚠️  이미 존재하는 제품입니다.');
                continue;
            }

            if (teamName && season && kitType) {
                allProducts.push({
                    team: teamName,
                    kitType: kitType,
                    season: season,
                    version: version,
                    name: details.name,
                    brand: details.brand,
                    productId: productId,
                    productUrl: url,
                    currentPrice: details.currentPrice,
                    regularPrice: details.regularPrice,
                    discountRate: details.discountRate,
                    currency: details.currency,
                    inStock: details.inStock,
                    gtin: details.gtin
                });
            }
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n\n📊 크롤링 완료!');
    console.log('='.repeat(60));
    console.log(`총 ${allProducts.length}개 제품 수집\n`);

    // 팀별 통계
    const byTeam = {};
    allProducts.forEach(p => {
        if (!byTeam[p.team]) byTeam[p.team] = [];
        byTeam[p.team].push(p);
    });

    console.log('🏆 팀별:');
    Object.entries(byTeam)
        .sort((a, b) => b[1].length - a[1].length)
        .forEach(([team, products]) => {
            console.log(`   ${team}: ${products.length}개`);
        });

    // 재고 상태
    const inStock = allProducts.filter(p => p.inStock).length;
    console.log(`\n📦 재고 있음: ${inStock}개 / ${allProducts.length}개`);

    // 저장
    fs.writeFileSync(
        'crawler/sportsdirect-products.json',
        JSON.stringify(allProducts, null, 2)
    );
    console.log(`\n✅ 저장: crawler/sportsdirect-products.json`);
}

main().catch(console.error);
