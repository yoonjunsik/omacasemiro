#!/usr/bin/env node

/**
 * Discord Webhook 테스트 스크립트
 *
 * 사용법:
 *   DISCORD_WEBHOOK_URL="your-webhook-url" node monitors/test-discord.js
 */

const DiscordNotifier = require('./discord-notifier');

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || '';

async function test() {
    if (!DISCORD_WEBHOOK_URL) {
        console.error('❌ Discord Webhook URL이 설정되지 않았습니다.');
        console.log('\n사용법:');
        console.log('  DISCORD_WEBHOOK_URL="your-webhook-url" node monitors/test-discord.js');
        console.log('\nDiscord Webhook 생성 방법:');
        console.log('  1. Discord 서버에서 채널 설정 클릭');
        console.log('  2. 연동(Integrations) → Webhook → 새 Webhook');
        console.log('  3. Webhook URL 복사');
        process.exit(1);
    }

    console.log('🧪 Discord Webhook 테스트 시작...\n');

    const notifier = new DiscordNotifier(DISCORD_WEBHOOK_URL);

    try {
        // 1. 테스트 메시지 전송
        console.log('1️⃣ 테스트 메시지 전송 중...');
        const success = await notifier.sendTestMessage();

        if (success) {
            console.log('✅ 테스트 메시지 전송 성공!\n');
        } else {
            console.log('❌ 테스트 메시지 전송 실패\n');
            process.exit(1);
        }

        // 2. 샘플 블랙프라이데이 감지 알림 전송
        console.log('2️⃣ 샘플 블랙프라이데이 알림 전송 중...');

        const sampleResults = [
            {
                team: '리버풀',
                teamEn: 'Liverpool',
                league: 'Premier League',
                timestamp: new Date().toISOString(),
                blackFridayDetected: true,
                confidence: 85,
                signals: [
                    {
                        type: 'bf_page_exists',
                        severity: 'HIGH',
                        message: '블랙프라이데이 전용 페이지 발견',
                        details: [
                            { url: 'https://store.liverpoolfc.com/black-friday', exists: true }
                        ]
                    },
                    {
                        type: 'bf_keywords',
                        severity: 'HIGH',
                        message: '메인 페이지에 블랙프라이데이 키워드/배너 발견',
                        details: {
                            hasKeywords: true,
                            hasBanner: true,
                            foundKeywords: ['black friday', 'cyber monday']
                        }
                    },
                    {
                        type: 'massive_discounts',
                        severity: 'HIGH',
                        message: '30% 이상 대규모 할인 제품 12개 발견',
                        details: {
                            totalProducts: 45,
                            bigDiscounts: 12,
                            averageDiscount: 32,
                            maxDiscount: 50,
                            products: [
                                { name: 'Liverpool Home Shirt 24/25', regularPrice: 80, salePrice: 48, discountPercent: 40 },
                                { name: 'Liverpool Training Kit', regularPrice: 60, salePrice: 39, discountPercent: 35 },
                                { name: 'Liverpool Jacket', regularPrice: 70, salePrice: 49, discountPercent: 30 },
                                { name: 'Liverpool Scarf', regularPrice: 20, salePrice: 13, discountPercent: 35 },
                                { name: 'Liverpool Cap', regularPrice: 25, salePrice: 15, discountPercent: 40 }
                            ]
                        }
                    }
                ]
            },
            {
                team: '맨체스터 시티',
                teamEn: 'Manchester City',
                league: 'Premier League',
                timestamp: new Date().toISOString(),
                blackFridayDetected: true,
                confidence: 70,
                signals: [
                    {
                        type: 'bf_keywords',
                        severity: 'MEDIUM',
                        message: '메인 페이지에 블랙프라이데이 키워드 발견',
                        details: {
                            hasKeywords: true,
                            hasBanner: false,
                            foundKeywords: ['black friday']
                        }
                    },
                    {
                        type: 'massive_discounts',
                        severity: 'HIGH',
                        message: '30% 이상 대규모 할인 제품 8개 발견',
                        details: {
                            totalProducts: 30,
                            bigDiscounts: 8,
                            averageDiscount: 28,
                            maxDiscount: 45,
                            products: [
                                { name: 'Man City Home Shirt', regularPrice: 75, salePrice: 45, discountPercent: 40 },
                                { name: 'Man City Away Shirt', regularPrice: 75, salePrice: 49, discountPercent: 35 }
                            ]
                        }
                    }
                ]
            },
            {
                team: '아스널',
                teamEn: 'Arsenal',
                league: 'Premier League',
                timestamp: new Date().toISOString(),
                blackFridayDetected: false,
                confidence: 20,
                signals: []
            }
        ];

        await notifier.notifyBlackFridayDetected(sampleResults);

        console.log('\n✅ 모든 테스트 완료!');
        console.log('\nDiscord 채널에서 다음 알림을 확인하세요:');
        console.log('  1. 테스트 메시지');
        console.log('  2. 리버풀 블랙프라이데이 알림');
        console.log('  3. 맨체스터 시티 블랙프라이데이 알림');
        console.log('  4. 요약 알림 (2개 팀 감지)');

    } catch (error) {
        console.error('\n❌ 테스트 실패:', error.message);
        process.exit(1);
    }
}

test();
