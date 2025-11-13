const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// 주요 팀 목록 (리그별)
const targetTeams = {
    // 프리미어리그
    '맨체스터 유나이티드': ['Manchester United', 'Man Utd', 'Man United'],
    '리버풀': ['Liverpool'],
    '맨체스터 시티': ['Manchester City', 'Man City'],
    '첼시': ['Chelsea'],
    '아스널': ['Arsenal'],
    '토트넘': ['Tottenham', 'Spurs'],
    '뉴캐슬 유나이티드': ['Newcastle United', 'Newcastle'],
    '애스턴 빌라': ['Aston Villa'],
    '웨스트햄 유나이티드': ['West Ham United', 'West Ham'],

    // 라리가
    '레알 마드리드': ['Real Madrid'],
    '바르셀로나': ['Barcelona', 'Barca'],
    '아틀레티코 마드리드': ['Atletico Madrid', 'Atletico'],

    // 분데스리가
    '바이에른 뮌헨': ['Bayern Munich', 'Bayern'],
    '보루시아 도르트문트': ['Borussia Dortmund', 'Dortmund', 'BVB'],

    // 세리에A
    '유벤투스': ['Juventus', 'Juve'],
    '인터 밀란': ['Inter Milan', 'Inter'],
    'AC 밀란': ['AC Milan', 'Milan'],
    '나폴리': ['Napoli'],
    'AS 로마': ['AS Roma', 'Roma'],

    // 리그앙
    'PSG': ['Paris Saint Germain', 'PSG', 'Paris SG'],

    // 에레디비지에
    '아약스': ['Ajax'],

    // 기타 유명 클럽
    '벤피카': ['Benfica'],
    '알 나스르': ['Al Nassr'],

    // 국가대표팀
    '잉글랜드': ['England'],
    '프랑스': ['France'],
    '독일': ['Germany'],
    '스페인': ['Spain'],
    '이탈리아': ['Italy'],
    '포르투갈': ['Portugal'],
    '네덜란드': ['Netherlands', 'Holland'],
    '브라질': ['Brazil'],
    '아르헨티나': ['Argentina'],
};

// 제품명에서 정보 추출
function parseProductInfo(name, brand) {
    // 시즌 패턴
    const seasonPatterns = [
        /(\d{4})[\s/\-](\d{4})/,  // 2024/2025, 2024-2025, 2024 2025
        /(\d{2})[\s/\-](\d{2})/    // 24/25, 24-25
    ];

    let season = null;
    for (const pattern of seasonPatterns) {
        const match = name.match(pattern);
        if (match) {
            if (match[1].length === 4) {
                season = `${match[1].slice(-2)}/${match[2].slice(-2)}`;
            } else {
                season = `${match[1]}/${match[2]}`;
            }
            break;
        }
    }

    // 키트 타입
    let kitType = null;
    if (name.match(/\bhome\b/i)) kitType = '홈킷';
    else if (name.match(/\baway\b/i)) kitType = '어웨이킷';
    else if (name.match(/\bthird\b/i)) kitType = '써드킷';
    else if (name.match(/training|pre[-\s]?match/i)) kitType = '트레이닝';

    // 버전
    let version = '레플리카';
    if (name.match(/authentic|player\s+(?:issue|version)|match/i)) version = '어센틱';

    return { season, kitType, version };
}

// 팀명 찾기
function findTeamName(productName) {
    const lowerName = productName.toLowerCase();

    for (const [koreanName, englishVariants] of Object.entries(targetTeams)) {
        for (const variant of englishVariants) {
            if (lowerName.includes(variant.toLowerCase())) {
                return koreanName;
            }
        }
    }

    return null;
}

// 특정 팀의 제품 검색
async function searchTeamProducts(teamName, searchTerms) {
    console.log(`\n🔍 검색 중: ${teamName}`);

    const products = [];

    for (const term of searchTerms) {
        const url = `https://www.sportsdirect.com/search?Filter=WEBCAT%5EFootball%7CWEBSTYLE%5EFootball%20Shirts&SearchTerm=${encodeURIComponent(term)}&FromSearch=true`;

        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limiting

            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            const $ = cheerio.load(response.data);

            // ecommerceData 찾기
            let foundProducts = [];
            $('script').each((i, elem) => {
                const scriptContent = $(elem).html();
                if (scriptContent && scriptContent.includes('ecommerceData')) {
                    const match = scriptContent.match(/var ecommerceData = ({[\s\S]*?});/);
                    if (match) {
                        try {
                            const ecommerceData = JSON.parse(match[1]);
                            if (ecommerceData.ecommerce && ecommerceData.ecommerce.impressions) {
                                foundProducts = ecommerceData.ecommerce.impressions;
                            }
                        } catch (e) {
                            // 파싱 실패
                        }
                    }
                }
            });

            console.log(`   "${term}" 검색 결과: ${foundProducts.length}개`);

            for (const item of foundProducts) {
                const { season, kitType, version } = parseProductInfo(item.name, item.brand);

                // 필터링: 시즌과 키트 타입이 있는 것만
                if (!season || !kitType) continue;

                // 시즌 필터: 20/21 ~ 25/26
                const validSeasons = ['20/21', '21/22', '22/23', '23/24', '24/25', '25/26'];
                if (!validSeasons.includes(season)) continue;

                const productId = item.id.split('-')[0];

                // URL 생성 (제품명을 URL 형식으로 변환)
                const urlSlug = item.name
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-');
                const productUrl = `https://www.sportsdirect.com/${urlSlug}-${productId}`;

                const currentPrice = parseFloat(item.price);

                // RRP 찾기
                let regularPrice = currentPrice;
                const productCard = $(`li[li-productid="${productId}"]`);
                if (productCard.length > 0) {
                    const rrpText = productCard.find('s').text();
                    const rrpMatch = rrpText.match(/£([\d.]+)/);
                    if (rrpMatch) {
                        regularPrice = parseFloat(rrpMatch[1]);
                    }
                }

                const discountRate = regularPrice > currentPrice
                    ? Math.round((1 - currentPrice / regularPrice) * 100)
                    : 0;

                // 중복 제거 (같은 productId)
                if (!products.find(p => p.productId === productId)) {
                    products.push({
                        team: teamName,
                        kitType: kitType,
                        season: season,
                        version: version,
                        name: item.name,
                        brand: item.brand,
                        productId: productId,
                        productUrl: productUrl,
                        currentPrice: currentPrice,
                        regularPrice: regularPrice,
                        discountRate: discountRate,
                        currency: 'GBP'
                    });
                }
            }

        } catch (error) {
            console.error(`   ❌ "${term}" 검색 실패:`, error.message);
        }
    }

    console.log(`   ✅ ${teamName}: 총 ${products.length}개 수집`);
    return products;
}

// 메인 함수
async function main() {
    console.log('🚀 스포츠다이렉트 팀별 제품 크롤러 시작\n');
    console.log(`📋 대상 팀: ${Object.keys(targetTeams).length}개`);
    console.log(`📅 대상 시즌: 20/21 ~ 25/26\n`);

    const allProducts = [];

    for (const [koreanName, englishVariants] of Object.entries(targetTeams)) {
        const products = await searchTeamProducts(koreanName, englishVariants);
        allProducts.push(...products);
    }

    console.log('\n\n📊 크롤링 결과 요약');
    console.log('='.repeat(60));
    console.log(`총 ${allProducts.length}개 제품 수집`);

    // 팀별 통계
    const byTeam = {};
    allProducts.forEach(p => {
        if (!byTeam[p.team]) byTeam[p.team] = [];
        byTeam[p.team].push(p);
    });

    console.log(`\n🏆 팀별 제품 수:`);
    Object.entries(byTeam)
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, 15)
        .forEach(([team, products]) => {
            console.log(`   ${team}: ${products.length}개`);
        });

    // 시즌별 통계
    const bySeason = {};
    allProducts.forEach(p => {
        if (!bySeason[p.season]) bySeason[p.season] = 0;
        bySeason[p.season]++;
    });
    console.log(`\n📅 시즌별 제품 수:`);
    Object.entries(bySeason)
        .sort((a, b) => {
            const seasonOrder = ['20/21', '21/22', '22/23', '23/24', '24/25', '25/26'];
            return seasonOrder.indexOf(b[0]) - seasonOrder.indexOf(a[0]);
        })
        .forEach(([season, count]) => {
            console.log(`   ${season}: ${count}개`);
        });

    // 결과 저장
    const outputPath = 'crawler/sportsdirect-products.json';
    fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2), 'utf8');
    console.log(`\n✅ 결과 저장: ${outputPath}`);
}

// 실행
main().catch(console.error);
