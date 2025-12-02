/**
 * GoalRoute API 통합 테스트 (Node.js)
 *
 * 실행 방법: node api/test-api-node.js
 */

// .env 파일 로드
require('dotenv').config();

// API 서비스 불러오기
const FootballDataService = require('./football-data-service.js');
const AmadeusService = require('./amadeus-service.js');
const ExchangeRateService = require('./exchange-rate-service.js');

// API 키 확인
console.log('🔑 API 키 확인...\n');
console.log('Football-Data:', process.env.FOOTBALL_DATA_API_KEY ? '✅' : '❌');
console.log('Amadeus Key:', process.env.AMADEUS_API_KEY ? '✅' : '❌');
console.log('Amadeus Secret:', process.env.AMADEUS_API_SECRET ? '✅' : '❌');
console.log('ExchangeRate:', process.env.EXCHANGE_RATE_API_KEY ? '✅' : '❌');
console.log('\n' + '='.repeat(60) + '\n');

// 테스트 실행
async function runTests() {
    // 1. Football-Data.org API 테스트
    console.log('⚽ Football-Data.org API 테스트\n');
    try {
        const footballService = new FootballDataService(process.env.FOOTBALL_DATA_API_KEY);
        const matches = await footballService.getMatchesByDate('2024-12-15');

        if (matches.length > 0) {
            console.log(`✅ 성공: ${matches.length}개 경기 발견`);
            matches.slice(0, 3).forEach(match => {
                console.log(`   - ${match.homeTeamKo} vs ${match.awayTeamKo}`);
                console.log(`     ${match.league} | ${match.stadium}, ${match.city} | ${match.time}`);
            });
        } else {
            console.log('⚠️  해당 날짜에 경기가 없습니다.');
        }
    } catch (error) {
        console.log('❌ 실패:', error.message);
    }
    console.log('\n' + '='.repeat(60) + '\n');

    // 2. Amadeus API 테스트 (항공권)
    console.log('✈️  Amadeus API 테스트 - 항공권\n');
    try {
        const amadeusService = new AmadeusService(
            process.env.AMADEUS_API_KEY,
            process.env.AMADEUS_API_SECRET
        );

        // Access Token 발급 테스트
        console.log('   토큰 발급 중...');
        const token = await amadeusService.getAccessToken();
        console.log(`   ✅ Access Token 발급 완료: ${token.substring(0, 20)}...`);

        // 항공권 검색 테스트
        console.log('   항공권 검색 중 (ICN → LHR)...');
        const flights = await amadeusService.searchFlights(
            'ICN', 'LHR',
            '2024-12-15', '2024-12-17',
            1
        );

        if (flights.length > 0) {
            console.log(`   ✅ ${flights.length}개 항공편 발견`);
            flights.slice(0, 3).forEach(flight => {
                console.log(`      ₩${flight.price.toLocaleString()} | 경유: ${flight.outbound.stops}회`);
            });
        } else {
            console.log('   ⚠️  검색 결과 없음 (Fallback 데이터 사용)');
        }
    } catch (error) {
        console.log('   ❌ 실패:', error.message);
    }
    console.log('\n' + '='.repeat(60) + '\n');

    // 3. Amadeus API 테스트 (숙소)
    console.log('🏨 Amadeus API 테스트 - 숙소\n');
    try {
        const amadeusService = new AmadeusService(
            process.env.AMADEUS_API_KEY,
            process.env.AMADEUS_API_SECRET
        );

        console.log('   숙소 검색 중 (런던)...');
        const hotels = await amadeusService.searchHotels(
            'LON',
            '2024-12-15',
            '2024-12-17',
            1
        );

        if (hotels.length > 0) {
            console.log(`   ✅ ${hotels.length}개 숙소 발견`);
            hotels.slice(0, 3).forEach(hotel => {
                console.log(`      ${hotel.name}`);
                console.log(`      ₩${hotel.price.toLocaleString()} | ${hotel.roomType} | ⭐ ${hotel.rating}`);
            });
        } else {
            console.log('   ⚠️  검색 결과 없음 (Fallback 데이터 사용)');
        }
    } catch (error) {
        console.log('   ❌ 실패:', error.message);
    }
    console.log('\n' + '='.repeat(60) + '\n');

    // 4. ExchangeRate API 테스트
    console.log('💱 ExchangeRate API 테스트\n');
    try {
        const exchangeService = new ExchangeRateService(process.env.EXCHANGE_RATE_API_KEY);

        // 환율 조회
        console.log('   환율 조회 중...');
        const rates = await exchangeService.getAllRates();

        if (rates.length > 0) {
            console.log('   ✅ 환율 조회 성공');
            rates.forEach(rate => {
                console.log(`      1 ${rate.currency} = ₩${rate.krwTo1Unit.toLocaleString()}`);
            });

            // 원화 변환 테스트
            console.log('\n   원화 변환 테스트: ₩1,000,000 → EUR');
            const conversion = await exchangeService.convertFromKRW(1000000, 'EUR');
            console.log(`   ✅ €${conversion.convertedAmount.toLocaleString()}`);
        } else {
            console.log('   ⚠️  환율 조회 실패 (Fallback 데이터 사용)');
        }
    } catch (error) {
        console.log('   ❌ 실패:', error.message);
    }
    console.log('\n' + '='.repeat(60) + '\n');

    console.log('🎉 모든 테스트 완료!\n');
}

// 테스트 실행
runTests().catch(error => {
    console.error('테스트 실행 중 오류:', error);
    process.exit(1);
});
