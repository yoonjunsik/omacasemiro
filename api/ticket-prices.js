/**
 * 경기 티켓 가격 정적 데이터
 *
 * 리셀 사이트(StubHub, Viagogo 등)는 API를 제공하지 않으므로
 * 평균 티켓 가격을 수동으로 관리합니다.
 *
 * 가격은 2024년 11월 기준 평균 가격이며,
 * 실제 구매 시 변동될 수 있습니다.
 */

const ticketPrices = {
    // 프리미어리그
    'Premier League': {
        'Liverpool FC': {
            budget: { price: 180000, section: '상층부 일반석' },
            premium: { price: 320000, section: '중앙부 프리미엄석' },
            vip: { price: 650000, section: 'VIP 라운지' }
        },
        'Manchester City FC': {
            budget: { price: 160000, section: '상층부 일반석' },
            premium: { price: 280000, section: '중앙부 프리미엄석' },
            vip: { price: 550000, section: 'VIP 라운지' }
        },
        'Arsenal FC': {
            budget: { price: 150000, section: '상층부 일반석' },
            premium: { price: 270000, section: '중앙부 프리미엄석' },
            vip: { price: 520000, section: 'VIP 라운지' }
        },
        'Chelsea FC': {
            budget: { price: 165000, section: '상층부 일반석' },
            premium: { price: 290000, section: '중앙부 프리미엄석' },
            vip: { price: 580000, section: 'VIP 라운지' }
        },
        'Manchester United FC': {
            budget: { price: 190000, section: '상층부 일반석' },
            premium: { price: 330000, section: '중앙부 프리미엄석' },
            vip: { price: 680000, section: 'VIP 라운지' }
        },
        'Tottenham Hotspur FC': {
            budget: { price: 155000, section: '상층부 일반석' },
            premium: { price: 275000, section: '중앙부 프리미엄석' },
            vip: { price: 540000, section: 'VIP 라운지' }
        },
        'Newcastle United FC': {
            budget: { price: 145000, section: '상층부 일반석' },
            premium: { price: 260000, section: '중앙부 프리미엄석' },
            vip: { price: 510000, section: 'VIP 라운지' }
        },
        'Aston Villa FC': {
            budget: { price: 130000, section: '상층부 일반석' },
            premium: { price: 240000, section: '중앙부 프리미엄석' },
            vip: { price: 480000, section: 'VIP 라운지' }
        }
    },

    // 라리가
    'La Liga': {
        'Real Madrid CF': {
            budget: { price: 200000, section: '상층부 일반석' },
            premium: { price: 350000, section: '중앙부 프리미엄석' },
            vip: { price: 720000, section: 'VIP 라운지' }
        },
        'FC Barcelona': {
            budget: { price: 210000, section: '상층부 일반석' },
            premium: { price: 360000, section: '중앙부 프리미엄석' },
            vip: { price: 750000, section: 'VIP 라운지' }
        },
        'Atlético Madrid': {
            budget: { price: 140000, section: '상층부 일반석' },
            premium: { price: 250000, section: '중앙부 프리미엄석' },
            vip: { price: 500000, section: 'VIP 라운지' }
        }
    },

    // 분데스리가
    'Bundesliga': {
        'FC Bayern München': {
            budget: { price: 170000, section: '상층부 일반석' },
            premium: { price: 300000, section: '중앙부 프리미엄석' },
            vip: { price: 600000, section: 'VIP 라운지' }
        },
        'Borussia Dortmund': {
            budget: { price: 155000, section: '상층부 일반석' },
            premium: { price: 280000, section: '중앙부 프리미엄석' },
            vip: { price: 550000, section: 'VIP 라운지' }
        }
    },

    // 리그앙
    'Ligue 1': {
        'Paris Saint-Germain FC': {
            budget: { price: 175000, section: '상층부 일반석' },
            premium: { price: 310000, section: '중앙부 프리미엄석' },
            vip: { price: 620000, section: 'VIP 라운지' }
        }
    },

    // 세리에 A
    'Serie A': {
        'Juventus FC': {
            budget: { price: 160000, section: '상층부 일반석' },
            premium: { price: 285000, section: '중앙부 프리미엄석' },
            vip: { price: 570000, section: 'VIP 라운지' }
        },
        'Inter Milan': {
            budget: { price: 150000, section: '상층부 일반석' },
            premium: { price: 270000, section: '중앙부 프리미엄석' },
            vip: { price: 540000, section: 'VIP 라운지' }
        },
        'AC Milan': {
            budget: { price: 145000, section: '상층부 일반석' },
            premium: { price: 265000, section: '중앙부 프리미엄석' },
            vip: { price: 530000, section: 'VIP 라운지' }
        }
    },

    // 챔피언스 리그 (평균 가격)
    'Champions League': {
        default: {
            budget: { price: 250000, section: '상층부 일반석' },
            premium: { price: 450000, section: '중앙부 프리미엄석' },
            vip: { price: 900000, section: 'VIP 라운지' }
        }
    }
};

/**
 * 티켓 가격 조회
 * @param {string} league - 리그 이름
 * @param {string} teamName - 팀 이름
 * @param {string} tier - 티켓 등급 (budget/premium/vip)
 */
function getTicketPrice(league, teamName, tier = 'budget') {
    try {
        const leagueData = ticketPrices[league];
        if (!leagueData) {
            return getDefaultPrice(tier);
        }

        const teamData = leagueData[teamName] || leagueData.default;
        if (!teamData) {
            return getDefaultPrice(tier);
        }

        return teamData[tier] || teamData.budget;
    } catch (error) {
        console.error('Failed to get ticket price:', error);
        return getDefaultPrice(tier);
    }
}

/**
 * 기본 티켓 가격
 */
function getDefaultPrice(tier) {
    const defaults = {
        budget: { price: 150000, section: '상층부 일반석' },
        premium: { price: 280000, section: '중앙부 프리미엄석' },
        vip: { price: 550000, section: 'VIP 라운지' }
    };
    return defaults[tier] || defaults.budget;
}

/**
 * 경기 중요도에 따른 가격 배수
 * 엘 클라시코, 더비 등 빅매치는 가격이 2~3배 상승
 */
function getMatchMultiplier(homeTeam, awayTeam) {
    const bigMatches = {
        'El Clásico': ['Real Madrid CF', 'FC Barcelona'],
        'Manchester Derby': ['Manchester City FC', 'Manchester United FC'],
        'North London Derby': ['Arsenal FC', 'Tottenham Hotspur FC'],
        'Milan Derby': ['Inter Milan', 'AC Milan']
    };

    for (const [matchName, teams] of Object.entries(bigMatches)) {
        if (
            (teams[0] === homeTeam && teams[1] === awayTeam) ||
            (teams[1] === homeTeam && teams[0] === awayTeam)
        ) {
            return 2.5; // 빅매치는 2.5배
        }
    }

    return 1.0; // 일반 경기
}

/**
 * 최종 티켓 가격 계산 (경기 중요도 반영)
 */
function calculateFinalPrice(league, homeTeam, awayTeam, tier = 'budget') {
    const basePrice = getTicketPrice(league, homeTeam, tier);
    const multiplier = getMatchMultiplier(homeTeam, awayTeam);

    return {
        price: Math.round(basePrice.price * multiplier),
        section: basePrice.section,
        tier: tier,
        isBigMatch: multiplier > 1.0,
        originalPrice: basePrice.price
    };
}

// Node.js 환경에서 사용
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ticketPrices,
        getTicketPrice,
        calculateFinalPrice,
        getMatchMultiplier
    };
}

// 브라우저 환경에서 사용
if (typeof window !== 'undefined') {
    window.TicketPrices = {
        ticketPrices,
        getTicketPrice,
        calculateFinalPrice,
        getMatchMultiplier
    };
}
