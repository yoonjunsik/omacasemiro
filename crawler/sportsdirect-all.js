const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// 팀명 매핑 (영문 -> 한글)
const teamNameMapping = {
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
    'aston villa': '애스턴 빌라',
    'west ham': '웨스트햄 유나이티드',
    'real madrid': '레알 마드리드',
    'barcelona': '바르셀로나',
    'barca': '바르셀로나',
    'atletico madrid': '아틀레티코 마드리드',
    'atletico': '아틀레티코 마드리드',
    'bayern munich': '바이에른 뮌헨',
    'bayern': '바이에른 뮌헨',
    'borussia dortmund': '보루시아 도르트문트',
    'dortmund': '보루시아 도르트문트',
    'juventus': '유벤투스',
    'juve': '유벤투스',
    'inter milan': '인터 밀란',
    'inter': '인터 밀란',
    'ac milan': 'AC 밀란',
    'milan': 'AC 밀란',
    'napoli': '나폴리',
    'roma': 'AS 로마',
    'as roma': 'AS 로마',
    'psg': 'PSG',
    'paris saint germain': 'PSG',
    'benfica': '벤피카',
    'al nassr': '알 나스르',
    'ajax': '아약스',
    'england': '잉글랜드',
    'france': '프랑스',
    'germany': '독일',
    'spain': '스페인',
    'italy': '이탈리아',
    'portugal': '포르투갈',
    'netherlands': '네덜란드',
    'brazil': '브라질',
    'argentina': '아르헨티나',
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

    const teamName = extractTeamFromName(name);

    return { season, kitType, version, teamName };
}

// 페이지 크롤링
async function crawlPage(pageNumber) {
    // 페이지당 100개씩 가져오기
    const url = pageNumber === 1
        ? 'https://www.sportsdirect.com/football-shirts'
        : `https://www.sportsdirect.com/football-shirts#dcp=${pageNumber}&dppp=100&OrderBy=rank`;

    console.log(`\n📄 페이지 ${pageNumber} 크롤링 중...`);

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
                                const { season, kitType, version, teamName } = parseProductInfo(item.name);

                                // 필터링: 시즌, 키트 타입, 팀명이 있는 것만
                                if (!season || !kitType || !teamName) return;

                                // 시즌 필터: 20/21 ~ 25/26
                                const validSeasons = ['20/21', '21/22', '22/23', '23/24', '24/25', '25/26'];
                                if (!validSeasons.includes(season)) return;

                                const productId = item.id.split('-')[0];
                                const urlSlug = item.name
                                    .toLowerCase()
                                    .replace(/[^a-z0-9\s-]/g, '')
                                    .replace(/\s+/g, '-')
                                    .replace(/-+/g, '-');

                                products.push({
                                    team: teamName,
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
                    } catch (e) {
                        console.error('   ⚠️  JSON 파싱 오류:', e.message);
                    }
                }
            }
        });

        console.log(`   ✅ ${products.length}개 제품 수집`);
        return products;

    } catch (error) {
        console.error(`   ❌ 페이지 ${pageNumber} 오류:`, error.message);
        return [];
    }
}

// 메인 함수
async function main() {
    console.log('🚀 스포츠다이렉트 전체 크롤러 시작\n');
    console.log('📋 대상: Football Shirts 전체 페이지');
    console.log('📅 필터: 20/21 ~ 25/26 시즌');
    console.log('🎯 대상 팀: 주요 리그 클럽 + 국가대표팀\n');

    const allProducts = [];
    const maxPages = 27; // 2633개 / 100개 = 약 27페이지

    // 페이지별 크롤링
    for (let page = 1; page <= maxPages; page++) {
        const products = await crawlPage(page);
        allProducts.push(...products);

        // Rate limiting
        if (page < maxPages) {
            console.log('   ⏳ 2초 대기 중...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // 중간 저장 (10페이지마다)
        if (page % 10 === 0) {
            fs.writeFileSync(
                'crawler/sportsdirect-products-temp.json',
                JSON.stringify(allProducts, null, 2)
            );
            console.log(`   💾 중간 저장 완료 (${allProducts.length}개)`);
        }
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

    console.log(`🏆 팀별 제품 수 (상위 20개):`);
    Object.entries(byTeam)
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, 20)
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
        .sort((a, b) => b[0].localeCompare(a[0]))
        .forEach(([season, count]) => {
            console.log(`   ${season}: ${count}개`);
        });

    // 브랜드별 통계
    const byBrand = {};
    allProducts.forEach(p => {
        if (!byBrand[p.brand]) byBrand[p.brand] = 0;
        byBrand[p.brand]++;
    });

    console.log(`\n🏷️  브랜드별 제품 수:`);
    Object.entries(byBrand)
        .sort((a, b) => b[1] - a[1])
        .forEach(([brand, count]) => {
            console.log(`   ${brand}: ${count}개`);
        });

    // 최종 저장
    fs.writeFileSync(
        'crawler/sportsdirect-products.json',
        JSON.stringify(allProducts, null, 2)
    );
    console.log(`\n✅ 최종 결과 저장: crawler/sportsdirect-products.json`);
}

// 실행
main().catch(console.error);
