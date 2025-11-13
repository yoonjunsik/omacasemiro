const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// 테스트용 주요 팀 5개 (URL slug)
const targetTeams = {
    '맨체스터 유나이티드': 'manchester-united',
    '리버풀': 'liverpool',
    '레알 마드리드': 'real-madrid',
    '바르셀로나': 'barcelona',
    'PSG': 'psg',
};

// 팀명 매핑 (영문 -> 한글)
const teamNameMapping = {
    'manchester united': '맨체스터 유나이티드',
    'man utd': '맨체스터 유나이티드',
    'liverpool': '리버풀',
    'manchester city': '맨체스터 시티',
    'man city': '맨체스터 시티',
    'chelsea': '첼시',
    'arsenal': '아스널',
    'tottenham': '토트넘',
    'newcastle': '뉴캐슬 유나이티드',
    'real madrid': '레알 마드리드',
    'barcelona': '바르셀로나',
    'barca': '바르셀로나',
    'atletico madrid': '아틀레티코 마드리드',
    'juventus': '유벤투스',
    'inter milan': '인터 밀란',
    'ac milan': 'AC 밀란',
    'bayern munich': '바이에른 뮌헨',
    'bayern': '바이에른 뮌헨',
    'borussia dortmund': '보루시아 도르트문트',
    'dortmund': '보루시아 도르트문트',
    'psg': 'PSG',
    'paris saint germain': 'PSG',
    'benfica': '벤피카',
    'al nassr': '알 나스르',
    'ajax': '아약스',
    'napoli': '나폴리',
    'roma': 'AS 로마',
};

// 제품명에서 팀명 추출
function extractTeamFromName(productName) {
    const lowerName = productName.toLowerCase();
    for (const [eng, kor] of Object.entries(teamNameMapping)) {
        if (lowerName.includes(eng)) {
            return kor;
        }
    }
    return null;
}

// 제품명에서 정보 추출
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

    // 제품명에서 실제 팀명 추출
    const teamName = extractTeamFromName(name);

    return { season, kitType, version, teamName };
}

async function searchTeamProducts(teamName, teamSlug) {
    const url = `https://www.sportsdirect.com/football-shirts/${teamSlug}`;

    console.log(`\n🔍 ${teamName} 크롤링 중...`);

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const products = [];

        // ecommerceData 추출
        $('script').each((i, elem) => {
            const scriptContent = $(elem).html();
            if (scriptContent && scriptContent.includes('ecommerceData')) {
                const match = scriptContent.match(/var ecommerceData = ({[\s\S]*?});/);
                if (match) {
                    try {
                        const data = JSON.parse(match[1]);
                        if (data.ecommerce && data.ecommerce.impressions) {
                            data.ecommerce.impressions.forEach(item => {
                                const { season, kitType, version, teamName: extractedTeam } = parseProductInfo(item.name);

                                // 필터링
                                if (!season || !kitType || !extractedTeam) return;
                                const validSeasons = ['20/21', '21/22', '22/23', '23/24', '24/25', '25/26'];
                                if (!validSeasons.includes(season)) return;

                                const productId = item.id.split('-')[0];
                                const urlSlug = item.name
                                    .toLowerCase()
                                    .replace(/[^a-z0-9\s-]/g, '')
                                    .replace(/\s+/g, '-')
                                    .replace(/-+/g, '-');

                                products.push({
                                    team: extractedTeam,  // 제품명에서 추출한 실제 팀명 사용
                                    kitType,
                                    season,
                                    version,
                                    name: item.name,
                                    brand: item.brand,
                                    productId,
                                    productUrl: `https://www.sportsdirect.com/${urlSlug}-${productId}`,
                                    currentPrice: parseFloat(item.price),
                                    regularPrice: parseFloat(item.price),
                                    discountRate: 0,
                                    currency: 'GBP'
                                });
                            });
                        }
                    } catch (e) {}
                }
            }
        });

        console.log(`   ✅ ${products.length}개 제품 발견`);
        return products;

    } catch (error) {
        console.error(`   ❌ 오류: ${error.message}`);
        return [];
    }
}

async function main() {
    console.log('🚀 스포츠다이렉트 테스트 크롤러 (5개 팀)\n');

    const allProducts = [];

    for (const [koreanName, teamSlug] of Object.entries(targetTeams)) {
        const products = await searchTeamProducts(koreanName, teamSlug);
        allProducts.push(...products);
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n\n📊 결과 요약');
    console.log('='.repeat(60));
    console.log(`총 ${allProducts.length}개 제품 수집\n`);

    // 팀별
    const byTeam = {};
    allProducts.forEach(p => {
        if (!byTeam[p.team]) byTeam[p.team] = [];
        byTeam[p.team].push(p);
    });

    console.log('팀별:');
    Object.entries(byTeam).forEach(([team, products]) => {
        console.log(`   ${team}: ${products.length}개`);
    });

    // 시즌별
    const bySeason = {};
    allProducts.forEach(p => {
        if (!bySeason[p.season]) bySeason[p.season] = 0;
        bySeason[p.season]++;
    });

    console.log('\n시즌별:');
    Object.entries(bySeason)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .forEach(([season, count]) => {
            console.log(`   ${season}: ${count}개`);
        });

    fs.writeFileSync('crawler/sportsdirect-products.json', JSON.stringify(allProducts, null, 2));
    console.log(`\n✅ 저장: crawler/sportsdirect-products.json`);
}

main().catch(console.error);
