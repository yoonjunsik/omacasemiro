/**
 * Football-Data.org API Service
 *
 * 주요 유럽 리그 경기 일정 조회
 * 무료 플랜: 10 requests/minute
 */

class FootballDataService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.football-data.org/v4';
        this.competitions = {
            'PL': 'Premier League',
            'PD': 'La Liga',
            'BL1': 'Bundesliga',
            'SA': 'Serie A',
            'FL1': 'Ligue 1',
            'CL': 'Champions League',
            'EL': 'Europa League'
        };
    }

    /**
     * 특정 리그의 경기 일정 조회
     * @param {string} competitionCode - 리그 코드 (PL, PD, BL1, SA, FL1)
     * @param {string} dateFrom - 시작 날짜 (YYYY-MM-DD)
     * @param {string} dateTo - 종료 날짜 (YYYY-MM-DD)
     */
    async getMatches(competitionCode, dateFrom, dateTo) {
        const url = `${this.baseUrl}/competitions/${competitionCode}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'X-Auth-Token': this.apiKey
                }
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return this.formatMatches(data.matches);
        } catch (error) {
            console.error(`Failed to fetch matches for ${competitionCode}:`, error);
            return [];
        }
    }

    /**
     * 모든 주요 리그의 경기 일정 조회
     * Rate limit 준수: 10 requests/minute = 6초 간격
     */
    async getAllMatches(dateFrom, dateTo) {
        const allMatches = [];
        // 주요 유럽 리그 모두 조회
        const leagues = ['PL', 'PD', 'BL1', 'SA', 'FL1'];

        for (let i = 0; i < leagues.length; i++) {
            const league = leagues[i];

            try {
                const matches = await this.getMatches(league, dateFrom, dateTo);
                allMatches.push(...matches);

                // Rate limiting: 10 requests/minute = 6초 간격
                // 마지막 리그가 아니면 대기
                if (i < leagues.length - 1) {
                    await this.delay(6500); // 여유있게 6.5초
                }
            } catch (error) {
                console.error(`Failed to fetch ${league}:`, error.message);
                // 에러가 나도 다음 리그 계속 조회
                if (i < leagues.length - 1) {
                    await this.delay(6500);
                }
            }
        }

        return allMatches;
    }

    /**
     * 특정 날짜의 경기 조회
     */
    async getMatchesByDate(date) {
        return this.getAllMatches(date, date);
    }

    /**
     * API 응답 데이터 포맷팅
     */
    formatMatches(matches) {
        return matches.map(match => ({
            id: match.id,
            homeTeam: match.homeTeam.name,
            homeTeamKo: this.getKoreanTeamName(match.homeTeam.name),
            awayTeam: match.awayTeam.name,
            awayTeamKo: this.getKoreanTeamName(match.awayTeam.name),
            homeLogo: match.homeTeam.crest,
            awayLogo: match.awayTeam.crest,
            date: match.utcDate,
            time: this.formatTime(match.utcDate),
            stadium: this.getStadiumName(match.homeTeam.name),
            city: this.getCityFromTeam(match.homeTeam.name),
            country: this.getCountryFromCompetition(match.competition.code),
            league: this.competitions[match.competition.code] || match.competition.name,
            leagueCode: match.competition.code,
            status: match.status
        }));
    }

    /**
     * UTC 시간을 GMT로 변환 (현지 시간 표시)
     */
    formatTime(utcDate) {
        const date = new Date(utcDate);
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes} GMT`;
    }

    /**
     * 팀 이름 한글 변환 (간단한 매핑)
     */
    getKoreanTeamName(teamName) {
        const teamMap = {
            'Liverpool FC': '리버풀',
            'Manchester City FC': '맨체스터 시티',
            'Arsenal FC': '아스널',
            'Chelsea FC': '첼시',
            'Manchester United FC': '맨체스터 유나이티드',
            'Tottenham Hotspur FC': '토트넘',
            'Newcastle United FC': '뉴캐슬',
            'Aston Villa FC': '애스턴 빌라',
            'Real Madrid CF': '레알 마드리드',
            'FC Barcelona': '바르셀로나',
            'Atlético Madrid': '아틀레티코 마드리드',
            'FC Bayern München': '바이에른 뮌헨',
            'Borussia Dortmund': '도르트문트',
            'Paris Saint-Germain FC': 'PSG',
            'Juventus FC': '유벤투스',
            'Inter Milan': '인터 밀란',
            'AC Milan': 'AC 밀란'
        };
        return teamMap[teamName] || teamName;
    }

    /**
     * 팀 이름으로 경기장 추정
     */
    getStadiumName(teamName) {
        const stadiumMap = {
            'Liverpool FC': '안필드',
            'Manchester City FC': '에티하드 스타디움',
            'Arsenal FC': '에미레이트 스타디움',
            'Chelsea FC': '스탬포드 브리지',
            'Manchester United FC': '올드 트래포드',
            'Tottenham Hotspur FC': '토트넘 호츠퍼 스타디움',
            'Real Madrid CF': '산티아고 베르나베우',
            'FC Barcelona': '캄프 누',
            'FC Bayern München': '알리안츠 아레나',
            'Borussia Dortmund': '지그날 이두나 파크',
            'Juventus FC': '알리안츠 스타디움',
            'Inter Milan': '산 시로'
        };
        return stadiumMap[teamName] || 'Stadium';
    }

    /**
     * 팀 이름으로 도시 추정
     */
    getCityFromTeam(teamName) {
        const cityMap = {
            'Liverpool FC': '리버풀',
            'Manchester City FC': '맨체스터',
            'Arsenal FC': '런던',
            'Chelsea FC': '런던',
            'Manchester United FC': '맨체스터',
            'Tottenham Hotspur FC': '런던',
            'Newcastle United FC': '뉴캐슬',
            'Real Madrid CF': '마드리드',
            'FC Barcelona': '바르셀로나',
            'Atlético Madrid': '마드리드',
            'FC Bayern München': '뮌헨',
            'Borussia Dortmund': '도르트문트',
            'Paris Saint-Germain FC': '파리',
            'Juventus FC': '토리노',
            'Inter Milan': '밀라노',
            'AC Milan': '밀라노'
        };
        return cityMap[teamName] || 'City';
    }

    /**
     * 리그 코드로 국가 추정
     */
    getCountryFromCompetition(code) {
        const countryMap = {
            'PL': '영국',
            'PD': '스페인',
            'BL1': '독일',
            'SA': '이탈리아',
            'FL1': '프랑스'
        };
        return countryMap[code] || 'Europe';
    }

    /**
     * 딜레이 헬퍼
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Node.js 환경에서 사용
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FootballDataService;
}

// 브라우저 환경에서 사용
if (typeof window !== 'undefined') {
    window.FootballDataService = FootballDataService;
}
