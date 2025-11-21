#!/usr/bin/env node

/**
 * 블랙프라이데이 모니터링 메인 스크립트
 *
 * 사용법:
 *   node monitors/run-monitor.js [league]
 *
 * 예시:
 *   node monitors/run-monitor.js                  # 모든 리그
 *   node monitors/run-monitor.js premierLeague   # 프리미어리그만
 *   node monitors/run-monitor.js laLiga          # 라리가만
 */

const BlackFridayDetector = require('./blackfriday-detector');
const DiscordNotifier = require('./discord-notifier');
const teamConfigs = require('./team-configs');
const fs = require('fs');
const path = require('path');

// 환경 변수에서 Discord Webhook URL 가져오기
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || '';

class MonitorRunner {
    constructor(discordWebhookUrl) {
        this.notifier = discordWebhookUrl ? new DiscordNotifier(discordWebhookUrl) : null;
        this.results = [];
    }

    /**
     * 특정 리그 모니터링
     */
    async monitorLeague(leagueName, teams) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`🏆 ${this.getLeagueName(leagueName)} 모니터링 시작`);
        console.log(`${'='.repeat(60)}\n`);

        const leagueResults = [];

        for (const team of teams) {
            console.log(`\n🔍 ${team.nameKo} (${team.name}) 크롤링 시작...`);
            const detector = new BlackFridayDetector(team);

            try {
                const result = await detector.detect();
                leagueResults.push(result);
                this.results.push(result);

                // 결과 로깅
                if (result.blackFridayDetected) {
                    console.log(`   ✅ 블랙프라이데이 감지! (신뢰도: ${result.confidence}%)`);
                } else {
                    console.log(`   ⭕ 미감지`);
                }

                // 팀 간 딜레이 (Rate limiting)
                await new Promise(resolve => setTimeout(resolve, 5000));
            } catch (error) {
                console.error(`   ❌ 모니터링 실패: ${error.message}`);
                leagueResults.push({
                    team: team.nameKo,
                    teamEn: team.name,
                    league: team.league,
                    error: error.message,
                    blackFridayDetected: false
                });
            }
        }

        // 리그 결과 요약
        const detected = leagueResults.filter(r => r.blackFridayDetected);
        console.log(`\n📊 ${this.getLeagueName(leagueName)} 결과 요약:`);
        console.log(`   전체: ${leagueResults.length}개 팀`);
        console.log(`   감지: ${detected.length}개 팀`);
        if (detected.length > 0) {
            detected.forEach(r => {
                console.log(`   🎯 ${r.team} (신뢰도: ${r.confidence}%)`);
            });
        }

        return leagueResults;
    }

    /**
     * 전체 모니터링 실행
     */
    async runAll() {
        console.log('🚀 블랙프라이데이 모니터링 시작');
        console.log(`⏰ 시작 시각: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} KST\n`);

        const startTime = Date.now();

        // 순서대로 리그 모니터링
        const leagues = ['premierLeague', 'laLiga', 'bundesliga', 'ligue1', 'serieA'];

        for (const league of leagues) {
            if (teamConfigs[league] && teamConfigs[league].length > 0) {
                await this.monitorLeague(league, teamConfigs[league]);
            }
        }

        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000 / 60);

        console.log(`\n${'='.repeat(60)}`);
        console.log('✅ 전체 모니터링 완료');
        console.log(`⏱️  소요 시간: ${duration}분`);
        console.log(`📊 총 ${this.results.length}개 팀 모니터링 완료`);
        console.log(`${'='.repeat(60)}\n`);

        // 결과 저장
        await this.saveResults();

        // Discord 알림
        if (this.notifier) {
            await this.sendNotifications();
        } else {
            console.log('⚠️  Discord Webhook URL이 설정되지 않아 알림을 전송하지 않습니다.');
            console.log('   환경 변수 DISCORD_WEBHOOK_URL을 설정해주세요.');
        }

        return this.results;
    }

    /**
     * 특정 리그만 실행
     */
    async runLeague(leagueName) {
        if (!teamConfigs[leagueName]) {
            console.error(`❌ 알 수 없는 리그: ${leagueName}`);
            console.log('사용 가능한 리그: premierLeague, laLiga, bundesliga, ligue1, serieA');
            return;
        }

        console.log(`🚀 ${this.getLeagueName(leagueName)} 모니터링 시작\n`);

        const startTime = Date.now();
        await this.monitorLeague(leagueName, teamConfigs[leagueName]);
        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000 / 60);

        console.log(`\n✅ 모니터링 완료 (소요 시간: ${duration}분)\n`);

        await this.saveResults();

        if (this.notifier) {
            await this.sendNotifications();
        }

        return this.results;
    }

    /**
     * 결과 저장
     */
    async saveResults() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const outputDir = path.join(__dirname, '../monitor-results');

        // 디렉토리 생성
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, `monitor-${timestamp}.json`);

        fs.writeFileSync(outputPath, JSON.stringify({
            timestamp: new Date().toISOString(),
            totalTeams: this.results.length,
            detectedTeams: this.results.filter(r => r.blackFridayDetected).length,
            results: this.results
        }, null, 2));

        console.log(`💾 결과 저장: ${outputPath}`);

        // 최신 결과도 저장
        const latestPath = path.join(outputDir, 'latest.json');
        fs.writeFileSync(latestPath, JSON.stringify({
            timestamp: new Date().toISOString(),
            totalTeams: this.results.length,
            detectedTeams: this.results.filter(r => r.blackFridayDetected).length,
            results: this.results
        }, null, 2));
    }

    /**
     * Discord 알림 전송
     */
    async sendNotifications() {
        console.log('\n📢 Discord 알림 전송 중...');

        try {
            await this.notifier.notifyBlackFridayDetected(this.results);
            // await this.notifier.sendDailyReport(this.results); // 일일 리포트는 선택적
            console.log('✅ Discord 알림 전송 완료');
        } catch (error) {
            console.error('❌ Discord 알림 전송 실패:', error.message);
        }
    }

    /**
     * 리그 한글 이름
     */
    getLeagueName(leagueKey) {
        const names = {
            premierLeague: '프리미어리그',
            laLiga: '라리가',
            bundesliga: '분데스리가',
            ligue1: '리그앙',
            serieA: '세리에 A'
        };
        return names[leagueKey] || leagueKey;
    }
}

// 메인 실행
async function main() {
    const args = process.argv.slice(2);
    const league = args[0];

    const runner = new MonitorRunner(DISCORD_WEBHOOK_URL);

    try {
        if (league) {
            await runner.runLeague(league);
        } else {
            await runner.runAll();
        }

        const detectedCount = runner.results.filter(r => r.blackFridayDetected).length;

        if (detectedCount > 0) {
            console.log(`\n🎉 ${detectedCount}개 팀에서 블랙프라이데이 감지!`);
            process.exit(0);
        } else {
            console.log('\n✅ 블랙프라이데이 미감지');
            process.exit(0);
        }
    } catch (error) {
        console.error('\n❌ 모니터링 중 오류 발생:', error);
        process.exit(1);
    }
}

// 스크립트 직접 실행 시
if (require.main === module) {
    main();
}

module.exports = MonitorRunner;
