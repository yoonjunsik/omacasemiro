const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeProductLinks() {
    console.log('🚀 Puppeteer로 스포츠다이렉트 제품 링크 수집 시작\n');

    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu'
        ]
    });

    const page = await browser.newPage();

    // User-Agent 설정
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log('📄 페이지 로드 중...');

    // 제공된 URL로 이동
    const url = 'https://www.sportsdirect.com/football-shirts#dcp=1&dppp=59&OrderBy=rank&Filter=3233_258177^Home,Away,Third|WEBSTYLE^Goalkeeper%20Tops,Football%20Shirts,T-Shirts,Retro%20Football%20Shirts,Tracksuit%20Tops,Drill%20Tops|AFLOR^Unisex%20Adults,Mens';

    await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
    });

    console.log('⏳ JavaScript 콘텐츠 로딩 대기 중...');

    // 제품 카드가 로드될 때까지 대기
    await page.waitForSelector('.s-productthumbbox, #productlistcontainer', { timeout: 30000 });

    // 추가 로딩 대기
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('🔍 제품 링크 추출 중...');

    // 페이지에서 모든 제품 링크 추출
    const productLinks = await page.evaluate(() => {
        const links = [];
        const productElements = document.querySelectorAll('.s-productthumbbox');

        console.log('Found product elements:', productElements.length);

        productElements.forEach(element => {
            const linkElement = element.querySelector('.s-productbox-title a, a.productdescriptionname');
            const nameElement = element.querySelector('.s-productbox-title, .productdescriptionname');
            const priceElement = element.querySelector('.s-now-price, .curprice');

            if (linkElement) {
                const href = linkElement.href;
                const name = nameElement ? nameElement.textContent.trim() : '';
                const price = priceElement ? priceElement.textContent.trim() : '';

                links.push({
                    url: href,
                    name: name,
                    price: price
                });
            }
        });

        return links;
    });

    console.log(`\n✅ ${productLinks.length}개 제품 링크 수집 완료!`);

    // 중복 제거 (URL 기준)
    const uniqueLinks = Array.from(
        new Map(productLinks.map(item => [item.url.split('#')[0], item])).values()
    );

    console.log(`📦 중복 제거 후: ${uniqueLinks.length}개`);

    // 처음 10개만 출력
    console.log('\n📋 수집된 제품 목록 (처음 10개):');
    uniqueLinks.slice(0, 10).forEach((link, i) => {
        console.log(`${i + 1}. ${link.name}`);
        console.log(`   ${link.url}`);
        console.log(`   ${link.price}\n`);
    });

    // 저장
    fs.writeFileSync(
        'crawler/sportsdirect-links.json',
        JSON.stringify(uniqueLinks, null, 2)
    );

    console.log(`✅ 저장: crawler/sportsdirect-links.json`);

    await browser.close();

    return uniqueLinks;
}

scrapeProductLinks()
    .then(links => {
        console.log(`\n🎉 완료! 총 ${links.length}개 제품 링크 수집됨`);
    })
    .catch(error => {
        console.error('❌ 오류:', error);
        process.exit(1);
    });
