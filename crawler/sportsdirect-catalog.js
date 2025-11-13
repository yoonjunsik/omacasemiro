const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// 제품명에서 정보 추출
function parseProductName(name) {
    // 시즌 패턴: 2024/25, 2024 2025, 24/25 등
    const seasonPatterns = [
        /(\d{4})[\s/](\d{4})/,  // 2024/2025 또는 2024 2025
        /(\d{2})[\s/](\d{2})/    // 24/25
    ];

    let season = null;
    for (const pattern of seasonPatterns) {
        const match = name.match(pattern);
        if (match) {
            if (match[1].length === 4) {
                // 2024/2025 -> 24/25
                season = `${match[1].slice(-2)}/${match[2].slice(-2)}`;
            } else {
                // 24/25
                season = `${match[1]}/${match[2]}`;
            }
            break;
        }
    }

    // 키트 타입
    let kitType = null;
    if (name.match(/home/i)) kitType = '홈킷';
    else if (name.match(/away/i)) kitType = '어웨이킷';
    else if (name.match(/third/i)) kitType = '써드킷';
    else if (name.match(/training|pre[-\s]?match/i)) kitType = '트레이닝';

    // 버전
    let version = '레플리카';
    if (name.match(/authentic|player|match/i)) version = '어센틱';

    return { season, kitType, version };
}

// 팀명 매핑 (영문 -> 한글)
const teamMapping = {
    'manchester united': '맨체스터 유나이티드',
    'man utd': '맨체스터 유나이티드',
    'man united': '맨체스터 유나이티드',
    'liverpool': '리버풀',
    'manchester city': '맨체스터 시티',
    'man city': '맨체스터 시티',
    'chelsea': '첼시',
    'arsenal': '아스널',
    'tottenham': '토트넘',
    'spurs': '토트넘',
    'newcastle': '뉴캐슬 유나이티드',
    'newcastle united': '뉴캐슬 유나이티드',
    'real madrid': '레알 마드리드',
    'barcelona': '바르셀로나',
    'barca': '바르셀로나',
    'juventus': '유벤투스',
    'inter milan': '인터 밀란',
    'inter': '인터 밀란',
    'ac milan': 'AC 밀란',
    'milan': 'AC 밀란',
    'bayern munich': '바이에른 뮌헨',
    'bayern': '바이에른 뮌헨',
    'psg': 'PSG',
    'paris saint germain': 'PSG',
    'benfica': '벤피카',
    'al nassr': '알 나스르',
    'atletico madrid': '아틀레티코 마드리드',
    'atletico': '아틀레티코 마드리드',
    'borussia dortmund': '보루시아 도르트문트',
    'dortmund': '보루시아 도르트문트',
};

function getKoreanTeamName(englishName) {
    const lowerName = englishName.toLowerCase();
    for (const [eng, kor] of Object.entries(teamMapping)) {
        if (lowerName.includes(eng)) {
            return kor;
        }
    }
    return null; // 매핑되지 않은 팀
}

// 스포츠다이렉트 제품 목록 페이지 크롤링
async function crawlProductListing(page = 1, maxPages = 5) {
    const baseUrl = 'https://www.sportsdirect.com/football-shirts';
    const url = page === 1 ? baseUrl : `${baseUrl}#dcp=${page}&dppp=100&OrderBy=rank`;

    console.log(`\n🔍 페이지 ${page} 크롤링 중: ${url}`);

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const products = [];

        // ecommerceData JSON 찾기
        let ecommerceData = null;
        $('script').each((i, elem) => {
            const scriptContent = $(elem).html();
            if (scriptContent && scriptContent.includes('ecommerceData')) {
                // var ecommerceData = {...} 형태로 되어 있음
                const match = scriptContent.match(/var ecommerceData = ({[\s\S]*?});/);
                if (match) {
                    try {
                        ecommerceData = JSON.parse(match[1]);
                    } catch (e) {
                        console.log('   ⚠️  ecommerceData 파싱 실패');
                    }
                }
            }
        });

        if (ecommerceData && ecommerceData.ecommerce && ecommerceData.ecommerce.impressions) {
            const impressions = ecommerceData.ecommerce.impressions;
            console.log(`   📦 ${impressions.length}개 제품 발견`);

            for (const item of impressions) {
                // 제품명에서 정보 추출
                const { season, kitType, version } = parseProductName(item.name);

                // 팀명 추출
                const koreanTeam = getKoreanTeamName(item.name);

                // 축구 유니폼만 필터링 (키트 타입이 있는 것)
                if (!kitType || !koreanTeam) {
                    continue;
                }

                // Product ID에서 코드 추출
                const productId = item.id.split('-')[0]; // "33197001-2233121" -> "33197001"
                const productUrl = `https://www.sportsdirect.com/${item.name.toLowerCase().replace(/\s+/g, '-')}-${productId}`;

                // 정가 계산 (할인율로부터)
                const currentPrice = parseFloat(item.price);
                let regularPrice = currentPrice;

                // 페이지에서 RRP 찾기 (더 정확함)
                const productCard = $(`li[li-productid="${productId}"]`);
                if (productCard.length > 0) {
                    const rrpText = productCard.find('s').text(); // <s>RRP £120.00</s>
                    const rrpMatch = rrpText.match(/£([\d.]+)/);
                    if (rrpMatch) {
                        regularPrice = parseFloat(rrpMatch[1]);
                    }
                }

                const discountRate = regularPrice > currentPrice
                    ? Math.round((1 - currentPrice / regularPrice) * 100)
                    : 0;

                products.push({
                    team: koreanTeam,
                    kitType: kitType,
                    season: season || 'Unknown',
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

        return products;

    } catch (error) {
        console.error(`❌ 페이지 ${page} 크롤링 실패:`, error.message);
        return [];
    }
}

// 메인 함수
async function main() {
    console.log('🚀 스포츠다이렉트 카탈로그 크롤러 시작\n');
    console.log('⚠️  Note: 스포츠다이렉트는 JavaScript로 동적 로딩하므로 첫 페이지만 크롤링합니다.');
    console.log('   전체 제품을 가져오려면 Puppeteer가 필요합니다.\n');

    const allProducts = [];

    // 첫 페이지만 크롤링 (axios로는 동적 로딩이 안 됨)
    const products = await crawlProductListing(1);
    allProducts.push(...products);

    console.log('\n\n📊 크롤링 결과 요약');
    console.log('='.repeat(60));
    console.log(`총 ${allProducts.length}개 제품 수집`);

    // 팀별 분류
    const byTeam = {};
    allProducts.forEach(p => {
        if (!byTeam[p.team]) byTeam[p.team] = [];
        byTeam[p.team].push(p);
    });

    console.log(`\n🏆 팀별 제품 수:`);
    Object.entries(byTeam)
        .sort((a, b) => b[1].length - a[1].length)
        .forEach(([team, products]) => {
            console.log(`   ${team}: ${products.length}개`);
        });

    // 결과를 JSON 파일로 저장
    const outputPath = 'crawler/sportsdirect-products.json';
    fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2), 'utf8');
    console.log(`\n✅ 결과 저장: ${outputPath}`);

    // 시즌별 통계
    const bySeason = {};
    allProducts.forEach(p => {
        if (!bySeason[p.season]) bySeason[p.season] = 0;
        bySeason[p.season]++;
    });
    console.log(`\n📅 시즌별 제품 수:`);
    Object.entries(bySeason)
        .sort((a, b) => b[1] - a[1])
        .forEach(([season, count]) => {
            console.log(`   ${season}: ${count}개`);
        });
}

// 실행
main().catch(console.error);
