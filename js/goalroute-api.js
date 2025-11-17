/**
 * GoalRoute - API 통합 버전
 * 백엔드 서버와 연동하여 실시간 데이터 사용
 */

// API 베이스 URL
const API_BASE_URL = 'http://localhost:3000/api';

// 전역 상태 관리
let selectedMatch = null;
let selectedDepartureCity = null;
let selectedRouteType = null;
let matchesCache = {}; // 날짜별 경기 캐시

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
 * API: 경기 일정 조회
 */
async function fetchMatches(date) {
    // 캐시 확인
    if (matchesCache[date]) {
        console.log(`[CACHE] 캐시된 경기 데이터 사용: ${date}`);
        return matchesCache[date];
    }

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
        throw error;
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
        throw error;
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
        throw error;
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
        throw error;
    }
}

/**
 * API: 티켓 가격 조회
 */
async function fetchTicketPrice(league, homeTeam, awayTeam, tier = 'budget') {
    try {
        console.log(`[API] 티켓 가격 조회: ${homeTeam} vs ${awayTeam}`);
        const response = await fetch(
            `${API_BASE_URL}/ticket-price?league=${encodeURIComponent(league)}&homeTeam=${encodeURIComponent(homeTeam)}&awayTeam=${encodeURIComponent(awayTeam)}&tier=${tier}`
        );

        if (!response.ok) {
            throw new Error(`API 오류: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('[ERROR] 티켓 가격 조회 실패:', error);
        throw error;
    }
}

// ============================================================
// UI 이벤트 핸들러
// ============================================================

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('[GoalRoute] API 버전 시작');

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
    // 달력 날짜 클릭 이벤트
    setupCalendar();

    // 출발 공항은 ICN 고정
    selectedDepartureCity = 'ICN';

    // 출발지 선택 UI는 숨김 처리 (Step 2 제거)
    const step2 = document.getElementById('step2');
    if (step2) {
        step2.style.display = 'none';
    }
}

// 달력 설정
function setupCalendar() {
    const calendarDays = document.querySelectorAll('.calendar-day.has-match');

    calendarDays.forEach(day => {
        day.addEventListener('click', async function() {
            const date = this.getAttribute('data-date');

            // 선택된 날짜 표시
            calendarDays.forEach(d => d.classList.remove('selected'));
            this.classList.add('selected');

            // 경기 목록 표시
            await showMatchesForDate(date);
        });
    });
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
        // API에서 경기 데이터 가져오기
        const matches = await fetchMatches(date);

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
        // 여행 날짜 계산 (경기 날짜 기준 전후 1일)
        const matchDate = new Date(selectedMatch.date);
        const departureDate = new Date(matchDate);
        departureDate.setDate(departureDate.getDate() - 1);
        const returnDate = new Date(matchDate);
        returnDate.setDate(returnDate.getDate() + 1);

        // 병렬로 데이터 조회
        const [flights, hotels, budgetTicket, premiumTicket] = await Promise.all([
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
            fetchTicketPrice(selectedMatch.league, selectedMatch.homeTeam, selectedMatch.awayTeam, 'premium')
        ]);

        // 가격 계산
        const budgetFlight = flights.length > 0 ? flights[0].price : 650000;
        const premiumFlight = flights.length > 0 ? flights[flights.length - 1].price : 1200000;
        const budgetHotel = hotels.length > 0 ? hotels[0].price : 80000;
        const premiumHotel = hotels.length > 0 ? hotels[hotels.length - 1].price : 200000;
        const localTransport = 70000;

        // Budget 견적 표시
        displayEstimate('budget', {
            flight: budgetFlight,
            hotel: budgetHotel,
            ticket: budgetTicket.price,
            transport: localTransport
        });

        // Premium 견적 표시
        displayEstimate('premium', {
            flight: premiumFlight,
            hotel: premiumHotel,
            ticket: premiumTicket.price,
            transport: localTransport
        });

        // 선택한 탭 표시
        showTab(selectedRouteType);

    } catch (error) {
        console.error('[ERROR] 견적 계산 실패:', error);
        showError('budgetRoute', '견적을 계산할 수 없습니다. 나중에 다시 시도해주세요.');
        showError('premiumRoute', '견적을 계산할 수 없습니다. 나중에 다시 시도해주세요.');
    }
}

// 견적 표시
function displayEstimate(type, prices) {
    const total = prices.flight + prices.hotel + prices.ticket + prices.transport;
    const elementId = type === 'budget' ? 'budgetRoute' : 'premiumRoute';
    const element = document.getElementById(elementId);

    if (!element) return;

    element.innerHTML = `
        <div class="space-y-4">
            <div class="bg-gradient-to-r ${type === 'budget' ? 'from-green-500 to-green-600' : 'from-purple-500 to-purple-600'} text-white p-6 rounded-lg">
                <div class="text-center">
                    <p class="text-sm opacity-90">총 예상 금액</p>
                    <p class="text-4xl font-black mt-2">₩${total.toLocaleString()}</p>
                </div>
            </div>

            <div class="space-y-3">
                <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span class="text-gray-700">✈️ 항공권</span>
                    <span class="font-bold">₩${prices.flight.toLocaleString()}</span>
                </div>
                <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span class="text-gray-700">🏨 숙소</span>
                    <span class="font-bold">₩${prices.hotel.toLocaleString()}</span>
                </div>
                <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span class="text-gray-700">🎫 티켓</span>
                    <span class="font-bold">₩${prices.ticket.toLocaleString()}</span>
                </div>
                <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span class="text-gray-700">🚌 현지 교통</span>
                    <span class="font-bold">₩${prices.transport.toLocaleString()}</span>
                </div>
            </div>

            <div class="text-sm text-gray-500 text-center">
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
