const https = require('https');

/**
 * Discord Webhook 알림 전송기
 *
 * Discord Webhook 생성 방법:
 * 1. Discord 서버에서 채널 설정 클릭
 * 2. 연동(Integrations) → Webhook → 새 Webhook
 * 3. Webhook URL 복사
 */
class DiscordNotifier {
    constructor(webhookUrl) {
        this.webhookUrl = webhookUrl;
        this.colors = {
            red: 0xFF0000,      // 매우 높음 (80%+)
            orange: 0xFF8C00,   // 높음 (60-80%)
            yellow: 0xFFD700,   // 중간 (40-60%)
            gray: 0x808080,     // 낮음 (40% 미만)
            blue: 0x0099FF,     // 정보
            green: 0x00FF00     // 성공
        };
    }

    /**
     * Discord에 메시지 전송
     */
    async sendMessage(message) {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(message);

            const url = new URL(this.webhookUrl);
            const options = {
                hostname: url.hostname,
                port: 443,
                path: url.pathname + url.search,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            };

            const req = https.request(options, (res) => {
                let responseData = '';

                res.on('data', (chunk) => {
                    responseData += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode === 204 || res.statusCode === 200) {
                        resolve(responseData);
                    } else {
                        reject(new Error(`Discord API returned ${res.statusCode}: ${responseData}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.write(data);
            req.end();
        });
    }

    /**
     * 블랙프라이데이 감지 알림
     */
    async notifyBlackFridayDetected(results) {
        const detectedTeams = results.filter(r => r.blackFridayDetected);

        if (detectedTeams.length === 0) {
            console.log('📭 블랙프라이데이 감지 없음 - Discord 알림 생략');
            return;
        }

        console.log(`\n📢 Discord로 ${detectedTeams.length}개 팀 알림 전송...`);

        // 팀별로 개별 알림 생성
        for (const team of detectedTeams) {
            await this.sendTeamAlert(team);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
        }

        // 요약 알림
        await this.sendSummaryAlert(results, detectedTeams);
    }

    /**
     * 개별 팀 알림
     */
    async sendTeamAlert(teamResult) {
        const emoji = this.getLeagueEmoji(teamResult.league);
        const color = this.getConfidenceColor(teamResult.confidence);

        // 필드 구성
        const fields = [
            {
                name: '팀',
                value: `${emoji} **${teamResult.team}** (${teamResult.teamEn})`,
                inline: true
            },
            {
                name: '리그',
                value: teamResult.league,
                inline: true
            },
            {
                name: '신뢰도',
                value: `**${teamResult.confidence}%**`,
                inline: true
            }
        ];

        // 감지 신호 추가
        if (teamResult.signals && teamResult.signals.length > 0) {
            const signalsText = teamResult.signals.map(signal => {
                const icon = signal.severity === 'HIGH' ? '🔴' : signal.severity === 'MEDIUM' ? '🟡' : '🟢';
                return `${icon} ${signal.message}`;
            }).join('\n');

            fields.push({
                name: '감지된 신호',
                value: signalsText,
                inline: false
            });
        }

        // 할인 제품 정보
        const saleSignal = teamResult.signals.find(s => s.type === 'massive_discounts' || s.type === 'sale_products');
        if (saleSignal && saleSignal.details.products && saleSignal.details.products.length > 0) {
            const productsText = saleSignal.details.products.slice(0, 5).map(p =>
                `• ${p.name} - **${p.discountPercent}% 할인**`
            ).join('\n');

            fields.push({
                name: '주요 할인 제품',
                value: productsText || '정보 없음',
                inline: false
            });
        }

        // 통계 정보
        if (saleSignal && saleSignal.details) {
            const stats = [
                `총 제품: ${saleSignal.details.totalProducts}개`,
                `대규모 할인(30%+): ${saleSignal.details.bigDiscounts}개`,
                `평균 할인율: ${saleSignal.details.averageDiscount}%`,
                `최대 할인율: ${saleSignal.details.maxDiscount}%`
            ].join('\n');

            fields.push({
                name: '📊 할인 통계',
                value: stats,
                inline: false
            });
        }

        const embed = {
            title: `🎉 블랙프라이데이 감지: ${teamResult.team}`,
            color: color,
            fields: fields,
            timestamp: teamResult.timestamp,
            footer: {
                text: 'Black Friday Monitor'
            }
        };

        const message = {
            username: 'Black Friday Monitor',
            avatar_url: 'https://cdn-icons-png.flaticon.com/512/2331/2331966.png',
            embeds: [embed]
        };

        try {
            await this.sendMessage(message);
            console.log(`✅ ${teamResult.team} 알림 전송 완료`);
        } catch (error) {
            console.error(`❌ ${teamResult.team} 알림 전송 실패:`, error.message);
        }
    }

    /**
     * 요약 알림
     */
    async sendSummaryAlert(allResults, detectedTeams) {
        const summary = {
            total: allResults.length,
            detected: detectedTeams.length,
            byLeague: {}
        };

        // 리그별 집계
        detectedTeams.forEach(team => {
            if (!summary.byLeague[team.league]) {
                summary.byLeague[team.league] = 0;
            }
            summary.byLeague[team.league]++;
        });

        const leagueText = Object.entries(summary.byLeague)
            .map(([league, count]) => `• ${league}: **${count}개 팀**`)
            .join('\n') || '없음';

        const teamList = detectedTeams
            .sort((a, b) => b.confidence - a.confidence)
            .map((t, i) => `${i + 1}. ${this.getLeagueEmoji(t.league)} **${t.team}** (신뢰도: ${t.confidence}%)`)
            .join('\n') || '없음';

        const fields = [
            {
                name: '📊 모니터링 현황',
                value: `전체: **${summary.total}개 팀**\n감지: **${summary.detected}개 팀**`,
                inline: false
            },
            {
                name: '🏆 리그별 현황',
                value: leagueText,
                inline: false
            },
            {
                name: '🎯 감지된 팀 목록',
                value: teamList,
                inline: false
            }
        ];

        const embed = {
            title: '📊 블랙프라이데이 모니터링 요약',
            description: `총 ${summary.detected}개 팀에서 블랙프라이데이 감지됨`,
            color: summary.detected > 0 ? this.colors.red : this.colors.green,
            fields: fields,
            timestamp: new Date().toISOString(),
            footer: {
                text: `다음 모니터링: 6시간 후`
            }
        };

        const message = {
            username: 'Black Friday Monitor',
            avatar_url: 'https://cdn-icons-png.flaticon.com/512/2331/2331966.png',
            content: summary.detected > 0 ? `🚨 **${summary.detected}개 팀에서 블랙프라이데이 시작!**` : '✅ 모든 팀 정상 (블랙프라이데이 미감지)',
            embeds: [embed]
        };

        try {
            await this.sendMessage(message);
            console.log('✅ 요약 알림 전송 완료');
        } catch (error) {
            console.error('❌ 요약 알림 전송 실패:', error.message);
        }
    }

    /**
     * 일일 리포트
     */
    async sendDailyReport(allResults) {
        const now = new Date();
        const hour = now.getHours();

        // 하루에 한 번만 (예: 18시)
        if (hour !== 18) {
            return;
        }

        const detectedCount = allResults.filter(r => r.blackFridayDetected).length;

        const fields = [
            {
                name: '모니터링 결과',
                value: `• 전체: ${allResults.length}개 팀\n• 블랙프라이데이 감지: ${detectedCount}개 팀\n• 정상: ${allResults.length - detectedCount}개 팀`,
                inline: false
            }
        ];

        const embed = {
            title: '📋 일일 모니터링 리포트',
            description: now.toLocaleDateString('ko-KR'),
            color: this.colors.blue,
            fields: fields,
            timestamp: now.toISOString(),
            footer: {
                text: '다음 모니터링: 6시간 후'
            }
        };

        const message = {
            username: 'Black Friday Monitor',
            avatar_url: 'https://cdn-icons-png.flaticon.com/512/2331/2331966.png',
            embeds: [embed]
        };

        try {
            await this.sendMessage(message);
            console.log('✅ 일일 리포트 전송 완료');
        } catch (error) {
            console.error('❌ 일일 리포트 전송 실패:', error.message);
        }
    }

    /**
     * 테스트 메시지
     */
    async sendTestMessage() {
        const embed = {
            title: '✅ Discord Webhook 테스트',
            description: '블랙프라이데이 모니터링 시스템이 정상적으로 연결되었습니다!',
            color: this.colors.green,
            fields: [
                {
                    name: '상태',
                    value: '정상 작동',
                    inline: true
                },
                {
                    name: '다음 모니터링',
                    value: '6시간 후',
                    inline: true
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: 'Black Friday Monitor'
            }
        };

        const message = {
            username: 'Black Friday Monitor',
            avatar_url: 'https://cdn-icons-png.flaticon.com/512/2331/2331966.png',
            content: '🚀 **모니터링 시스템 시작!**',
            embeds: [embed]
        };

        try {
            await this.sendMessage(message);
            console.log('✅ 테스트 메시지 전송 완료');
            return true;
        } catch (error) {
            console.error('❌ 테스트 메시지 전송 실패:', error.message);
            return false;
        }
    }

    /**
     * 리그별 이모지
     */
    getLeagueEmoji(league) {
        const emojis = {
            'Premier League': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
            'La Liga': '🇪🇸',
            'Bundesliga': '🇩🇪',
            'Serie A': '🇮🇹',
            'Ligue 1': '🇫🇷'
        };
        return emojis[league] || '⚽';
    }

    /**
     * 신뢰도에 따른 색상
     */
    getConfidenceColor(confidence) {
        if (confidence >= 80) return this.colors.red;      // 매우 높음
        if (confidence >= 60) return this.colors.orange;   // 높음
        if (confidence >= 40) return this.colors.yellow;   // 중간
        return this.colors.gray;                           // 낮음
    }
}

module.exports = DiscordNotifier;
