const https = require('https');

/**
 * Slack 알림 전송기
 */
class SlackNotifier {
    constructor(webhookUrl) {
        this.webhookUrl = webhookUrl;
    }

    /**
     * Slack에 메시지 전송
     */
    async sendMessage(message) {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(message);

            const url = new URL(this.webhookUrl);
            const options = {
                hostname: url.hostname,
                port: 443,
                path: url.pathname,
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
                    if (res.statusCode === 200) {
                        resolve(responseData);
                    } else {
                        reject(new Error(`Slack API returned ${res.statusCode}: ${responseData}`));
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
            console.log('📭 블랙프라이데이 감지 없음 - Slack 알림 생략');
            return;
        }

        console.log(`\n📢 Slack으로 ${detectedTeams.length}개 팀 알림 전송...`);

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
        const confidenceColor = this.getConfidenceColor(teamResult.confidence);

        const blocks = [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: `🎉 블랙프라이데이 감지: ${teamResult.team}`,
                    emoji: true
                }
            },
            {
                type: 'section',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: `*팀:*\n${emoji} ${teamResult.team} (${teamResult.teamEn})`
                    },
                    {
                        type: 'mrkdwn',
                        text: `*리그:*\n${teamResult.league}`
                    },
                    {
                        type: 'mrkdwn',
                        text: `*신뢰도:*\n${teamResult.confidence}%`
                    },
                    {
                        type: 'mrkdwn',
                        text: `*감지 시각:*\n${new Date(teamResult.timestamp).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`
                    }
                ]
            }
        ];

        // 감지 신호 추가
        if (teamResult.signals && teamResult.signals.length > 0) {
            const signalsText = teamResult.signals.map(signal => {
                const icon = signal.severity === 'HIGH' ? '🔴' : signal.severity === 'MEDIUM' ? '🟡' : '🟢';
                return `${icon} *${signal.message}*`;
            }).join('\n');

            blocks.push({
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*감지된 신호:*\n${signalsText}`
                }
            });
        }

        // 할인 제품 정보
        const saleSignal = teamResult.signals.find(s => s.type === 'massive_discounts' || s.type === 'sale_products');
        if (saleSignal && saleSignal.details.products) {
            const productsText = saleSignal.details.products.slice(0, 5).map(p =>
                `• ${p.name} - ${p.discountPercent}% 할인`
            ).join('\n');

            blocks.push({
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*주요 할인 제품:*\n${productsText}`
                }
            });
        }

        blocks.push({
            type: 'divider'
        });

        const message = {
            username: 'Black Friday Monitor',
            icon_emoji: ':shopping_bags:',
            attachments: [
                {
                    color: confidenceColor,
                    blocks: blocks
                }
            ]
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
            .map(([league, count]) => `• ${league}: ${count}개 팀`)
            .join('\n');

        const teamList = detectedTeams
            .sort((a, b) => b.confidence - a.confidence)
            .map(t => `${this.getLeagueEmoji(t.league)} *${t.team}* (신뢰도: ${t.confidence}%)`)
            .join('\n');

        const message = {
            username: 'Black Friday Monitor',
            icon_emoji: ':chart_with_upwards_trend:',
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: '📊 블랙프라이데이 모니터링 요약',
                        emoji: true
                    }
                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'mrkdwn',
                            text: `*전체 모니터링:*\n${summary.total}개 팀`
                        },
                        {
                            type: 'mrkdwn',
                            text: `*블랙프라이데이 감지:*\n${summary.detected}개 팀`
                        }
                    ]
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `*리그별 현황:*\n${leagueText || '없음'}`
                    }
                },
                {
                    type: 'divider'
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `*감지된 팀 목록:*\n${teamList || '없음'}`
                    }
                },
                {
                    type: 'context',
                    elements: [
                        {
                            type: 'mrkdwn',
                            text: `🕐 ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} KST`
                        }
                    ]
                }
            ]
        };

        try {
            await this.sendMessage(message);
            console.log('✅ 요약 알림 전송 완료');
        } catch (error) {
            console.error('❌ 요약 알림 전송 실패:', error.message);
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
        if (confidence >= 80) return '#FF0000'; // 빨강 - 매우 높음
        if (confidence >= 60) return '#FF8C00'; // 주황 - 높음
        if (confidence >= 40) return '#FFD700'; // 노랑 - 중간
        return '#808080'; // 회색 - 낮음
    }

    /**
     * 일일 리포트 (블랙프라이데이 미감지 시에도 전송)
     */
    async sendDailyReport(allResults) {
        const now = new Date();
        const hour = now.getHours();

        // 하루에 한 번만 (예: 18시)
        if (hour !== 18) {
            return;
        }

        const detectedCount = allResults.filter(r => r.blackFridayDetected).length;

        const message = {
            username: 'Black Friday Monitor',
            icon_emoji: ':clipboard:',
            text: `📋 일일 모니터링 리포트 (${now.toLocaleDateString('ko-KR')})`,
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: '📋 일일 모니터링 리포트',
                        emoji: true
                    }
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `*모니터링 결과:*\n• 전체: ${allResults.length}개 팀\n• 블랙프라이데이 감지: ${detectedCount}개 팀\n• 정상: ${allResults.length - detectedCount}개 팀`
                    }
                },
                {
                    type: 'context',
                    elements: [
                        {
                            type: 'mrkdwn',
                            text: `다음 모니터링: 6시간 후`
                        }
                    ]
                }
            ]
        };

        try {
            await this.sendMessage(message);
            console.log('✅ 일일 리포트 전송 완료');
        } catch (error) {
            console.error('❌ 일일 리포트 전송 실패:', error.message);
        }
    }
}

module.exports = SlackNotifier;
