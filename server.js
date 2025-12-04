/**
 * GoalRoute 백엔드 서버
 *
 * 실행: node server.js
 * 접속: http://localhost:3000
 */

// Railway는 환경 변수를 process.env로 직접 주입
// 먼저 Railway 환경인지 확인
const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_STATIC_URL || process.env.RAILWAY_PROJECT_ID;

console.log('[DEBUG] Environment check:');
console.log('  - RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT);
console.log('  - RAILWAY_STATIC_URL:', process.env.RAILWAY_STATIC_URL);
console.log('  - RAILWAY_PROJECT_ID:', process.env.RAILWAY_PROJECT_ID);
console.log('  - Is Railway:', !!isRailway);

// 🔍 모든 환경 변수 출력 (디버깅용)
console.log('\n[DEBUG] ALL Environment Variables:');
const envKeys = Object.keys(process.env).sort();
console.log(`Total: ${envKeys.length} variables`);
envKeys.forEach(key => {
    // 민감한 정보는 마스킹
    const value = process.env[key];
    const displayValue = (key.includes('KEY') || key.includes('SECRET')) && value
        ? `${value.substring(0, 8)}...`
        : value && value.length > 50
        ? `${value.substring(0, 50)}...`
        : value;
    console.log(`  ${key}=${displayValue}`);
});
console.log('\n');

if (!isRailway) {
    // 로컬 개발 환경에서만 .env 파일 로드
    require('dotenv').config();
    console.log('[LOCAL] .env 파일에서 환경 변수 로드');
} else {
    console.log('[RAILWAY] Railway 환경에서 실행 중');
}

// API 키 상태 확인
console.log('[DEBUG] API Keys in process.env:');
console.log('  - FOOTBALL_DATA_API_KEY:', process.env.FOOTBALL_DATA_API_KEY ? `${process.env.FOOTBALL_DATA_API_KEY.substring(0, 8)}...` : '❌ MISSING');
console.log('  - AMADEUS_API_KEY:', process.env.AMADEUS_API_KEY ? `${process.env.AMADEUS_API_KEY.substring(0, 8)}...` : '❌ MISSING');
console.log('  - AMADEUS_API_SECRET:', process.env.AMADEUS_API_SECRET ? `${process.env.AMADEUS_API_SECRET.substring(0, 8)}...` : '❌ MISSING');
console.log('  - EXCHANGE_RATE_API_KEY:', process.env.EXCHANGE_RATE_API_KEY ? `${process.env.EXCHANGE_RATE_API_KEY.substring(0, 8)}...` : '❌ MISSING');

const express = require('express');
const cors = require('cors');
const path = require('path');

// Firebase Admin SDK 초기화
const admin = require('firebase-admin');
let db = null;

try {
    let serviceAccount;

    // Railway: Base64 인코딩된 환경 변수 사용
    if (isRailway && process.env.FIREBASE_CREDENTIALS_BASE64) {
        console.log('[RAILWAY] Firebase credentials from Base64 environment variable');
        const decoded = Buffer.from(process.env.FIREBASE_CREDENTIALS_BASE64, 'base64').toString('utf-8');
        serviceAccount = JSON.parse(decoded);
    } else {
        // 로컬: 파일에서 읽기
        console.log('[LOCAL] Firebase credentials from file');
        const serviceAccountPath = path.join(__dirname, 'omacasemiro-8fd4c-firebase-adminsdk-fbsvc-8c438c494c.json');
        serviceAccount = require(serviceAccountPath);
    }

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log('✅ Firebase Admin 초기화 완료 (Firestore 사용)');
} catch (error) {
    console.error('❌ Firebase Admin 초기화 실패:', error.message);
    console.warn('⚠️  로컬 파일 캐시로 Fallback (Railway 재배포 시 삭제됨)');
    db = null;
}

// API 서비스 불러오기
const FootballDataService = require('./api/football-data-service.js');
const AmadeusService = require('./api/amadeus-service.js');
const ExchangeRateService = require('./api/exchange-rate-service.js');
const MatchCacheService = require('./api/match-cache-service.js');
const { getTicketPrice, calculateFinalPrice } = require('./api/ticket-prices.js');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // 정적 파일 제공

// API 서비스 인스턴스
const footballService = new FootballDataService(process.env.FOOTBALL_DATA_API_KEY);
const amadeusService = new AmadeusService(
    process.env.AMADEUS_API_KEY,
    process.env.AMADEUS_API_SECRET
);
const exchangeService = new ExchangeRateService(process.env.EXCHANGE_RATE_API_KEY);
const matchCacheService = new MatchCacheService(footballService, db);

// 캐시 서비스 초기화 (서버 시작 시 자동으로 데이터 수집 시작)
matchCacheService.initialize();

// 캐시 (간단한 메모리 캐시)
const cache = {
    matches: null,
    matchesExpiry: null,
    exchangeRates: null,
    exchangeExpiry: null
};

// ============================================================
// API 라우트
// ============================================================

/**
 * 전체 캐시된 경기 데이터 조회 (한 번에 모두 가져오기)
 * GET /api/matches/all
 */
app.get('/api/matches/all', async (req, res) => {
    try {
        console.log('[API] 전체 캐시 데이터 조회');

        // 파일 캐시에서 전체 데이터 가져오기
        const allMatches = await matchCacheService.getAllCachedMatches();

        if (allMatches && Object.keys(allMatches).length > 0) {
            console.log(`[FILE CACHE] 전체 캐시 데이터 반환: ${Object.keys(allMatches).length}일치`);
            return res.json({
                success: true,
                matches: allMatches,
                lastUpdate: (await matchCacheService.loadCache())?.lastUpdate
            });
        }

        // 캐시 없으면 빈 객체 반환
        console.log('[FILE CACHE] 캐시 없음');
        return res.json({
            success: true,
            matches: {},
            lastUpdate: null
        });
    } catch (error) {
        console.error('[ERROR] 전체 캐시 조회 실패:', error.message);
        res.status(500).json({ error: '전체 캐시 조회 실패', message: error.message });
    }
});

/**
 * 경기 일정 조회 (특정 날짜)
 * GET /api/matches?date=2024-12-15
 */
app.get('/api/matches', async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ error: 'date 파라미터가 필요합니다.' });
        }

        console.log(`[API] 경기 일정 조회: ${date}`);

        // 1. 먼저 파일 캐시 확인 (백그라운드 수집 데이터)
        const cachedMatches = await matchCacheService.getCachedMatches(date);
        if (cachedMatches) {
            console.log('[FILE CACHE] 캐시된 경기 데이터 반환');
            return res.json(cachedMatches);
        }

        // 2. 메모리 캐시 확인 (24시간)
        const cacheKey = `matches_${date}`;
        if (cache[cacheKey] && cache[`${cacheKey}_expiry`] > Date.now()) {
            console.log('[MEMORY CACHE] 캐시된 경기 데이터 반환');
            return res.json(cache[cacheKey]);
        }

        // 3. 캐시에 없으면 실시간 API 호출 (fallback)
        console.log('[API] 실시간 데이터 조회 중...');
        const matches = await footballService.getMatchesByDate(date);

        // 메모리 캐시 저장
        cache[cacheKey] = matches;
        cache[`${cacheKey}_expiry`] = Date.now() + (24 * 60 * 60 * 1000);

        res.json(matches);
    } catch (error) {
        console.error('[ERROR] 경기 조회 실패:', error.message);
        res.status(500).json({ error: '경기 일정 조회 실패', message: error.message });
    }
});

/**
 * 특정 리그의 경기 일정 조회
 * GET /api/matches/league?code=PL&dateFrom=2024-12-01&dateTo=2024-12-31
 */
app.get('/api/matches/league', async (req, res) => {
    try {
        const { code, dateFrom, dateTo } = req.query;

        if (!code || !dateFrom || !dateTo) {
            return res.status(400).json({
                error: 'code, dateFrom, dateTo 파라미터가 필요합니다.'
            });
        }

        console.log(`[API] 리그 경기 조회: ${code} (${dateFrom} ~ ${dateTo})`);

        const matches = await footballService.getMatches(code, dateFrom, dateTo);
        res.json(matches);
    } catch (error) {
        console.error('[ERROR] 리그 경기 조회 실패:', error.message);
        res.status(500).json({ error: '리그 경기 조회 실패', message: error.message });
    }
});

/**
 * 항공권 검색
 * POST /api/flights/search
 * Body: { origin, destination, departureDate, returnDate, adults }
 */
app.post('/api/flights/search', async (req, res) => {
    try {
        const { origin, destination, departureDate, returnDate, adults = 1 } = req.body;

        if (!origin || !destination || !departureDate || !returnDate) {
            return res.status(400).json({
                error: 'origin, destination, departureDate, returnDate 필수'
            });
        }

        console.log(`[API] 항공권 검색: ${origin} → ${destination}`);

        const flights = await amadeusService.searchFlights(
            origin, destination, departureDate, returnDate, adults
        );

        res.json(flights);
    } catch (error) {
        console.error('[ERROR] 항공권 검색 실패:', error.message);
        res.status(500).json({ error: '항공권 검색 실패', message: error.message });
    }
});

/**
 * 숙소 검색
 * POST /api/hotels/search
 * Body: { cityCode, checkInDate, checkOutDate, adults }
 */
app.post('/api/hotels/search', async (req, res) => {
    try {
        const { cityCode, checkInDate, checkOutDate, adults = 1 } = req.body;

        if (!cityCode || !checkInDate || !checkOutDate) {
            return res.status(400).json({
                error: 'cityCode, checkInDate, checkOutDate 필수'
            });
        }

        console.log(`[API] 숙소 검색: ${cityCode}`);

        const hotels = await amadeusService.searchHotels(
            cityCode, checkInDate, checkOutDate, adults
        );

        res.json(hotels);
    } catch (error) {
        console.error('[ERROR] 숙소 검색 실패:', error.message);
        res.status(500).json({ error: '숙소 검색 실패', message: error.message });
    }
});

/**
 * 환율 조회
 * GET /api/exchange-rate?currency=EUR
 */
app.get('/api/exchange-rate', async (req, res) => {
    try {
        const { currency = 'EUR' } = req.query;

        console.log(`[API] 환율 조회: KRW → ${currency}`);

        // 캐시 확인 (24시간)
        if (cache.exchangeRates && cache.exchangeExpiry > Date.now()) {
            console.log('[CACHE] 캐시된 환율 데이터 반환');
            return res.json(cache.exchangeRates);
        }

        // API 호출
        const rates = await exchangeService.getAllRates();

        // 캐시 저장
        cache.exchangeRates = rates;
        cache.exchangeExpiry = Date.now() + (24 * 60 * 60 * 1000);

        res.json(rates);
    } catch (error) {
        console.error('[ERROR] 환율 조회 실패:', error.message);
        res.status(500).json({ error: '환율 조회 실패', message: error.message });
    }
});

/**
 * 환전 계산
 * POST /api/exchange-rate/convert
 * Body: { amount, fromCurrency, toCurrency }
 */
app.post('/api/exchange-rate/convert', async (req, res) => {
    try {
        const { amount, fromCurrency = 'KRW', toCurrency = 'EUR' } = req.body;

        if (!amount) {
            return res.status(400).json({ error: 'amount 필수' });
        }

        console.log(`[API] 환전 계산: ${amount} ${fromCurrency} → ${toCurrency}`);

        let result;
        if (fromCurrency === 'KRW') {
            result = await exchangeService.convertFromKRW(amount, toCurrency);
        } else {
            result = await exchangeService.convertToKRW(amount, fromCurrency);
        }

        res.json(result);
    } catch (error) {
        console.error('[ERROR] 환전 계산 실패:', error.message);
        res.status(500).json({ error: '환전 계산 실패', message: error.message });
    }
});

/**
 * 티켓 가격 조회
 * GET /api/ticket-price?league=Premier League&team=Liverpool FC&tier=budget
 */
app.get('/api/ticket-price', async (req, res) => {
    try {
        const { league, homeTeam, awayTeam, tier = 'budget' } = req.query;

        if (!league || !homeTeam) {
            return res.status(400).json({ error: 'league, homeTeam 필수' });
        }

        console.log(`[API] 티켓 가격 조회: ${homeTeam} vs ${awayTeam || 'N/A'}`);

        let price;
        if (awayTeam) {
            // 빅매치 여부 확인하여 최종 가격 계산
            price = calculateFinalPrice(league, homeTeam, awayTeam, tier);
        } else {
            // 일반 가격만 조회
            price = getTicketPrice(league, homeTeam, tier);
        }

        res.json(price);
    } catch (error) {
        console.error('[ERROR] 티켓 가격 조회 실패:', error.message);
        res.status(500).json({ error: '티켓 가격 조회 실패', message: error.message });
    }
});

/**
 * 여행 추천 옵션 조회 (항공편/숙소 다양한 옵션)
 * GET /api/travel-options?origin=ICN&destination=LHR&city=London&nights=3
 */
app.get('/api/travel-options', (req, res) => {
    try {
        const { origin, destination, city, nights, departureDate, returnDate } = req.query;

        if (!origin || !destination || !city || !nights) {
            return res.status(400).json({
                error: 'origin, destination, city, nights 필수'
            });
        }

        console.log(`[API] 여행 옵션 조회: ${origin} → ${destination}, ${city} ${nights}박`);

        // 항공편 옵션
        const flightOptions = getFlightOptions(origin, destination, departureDate, returnDate);

        // 숙소 옵션
        const accommodationOptions = getAccommodationOptions(city, parseInt(nights));

        res.json({
            flights: flightOptions,
            accommodations: accommodationOptions,
            tips: {
                flight: [
                    '💡 경기 일정 변동에 대비해 앞뒤로 하루씩 여유를 두세요',
                    '💡 경유편은 직항 대비 50% 저렴하지만 시간이 오래 걸립니다',
                    '💡 항공권은 출발 2-3개월 전 예매 시 가장 저렴합니다'
                ],
                accommodation: [
                    '💡 2인 이상이면 호스텔비를 합쳐 모텔/호텔로 업그레이드 가능',
                    '💡 1인 여행이라면 호스텔 도미토리가 가장 경제적',
                    '💡 경기장 근처 호스텔이 없다면 시내에서 예약 후 대중교통 이용'
                ],
                ticket: [
                    '📉 일반 경기는 경기일에 가까워질수록 티켓 가격이 5-10% 하락',
                    '📈 빅매치(챔피언스리그, 더비)는 경기가 가까워져도 가격 상승 가능',
                    '💡 Football Ticket Net이 수수료 포함 가격이 다른 곳보다 5% 저렴'
                ]
            }
        });
    } catch (error) {
        console.error('[ERROR] 여행 옵션 조회 실패:', error.message);
        res.status(500).json({ error: '여행 옵션 조회 실패', message: error.message });
    }
});

/**
 * 전체 여행 견적 계산
 * POST /api/estimate
 * Body: { match, departureCity, routeType, travelDates }
 */
app.post('/api/estimate', async (req, res) => {
    try {
        const { match, departureCity, routeType = 'budget', travelDates } = req.body;

        if (!match || !departureCity || !travelDates) {
            return res.status(400).json({
                error: 'match, departureCity, travelDates 필수'
            });
        }

        console.log(`[API] 견적 계산: ${match.homeTeam} vs ${match.awayTeam}`);

        // 병렬로 모든 데이터 조회
        const [flights, hotels, ticketPrice, exchangeRates] = await Promise.all([
            amadeusService.searchFlights(
                departureCity,
                match.airportCode || 'LHR',
                travelDates.departure,
                travelDates.return,
                1
            ),
            amadeusService.searchHotels(
                match.cityCode || 'LON',
                travelDates.checkIn,
                travelDates.checkOut,
                1
            ),
            Promise.resolve(calculateFinalPrice(
                match.league,
                match.homeTeam,
                match.awayTeam,
                routeType === 'budget' ? 'budget' : 'premium'
            )),
            exchangeService.getAllRates()
        ]);

        // 가격 계산
        const flightPrice = flights.length > 0
            ? (routeType === 'budget' ? flights[0].price : flights[flights.length - 1].price)
            : 650000;

        const hotelPrice = hotels.length > 0
            ? (routeType === 'budget' ? hotels[0].price : hotels[hotels.length - 1].price)
            : 80000;

        const localTransport = 70000; // 현지 교통비 (고정)

        const estimate = {
            match: {
                homeTeam: match.homeTeam,
                awayTeam: match.awayTeam,
                stadium: match.stadium,
                city: match.city,
                date: match.date
            },
            routeType: routeType,
            breakdown: {
                flight: flightPrice,
                hotel: hotelPrice,
                ticket: ticketPrice.price,
                localTransport: localTransport
            },
            total: flightPrice + hotelPrice + ticketPrice.price + localTransport,
            currency: 'KRW',
            flightDetails: flights.slice(0, 3),
            hotelDetails: hotels.slice(0, 3)
        };

        res.json(estimate);
    } catch (error) {
        console.error('[ERROR] 견적 계산 실패:', error.message);
        res.status(500).json({ error: '견적 계산 실패', message: error.message });
    }
});

// ============================================================
// 캐시 관리 API
// ============================================================

/**
 * 캐시 상태 조회
 * GET /api/cache/status
 */
app.get('/api/cache/status', async (req, res) => {
    try {
        const status = await matchCacheService.getCacheStatus();
        res.json(status);
    } catch (error) {
        console.error('[ERROR] 캐시 상태 조회 실패:', error.message);
        res.status(500).json({ error: '캐시 상태 조회 실패', message: error.message });
    }
});

/**
 * 수동 캐시 업데이트 트리거
 * POST /api/cache/update
 */
app.post('/api/cache/update', async (req, res) => {
    try {
        // 비동기로 실행 (응답은 바로 반환)
        matchCacheService.triggerManualUpdate();
        res.json({
            success: true,
            message: '백그라운드에서 데이터 수집을 시작했습니다.'
        });
    } catch (error) {
        console.error('[ERROR] 수동 업데이트 실패:', error.message);
        res.status(500).json({ error: '수동 업데이트 실패', message: error.message });
    }
});

// ============================================================
// 정적 페이지 라우트
// ============================================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'goalroute.html'));
});

app.get('/plan', (req, res) => {
    res.sendFile(path.join(__dirname, 'plan-route.html'));
});

// ============================================================
// Helper Functions
// ============================================================

/**
 * 항공편 옵션 생성 (경유/직항 다양한 옵션)
 */
function getFlightOptions(origin, destination, departureDate, returnDate) {
    const basePrice = getBaseFlightPrice(origin, destination);

    return {
        layover: [
            {
                type: 'layover',
                category: '초가성비',
                airline: '저가항공 (1회 경유)',
                stops: 1,
                duration: '17-20시간',
                price: Math.round(basePrice * 0.55),
                priceRange: `${Math.round(basePrice * 0.5).toLocaleString()}~${Math.round(basePrice * 0.6).toLocaleString()}원`,
                description: '가장 저렴하지만 대기시간이 길 수 있음',
                recommended: '시간 여유가 충분한 경우',
                searchUrl: `https://www.skyscanner.co.kr/transport/flights/${origin.toLowerCase()}/${destination.toLowerCase()}/${departureDate}/${returnDate}/`
            },
            {
                type: 'layover',
                category: '가성비',
                airline: '일반항공 (1회 경유)',
                stops: 1,
                duration: '15-18시간',
                price: Math.round(basePrice * 0.7),
                priceRange: `${Math.round(basePrice * 0.65).toLocaleString()}~${Math.round(basePrice * 0.75).toLocaleString()}원`,
                description: '가격과 편의성의 균형',
                recommended: '가장 인기있는 옵션 ⭐',
                searchUrl: `https://www.skyscanner.co.kr/transport/flights/${origin.toLowerCase()}/${destination.toLowerCase()}/${departureDate}/${returnDate}/`
            }
        ],
        direct: [
            {
                type: 'direct',
                category: '직항',
                airline: '대한항공/아시아나',
                stops: 0,
                duration: '11-13시간',
                price: Math.round(basePrice),
                priceRange: `${Math.round(basePrice * 0.9).toLocaleString()}~${Math.round(basePrice * 1.1).toLocaleString()}원`,
                description: '가장 빠르고 편안한 여정',
                recommended: '시간이 부족하거나 편안한 여행 선호',
                searchUrl: `https://www.skyscanner.co.kr/transport/flights/${origin.toLowerCase()}/${destination.toLowerCase()}/${departureDate}/${returnDate}/?preferdirects=true`
            },
            {
                type: 'direct',
                category: '프리미엄 직항',
                airline: '외항사 직항',
                stops: 0,
                duration: '11-13시간',
                price: Math.round(basePrice * 1.2),
                priceRange: `${Math.round(basePrice * 1.1).toLocaleString()}~${Math.round(basePrice * 1.3).toLocaleString()}원`,
                description: '최고급 서비스 및 라운지 이용',
                recommended: '편안함을 최우선으로 하는 경우',
                searchUrl: `https://www.skyscanner.co.kr/transport/flights/${origin.toLowerCase()}/${destination.toLowerCase()}/${departureDate}/${returnDate}/?preferdirects=true&cabinclass=business`
            }
        ]
    };
}

/**
 * 숙소 옵션 생성 (호스텔/모텔/호텔 다양한 옵션)
 */
function getAccommodationOptions(city, nights) {
    const baseNightlyRate = getBaseAccommodationPrice(city);

    return {
        budget: [
            {
                category: '호스텔 (도미토리)',
                type: 'hostel_dorm',
                pricePerNight: Math.round(baseNightlyRate * 0.3),
                totalPrice: Math.round(baseNightlyRate * 0.3 * nights),
                priceRange: `1박 ${Math.round(baseNightlyRate * 0.2).toLocaleString()}~${Math.round(baseNightlyRate * 0.4).toLocaleString()}원`,
                description: '공용 침실 (4-8인실), 공용 샤워실/화장실',
                amenities: ['무료 Wi-Fi', '공용 주방', '세탁실'],
                pros: '최저가 · 중심가 위치',
                cons: '프라이버시 없음 · 소음 가능',
                recommended: '1인 여행, 가성비 최우선 ⭐',
                searchUrl: `https://www.booking.com/searchresults.html?ss=${city}&nflt=ht_id%3D203`
            },
            {
                category: '호스텔 (개인실)',
                type: 'hostel_private',
                pricePerNight: Math.round(baseNightlyRate * 0.5),
                totalPrice: Math.round(baseNightlyRate * 0.5 * nights),
                priceRange: `1박 ${Math.round(baseNightlyRate * 0.4).toLocaleString()}~${Math.round(baseNightlyRate * 0.6).toLocaleString()}원`,
                description: '개인 침실, 공용 샤워실/화장실',
                amenities: ['무료 Wi-Fi', '공용 주방', '개인 침대'],
                pros: '저렴한 가격 · 개인 공간',
                cons: '공용 샤워실',
                recommended: '1-2인 여행, 기본적인 프라이버시 원함',
                searchUrl: `https://www.booking.com/searchresults.html?ss=${city}&nflt=ht_id%3D203%3Broomfacility%3D999`
            }
        ],
        standard: [
            {
                category: '2성급 호텔/모텔',
                type: 'budget_hotel',
                pricePerNight: Math.round(baseNightlyRate * 0.7),
                totalPrice: Math.round(baseNightlyRate * 0.7 * nights),
                priceRange: `1박 ${Math.round(baseNightlyRate * 0.6).toLocaleString()}~${Math.round(baseNightlyRate * 0.8).toLocaleString()}원`,
                description: '개인실, 개인 욕실, 기본 편의시설',
                amenities: ['무료 Wi-Fi', '개인 욕실', 'TV', '에어컨'],
                pros: '완전한 프라이버시 · 개인 욕실',
                cons: '시설 기본적',
                recommended: '2인 이상 여행, 프라이버시 중요',
                searchUrl: `https://www.agoda.com/search?city=${city}&star=2`
            },
            {
                category: '3성급 호텔',
                type: 'standard_hotel',
                pricePerNight: Math.round(baseNightlyRate),
                totalPrice: Math.round(baseNightlyRate * nights),
                priceRange: `1박 ${Math.round(baseNightlyRate * 0.9).toLocaleString()}~${Math.round(baseNightlyRate * 1.1).toLocaleString()}원`,
                description: '개인실, 개인 욕실, 양호한 시설',
                amenities: ['무료 Wi-Fi', '개인 욕실', 'TV', '에어컨', '미니바'],
                pros: '좋은 위치 · 괜찮은 시설',
                cons: '중간 가격대',
                recommended: '편안함과 가격의 균형 ⭐',
                searchUrl: `https://www.agoda.com/search?city=${city}&star=3`
            }
        ],
        premium: [
            {
                category: '4성급 호텔',
                type: 'upscale_hotel',
                pricePerNight: Math.round(baseNightlyRate * 1.5),
                totalPrice: Math.round(baseNightlyRate * 1.5 * nights),
                priceRange: `1박 ${Math.round(baseNightlyRate * 1.3).toLocaleString()}~${Math.round(baseNightlyRate * 1.7).toLocaleString()}원`,
                description: '넓은 객실, 고급 시설, 우수한 서비스',
                amenities: ['무료 Wi-Fi', '고급 욕실', 'TV', '에어컨', '미니바', '룸서비스', '피트니스'],
                pros: '최고급 시설 · 우수한 위치',
                cons: '높은 가격',
                recommended: '프리미엄 여행, 편안함 최우선',
                searchUrl: `https://www.agoda.com/search?city=${city}&star=4`
            }
        ]
    };
}

function getBaseFlightPrice(origin, destination) {
    const prices = {
        'ICN-LHR': 1300000,
        'ICN-MAN': 1300000,
        'ICN-MAD': 1400000,
        'ICN-FCO': 1350000,
        'ICN-MXP': 1350000,
        'ICN-CDG': 1300000,
        'ICN-FRA': 1250000,
        'ICN-MUC': 1300000,
    };
    const route = `${origin}-${destination}`;
    return prices[route] || 1300000;
}

function getBaseAccommodationPrice(city) {
    const prices = {
        'London': 150000,
        'Liverpool': 120000,
        'Manchester': 110000,
        'Madrid': 130000,
        'Barcelona': 140000,
        'Milan': 135000,
        'Rome': 130000,
        'Paris': 160000,
        'Munich': 140000,
    };
    return prices[city] || 130000;
}

// ============================================================
// 서버 시작
// ============================================================

app.listen(PORT, () => {
    console.log('');
    console.log('🚀 GoalRoute 서버가 시작되었습니다!');
    console.log('');
    console.log(`   로컬 접속: http://localhost:${PORT}`);
    console.log(`   메인 페이지: http://localhost:${PORT}/goalroute.html`);
    console.log(`   코스 설계: http://localhost:${PORT}/plan-route.html`);
    console.log(`   API 테스트: http://localhost:${PORT}/api/test-api.html`);
    console.log('');
    console.log('📡 API 엔드포인트:');
    console.log(`   GET  /api/matches?date=YYYY-MM-DD`);
    console.log(`   POST /api/flights/search`);
    console.log(`   POST /api/hotels/search`);
    console.log(`   GET  /api/exchange-rate`);
    console.log(`   POST /api/estimate`);
    console.log('');
    console.log('✅ API 키 상태:');
    console.log(`   Football-Data: ${process.env.FOOTBALL_DATA_API_KEY ? '✅' : '❌'}`);
    console.log(`   Amadeus: ${process.env.AMADEUS_API_KEY ? '✅' : '❌'}`);
    console.log(`   ExchangeRate: ${process.env.EXCHANGE_RATE_API_KEY ? '✅' : '❌'}`);
    console.log('');
    console.log('종료: Ctrl+C');
    console.log('');
});

// 에러 핸들링
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});
