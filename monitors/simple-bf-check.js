#!/usr/bin/env node

/**
 * 간단한 HTTP 기반 블랙프라이데이 페이지 체커
 * Puppeteer 없이 axios만 사용
 */

const axios = require('axios');
const teamConfigs = require('./team-configs');

async function checkTeam(team) {
    console.log(`\n🔍 ${team.nameKo} (${team.name})`);

    const results = [];

    for (const url of team.blackFridayUrls) {
        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 10000,
                maxRedirects: 5
            });

            if (response.status === 200) {
                const content = response.data.toLowerCase();
                const hasKeyword = team.keywords.some(keyword =>
                    content.includes(keyword.toLowerCase())
                );

                console.log(`   ✅ ${url}`);
                console.log(`      Status: ${response.status}`);
                console.log(`      Keywords: ${hasKeyword ? '발견' : '없음'}`);

                results.push({
                    url,
                    status: response.status,
                    hasKeyword
                });
            }
        } catch (error) {
            if (error.response) {
                console.log(`   ❌ ${url}`);
                console.log(`      Status: ${error.response.status}`);
            } else {
                console.log(`   ⚠️  ${url}`);
                console.log(`      Error: ${error.message}`);
            }
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    const detected = results.some(r => r.status === 200 && r.hasKeyword);
    console.log(`   결과: ${detected ? '🎉 블랙프라이데이 감지!' : '⭕ 미감지'}`);

    return {
        team: team.nameKo,
        teamEn: team.name,
        league: team.league,
        detected,
        results
    };
}

async function main() {
    console.log('🚀 블랙프라이데이 간단 체크 시작\n');
    console.log('='.repeat(60));

    const allResults = [];

    // 모든 리그 체크
    for (const leagueKey of ['premierLeague', 'laLiga', 'bundesliga', 'ligue1', 'serieA']) {
        const teams = teamConfigs[leagueKey];

        if (!teams || teams.length === 0) continue;

        console.log(`\n\n🏆 ${leagueKey.toUpperCase()}`);
        console.log('='.repeat(60));

        for (const team of teams) {
            const result = await checkTeam(team);
            allResults.push(result);

            // 팀 간 딜레이
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    // 요약
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 요약');
    console.log('='.repeat(60));

    const detected = allResults.filter(r => r.detected);
    console.log(`\n전체: ${allResults.length}개 팀`);
    console.log(`감지: ${detected.length}개 팀`);
    console.log(`미감지: ${allResults.length - detected.length}개 팀`);

    if (detected.length > 0) {
        console.log('\n🎉 블랙프라이데이 감지된 팀:');
        detected.forEach(r => {
            console.log(`   • ${r.team} (${r.teamEn}) - ${r.league}`);
        });
    }
}

main().catch(console.error);
