#!/usr/bin/env node

/**
 * 블랙프라이데이 수동 체크 및 Discord 알림 테스트
 * WebFetch를 사용하지 않고 간단한 HTTP 요청으로 테스트
 */

const https = require('https');
const DiscordNotifier = require('./discord-notifier');

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || '';

// 테스트할 팀들의 블랙프라이데이 URL (전체 17개 팀)
const testTeams = [
    // 프리미어리그 (8팀)
    {
        name: 'Liverpool',
        nameKo: '리버풀',
        league: 'Premier League',
        url: 'https://store.liverpoolfc.com/black-friday'
    },
    {
        name: 'Manchester City',
        nameKo: '맨체스터 시티',
        league: 'Premier League',
        url: 'https://shop.mancity.com/kr/ko/black-friday'
    },
    {
        name: 'Arsenal',
        nameKo: '아스널',
        league: 'Premier League',
        url: 'https://arsenaldirect.arsenal.com/black-friday'
    },
    {
        name: 'Chelsea',
        nameKo: '첼시',
        league: 'Premier League',
        url: 'https://store.chelseafc.com/ko/black-friday'
    },
    {
        name: 'Newcastle United',
        nameKo: '뉴캐슬',
        league: 'Premier League',
        url: 'https://shop.newcastleunited.com/collections/black-friday'
    },
    {
        name: 'Manchester United',
        nameKo: '맨체스터 유나이티드',
        league: 'Premier League',
        url: 'https://store.manutd.com/ko/black-friday'
    },
    {
        name: 'Tottenham',
        nameKo: '토트넘',
        league: 'Premier League',
        url: 'https://shop.tottenhamhotspur.com/black-friday'
    },
    {
        name: 'Aston Villa',
        nameKo: '애스턴 빌라',
        league: 'Premier League',
        url: 'https://shop.avfc.co.uk/black-friday'
    },

    // 라리가 (3팀)
    {
        name: 'Real Madrid',
        nameKo: '레알 마드리드',
        league: 'La Liga',
        url: 'https://shop.realmadrid.com/en-es/black-friday'
    },
    {
        name: 'Barcelona',
        nameKo: '바르셀로나',
        league: 'La Liga',
        url: 'https://store.fcbarcelona.com/ko-kr/black-friday'
    },
    {
        name: 'Atletico Madrid',
        nameKo: '아틀레티코 마드리드',
        league: 'La Liga',
        url: 'https://tienda.atleticodemadrid.com/black-friday'
    },

    // 분데스리가 (2팀)
    {
        name: 'Bayern Munich',
        nameKo: '바이에른 뮌헨',
        league: 'Bundesliga',
        url: 'https://fcbayern.com/store/en-zz/black-friday'
    },
    {
        name: 'Borussia Dortmund',
        nameKo: '도르트문트',
        league: 'Bundesliga',
        url: 'https://shop.bvb.de/en-de/black-friday'
    },

    // 리그앙 (1팀)
    {
        name: 'PSG',
        nameKo: 'PSG',
        league: 'Ligue 1',
        url: 'https://shop.psg.fr/en/black-friday'
    },

    // 세리에 A (3팀)
    {
        name: 'Inter Milan',
        nameKo: '인터 밀란',
        league: 'Serie A',
        url: 'https://store.inter.it/kr/black-friday'
    },
    {
        name: 'AC Milan',
        nameKo: 'AC 밀란',
        league: 'Serie A',
        url: 'https://store.acmilan.com/en-me/black-friday'
    },
    {
        name: 'Juventus',
        nameKo: '유벤투스',
        league: 'Serie A',
        url: 'https://store.juventus.com/kr/black-friday'
    }
];

/**
 * URL 체크 (HEAD 요청)
 */
function checkUrl(url) {
    return new Promise((resolve) => {
        const urlObj = new URL(url);

        const options = {
            hostname: urlObj.hostname,
            port: 443,
            path: urlObj.pathname,
            method: 'HEAD',
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
        };

        const req = https.request(options, (res) => {
            resolve({
                statusCode: res.statusCode,
                exists: res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302
            });
        });

        req.on('error', () => {
            resolve({ statusCode: 0, exists: false });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ statusCode: 0, exists: false });
        });

        req.end();
    });
}

/**
 * 모든 팀 체크
 */
async function checkAllTeams() {
    console.log('🔍 블랙프라이데이 페이지 존재 여부 체크 중...\n');

    const results = [];

    for (const team of testTeams) {
        console.log(`체크 중: ${team.nameKo} (${team.name})...`);

        const check = await checkUrl(team.url);

        const result = {
            team: team.nameKo,
            teamEn: team.name,
            league: team.league,
            url: team.url,
            statusCode: check.statusCode,
            blackFridayDetected: check.exists,
            timestamp: new Date().toISOString()
        };

        if (check.exists) {
            result.confidence = 60; // BF 페이지 존재하면 신뢰도 60%
            result.signals = [
                {
                    type: 'bf_page_exists',
                    severity: 'MEDIUM',
                    message: '블랙프라이데이 전용 페이지 존재 (HTTP ' + check.statusCode + ')',
                    details: { url: team.url, statusCode: check.statusCode }
                }
            ];
            console.log(`  ✅ 블랙프라이데이 페이지 발견! (HTTP ${check.statusCode})`);
        } else {
            result.confidence = 0;
            result.signals = [];
            console.log(`  ⚪ 블랙프라이데이 페이지 없음 (HTTP ${check.statusCode || 'timeout'})`);
        }

        results.push(result);

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
}

/**
 * 메인 실행
 */
async function main() {
    if (!DISCORD_WEBHOOK_URL) {
        console.error('❌ Discord Webhook URL이 설정되지 않았습니다.');
        console.log('사용법: DISCORD_WEBHOOK_URL="your-url" node monitors/test-blackfriday-check.js');
        process.exit(1);
    }

    console.log('🚀 블랙프라이데이 간단 체크 시작\n');
    console.log(`📅 체크 시각: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} KST\n`);

    try {
        // 팀 체크
        const results = await checkAllTeams();

        console.log('\n📊 결과 요약:');
        const detected = results.filter(r => r.blackFridayDetected);
        console.log(`  전체: ${results.length}개 팀`);
        console.log(`  감지: ${detected.length}개 팀`);

        if (detected.length > 0) {
            console.log('\n🎯 블랙프라이데이 페이지 발견:');
            detected.forEach(r => {
                console.log(`  - ${r.team} (${r.teamEn}): ${r.url}`);
            });
        }

        // Discord 알림
        console.log('\n📢 Discord 알림 전송 중...');
        const notifier = new DiscordNotifier(DISCORD_WEBHOOK_URL);
        await notifier.notifyBlackFridayDetected(results);

        console.log('\n✅ 테스트 완료!');
        console.log('Discord 채널을 확인해주세요.');

    } catch (error) {
        console.error('\n❌ 오류 발생:', error.message);
        process.exit(1);
    }
}

// 실행
if (require.main === module) {
    main();
}

module.exports = { checkAllTeams };
