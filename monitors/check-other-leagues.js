#!/usr/bin/env node

const axios = require('axios');

const urlsToCheck = {
    '레알 마드리드': [
        'https://shop.realmadrid.com/en-es/black-week',
        'https://shop.realmadrid.com/es-es/black-week',
        'https://shop.realmadrid.com/en-es/black-friday',
        'https://shop.realmadrid.com/es-es/viernes-negro'
    ],
    '바르셀로나': [
        'https://store.fcbarcelona.com/en-es/black-friday',
        'https://store.fcbarcelona.com/es-es/black-friday',
        'https://store.fcbarcelona.com/en-es/black-week',
        'https://store.fcbarcelona.com/es-es/viernes-negro'
    ],
    '바이에른 뮌헨': [
        'https://fcbayern.com/shop/en/black-friday',
        'https://fcbayern.com/shop/de/black-friday',
        'https://fcbayern.com/shop/en/black-week',
        'https://fcbayern.com/shop/de/black-week'
    ],
    '도르트문트': [
        'https://shop.bvb.de/en-de/black-week',
        'https://shop.bvb.de/de-de/black-week',
        'https://shop.bvb.de/en-de/black-friday',
        'https://shop.bvb.de/de-de/black-friday'
    ],
    '인터 밀란': [
        'https://store.inter.it/en/black-friday',
        'https://store.inter.it/it/black-friday',
        'https://store.inter.it/en/black-week',
        'https://store.inter.it/it/black-week'
    ],
    'AC 밀란': [
        'https://store.acmilan.com/en-me/black-friday',
        'https://store.acmilan.com/it-it/black-friday',
        'https://store.acmilan.com/en-me/black-week',
        'https://store.acmilan.com/it-it/black-week'
    ],
    '유벤투스': [
        'https://store.juventus.com/en/black-friday',
        'https://store.juventus.com/it/black-friday',
        'https://store.juventus.com/en/black-week',
        'https://store.juventus.com/it/black-week'
    ],
    'PSG': [
        'https://shop.psg.fr/en/black-friday',
        'https://shop.psg.fr/fr/black-friday',
        'https://shop.psg.fr/en/ventes',
        'https://shop.psg.fr/fr/ventes'
    ]
};

async function checkUrl(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000,
            maxRedirects: 5
        });

        const content = response.data.toLowerCase();
        const keywords = ['black friday', 'black week', 'cyber', 'viernes negro', 'vendredi noir'];
        const hasKeyword = keywords.some(k => content.includes(k));

        return {
            url,
            status: response.status,
            hasKeyword,
            success: true
        };
    } catch (error) {
        return {
            url,
            status: error.response?.status || 0,
            error: error.message,
            success: false
        };
    }
}

async function main() {
    console.log('🔍 라리가/분데스리가/세리에 A/리그앙 블랙프라이데이 체크\n');
    console.log('='.repeat(70));

    for (const [team, urls] of Object.entries(urlsToCheck)) {
        console.log(`\n🏆 ${team}`);
        console.log('-'.repeat(70));

        for (const url of urls) {
            const result = await checkUrl(url);

            if (result.success) {
                const icon = result.hasKeyword ? '✅' : '⚠️';
                console.log(`${icon} ${url}`);
                console.log(`   Status: ${result.status}, Keyword: ${result.hasKeyword ? '있음' : '없음'}`);
            } else {
                console.log(`❌ ${url}`);
                console.log(`   ${result.status > 0 ? `Status: ${result.status}` : `Error: ${result.error}`}`);
            }

            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    console.log('\n' + '='.repeat(70));
    console.log('완료!');
}

main().catch(console.error);
