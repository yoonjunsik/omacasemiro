const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// 팀명 매핑 (영어 -> 한국어)
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
    'al-nassr': '알 나스르',
    'ajax': '아약스',
    'bayern': '바이에른 뮌헨',
    'bayern munich': '바이에른 뮌헨',
    'juventus': '유벤투스',
    'juve': '유벤투스',
    'inter': '인테르 밀란',
    'inter milan': '인테르 밀란',
    'ac milan': 'AC 밀란',
    'milan': 'AC 밀란',
    'atletico': '아틀레티코 마드리드',
    'atletico madrid': '아틀레티코 마드리드',
    'newcastle': '뉴캐슬',
    'newcastle united': '뉴캐슬',
    'west ham': '웨스트햄',
    'aston villa': '애스턴 빌라',
    'everton': '에버튼',
    'leicester': '레스터 시티',
    'wolves': '울버햄튼',
    'wolverhampton': '울버햄튼',
    'leeds': '리즈 유나이티드',
    'leeds united': '리즈 유나이티드',
    'nottingham forest': '노팅엄 포레스트',
    'crystal palace': '크리스탈 팰리스',
    'brighton': '브라이튼',
    'southampton': '사우샘프턴',
    'fulham': '풀럼',
    'bournemouth': '본머스',
    'brentford': '브렌트포드',
    'sevilla': '세비야',
    'villarreal': '비야레알',
    'valencia': '발렌시아',
    'dortmund': '도르트문트',
    'borussia dortmund': '도르트문트',
    'napoli': '나폴리',
    'roma': '로마',
    'as roma': '로마',
    'lazio': '라치오',
    'monaco': '모나코',
    'marseille': '마르세유',
    'lyon': '리옹',
    'celtic': '셀틱',
    'rangers': '레인저스'
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
    // 시즌 파싱
    const seasonPatterns = [
        /(20\d{2})[\/\s\-](20\d{2})/,  // 2024/2025
        /(20\d{2})[\/\s\-](\d{2})/,     // 2024/25
        /(\d{2})[\/\s\-](\d{2})/        // 24/25
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

    // 키트 타입 파싱
    let kitType = null;
    if (name.match(/\bhome\b/i)) kitType = '홈킷';
    else if (name.match(/\baway\b/i)) kitType = '어웨이킷';
    else if (name.match(/\bthird\b/i)) kitType = '써드킷';
    else if (name.match(/training|pre[-\s]?match/i)) kitType = '트레이닝';

    // 버전 파싱
    let version = '레플리카';
    if (name.match(/authentic|player\s+(?:issue|version)|match/i)) {
        version = '어센틱';
    }

    const teamName = extractTeamFromName(name);

    return { season, kitType, version, teamName };
}

async function crawlProductPage(url) {
    try {
        console.log(`   🔍 상세 페이지 크롤링: ${url}`);

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

        return {
            currentPrice,
            regularPrice,
            discountRate,
            currency,
            imageUrl
        };

    } catch (error) {
        console.error(`   ❌ 상세 페이지 오류: ${error.message}`);
        return null;
    }
}

async function crawlCatalogPage(pageNum = 1) {
    try {
        // 필터 파라미터: Home, Away, Third + Unisex Adults, Mens
        const url = `https://www.sportsdirect.com/football-shirts#dcp=${pageNum}&dppp=100&OrderBy=rank&Filter=3233_258177^Home,Away,Third|WEBSTYLE^Football%20Shirts|AFLOR^Unisex%20Adults,Mens`;

        console.log(`\n📄 페이지 ${pageNum} 크롤링...`);
        console.log(`URL: ${url}`);

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const products = [];

        // 제품 카드 찾기
        $('.s-productthumbbox').each((i, elem) => {
            const $product = $(elem);

            const name = $product.find('.s-productbox-title a').text().trim();
            const productLink = $product.find('.s-productbox-title a').attr('href');
            const priceText = $product.find('.s-now-price').text().trim();

            if (name && productLink) {
                const fullUrl = productLink.startsWith('http')
                    ? productLink
                    : `https://www.sportsdirect.com${productLink}`;

                // 가격 파싱 (현재는 목록에서 가져오지 않고, 상세 페이지에서 가져올 예정)
                const price = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '')) : null;

                const { season, kitType, version, teamName } = parseProductInfo(name);

                if (teamName && season && kitType) {
                    products.push({
                        name,
                        team: teamName,
                        kitType,
                        season,
                        version,
                        productUrl: fullUrl,
                        listPrice: price
                    });
                }
            }
        });

        console.log(`   ✅ ${products.length}개 제품 발견`);
        return products;

    } catch (error) {
        console.error(`❌ 페이지 ${pageNum} 크롤링 오류:`, error.message);
        return [];
    }
}

async function main() {
    console.log('🚀 Sports Direct 전체 카탈로그 크롤링 시작\n');

    let allProducts = [];
    let pageNum = 1;
    const maxPages = 5; // 최대 5페이지 (100개씩 = 500개)

    // 1. 카탈로그 페이지에서 제품 목록 수집
    while (pageNum <= maxPages) {
        const products = await crawlCatalogPage(pageNum);

        if (products.length === 0) {
            console.log(`\n⚠️ 페이지 ${pageNum}에 제품이 없습니다. 크롤링 종료.`);
            break;
        }

        allProducts.push(...products);
        pageNum++;

        // 요청 간 딜레이
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`\n\n📊 1단계 완료: 총 ${allProducts.length}개 제품 수집`);

    // 2. 상위 100개 제품의 상세 정보 크롤링 (가격, 이미지)
    console.log('\n='.repeat(60));
    console.log('2단계: 상세 정보 크롤링 (상위 100개)');
    console.log('='.repeat(60));

    const productsToDetail = allProducts.slice(0, 100);

    for (let i = 0; i < productsToDetail.length; i++) {
        const product = productsToDetail[i];
        console.log(`\n[${i + 1}/${productsToDetail.length}] ${product.team} ${product.kitType} (${product.season})`);

        const details = await crawlProductPage(product.productUrl);

        if (details) {
            product.currentPrice = details.currentPrice;
            product.regularPrice = details.regularPrice;
            product.discountRate = details.discountRate;
            product.currency = details.currency;
            product.imageUrl = details.imageUrl;
            console.log(`      ✅ £${details.currentPrice} (정가 £${details.regularPrice}, ${details.discountRate}% 할인)`);
        }

        // 요청 간 딜레이
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 3. 저장
    const validProducts = allProducts.filter(p => p.currentPrice);

    fs.writeFileSync(
        'crawler/sportsdirect-full-catalog.json',
        JSON.stringify(validProducts, null, 2)
    );

    console.log('\n\n📊 크롤링 완료!');
    console.log('='.repeat(60));
    console.log(`총 ${validProducts.length}개 제품 수집 (상세 정보 포함)`);
    console.log(`나머지 ${allProducts.length - validProducts.length}개 제품 (URL만 수집)`);

    // 팀별 통계
    const byTeam = {};
    validProducts.forEach(p => {
        if (!byTeam[p.team]) byTeam[p.team] = [];
        byTeam[p.team].push(p);
    });

    console.log('\n🏆 팀별 제품 수:');
    Object.entries(byTeam)
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, 20)
        .forEach(([team, products]) => {
            console.log(`   ${team}: ${products.length}개`);
        });

    console.log(`\n✅ 저장: crawler/sportsdirect-full-catalog.json`);
}

main().catch(console.error);
