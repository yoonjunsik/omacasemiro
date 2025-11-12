// 필터 상태 관리
let filters = {
    team: 'all',
    kit: 'all',
    season: 'all',
    version: 'all',
    sort: 'default'
};

// 실시간 데이터 리스너 설정 (초기 로드 + 실시간 업데이트)
function setupRealtimeListeners() {
    try {
        console.log('🔵 Firebase 실시간 리스너 설정 중...');

        // uniformData 실시간 리스너
        const uniformRef = window.firebaseDBRef(window.firebaseDB, 'uniformData');
        window.firebaseDBOnValue(uniformRef, (snapshot) => {
            if (snapshot.exists()) {
                window.uniformData = snapshot.val();
                console.log('🔄 uniformData 업데이트됨:', window.uniformData.length, '개');
                renderProducts();
            } else {
                console.log('⚠️ Firebase에 uniformData가 없습니다. data.js 사용');
                if (typeof uniformData !== 'undefined') {
                    window.uniformData = uniformData;
                    renderProducts();
                }
            }
        });

        // blackFridaySites 실시간 리스너
        const bfRef = window.firebaseDBRef(window.firebaseDB, 'blackFridaySites');
        window.firebaseDBOnValue(bfRef, (snapshot) => {
            if (snapshot.exists()) {
                window.blackFridaySites = snapshot.val();
                console.log('🔄 blackFridaySites 업데이트됨:', window.blackFridaySites.length, '개');
                console.log('📍 나이키 코리아 URL:', window.blackFridaySites[0].url);
                renderBlackFridaySites();
            } else {
                console.log('⚠️ Firebase에 blackFridaySites가 없습니다. data.js 사용');
                if (typeof blackFridaySites !== 'undefined') {
                    window.blackFridaySites = blackFridaySites;
                    renderBlackFridaySites();
                }
            }
        });

        console.log('✅ Firebase 실시간 리스너 설정 완료');
    } catch (error) {
        console.error('❌ Firebase 리스너 설정 실패:', error);
        // 에러 발생 시 data.js 사용
        if (typeof uniformData !== 'undefined') {
            window.uniformData = uniformData;
            renderProducts();
        }
        if (typeof blackFridaySites !== 'undefined') {
            window.blackFridaySites = blackFridaySites;
            renderBlackFridaySites();
        }
    }
}

// DOM이 로드되면 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 필터 초기화
    initializeFilters();

    // Firebase 실시간 리스너 설정 (초기 데이터 로드 포함)
    setupRealtimeListeners();
});

// 필터 초기화
function initializeFilters() {
    // 팀 필터
    const teamButtons = document.querySelectorAll('#teamFilter .filter-btn');
    teamButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 모든 버튼의 active 클래스 제거
            teamButtons.forEach(btn => btn.classList.remove('active'));
            // 클릭된 버튼에 active 클래스 추가
            this.classList.add('active');
            // 필터 상태 업데이트
            filters.team = this.dataset.team;
            renderProducts();
        });
    });

    // 키트 유형 필터
    const kitButtons = document.querySelectorAll('#kitFilter .filter-btn');
    kitButtons.forEach(button => {
        button.addEventListener('click', function() {
            kitButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filters.kit = this.dataset.kit;
            renderProducts();
        });
    });

    // 시즌 필터
    const seasonSelect = document.getElementById('seasonFilter');
    seasonSelect.addEventListener('change', function() {
        filters.season = this.value;
        renderProducts();
    });

    // 버전 필터
    const versionButtons = document.querySelectorAll('#versionFilter .filter-btn');
    versionButtons.forEach(button => {
        button.addEventListener('click', function() {
            versionButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filters.version = this.dataset.version;
            renderProducts();
        });
    });

    // 정렬 필터
    const sortSelect = document.getElementById('sortFilter');
    sortSelect.addEventListener('change', function() {
        filters.sort = this.value;
        renderProducts();
    });
}

// 제품 필터링
function filterProducts() {
    return uniformData.filter(product => {
        // visible이 false인 제품은 제외
        const visibleMatch = product.visible !== false;

        const teamMatch = filters.team === 'all' || product.team === filters.team;
        const kitMatch = filters.kit === 'all' || product.kit_type === filters.kit;
        const seasonMatch = filters.season === 'all' || product.season === filters.season;
        const versionMatch = filters.version === 'all' || product.version === filters.version;

        return visibleMatch && teamMatch && kitMatch && seasonMatch && versionMatch;
    });
}

// 제품 정렬
function sortProducts(products) {
    const sorted = [...products]; // 원본 배열 복사

    switch (filters.sort) {
        case 'latest':
            // 시즌 최신순 (25/26 > 24/25 > 23/24 > 22/23)
            sorted.sort((a, b) => {
                return b.season.localeCompare(a.season);
            });
            break;

        case 'price-low':
            // 가격 낮은순 (판매처 없는 제품은 맨 뒤로)
            sorted.sort((a, b) => {
                const priceA = getLowestPrice(a.site_offers);
                const priceB = getLowestPrice(b.site_offers);

                if (priceA === null && priceB === null) return 0;
                if (priceA === null) return 1;
                if (priceB === null) return -1;

                return priceA - priceB;
            });
            break;

        case 'price-high':
            // 가격 높은순 (판매처 없는 제품은 맨 뒤로)
            sorted.sort((a, b) => {
                const priceA = getLowestPrice(a.site_offers);
                const priceB = getLowestPrice(b.site_offers);

                if (priceA === null && priceB === null) return 0;
                if (priceA === null) return 1;
                if (priceB === null) return -1;

                return priceB - priceA;
            });
            break;

        case 'discount':
            // 할인율 높은순 (판매처 없는 제품은 맨 뒤로)
            sorted.sort((a, b) => {
                const discountA = getMaxDiscount(a.site_offers);
                const discountB = getMaxDiscount(b.site_offers);

                return discountB - discountA;
            });
            break;

        case 'default':
        default:
            // 기본순 - 시즌 최신순, 팀명순
            sorted.sort((a, b) => {
                if (a.season !== b.season) {
                    return b.season.localeCompare(a.season);
                }
                return a.team.localeCompare(b.team);
            });
            break;
    }

    return sorted;
}

// 환율 정보 (네이버 증권 실시간 환율 기준)
const exchangeRates = {
    USD: 1469.60,   // 미국 달러
    EUR: 1700.69,   // 유럽 유로
    GBP: 1931.33,   // 영국 파운드
    JPY: 950.27     // 일본 100엔
};

// 원화 환산
function convertToKRW(amount, currency) {
    if (currency === 'KRW' || !currency) return amount;

    const rate = exchangeRates[currency];
    if (!rate) return amount;

    if (currency === 'JPY') {
        return (amount / 100) * rate;
    }

    return amount * rate;
}

// 최저가 계산 (원화 기준)
function getLowestPrice(siteOffers) {
    if (!siteOffers || siteOffers.length === 0) return null;

    const prices = siteOffers.map(offer => {
        return offer.sale_price_krw || convertToKRW(offer.sale_price, offer.currency);
    });
    return Math.min(...prices);
}

// 최대 할인율 계산
function getMaxDiscount(siteOffers) {
    if (!siteOffers || siteOffers.length === 0) return 0;

    const discounts = siteOffers.map(offer => offer.discount_rate);
    return Math.max(...discounts);
}

// 가격 포맷팅
function formatPrice(price) {
    return price.toLocaleString('ko-KR') + '원';
}

// 제품 카드 생성
function createProductCard(product) {
    const hasOffers = product.site_offers && product.site_offers.length > 0;
    const lowestPrice = hasOffers ? getLowestPrice(product.site_offers) : null;
    const maxDiscount = hasOffers ? getMaxDiscount(product.site_offers) : 0;

    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer';
    card.onclick = () => {
        window.location.href = `product.html?id=${product.model_code}`;
    };

    // Version badge color
    const versionBadgeClass = product.version === '어센틱' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700';
    const versionText = product.version || '레플리카';

    // 가격 영역 HTML
    const priceHTML = hasOffers ? `
        <div class="flex items-center justify-between">
            <div>
                <div class="text-xs text-gray-500 mb-1">최저가</div>
                <div class="text-xl font-black text-green-600">${formatPrice(lowestPrice)}</div>
            </div>
            <div class="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                ${maxDiscount}% ↓
            </div>
        </div>
    ` : `
        <div class="text-center py-2">
            <div class="text-sm text-gray-500 mb-1">판매처 준비중</div>
            <div class="text-xs text-gray-400">곧 업데이트 예정입니다</div>
        </div>
    `;

    card.innerHTML = `
        <div class="aspect-square bg-gray-100 overflow-hidden">
            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300">
        </div>
        <div class="p-4">
            <div class="flex items-center mb-2 flex-wrap gap-1">
                <span class="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">${product.team}</span>
                <span class="text-xs text-gray-500">${product.season}</span>
                <span class="text-xs font-semibold ${versionBadgeClass} px-2 py-1 rounded">${versionText}</span>
            </div>
            <h3 class="font-bold text-gray-800 mb-1 line-clamp-2">${product.name}</h3>
            <p class="text-sm text-gray-600 mb-3">${product.kit_type}</p>
            ${priceHTML}
        </div>
    `;

    return card;
}

// 제품 렌더링
function renderProducts() {
    const filteredProducts = filterProducts();
    const sortedProducts = sortProducts(filteredProducts);
    const productGrid = document.getElementById('productGrid');
    const resultCount = document.getElementById('resultCount');

    // 기존 제품 제거
    productGrid.innerHTML = '';

    // 결과 카운트 업데이트
    resultCount.textContent = sortedProducts.length;

    // 결과가 없을 때
    if (sortedProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-gray-500 text-lg mb-2">😢 검색 결과가 없습니다.</p>
                <p class="text-gray-400 text-sm">다른 필터 조건을 선택해보세요.</p>
            </div>
        `;
        return;
    }

    // 제품 카드 생성 및 추가
    sortedProducts.forEach(product => {
        const card = createProductCard(product);
        productGrid.appendChild(card);
    });
}

// 날짜 포맷팅 함수
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
}

// 날짜 표시 텍스트 생성
function getDateRangeText(startDate, endDate) {
    const hasStart = startDate && startDate.trim() !== '';
    const hasEnd = endDate && endDate.trim() !== '';

    if (!hasStart && !hasEnd) return '';

    if (hasStart && hasEnd) {
        return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
    } else if (hasStart) {
        return `${formatDate(startDate)} ~`;
    } else {
        return `~ ${formatDate(endDate)}`;
    }
}

// 블프 세일 사이트 렌더링
function renderBlackFridaySites() {
    const container = document.getElementById('blackFridaySitesContainer');
    if (!container) return;

    // visible이 true인 사이트만 필터링
    const visibleSites = blackFridaySites.filter(site => site.visible !== false);

    container.innerHTML = '';

    visibleSites.forEach(site => {
        const colorMap = {
            'orange': { bg: 'from-orange-50 to-orange-100', border: 'border-orange-200', text: 'text-orange-600', badge: 'bg-orange-500' },
            'blue': { bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', text: 'text-blue-600', badge: 'bg-blue-500' },
            'gray': { bg: 'from-gray-50 to-gray-100', border: 'border-gray-200', text: 'text-gray-600', badge: 'bg-gray-500' },
            'green': { bg: 'from-green-50 to-green-100', border: 'border-green-200', text: 'text-green-600', badge: 'bg-green-500' },
            'purple': { bg: 'from-purple-50 to-purple-100', border: 'border-purple-200', text: 'text-purple-600', badge: 'bg-purple-500' },
            'indigo': { bg: 'from-indigo-50 to-indigo-100', border: 'border-indigo-200', text: 'text-indigo-600', badge: 'bg-indigo-500' }
        };

        const colors = colorMap[site.color] || colorMap['gray'];
        const dateText = getDateRangeText(site.startDate, site.endDate);

        const card = document.createElement('a');
        card.href = site.url;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.className = `block relative overflow-hidden p-6 bg-gradient-to-br ${colors.bg} rounded-lg border-2 ${colors.border} hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer`;
        card.style.aspectRatio = '1'; // 정사각형

        card.innerHTML = `
            <div class="absolute top-2 right-2">
                <span class="${colors.badge} text-white text-xs font-bold px-2 py-1 rounded-full">
                    ${site.discount}
                </span>
            </div>
            <div class="flex flex-col h-full justify-between">
                <div>
                    <h3 class="font-bold text-lg text-gray-800 mb-2">${site.name}</h3>
                    <p class="text-xs ${colors.text} font-semibold mb-1">${site.type}</p>
                    ${dateText ? `<p class="text-xs text-gray-500 font-medium mt-1">📅 ${dateText}</p>` : ''}
                </div>
                <div class="mt-auto">
                    <p class="text-xs text-gray-600 leading-relaxed">${site.description}</p>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}
