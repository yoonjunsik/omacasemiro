// 크리스마스 에디션 페이지 JavaScript

// 전역 변수
let filteredProducts = [];
let currentFilters = {
    team: 'all',
    sort: 'discount'
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎄 크리스마스 페이지 초기화 시작...');

    // 크리스마스 에디션만 필터링 (임시로 모든 제품 표시)
    filteredProducts = uniformData.filter(product => {
        // 크리스마스 에디션 제품 필터링 로직
        // 나중에 product.is_christmas 같은 필드로 구분 가능
        return product.visible !== false;
    });

    // 이벤트 리스너 등록
    setupEventListeners();

    // 초기 렌더링
    applyFilters();

    console.log('✅ 크리스마스 페이지 초기화 완료');
});

// 이벤트 리스너 설정
function setupEventListeners() {
    // 팀 필터 버튼
    document.querySelectorAll('#teamFilter .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#teamFilter .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilters.team = btn.dataset.team;
            applyFilters();
        });
    });

    // 정렬 선택
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        currentFilters.sort = e.target.value;
        applyFilters();
    });
}

// 필터 적용
function applyFilters() {
    let products = [...filteredProducts];

    // 팀 필터
    if (currentFilters.team !== 'all') {
        products = products.filter(p => p.team === currentFilters.team);
    }

    // 정렬
    switch (currentFilters.sort) {
        case 'discount':
            products.sort((a, b) => {
                const aDiscount = getMaxDiscount(a);
                const bDiscount = getMaxDiscount(b);
                return bDiscount - aDiscount;
            });
            break;
        case 'price-low':
            products.sort((a, b) => getMinPrice(a) - getMinPrice(b));
            break;
        case 'price-high':
            products.sort((a, b) => getMinPrice(b) - getMinPrice(a));
            break;
        case 'name':
            products.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
            break;
    }

    renderProducts(products);
}

// 최대 할인율 가져오기
function getMaxDiscount(product) {
    if (!product.site_offers || product.site_offers.length === 0) return 0;
    return Math.max(...product.site_offers.map(offer => offer.discount_rate || 0));
}

// 최저가 가져오기
function getMinPrice(product) {
    if (!product.site_offers || product.site_offers.length === 0) return Infinity;
    return Math.min(...product.site_offers.map(offer => offer.sale_price_krw || offer.sale_price || Infinity));
}

// 제품 렌더링
function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    const emptyState = document.getElementById('emptyState');
    const countElement = document.getElementById('productCount');

    countElement.textContent = products.length;

    if (products.length === 0) {
        grid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    grid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    grid.innerHTML = '';

    products.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

// 제품 카드 생성
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border-2 border-transparent hover:border-red-500';

    // 최저가 및 최대 할인율 계산
    const minPrice = getMinPrice(product);
    const maxDiscount = getMaxDiscount(product);

    // 크리스마스 배지
    const christmasBadge = `
        <div class="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            🎄 XMAS
        </div>
    `;

    // 할인율 배지
    const discountBadge = maxDiscount > 0 ? `
        <div class="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
            ${maxDiscount}% 할인
        </div>
    ` : '';

    card.innerHTML = `
        <div class="relative">
            <img src="${product.image}"
                 alt="${product.name}"
                 class="w-full h-48 md:h-64 object-cover"
                 onerror="this.src='https://via.placeholder.com/400x500?text=No+Image'">
            ${christmasBadge}
            ${discountBadge}
        </div>
        <div class="p-3 md:p-4">
            <h3 class="font-bold text-sm md:text-base mb-2 text-gray-800 line-clamp-2">${product.name}</h3>
            <div class="flex items-center justify-between mb-2">
                <span class="text-xs md:text-sm text-gray-600">${product.team}</span>
                <span class="text-xs md:text-sm font-semibold text-red-600">${product.season}</span>
            </div>
            ${minPrice !== Infinity ? `
                <div class="mt-3 pt-3 border-t border-gray-200">
                    <p class="text-xs text-gray-500">최저가</p>
                    <p class="text-lg md:text-xl font-black text-red-600">₩${minPrice.toLocaleString('ko-KR')}</p>
                </div>
            ` : ''}
            <div class="mt-3">
                <span class="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                    ${product.site_offers?.length || 0}개 판매처
                </span>
            </div>
        </div>
    `;

    card.onclick = () => {
        window.location.href = `product.html?id=${product.model_code}`;
    };

    return card;
}
