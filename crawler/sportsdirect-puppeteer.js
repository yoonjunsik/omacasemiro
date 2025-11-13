const puppeteer = require('puppeteer');
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

// 페이지에서 제품 추출
async function extractProductsFromPage(page) {
    return await page.evaluate(() => {
        const products = [];

        // 페이지에 있는 모든 제품 카드 찾기
        const productCards = document.querySelectorAll('li[li-productid]');

        productCards.forEach(card => {
            try {
                // 제품 링크
                const linkElem = card.querySelector('a[href*="/"]');
                if (!linkElem) return;

                const productUrl = linkElem.href;
                const productName = linkElem.getAttribute('title') || linkElem.textContent.trim();

                // Product ID
                const productId = card.getAttribute('li-productid');

                // 가격 정보
                const priceElem = card.querySelector('[data-price]');
                const currentPrice = priceElem ? parseFloat(priceElem.getAttribute('data-price')) : null;

                // RRP (정가)
                const rrpElem = card.querySelector('s');
                let regularPrice = currentPrice;
                if (rrpElem) {
                    const rrpText = rrpElem.textContent;
                    const rrpMatch = rrpText.match(/£([\d.]+)/);
                    if (rrpMatch) {
                        regularPrice = parseFloat(rrpMatch[1]);
                    }
                }

                // 브랜드 (링크나 텍스트에서 추출)
                let brand = 'Unknown';
                const brandMatch = productName.match(/^(adidas|nike|puma|new balance)/i);
                if (brandMatch) {
                    brand = brandMatch[1];
                }

                if (productName && currentPrice) {
                    products.push({
                        name: productName,
                        productId: productId,
                        productUrl: productUrl,
                        currentPrice: currentPrice,
                        regularPrice: regularPrice,
                        brand: brand,
                        currency: 'GBP'
                    });
                }
            } catch (e) {
                // 개별 제품 파싱 오류 무시
            }
        });

        return products;
    });
}

// 메인 함수
async function main() {
    console.log('🚀 Puppeteer 크롤러 시작\n');
    console.log('📋 대상: Football Shirts 페이지 (동적 렌더링)');
    console.log('📅 필터: 20/21 ~ 25/26 시즌\n');

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    const allProducts = [];
    const maxPages = 10; // 일단 10페이지만 테스트

    try {
        // 첫 페이지 로드
        console.log('📄 페이지 1 로딩 중...');
        await page.goto('https://www.sportsdirect.com/football-shirts', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // 페이지네이션 크롤링
        for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
            console.log(`\n📄 페이지 ${pageNum} 크롤링 중...`);

            // 페이지 로드 대기
            await page.waitForSelector('li[li-productid]', { timeout: 10000 });
            await new Promise(resolve => setTimeout(resolve, 2000)); // 추가 대기

            // 제품 추출
            const rawProducts = await extractProductsFromPage(page);
            console.log(`   🔍 ${rawProducts.length}개 원본 제품 발견`);

            // 제품 정보 파싱 및 필터링
            let validCount = 0;
            rawProducts.forEach(raw => {
                const { season, kitType, version, teamName } = parseProductInfo(raw.name);

                // 필터링
                if (!season || !kitType || !teamName) return;
                const validSeasons = ['20/21', '21/22', '22/23', '23/24', '24/25', '25/26'];
                if (!validSeasons.includes(season)) return;

                // 중복 체크
                if (allProducts.find(p => p.productId === raw.productId)) return;

                const discountRate = raw.regularPrice > raw.currentPrice
                    ? Math.round((1 - raw.currentPrice / raw.regularPrice) * 100)
                    : 0;

                allProducts.push({
                    team: teamName,
                    kitType,
                    season,
                    version,
                    name: raw.name,
                    brand: raw.brand,
                    productId: raw.productId,
                    productUrl: raw.productUrl,
                    currentPrice: raw.currentPrice,
                    regularPrice: raw.regularPrice,
                    discountRate: discountRate,
                    currency: 'GBP'
                });
                validCount++;
            });

            console.log(`   ✅ ${validCount}개 유효 제품 수집 (총: ${allProducts.length}개)`);

            // 다음 페이지로 이동
            if (pageNum < maxPages) {
                try {
                    // "Next" 버튼 찾기
                    const nextButton = await page.$('a.swipeNextClick, a[title="Next"]');
                    if (nextButton) {
                        console.log('   ⏭️  다음 페이지로 이동 중...');
                        await Promise.all([
                            page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
                            nextButton.click()
                        ]);
                    } else {
                        console.log('   ⚠️  다음 페이지 버튼을 찾을 수 없습니다. 종료합니다.');
                        break;
                    }
                } catch (e) {
                    console.error('   ❌ 페이지 이동 오류:', e.message);
                    break;
                }
            }

            // 중간 저장 (5페이지마다)
            if (pageNum % 5 === 0) {
                fs.writeFileSync(
                    'crawler/sportsdirect-products-temp.json',
                    JSON.stringify(allProducts, null, 2)
                );
                console.log(`   💾 중간 저장 완료`);
            }
        }

    } catch (error) {
        console.error('\n❌ 크롤링 오류:', error.message);
    } finally {
        await browser.close();
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

    console.log(`🏆 팀별 제품 수 (상위 15개):`);
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
        .sort((a, b) => b[0].localeCompare(a[0]))
        .forEach(([season, count]) => {
            console.log(`   ${season}: ${count}개`);
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
