/**
 * GoalRoute - API 통합 버전
 * 백엔드 서버와 연동하여 실시간 데이터 사용
 */

// API 베이스 URL (환경에 따라 자동 설정)
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://omacasemiro-production.up.railway.app/api';

// 전역 상태 관리
let selectedMatch = null;
let selectedDepartureCity = null;
let selectedRouteType = null;
let matchesCache = {}; // 날짜별 경기 캐시

// 캘린더 상태
const now = new Date();
let currentYear = now.getFullYear();
let currentMonth = now.getMonth(); // 0-11
console.log(`[Calendar] 초기 날짜 설정: ${currentYear}년 ${currentMonth + 1}월 (${now.toLocaleDateString('ko-KR')})`);
let monthMatchesData = {}; // 해당 월의 모든 경기 데이터

// 정적 빅매치 데이터 (Football-Data API에 없는 경기 보완)
// 2025년 11월 18일 기준 실제 검증된 향후 3-4개월 일정 (WebSearch로 확인)
const staticBigMatches = {
    '2025-11-22': [{
        league: 'Premier League',
        homeTeamKo: '뉴캐슬',
        awayTeamKo: '맨체스터 시티',
        homeLogo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg',
        awayLogo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
        stadium: '세인트 제임스 파크',
        city: '뉴캐슬',
        time: '15:00 GMT',
        homeTeam: 'Newcastle United FC',
        awayTeam: 'Manchester City FC'
    }],
    '2025-11-23': [
        {
            league: 'Premier League',
            homeTeamKo: '아스널',
            awayTeamKo: '토트넘',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
            stadium: '에미레이트 스타디움',
            city: '런던',
            time: '16:30 GMT',
            homeTeam: 'Arsenal FC',
            awayTeam: 'Tottenham Hotspur FC'
        },
        {
            league: 'Serie A',
            homeTeamKo: 'AC 밀란',
            awayTeamKo: '인터 밀란',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg',
            stadium: '산 시로',
            city: '밀라노',
            time: '20:45 CET',
            homeTeam: 'AC Milan',
            awayTeam: 'Inter Milan',
            country: '이탈리아'
        }
    ],
    '2025-11-30': [{
        league: 'Serie A',
        homeTeamKo: 'AC 밀란',
        awayTeamKo: '라치오',
        homeLogo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg',
        awayLogo: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/S.S._Lazio_badge.svg',
        stadium: '산 시로',
        city: '밀라노',
        time: '20:45 CET',
        homeTeam: 'AC Milan',
        awayTeam: 'SS Lazio',
        country: '이탈리아'
    }],
    '2025-12-03': [{
        league: 'Premier League',
        homeTeamKo: '아스널',
        awayTeamKo: '브렌트포드',
        homeLogo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
        awayLogo: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg',
        stadium: '에미레이트 스타디움',
        city: '런던',
        time: '19:30 GMT',
        homeTeam: 'Arsenal FC',
        awayTeam: 'Brentford FC'
    }],
    '2025-12-04': [{
        league: 'Premier League',
        homeTeamKo: '맨체스터 유나이티드',
        awayTeamKo: '웨스트햄',
        homeLogo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
        awayLogo: 'https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg',
        stadium: '올드 트래포드',
        city: '맨체스터',
        time: '20:00 GMT',
        homeTeam: 'Manchester United FC',
        awayTeam: 'West Ham United FC'
    }],
    '2025-12-06': [{
        league: 'Premier League',
        homeTeamKo: '애스턴 빌라',
        awayTeamKo: '아스널',
        homeLogo: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Aston_Villa_FC_crest_%282016%29.svg',
        awayLogo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
        stadium: '빌라 파크',
        city: '버밍엄',
        time: '12:30 GMT',
        homeTeam: 'Aston Villa FC',
        awayTeam: 'Arsenal FC'
    }],
    '2025-12-08': [{
        league: 'Premier League',
        homeTeamKo: '울버햄튼',
        awayTeamKo: '맨체스터 유나이티드',
        homeLogo: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg',
        awayLogo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
        stadium: '몰리뉴 스타디움',
        city: '울버햄튼',
        time: '20:00 GMT',
        homeTeam: 'Wolverhampton Wanderers FC',
        awayTeam: 'Manchester United FC'
    }],
    '2025-12-13': [{
        league: 'Premier League',
        homeTeamKo: '아스널',
        awayTeamKo: '울버햄튼',
        homeLogo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
        awayLogo: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg',
        stadium: '에미레이트 스타디움',
        city: '런던',
        time: '20:00 GMT',
        homeTeam: 'Arsenal FC',
        awayTeam: 'Wolverhampton Wanderers FC'
    }],
    '2025-12-14': [{
        league: 'Premier League',
        homeTeamKo: '크리스탈 팰리스',
        awayTeamKo: '맨체스터 시티',
        homeLogo: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Crystal_Palace_FC_logo_%282022%29.svg',
        awayLogo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
        stadium: '셀허스트 파크',
        city: '런던',
        time: '14:00 GMT',
        homeTeam: 'Crystal Palace FC',
        awayTeam: 'Manchester City FC'
    }],
    '2025-12-20': [{
        league: 'Premier League',
        homeTeamKo: '토트넘',
        awayTeamKo: '리버풀',
        homeLogo: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
        awayLogo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
        stadium: '토트넘 호츠퍼 스타디움',
        city: '런던',
        time: '17:30 GMT',
        homeTeam: 'Tottenham Hotspur FC',
        awayTeam: 'Liverpool FC'
    }],
    '2025-12-21': [{
        league: 'Premier League',
        homeTeamKo: '애스턴 빌라',
        awayTeamKo: '맨체스터 유나이티드',
        homeLogo: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Aston_Villa_FC_crest_%282016%29.svg',
        awayLogo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
        stadium: '빌라 파크',
        city: '버밍엄',
        time: '16:30 GMT',
        homeTeam: 'Aston Villa FC',
        awayTeam: 'Manchester United FC'
    }],
    '2025-12-26': [
        {
            league: 'Premier League',
            homeTeamKo: '맨체스터 시티',
            awayTeamKo: '에버튼',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg',
            stadium: '에티하드 스타디움',
            city: '맨체스터',
            time: '12:30 GMT',
            homeTeam: 'Manchester City FC',
            awayTeam: 'Everton FC'
        },
        {
            league: 'Premier League',
            homeTeamKo: '본머스',
            awayTeamKo: '크리스탈 팰리스',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_%282013%29.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Crystal_Palace_FC_logo_%282022%29.svg',
            stadium: '비탈리티 스타디움',
            city: '본머스',
            time: '15:00 GMT',
            homeTeam: 'AFC Bournemouth',
            awayTeam: 'Crystal Palace FC'
        },
        {
            league: 'Premier League',
            homeTeamKo: '첼시',
            awayTeamKo: '풀럼',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Fulham_FC_%28shield%29.svg',
            stadium: '스탬포드 브리지',
            city: '런던',
            time: '15:00 GMT',
            homeTeam: 'Chelsea FC',
            awayTeam: 'Fulham FC'
        },
        {
            league: 'Premier League',
            homeTeamKo: '뉴캐슬',
            awayTeamKo: '애스턴 빌라',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Aston_Villa_FC_crest_%282016%29.svg',
            stadium: '세인트 제임스 파크',
            city: '뉴캐슬',
            time: '15:00 GMT',
            homeTeam: 'Newcastle United FC',
            awayTeam: 'Aston Villa FC'
        },
        {
            league: 'Premier League',
            homeTeamKo: '노팅엄 포레스트',
            awayTeamKo: '토트넘',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/e/e5/Nottingham_Forest_F.C._logo.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
            stadium: '시티 그라운드',
            city: '노팅엄',
            time: '15:00 GMT',
            homeTeam: 'Nottingham Forest FC',
            awayTeam: 'Tottenham Hotspur FC'
        },
        {
            league: 'Premier League',
            homeTeamKo: '사우샘프턴',
            awayTeamKo: '웨스트햄',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/c/c9/FC_Southampton.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg',
            stadium: '세인트 메리스',
            city: '사우샘프턴',
            time: '15:00 GMT',
            homeTeam: 'Southampton FC',
            awayTeam: 'West Ham United FC'
        },
        {
            league: 'Premier League',
            homeTeamKo: '울버햄튼',
            awayTeamKo: '맨체스터 유나이티드',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
            stadium: '몰리뉴 스타디움',
            city: '울버햄튼',
            time: '17:30 GMT',
            homeTeam: 'Wolverhampton Wanderers FC',
            awayTeam: 'Manchester United FC'
        },
        {
            league: 'Premier League',
            homeTeamKo: '리버풀',
            awayTeamKo: '레스터',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/2/2d/Leicester_City_crest.svg',
            stadium: '안필드',
            city: '리버풀',
            time: '20:00 GMT',
            homeTeam: 'Liverpool FC',
            awayTeam: 'Leicester City FC'
        }
    ],
    '2025-12-27': [
        {
            league: 'Premier League',
            homeTeamKo: '브라이턴',
            awayTeamKo: '브렌트포드',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg',
            stadium: '아멕스 스타디움',
            city: '브라이턴',
            time: '15:00 GMT',
            homeTeam: 'Brighton & Hove Albion FC',
            awayTeam: 'Brentford FC'
        },
        {
            league: 'Premier League',
            homeTeamKo: '맨체스터 유나이티드',
            awayTeamKo: '본머스',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_%282013%29.svg',
            stadium: '올드 트래포드',
            city: '맨체스터',
            time: '15:00 GMT',
            homeTeam: 'Manchester United FC',
            awayTeam: 'AFC Bournemouth'
        },
        {
            league: 'Premier League',
            homeTeamKo: '사우샘프턴',
            awayTeamKo: '웨스트햄',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/c/c9/FC_Southampton.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg',
            stadium: '세인트 메리스',
            city: '사우샘프턴',
            time: '15:00 GMT',
            homeTeam: 'Southampton FC',
            awayTeam: 'West Ham United FC'
        },
        {
            league: 'Premier League',
            homeTeamKo: '아스널',
            awayTeamKo: '입스위치',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/4/43/Ipswich_Town.svg',
            stadium: '에미레이트 스타디움',
            city: '런던',
            time: '15:00 GMT',
            homeTeam: 'Arsenal FC',
            awayTeam: 'Ipswich Town FC'
        },
        {
            league: 'Premier League',
            homeTeamKo: '에버튼',
            awayTeamKo: '노팅엄 포레스트',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/e/e5/Nottingham_Forest_F.C._logo.svg',
            stadium: '굿이슨 파크',
            city: '리버풀',
            time: '15:00 GMT',
            homeTeam: 'Everton FC',
            awayTeam: 'Nottingham Forest FC'
        },
        {
            league: 'Premier League',
            homeTeamKo: '풀럼',
            awayTeamKo: '본머스',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Fulham_FC_%28shield%29.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_%282013%29.svg',
            stadium: '크레이븐 코티지',
            city: '런던',
            time: '15:00 GMT',
            homeTeam: 'Fulham FC',
            awayTeam: 'AFC Bournemouth'
        },
        {
            league: 'Premier League',
            homeTeamKo: '첼시',
            awayTeamKo: '애스턴 빌라',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Aston_Villa_FC_crest_%282016%29.svg',
            stadium: '스탬포드 브리지',
            city: '런던',
            time: '17:30 GMT',
            homeTeam: 'Chelsea FC',
            awayTeam: 'Aston Villa FC'
        }
    ],
    '2025-12-28': [
        {
            league: 'Premier League',
            homeTeamKo: '크리스탈 팰리스',
            awayTeamKo: '사우샘프턴',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Crystal_Palace_FC_logo_%282022%29.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/c/c9/FC_Southampton.svg',
            stadium: '셀허스트 파크',
            city: '런던',
            time: '15:00 GMT',
            homeTeam: 'Crystal Palace FC',
            awayTeam: 'Southampton FC'
        },
        {
            league: 'Premier League',
            homeTeamKo: '맨체스터 시티',
            awayTeamKo: '웨스트햄',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg',
            stadium: '에티하드 스타디움',
            city: '맨체스터',
            time: '15:00 GMT',
            homeTeam: 'Manchester City FC',
            awayTeam: 'West Ham United FC'
        },
        {
            league: 'Premier League',
            homeTeamKo: '뉴캐슬',
            awayTeamKo: '리버풀',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
            stadium: '세인트 제임스 파크',
            city: '뉴캐슬',
            time: '15:00 GMT',
            homeTeam: 'Newcastle United FC',
            awayTeam: 'Liverpool FC'
        },
        {
            league: 'Premier League',
            homeTeamKo: '토트넘',
            awayTeamKo: '울버햄튼',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg',
            stadium: '토트넘 호츠퍼 스타디움',
            city: '런던',
            time: '16:30 GMT',
            homeTeam: 'Tottenham Hotspur FC',
            awayTeam: 'Wolverhampton Wanderers FC'
        }
    ],
    '2025-12-29': [
        {
            league: 'Premier League',
            homeTeamKo: '애스턴 빌라',
            awayTeamKo: '브라이턴',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Aston_Villa_FC_crest_%282016%29.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg',
            stadium: '빌라 파크',
            city: '버밍엄',
            time: '14:00 GMT',
            homeTeam: 'Aston Villa FC',
            awayTeam: 'Brighton & Hove Albion FC'
        },
        {
            league: 'Premier League',
            homeTeamKo: '입스위치',
            awayTeamKo: '첼시',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/4/43/Ipswich_Town.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
            stadium: '포트만 로드',
            city: '입스위치',
            time: '16:30 GMT',
            homeTeam: 'Ipswich Town FC',
            awayTeam: 'Chelsea FC'
        },
        {
            league: 'Premier League',
            homeTeamKo: '레스터',
            awayTeamKo: '맨체스터 시티',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/2/2d/Leicester_City_crest.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
            stadium: '킹 파워 스타디움',
            city: '레스터',
            time: '14:00 GMT',
            homeTeam: 'Leicester City FC',
            awayTeam: 'Manchester City FC'
        }
    ],
    '2025-12-30': [{
        league: 'Premier League',
        homeTeamKo: '아스널',
        awayTeamKo: '애스턴 빌라',
        homeLogo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
        awayLogo: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Aston_Villa_FC_crest_%282016%29.svg',
        stadium: '에미레이트 스타디움',
        city: '런던',
        time: '20:00 GMT',
        homeTeam: 'Arsenal FC',
        awayTeam: 'Aston Villa FC'
    }],
    '2026-01-01': [{
        league: 'Premier League',
        homeTeamKo: '리버풀',
        awayTeamKo: '리즈 유나이티드',
        homeLogo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
        awayLogo: 'https://upload.wikimedia.org/wikipedia/en/5/54/Leeds_United_F.C._logo.svg',
        stadium: '안필드',
        city: '리버풀',
        time: '17:30 GMT',
        homeTeam: 'Liverpool FC',
        awayTeam: 'Leeds United FC'
    }],
    '2026-01-04': [{
        league: 'Premier League',
        homeTeamKo: '맨체스터 시티',
        awayTeamKo: '첼시',
        homeLogo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
        awayLogo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
        stadium: '에티하드 스타디움',
        city: '맨체스터',
        time: '17:30 GMT',
        homeTeam: 'Manchester City FC',
        awayTeam: 'Chelsea FC'
    }],
    '2026-01-08': [{
        league: 'Premier League',
        homeTeamKo: '아스널',
        awayTeamKo: '리버풀',
        homeLogo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
        awayLogo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
        stadium: '에미레이트 스타디움',
        city: '런던',
        time: '20:00 GMT',
        homeTeam: 'Arsenal FC',
        awayTeam: 'Liverpool FC'
    }],
    '2026-01-17': [{
        league: 'Premier League',
        homeTeamKo: '맨체스터 유나이티드',
        awayTeamKo: '맨체스터 시티',
        homeLogo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
        awayLogo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
        stadium: '올드 트래포드',
        city: '맨체스터',
        time: '16:30 GMT',
        homeTeam: 'Manchester United FC',
        awayTeam: 'Manchester City FC'
    }],
    '2026-01-24': [{
        league: 'Premier League',
        homeTeamKo: '아스널',
        awayTeamKo: '맨체스터 유나이티드',
        homeLogo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
        awayLogo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
        stadium: '에미레이트 스타디움',
        city: '런던',
        time: '17:30 GMT',
        homeTeam: 'Arsenal FC',
        awayTeam: 'Manchester United FC'
    }],
    '2026-01-31': [{
        league: 'Premier League',
        homeTeamKo: '토트넘',
        awayTeamKo: '맨체스터 시티',
        homeLogo: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
        awayLogo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
        stadium: '토트넘 호츠퍼 스타디움',
        city: '런던',
        time: '16:30 GMT',
        homeTeam: 'Tottenham Hotspur FC',
        awayTeam: 'Manchester City FC'
    }],
    '2026-02-07': [
        {
            league: 'Premier League',
            homeTeamKo: '리버풀',
            awayTeamKo: '맨체스터 시티',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
            stadium: '안필드',
            city: '리버풀',
            time: '16:30 GMT',
            homeTeam: 'Liverpool FC',
            awayTeam: 'Manchester City FC'
        },
        {
            league: 'Premier League',
            homeTeamKo: '맨체스터 유나이티드',
            awayTeamKo: '토트넘',
            homeLogo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
            awayLogo: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
            stadium: '올드 트래포드',
            city: '맨체스터',
            time: '14:00 GMT',
            homeTeam: 'Manchester United FC',
            awayTeam: 'Tottenham Hotspur FC'
        }
    ],
    '2026-02-15': [{
        league: 'Serie A',
        homeTeamKo: '인터 밀란',
        awayTeamKo: '유벤투스',
        homeLogo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg',
        awayLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Juventus_FC_-_pictogram_black_%28Italy%2C_2017%29.svg',
        stadium: '산 시로',
        city: '밀라노',
        time: '20:45 CET',
        homeTeam: 'Inter Milan',
        awayTeam: 'Juventus FC',
        country: '이탈리아'
    }],
    '2026-02-21': [{
        league: 'Premier League',
        homeTeamKo: '토트넘',
        awayTeamKo: '아스널',
        homeLogo: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
        awayLogo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
        stadium: '토트넘 호츠퍼 스타디움',
        city: '런던',
        time: '16:30 GMT',
        homeTeam: 'Tottenham Hotspur FC',
        awayTeam: 'Arsenal FC'
    }]
};

// 로딩 상태 표시
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="text-center text-blue-600 py-8">⏳ 데이터 로딩 중...</div>';
    }
}

function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '';
    }
}

// 에러 메시지 표시
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="text-center text-red-600 py-8">
                <p class="font-bold">❌ 오류 발생</p>
                <p class="text-sm mt-2">${message}</p>
            </div>
        `;
    }
}

/**
 * API: 전체 캐시 데이터 미리 로드 (페이지 초기화 시 1회 호출)
 */
async function preloadAllMatches() {
    try {
        console.log('[PRELOAD] 전체 경기 데이터 로드 시작...');
        const startTime = performance.now();

        const response = await fetch(`${API_BASE_URL}/matches/all`);

        if (!response.ok) {
            throw new Error(`API 오류: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.matches) {
            // 전체 캐시 저장
            Object.assign(matchesCache, data.matches);

            const endTime = performance.now();
            const loadTime = ((endTime - startTime) / 1000).toFixed(2);
            const totalMatches = Object.values(data.matches).reduce((sum, matches) => sum + matches.length, 0);

            console.log(`[PRELOAD] ✅ 완료 (${loadTime}초)`);
            console.log(`[PRELOAD] 📊 ${Object.keys(data.matches).length}일치 / ${totalMatches}경기 로드`);
            console.log(`[PRELOAD] 🕐 최종 업데이트: ${data.lastUpdate || 'N/A'}`);

            return true;
        }

        console.warn('[PRELOAD] 캐시 데이터 없음');
        return false;
    } catch (error) {
        console.error('[PRELOAD] 전체 데이터 로드 실패:', error);
        return false;
    }
}

/**
 * API: 경기 일정 조회 (로컬 캐시 우선, fallback으로 개별 API 호출)
 */
async function fetchMatches(date) {
    // 1. 로컬 캐시 확인 (preload된 데이터)
    if (matchesCache[date]) {
        console.log(`[CACHE] 캐시된 경기 데이터 사용: ${date}`);
        return matchesCache[date];
    }

    // 2. 캐시 없으면 개별 API 호출 (fallback)
    try {
        console.log(`[API] 경기 일정 조회: ${date}`);
        const response = await fetch(`${API_BASE_URL}/matches?date=${date}`);

        if (!response.ok) {
            throw new Error(`API 오류: ${response.status}`);
        }

        const matches = await response.json();

        // 캐시 저장
        matchesCache[date] = matches;

        return matches;
    } catch (error) {
        console.error('[ERROR] 경기 조회 실패:', error);
        // 빈 배열 반환 (에러 처리)
        return [];
    }
}

/**
 * API: 환율 조회
 */
async function fetchExchangeRates() {
    try {
        console.log('[API] 환율 조회');
        const response = await fetch(`${API_BASE_URL}/exchange-rate`);

        if (!response.ok) {
            throw new Error(`API 오류: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('[ERROR] 환율 조회 실패:', error);
        // Fallback 환율 데이터
        return [
            { currency: 'GBP', krwTo1Unit: 1914 },
            { currency: 'EUR', krwTo1Unit: 1691 },
            { currency: 'USD', krwTo1Unit: 1454 }
        ];
    }
}

/**
 * API: 항공권 검색
 */
async function searchFlights(origin, destination, departureDate, returnDate) {
    try {
        console.log(`[API] 항공권 검색: ${origin} → ${destination}`);
        const response = await fetch(`${API_BASE_URL}/flights/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                origin,
                destination,
                departureDate,
                returnDate,
                adults: 1
            })
        });

        if (!response.ok) {
            throw new Error(`API 오류: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('[ERROR] 항공권 검색 실패:', error);
        // Fallback 데이터 반환
        return [
            { airline: '일반항공 (1회 경유)', price: 910000, duration: '15-18시간', stops: 1 },
            { airline: '저가항공 (1회 경유)', price: 715000, duration: '17-20시간', stops: 1 },
            { airline: '대한항공/아시아나 (직항)', price: 1300000, duration: '11-13시간', stops: 0 }
        ];
    }
}

/**
 * API: 숙소 검색
 */
async function searchHotels(cityCode, checkInDate, checkOutDate) {
    try {
        console.log(`[API] 숙소 검색: ${cityCode}`);
        const response = await fetch(`${API_BASE_URL}/hotels/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cityCode,
                checkInDate,
                checkOutDate,
                adults: 1
            })
        });

        if (!response.ok) {
            throw new Error(`API 오류: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('[ERROR] 숙소 검색 실패:', error);
        // Fallback 데이터 반환
        return [
            { name: '호스텔 (도미토리)', price: 36000, rating: 7.5, currency: 'KRW' },
            { name: '호스텔 (개인실)', price: 60000, rating: 7.8, currency: 'KRW' },
            { name: '2성급 호텔', price: 84000, rating: 8.0, currency: 'KRW' },
            { name: '3성급 호텔', price: 120000, rating: 8.5, currency: 'KRW' }
        ];
    }
}

/**
 * API: 티켓 가격 조회
 */
async function fetchTicketPrice(league, homeTeam, awayTeam, tier = 'budget') {
    try {
        console.log(`[API] 티켓 가격 조회: ${homeTeam} vs ${awayTeam}`);
        const response = await fetch(
            `${API_BASE_URL}/ticket-price?league=${encodeURIComponent(league)}&homeTeam=${encodeURIComponent(homeTeam)}&awayTeam=${encodeURIComponent(awayTeam)}&tier=${tier}`,
            { timeout: 5000 } // 5초 타임아웃
        );

        if (!response.ok) {
            console.warn(`[API] 티켓 가격 API 오류 (${response.status}), fallback 사용`);
            throw new Error(`API 오류: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.warn('[FALLBACK] 티켓 가격 조회 실패, 기본값 사용:', error.message);
        // Fallback 티켓 가격
        return { price: tier === 'budget' ? 280000 : 450000 };
    }
}

// ============================================================
// UI 이벤트 핸들러
// ============================================================

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', async function() {
    console.log('[GoalRoute] API 버전 시작');

    // plan-route.html 페이지인 경우 캘린더 렌더링
    // 주의: renderCalendar()는 preload 완료 후 initPageData()에서 호출됩니다

    // URL 쿼리 파라미터에서 경기 정보 확인
    const urlParams = new URLSearchParams(window.location.search);
    const matchParam = urlParams.get('match');

    if (matchParam) {
        try {
            // 빅매치에서 전달된 경기 정보
            const match = JSON.parse(decodeURIComponent(matchParam));
            selectedMatch = match;
            selectedDepartureCity = 'ICN'; // 출발 공항 고정 (인천국제공항)

            console.log('[GoalRoute] 빅매치 선택:', match);

            // Step 1, 2 스킵하고 바로 Step 3으로 이동
            goToStep(3);
        } catch (error) {
            console.error('[ERROR] 경기 정보 파싱 실패:', error);
            // 에러 시 일반 플로우로 진행
            setupNormalFlow();
        }
    } else {
        // 일반 플로우 (날짜 선택부터)
        setupNormalFlow();
    }
});

// 일반 플로우 설정
function setupNormalFlow() {
    // 출발 공항은 ICN 고정
    selectedDepartureCity = 'ICN';

    // 출발지 선택 UI는 숨김 처리 (Step 2 제거)
    const step2 = document.getElementById('step2');
    if (step2) {
        step2.style.display = 'none';
    }
}

// 특정 날짜의 경기 표시
async function showMatchesForDate(date) {
    const matchList = document.getElementById('matchList');
    const matchCards = document.getElementById('matchCards');

    if (!matchList || !matchCards) {
        console.error('[ERROR] matchList 또는 matchCards 요소를 찾을 수 없습니다.');
        return;
    }

    // 로딩 표시
    showLoading('matchCards');
    matchList.classList.remove('hidden');

    try {
        // 캐시된 데이터 먼저 확인
        let matches = monthMatchesData[date] || matchesCache[date];

        // 캐시에 없으면 API에서 가져오기
        if (!matches) {
            matches = await fetchMatches(date);
        }

        if (!matches || matches.length === 0) {
            matchCards.innerHTML = '<div class="text-center text-gray-600 py-8">해당 날짜에 경기가 없습니다.</div>';
            return;
        }

        // 경기 카드 생성
        matchCards.innerHTML = matches.map(match => `
            <div class="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-500 transition cursor-pointer"
                 onclick='selectMatch(${JSON.stringify(match).replace(/'/g, "&apos;")})'>
                <div class="flex items-center justify-between mb-3">
                    <span class="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">${match.league}</span>
                    <span class="text-gray-600 text-sm">⏰ ${match.time}</span>
                </div>
                <div class="flex items-center justify-between mb-3">
                    <div class="text-center flex-1">
                        <img src="${match.homeLogo}" alt="${match.homeTeamKo}" class="w-10 h-10 mx-auto mb-1" onerror="this.src='https://via.placeholder.com/40'">
                        <p class="font-bold text-sm">${match.homeTeamKo}</p>
                    </div>
                    <div class="text-xl font-black text-gray-400">VS</div>
                    <div class="text-center flex-1">
                        <img src="${match.awayLogo}" alt="${match.awayTeamKo}" class="w-10 h-10 mx-auto mb-1" onerror="this.src='https://via.placeholder.com/40'">
                        <p class="font-bold text-sm">${match.awayTeamKo}</p>
                    </div>
                </div>
                <div class="text-center text-gray-600 text-sm">
                    📍 ${match.stadium}, ${match.city}
                </div>
                <button class="mt-3 w-full bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700">
                    이 경기 선택하기
                </button>
            </div>
        `).join('');

    } catch (error) {
        showError('matchCards', '경기 일정을 불러올 수 없습니다. 나중에 다시 시도해주세요.');
    }
}

// 경기 선택
function selectMatch(match) {
    selectedMatch = match;
    selectedDepartureCity = 'ICN'; // 출발 공항 고정 (인천국제공항)

    // Step 2 (출발지 선택) 스킵하고 바로 Step 3 (루트 타입 선택)으로 이동
    goToStep(3);

    // 선택한 경기 정보 표시
    const selectedMatchEl = document.getElementById('selectedMatch');
    const selectedMatchDetailsEl = document.getElementById('selectedMatchDetails');

    if (selectedMatchEl) {
        selectedMatchEl.textContent = `${match.homeTeamKo} vs ${match.awayTeamKo}`;
    }

    if (selectedMatchDetailsEl) {
        selectedMatchDetailsEl.textContent = `${match.stadium}, ${match.city} | ${match.time}`;
    }
}

// 코스 유형 선택
function selectRouteType(type) {
    selectedRouteType = type;

    // 라디오 버튼 선택
    const radioButton = document.querySelector(`input[value="${type}"]`);
    if (radioButton) {
        radioButton.checked = true;
    }

    // 버튼 활성화
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.disabled = false;
    }
}

// 견적 계산
async function calculateEstimate() {
    if (!selectedMatch || !selectedDepartureCity || !selectedRouteType) {
        alert('모든 정보를 선택해주세요.');
        return;
    }

    // Step 4로 이동
    goToStep(4);

    // 로딩 표시
    showLoading('budgetRoute');
    showLoading('premiumRoute');

    try {
        // 여행 날짜 계산 (경기 날짜 기준 전 3일, 후 4일 = 6박8일)
        // selectedMatch.date는 ISO 형식 (2025-12-15T15:00:00Z) 또는 'MM/DD' 형식
        const parseMatchDate = (dateStr) => {
            // ISO 형식인 경우 (YYYY-MM-DD...)
            if (dateStr.includes('T') || dateStr.includes('-')) {
                return new Date(dateStr);
            }

            // 'MM/DD' 형식인 경우
            const [month, day] = dateStr.split('/').map(Number);
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();

            // 해당 날짜를 올해로 가정
            let matchDate = new Date(currentYear, month - 1, day);

            // 만약 경기 날짜가 이미 지났다면 내년으로 설정
            if (matchDate < currentDate) {
                matchDate = new Date(currentYear + 1, month - 1, day);
            }

            return matchDate;
        };

        const matchDate = parseMatchDate(selectedMatch.date);
        const departureDate = new Date(matchDate);
        departureDate.setDate(departureDate.getDate() - 3); // 경기 3일 전 출발
        const returnDate = new Date(matchDate);
        returnDate.setDate(returnDate.getDate() + 4); // 경기 4일 후 귀국 (총 8일)

        // 날짜를 전역 변수로 저장 (URL 생성에 사용)
        window.travelDates = {
            departure: departureDate,
            return: returnDate,
            departureStr: departureDate.toISOString().split('T')[0],
            returnStr: returnDate.toISOString().split('T')[0],
            nights: 7 // 기본 6박8일
        };

        // 병렬로 데이터 조회
        const [flights, hotels, budgetTicket, premiumTicket, exchangeRates] = await Promise.all([
            searchFlights(
                selectedDepartureCity,
                getAirportCode(selectedMatch.city),
                departureDate.toISOString().split('T')[0],
                returnDate.toISOString().split('T')[0]
            ),
            searchHotels(
                getCityCode(selectedMatch.city),
                departureDate.toISOString().split('T')[0],
                returnDate.toISOString().split('T')[0]
            ),
            fetchTicketPrice(selectedMatch.league, selectedMatch.homeTeam, selectedMatch.awayTeam, 'budget'),
            fetchTicketPrice(selectedMatch.league, selectedMatch.homeTeam, selectedMatch.awayTeam, 'premium'),
            fetchExchangeRates()
        ]);

        // 환율 정보 추출
        const gbpRate = exchangeRates.find(rate => rate.currency === 'GBP')?.krwTo1Unit || 1914;
        const eurRate = exchangeRates.find(rate => rate.currency === 'EUR')?.krwTo1Unit || 1691;
        const usdRate = exchangeRates.find(rate => rate.currency === 'USD')?.krwTo1Unit || 1454;

        // 호텔 가격을 KRW로 환산하는 함수
        const convertToKRW = (price, currency) => {
            switch(currency) {
                case 'GBP': return Math.round(price * gbpRate);
                case 'EUR': return Math.round(price * eurRate);
                case 'USD': return Math.round(price * usdRate);
                default: return price;
            }
        };

        // 호텔 가격 환산 및 가격순 정렬
        const hotelsWithKRW = hotels
            .map(hotel => ({
                ...hotel,
                price: convertToKRW(hotel.price, hotel.currency),
                originalPrice: hotel.price,
                originalCurrency: hotel.currency
            }))
            .sort((a, b) => a.price - b.price); // 가격 낮은 순으로 정렬

        console.log('[Hotel Data] 총 호텔 수:', hotelsWithKRW.length);
        if (hotelsWithKRW.length > 0) {
            console.log('[Hotel Data] 최저가 호텔:', hotelsWithKRW[0]);
            console.log('[Hotel Data] 최고가 호텔:', hotelsWithKRW[hotelsWithKRW.length - 1]);
            console.log('[Hotel Data] 전체 가격 범위:', hotelsWithKRW.map(h => Math.round(h.price)));
        }

        // 가격 계산 (숙박일수 = 총 일수 - 1)
        const nights = Math.floor((returnDate - departureDate) / (1000 * 60 * 60 * 24));
        console.log('[Date Calculation] departureDate:', departureDate, 'returnDate:', returnDate, 'nights:', nights);

        // 항공편 선택 로직
        console.log('[Flight Data] 총 항공편 수:', flights.length);

        // Budget: 경유 항공편 중 최저가 (stops >= 1)
        const connectingFlights = flights.filter(f =>
            f.outbound && f.outbound.stops >= 1
        );
        const budgetFlight = connectingFlights.length > 0
            ? connectingFlights[0].price
            : (flights.length > 0 ? flights[0].price : 650000);

        console.log('[Budget Flight] 경유 항공편 수:', connectingFlights.length, '선택 가격:', budgetFlight);

        // Premium: 직항 항공편 중 최저가 (stops === 0)
        const directFlights = flights.filter(f =>
            f.outbound && f.outbound.stops === 0 &&
            f.inbound && f.inbound.stops === 0
        );
        const premiumFlight = directFlights.length > 0
            ? directFlights[0].price
            : (flights.length > 0 ? flights[flights.length - 1].price : 1200000);

        console.log('[Premium Flight] 직항 항공편 수:', directFlights.length, '선택 가격:', premiumFlight);

        // API에서 반환하는 가격은 이미 전체 숙박 기간의 총 가격임
        const budgetHotelTotal = hotelsWithKRW.length > 0 ? hotelsWithKRW[0].price : 560000; // 최저가 숙소

        // Premium 호텔: 최저가 기준으로 1.5~2배 정도로 가정 (더 나은 위치/시설)
        const premiumHotelTotal = (() => {
            if (hotelsWithKRW.length === 0) return 1400000; // 기본값

            const budgetPrice = hotelsWithKRW[0].price;
            console.log('[Premium Hotel] 총 호텔 수:', hotelsWithKRW.length);
            console.log('[Premium Hotel] 최저가:', budgetPrice);

            // 최저가의 1.5~2배 범위에서 호텔 찾기
            const minPrice = budgetPrice * 1.5;
            const maxPrice = budgetPrice * 2.0;

            const suitableHotels = hotelsWithKRW.filter(h =>
                h.price >= minPrice && h.price <= maxPrice
            );

            if (suitableHotels.length > 0) {
                // 적합한 가격대가 있으면 그 중 중간 호텔 선택
                const midIndex = Math.floor(suitableHotels.length / 2);
                console.log('[Premium Hotel] 적합한 호텔 수:', suitableHotels.length, '선택:', suitableHotels[midIndex]);
                return suitableHotels[midIndex].price;
            }

            // 적합한 가격대가 없으면 최저가의 1.7배로 추정 (가성비 대비 20~70% 더 비쌈)
            const estimatedPrice = Math.round(budgetPrice * 1.7);
            console.log('[Premium Hotel] 적합한 호텔 없음, 최저가의 1.7배로 추정:', estimatedPrice);
            return estimatedPrice;
        })();

        const budgetHotelPerNight = Math.round(budgetHotelTotal / nights); // 1박 평균 가격
        const premiumHotelPerNight = Math.round(premiumHotelTotal / nights); // 1박 평균 가격
        const localTransport = 100000; // 일주일 기준 교통비

        // Budget 견적 표시
        displayEstimate('budget', {
            flight: budgetFlight,
            hotel: budgetHotelTotal,
            hotelPerNight: budgetHotelPerNight,
            ticket: budgetTicket.price,
            transport: localTransport,
            flights: flights.slice(0, 3), // 상위 3개 항공편
            hotels: hotelsWithKRW.slice(0, 3), // 가격 낮은 순 상위 3개
            nights: nights
        });

        // Premium 견적 표시
        displayEstimate('premium', {
            flight: premiumFlight,
            hotel: premiumHotelTotal,
            hotelPerNight: premiumHotelPerNight,
            ticket: premiumTicket.price,
            transport: localTransport,
            flights: flights.slice(-3).reverse(), // 상위 3개 고가 항공편
            hotels: hotelsWithKRW.slice(-3).reverse(), // 가격 높은 순 상위 3개
            nights: nights
        });

        // 선택한 탭 표시
        showTab(selectedRouteType);

    } catch (error) {
        console.error('[ERROR] 견적 계산 실패:', error);
        console.error('[ERROR] Stack:', error.stack);

        // 더 자세한 에러 메시지 표시
        const errorMessage = `견적 계산 중 오류가 발생했습니다.<br/>
            <span class="text-xs">에러: ${error.message}</span><br/>
            <span class="text-xs">Railway API가 응답하지 않으면 기본 견적으로 표시됩니다.</span>`;

        showError('budgetRoute', errorMessage);
        showError('premiumRoute', errorMessage);
    }
}

// 견적 표시
function displayEstimate(type, prices) {
    const total = prices.flight + prices.hotel + prices.ticket + prices.transport;
    const elementId = type === 'budget' ? 'budgetRoute' : 'premiumRoute';
    const element = document.getElementById(elementId);

    if (!element) return;

    // URL 생성에 필요한 정보
    const origin = selectedDepartureCity || 'ICN';
    const destination = getAirportCode(selectedMatch.city);
    const cityId = getAgodaCityId(selectedMatch.city);
    const cityName = selectedMatch.city; // 도시 이름 (한글)
    const dates = window.travelDates || {
        departureStr: '2024-12-15',
        returnStr: '2024-12-18',
        departure: new Date('2024-12-15'),
        return: new Date('2024-12-18')
    };

    // Skyscanner 검색 URL (문자열 형식 날짜 사용하여 시간대 문제 방지)
    // Premium 버전은 직항만 검색
    const skyscannerURL = generateSkyscannerURL(origin, destination, dates.departureStr, dates.returnStr, type);

    // Agoda 검색 URL (routeType에 따라 정렬 기준 다름)
    const agodaURL = generateAgodaURL(cityId, dates.departureStr, dates.returnStr, type, cityName);

    // 항공편 리스트 HTML 생성 - Skyscanner 직접 검색 안내
    const flightListHTML = `
        <div class="border-2 border-blue-200 bg-blue-50 rounded-lg p-6">
            <div class="text-center mb-4">
                <p class="text-lg font-bold text-gray-800 mb-2">✈️ 항공권 최저가 검색</p>
                <p class="text-sm text-gray-600 mb-4">
                    ${origin} ⇄ ${destination}<br/>
                    ${dates.departureStr} ~ ${dates.returnStr} (${prices.nights || 7}박 ${(prices.nights || 7) + 1}일)
                </p>
                <p class="text-xs text-gray-500 mb-4">
                    💡 예상 가격: ₩${prices.flight.toLocaleString()} (참고용)<br/>
                    실시간 최저가는 Skyscanner에서 직접 확인하세요
                </p>
            </div>
            <a href="${skyscannerURL}" target="_blank" class="block w-full text-center bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition">
                Skyscanner에서 실시간 최저가 검색 →
            </a>
        </div>
    `;

    // 숙소 리스트 HTML 생성 - Agoda 직접 검색 안내
    const hotelSortInfo = type === 'budget'
        ? '낮은 가격순으로 정렬됩니다 (호스텔, 게스트하우스 등 가성비 숙소 우선)'
        : '높은 가격순으로 정렬됩니다 (고급 호텔 우선)';

    const hotelListHTML = `
        <div class="border-2 border-red-200 bg-red-50 rounded-lg p-6">
            <div class="text-center mb-4">
                <p class="text-lg font-bold text-gray-800 mb-2">🏨 숙소 최저가 검색</p>
                <p class="text-sm text-gray-600 mb-4">
                    ${selectedMatch.city}, ${selectedMatch.country}<br/>
                    ${dates.departureStr} ~ ${dates.returnStr} (${prices.nights || 7}박)
                </p>
                <p class="text-xs text-gray-500 mb-4">
                    💡 예상 가격: ₩${prices.hotelPerNight.toLocaleString()}/박 (총 ₩${prices.hotel.toLocaleString()})<br/>
                    실시간 최저가는 Agoda에서 직접 확인하세요<br/>
                    <span class="font-semibold text-red-600">${hotelSortInfo}</span>
                </p>
            </div>
            <a href="${agodaURL}" target="_blank" class="block w-full text-center bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition">
                Agoda에서 실시간 최저가 검색 →
            </a>
        </div>
    `;

    element.innerHTML = `
        <div class="space-y-6">
            <!-- 총 예상 금액 -->
            <div class="bg-gradient-to-r ${type === 'budget' ? 'from-green-500 to-green-600' : 'from-purple-500 to-purple-600'} text-white p-6 rounded-lg">
                <div class="text-center">
                    <p class="text-sm opacity-90">총 예상 금액</p>
                    <p class="text-4xl font-black mt-2">₩${total.toLocaleString()}</p>
                </div>
            </div>

            <!-- 항목별 요약 -->
            <!-- 여행 기간 정보 -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p class="text-sm text-blue-700 font-medium">여행 기간</p>
                <p class="text-2xl font-black text-blue-900 mt-1">${prices.nights || 7}박 ${(prices.nights || 7) + 1}일</p>
                <p class="text-xs text-blue-600 mt-1">${dates.departureStr} ~ ${dates.returnStr}</p>
            </div>

            <!-- 항목별 요약 -->
            <div class="space-y-3">
                <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span class="text-gray-700">✈️ 항공권 (왕복)</span>
                    <span class="font-bold">₩${prices.flight.toLocaleString()}</span>
                </div>
                <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                        <span class="text-gray-700">🏨 숙소 (${prices.nights || 7}박)</span>
                        <p class="text-xs text-gray-500 mt-1">1박 평균 ₩${(prices.hotelPerNight || Math.floor(prices.hotel / (prices.nights || 7))).toLocaleString()}</p>
                    </div>
                    <span class="font-bold">₩${prices.hotel.toLocaleString()}</span>
                </div>
                <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span class="text-gray-700">🎫 경기 티켓</span>
                    <span class="font-bold">₩${prices.ticket.toLocaleString()}</span>
                </div>
                <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span class="text-gray-700">🚌 현지 교통</span>
                    <span class="font-bold">₩${prices.transport.toLocaleString()}</span>
                </div>
            </div>

            <!-- 추천 항공편 -->
            <div class="mt-6">
                <h3 class="text-lg font-bold mb-3 flex items-center">
                    ✈️ 추천 항공편
                    <span class="ml-2 text-sm text-gray-500 font-normal">(최저가 순)</span>
                </h3>
                <div class="space-y-3">
                    ${flightListHTML}
                </div>
            </div>

            <!-- 추천 숙소 -->
            <div class="mt-6">
                <h3 class="text-lg font-bold mb-3 flex items-center">
                    🏨 추천 숙소
                    <span class="ml-2 text-sm text-gray-500 font-normal">(가성비 순)</span>
                </h3>
                <div class="space-y-3">
                    ${hotelListHTML}
                </div>
            </div>

            <div class="text-sm text-gray-500 text-center mt-6">
                * 실제 가격은 예약 시점에 따라 변동될 수 있습니다.
            </div>
        </div>
    `;
}

// 탭 전환 (Step 4)
function showTab(type) {
    const budgetTab = document.getElementById('budgetTab');
    const premiumTab = document.getElementById('premiumTab');
    const budgetRoute = document.getElementById('budgetRoute');
    const premiumRoute = document.getElementById('premiumRoute');

    if (!budgetTab || !premiumTab || !budgetRoute || !premiumRoute) return;

    if (type === 'budget') {
        budgetTab.classList.remove('tab-inactive');
        budgetTab.classList.add('tab-active');
        premiumTab.classList.remove('tab-active');
        premiumTab.classList.add('tab-inactive');

        budgetRoute.classList.remove('hidden');
        premiumRoute.classList.add('hidden');
    } else {
        premiumTab.classList.remove('tab-inactive');
        premiumTab.classList.add('tab-active');
        budgetTab.classList.remove('tab-active');
        budgetTab.classList.add('tab-inactive');

        premiumRoute.classList.remove('hidden');
        budgetRoute.classList.add('hidden');
    }
}

// 단계 이동
function goToStep(stepNumber) {
    // 모든 단계 숨기기
    for (let i = 1; i <= 4; i++) {
        const step = document.getElementById(`step${i}`);
        if (step) {
            step.classList.add('hidden');
        }
    }

    // 선택한 단계 표시
    const currentStep = document.getElementById(`step${stepNumber}`);
    if (currentStep) {
        currentStep.classList.remove('hidden');
    }

    // 진행 표시 업데이트
    updateProgressIndicators(stepNumber);

    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Step 4로 이동 시 선택한 유형의 탭 표시
    if (stepNumber === 4 && selectedRouteType) {
        setTimeout(() => {
            showTab(selectedRouteType);
        }, 100);
    }
}

// 진행 표시 업데이트
function updateProgressIndicators(currentStep) {
    for (let i = 1; i <= 4; i++) {
        const indicator = document.getElementById(`step${i}-indicator`);
        if (!indicator) continue;

        if (i < currentStep) {
            // 완료된 단계
            indicator.classList.remove('step-active', 'step-inactive');
            indicator.classList.add('step-completed');
        } else if (i === currentStep) {
            // 현재 단계
            indicator.classList.remove('step-completed', 'step-inactive');
            indicator.classList.add('step-active');
        } else {
            // 미완료 단계
            indicator.classList.remove('step-active', 'step-completed');
            indicator.classList.add('step-inactive');
        }
    }
}

// 헬퍼 함수: 도시 → 공항 코드
function getAirportCode(city) {
    const airportMap = {
        '런던': 'LHR',
        '리버풀': 'LPL',
        '맨체스터': 'MAN',
        '마드리드': 'MAD',
        '바르셀로나': 'BCN',
        '뮌헨': 'MUC',
        '밀라노': 'MXP',
        '토리노': 'TRN',
        '파리': 'CDG'
    };
    return airportMap[city] || 'LHR';
}

// 헬퍼 함수: 도시 → 도시 코드
function getCityCode(city) {
    const cityMap = {
        '런던': 'LON',
        '리버풀': 'LPL',
        '맨체스터': 'MAN',
        '마드리드': 'MAD',
        '바르셀로나': 'BCN',
        '뮌헨': 'MUC',
        '밀라노': 'MIL',
        '토리노': 'TRN',
        '파리': 'PAR'
    };
    return cityMap[city] || 'LON';
}

// 헬퍼 함수: 도시 → Agoda 도시 ID
function getAgodaCityId(city) {
    const cityIdMap = {
        '런던': '233',        // London, UK (verified)
        '리버풀': '2817',     // Liverpool, UK
        '맨체스터': '10478',  // Manchester, UK
        '뉴캐슬': '13325',    // Newcastle, UK
        '버밍엄': '2818',     // Birmingham, UK
        '브라이턴': '7692',   // Brighton, UK
        '사우샘프턴': '8307', // Southampton, UK
        '노팅엄': '7691',     // Nottingham, UK
        '울버햄튼': '15320',  // Wolverhampton, UK
        '레스터': '6543',     // Leicester, UK
        '입스위치': '30295',  // Ipswich, UK
        '마드리드': '5531',   // Madrid, Spain (verified)
        '바르셀로나': '39',   // Barcelona, Spain
        '발렌시아': '18110',  // Valencia, Spain
        '세비야': '1581',     // Seville, Spain
        '뮌헨': '6199',       // Munich, Germany
        '도르트문트': '6083', // Dortmund, Germany
        '베를린': '1854',     // Berlin, Germany
        '밀라노': '4420',     // Milan, Italy
        '밀라노': '4420',     // Milano, Italy
        '로마': '1370',       // Rome, Italy
        '토리노': '13189',    // Turin, Italy
        '나폴리': '1944',     // Naples, Italy
        '파리': '1836',       // Paris, France
        '리옹': '10257',      // Lyon, France
        '마르세유': '14568'   // Marseille, France
    };
    return cityIdMap[city] || '233'; // 기본값: 런던
}

// Skyscanner 검색 URL 생성
function generateSkyscannerURL(origin, destination, departureDate, returnDate, routeType = 'budget') {
    // 날짜를 YYMMDD 형식으로 변환
    // departureDate, returnDate는 'YYYY-MM-DD' 형식의 문자열
    const formatDate = (dateStr) => {
        // YYYY-MM-DD 형식을 YYMMDD로 변환
        const [year, month, day] = dateStr.split('-');
        const yy = year.slice(-2);
        return yy + month + day;
    };

    const depDate = formatDate(departureDate);
    const retDate = formatDate(returnDate);

    // Premium 버전은 직항만 검색 (preferdirects=true)
    const directOnly = routeType === 'premium' ? 'true' : 'false';

    return `https://www.skyscanner.co.kr/transport/flights/${origin.toLowerCase()}/${destination.toLowerCase()}/${depDate}/${retDate}/?adultsv2=1&cabinclass=economy&children=0&inboundaltsenabled=false&outboundaltsenabled=false&preferdirects=${directOnly}&ref=home&rtn=1`;
}

// Agoda 검색 URL 생성
function generateAgodaURL(cityId, checkIn, checkOut, routeType = 'budget', cityName = '') {
    // 도시 이름을 URL 인코딩
    const encodedCityName = encodeURIComponent(cityName);

    // 기본 파라미터 (단순화 - cid, ds 제거)
    let url = `https://www.agoda.com/ko-kr/search?city=${cityId}&checkIn=${checkIn}&checkOut=${checkOut}&rooms=1&adults=1&children=0`;

    if (routeType === 'budget') {
        // 가성비 버전: 낮은 가격순 정렬 (호스텔, 게스트하우스 포함)
        url += `&sort=priceLowToHigh`;
    } else {
        // 프리미엄 버전: 3-4성급 호텔, 평점 8점 이상
        url += `&sort=reviewScore`;     // 평점 높은 순
        url += `&star=3,4`;              // 3-4성급
    }

    return url;
}

// URL 파라미터에서 경기 정보 가져오기
function getMatchFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get('match');

    if (matchId) {
        // URL에 경기 ID가 있으면 해당 경기 자동 선택 로직
        console.log('[URL] Match ID:', matchId);
        // TODO: matchId로 경기 조회 후 selectMatch 호출
    }
}

// 페이지 로드 시 URL 파라미터 확인
window.addEventListener('load', getMatchFromURL);

// ============================================================
// 동적 캘린더 기능
// ============================================================

// 캘린더 렌더링
async function renderCalendar() {
    const calendarTitle = document.getElementById('calendarTitle');
    const calendarDays = document.getElementById('calendarDays');

    if (!calendarDays) return; // plan-route.html이 아닌 경우

    // 제목 업데이트
    if (calendarTitle) {
        calendarTitle.textContent = `${currentYear}년 ${currentMonth + 1}월`;
    }

    // 해당 월의 첫날과 마지막날
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay(); // 0(일요일) ~ 6(토요일)

    // 해당 월의 모든 날짜에 대한 경기 데이터 로드
    await loadMonthMatches(currentYear, currentMonth);

    // 달력 HTML 생성
    let calendarHTML = '';

    // 빈 칸 추가 (이전 달 날짜)
    for (let i = 0; i < startDay; i++) {
        calendarHTML += '<div class="calendar-day py-3 rounded"></div>';
    }

    // 현재 날짜 (오늘)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간 부분 제거하여 날짜만 비교

    // 현재 달 날짜
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const currentDate = new Date(currentYear, currentMonth, day);

        // 과거 날짜인지 확인
        const isPastDate = currentDate < today;

        // 과거 날짜가 아니고 경기가 있는 경우만 표시
        const hasMatch = !isPastDate && monthMatchesData[dateStr] && monthMatchesData[dateStr].length > 0;
        const matchClass = hasMatch ? 'has-match' : '';

        calendarHTML += `
            <div class="calendar-day ${matchClass} py-3 rounded cursor-pointer hover:bg-gray-100"
                 data-date="${dateStr}"
                 ${hasMatch ? `onclick="showMatchesForDate('${dateStr}')"` : ''}>
                ${day}
            </div>
        `;
    }

    calendarDays.innerHTML = calendarHTML;
}

// 해당 월의 모든 경기 데이터 로드
async function loadMonthMatches(year, month) {
    monthMatchesData = {};

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const dateFrom = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const dateTo = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

    console.log(`[Calendar] Loading matches from preloaded cache: ${dateFrom} ~ ${dateTo}`);

    // 1순위: Preload된 matchesCache에서 직접 가져오기 (API 호출 없음!)
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // Preload된 캐시에서 바로 가져오기
        if (matchesCache[dateStr] && matchesCache[dateStr].length > 0) {
            monthMatchesData[dateStr] = matchesCache[dateStr];
        }
        // 캐시에 없으면 정적 데이터 사용
        else if (staticBigMatches[dateStr]) {
            monthMatchesData[dateStr] = staticBigMatches[dateStr];
        }
    }

    console.log('[Calendar] Month matches loaded from cache:', Object.keys(monthMatchesData).length, 'days with matches');
}

// 월 이동
async function changeMonth(direction) {
    currentMonth += direction;

    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }

    await renderCalendar();
}

// ============================================================
// 페이지 초기화
// ============================================================

// 페이지 로드 시 자동으로 전체 캐시 데이터를 미리 로드
(async function initPageData() {
    console.log('[INIT] 페이지 초기화 시작...');

    // 전체 경기 데이터 preload
    const success = await preloadAllMatches();

    if (success) {
        console.log('[INIT] ✅ 전체 데이터 로드 완료 - 이제 달력 클릭 시 즉시 표시됩니다!');
    } else {
        console.log('[INIT] ⚠️  캐시 데이터 없음 - 개별 API 호출로 fallback');
    }

    // Preload 완료 후 캘린더 렌더링
    const calendarDays = document.getElementById('calendarDays');
    if (calendarDays) {
        console.log('[Calendar] Rendering calendar with preloaded data...');
        await renderCalendar();
    }

    console.log('[INIT] 페이지 초기화 완료');
})();

