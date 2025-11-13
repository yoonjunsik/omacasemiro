const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function debugCrawl() {
    const url = 'https://www.sportsdirect.com/adidas-manchester-united-home-shirt-2025-2026-adults-377822';

    console.log('🔍 디버그 크롤링:', url);

    const response = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });

    const $ = cheerio.load(response.data);

    // HTML 저장
    fs.writeFileSync('crawler/debug.html', response.data);
    console.log('✅ HTML 저장: crawler/debug.html');

    // JSON-LD 찾기
    console.log('\n📦 JSON-LD 스크립트:');
    $('script[type="application/ld+json"]').each((i, elem) => {
        console.log(`\n--- Script ${i + 1} ---`);
        console.log($(elem).html());
    });

    // 가격 관련 클래스/요소 찾기
    console.log('\n💰 가격 관련 요소:');

    // 여러 가능한 가격 셀렉터 시도
    const priceSelectors = [
        '.ProductPrice',
        '.productPrice',
        '[data-price]',
        '.price',
        '[itemprop="price"]',
        '.PriceText',
        '#ProductPrice'
    ];

    priceSelectors.forEach(selector => {
        const elem = $(selector);
        if (elem.length > 0) {
            console.log(`\n${selector}:`);
            console.log(elem.text().trim());
            console.log('HTML:', elem.html());
        }
    });

    // RRP 찾기
    console.log('\n💵 RRP (정가) 관련 요소:');
    $('*').filter((i, el) => {
        const text = $(el).text();
        return text.includes('RRP') || text.includes('Was');
    }).each((i, el) => {
        if (i < 5) { // 처음 5개만
            console.log(`\n${$(el).prop('tagName')} (${$(el).attr('class') || 'no-class'}):`);
            console.log($(el).text().trim().substring(0, 100));
        }
    });
}

debugCrawl().catch(console.error);
