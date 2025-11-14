// 구 모델 코드 → 새 모델 코드 매핑
const modelCodeRedirects = {
    'SD-367399': 'IU1397',      // 맨유 24/25 홈킷
    'SD-377880': 'KD4225',      // 맨유 25/26 써드킷
    'SD-377428': '78033801',    // 맨시티 25/26 홈킷
    'SD-377422': 'HJ4598101',   // 토트넘 25/26 홈킷
    'SD-378746': 'JV6487',      // 리버풀 25/26 어웨이킷
    'SD-377841': 'KE6801',      // 바이에른 25/26 써드킷
    'SD-377848': 'KC3486'       // 유벤투스 25/26 써드킷
};

// URL 파라미터에서 상품 ID 가져오기
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    let modelCode = urlParams.get('id');

    // 구 모델 코드인 경우 새 모델 코드로 리다이렉트
    if (modelCode && modelCodeRedirects[modelCode]) {
        const newModelCode = modelCodeRedirects[modelCode];
        console.log(`Redirecting from old model code ${modelCode} to ${newModelCode}`);
        window.location.href = `product.html?id=${newModelCode}`;
        return null; // 리다이렉트 중이므로 null 반환
    }

    return modelCode;
}

// 상품 데이터 찾기
function findProduct(modelCode) {
    return uniformData.find(product => product.model_code === modelCode);
}

// 환율 정보 (네이버 증권 실시간 환율 기준)
const exchangeRates = {
    USD: 1469.60,   // 미국 달러
    EUR: 1700.69,   // 유럽 유로
    GBP: 1931.33,   // 영국 파운드 (USD × GBP/USD 환율)
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

// 가격 포맷팅 (통화 지원)
function formatPrice(price, currency = 'KRW') {
    if (!currency || currency === 'KRW') {
        return price.toLocaleString('ko-KR') + '원';
    }

    const symbols = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥'
    };

    return `${symbols[currency] || ''}${price.toLocaleString('ko-KR')}`;
}

// 원화 환산 표시 추가
function formatPriceWithKRW(price, currency = 'KRW') {
    const formatted = formatPrice(price, currency);

    if (!currency || currency === 'KRW') {
        return formatted;
    }

    const krwAmount = Math.round(convertToKRW(price, currency));
    return `${formatted} <span class="text-sm text-gray-500">(약 ₩${krwAmount.toLocaleString('ko-KR')})</span>`;
}

// 최저가 및 정가 계산 (원화 기준)
function getBestPriceInfo(siteOffers) {
    if (!siteOffers || siteOffers.length === 0) return null;

    // 모두 원화로 환산하여 비교
    const sortedOffers = [...siteOffers].sort((a, b) => {
        const priceA = a.sale_price_krw || convertToKRW(a.sale_price, a.currency);
        const priceB = b.sale_price_krw || convertToKRW(b.sale_price, b.currency);
        return priceA - priceB;
    });

    const bestOffer = sortedOffers[0];

    return {
        salePrice: bestOffer.sale_price,
        regularPrice: bestOffer.regular_price,
        discountRate: bestOffer.discount_rate,
        currency: bestOffer.currency || 'KRW'
    };
}

// 제품 정보 렌더링
function renderProductInfo(product) {
    // 제품 이미지
    const productImage = document.querySelector('#productImage img');
    productImage.src = product.image;
    productImage.alt = product.name;

    // 제품 정보
    document.getElementById('productTeam').textContent = product.team;
    document.getElementById('productSeason').textContent = product.season;

    // 버전 뱃지 추가
    const versionBadge = document.createElement('span');
    const versionClass = product.version === '어센틱' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
    versionBadge.className = `inline-block ${versionClass} px-3 py-1 rounded-full text-sm font-semibold ml-2`;
    versionBadge.textContent = product.version || '레플리카';
    document.getElementById('productSeason').parentElement.appendChild(versionBadge);

    document.getElementById('productName').textContent = product.name;
    document.getElementById('productKitType').textContent = product.kit_type;
    document.getElementById('productModelCode').textContent = product.model_code;

    // 최저가 정보
    const priceInfo = getBestPriceInfo(product.site_offers);
    document.getElementById('bestPrice').innerHTML = formatPriceWithKRW(priceInfo.salePrice, priceInfo.currency);
    document.getElementById('originalPrice').innerHTML = formatPriceWithKRW(priceInfo.regularPrice, priceInfo.currency);
    document.getElementById('discountRate').textContent = priceInfo.discountRate + '% 할인';
}

// 가격 비교 테이블 렌더링
function renderPriceTable(siteOffers) {
    const tableBody = document.getElementById('priceTableBody');
    tableBody.innerHTML = '';

    // 가격순으로 정렬 (원화 기준)
    const sortedOffers = [...siteOffers].sort((a, b) => {
        const priceA = a.sale_price_krw || convertToKRW(a.sale_price, a.currency);
        const priceB = b.sale_price_krw || convertToKRW(b.sale_price, b.currency);
        return priceA - priceB;
    });

    sortedOffers.forEach((offer, index) => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-200 hover:bg-gray-50 transition';

        // 최저가 강조
        const isBestPrice = index === 0;
        const rowClass = isBestPrice ? 'bg-green-50' : '';

        const currency = offer.currency || 'KRW';
        const currencyBadge = currency !== 'KRW' ?
            `<span class="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">${currency}</span>` : '';

        row.innerHTML = `
            <td class="py-4 px-4 ${rowClass}">
                <div class="flex items-center flex-wrap gap-2">
                    <span class="font-semibold text-gray-800">${offer.site_name}</span>
                    ${isBestPrice ? '<span class="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">최저가</span>' : ''}
                    ${currencyBadge}
                </div>
            </td>
            <td class="py-4 px-4 text-right text-gray-500 ${rowClass}">
                <div>${formatPriceWithKRW(offer.regular_price, currency)}</div>
            </td>
            <td class="py-4 px-4 text-right ${rowClass}">
                <span class="font-bold text-red-500">${offer.discount_rate}%</span>
            </td>
            <td class="py-4 px-4 text-right ${rowClass}">
                <div class="text-lg font-black text-gray-900">${formatPriceWithKRW(offer.sale_price, currency)}</div>
            </td>
            <td class="py-4 px-4 text-center ${rowClass}">
                <a href="${offer.affiliate_link}"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition">
                    구매하기
                </a>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// 페이지 초기화
function initializePage() {
    const productId = getProductIdFromUrl();

    // 로딩 상태 요소
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const productDetail = document.getElementById('productDetail');

    if (!productId) {
        // ID가 없으면 에러 표시
        loading.classList.add('hidden');
        error.classList.remove('hidden');
        return;
    }

    // 제품 찾기
    const product = findProduct(productId);

    if (!product) {
        // 제품을 찾지 못하면 에러 표시
        loading.classList.add('hidden');
        error.classList.remove('hidden');
        return;
    }

    // 제품 정보 렌더링
    renderProductInfo(product);
    renderPriceTable(product.site_offers);

    // 페이지 타이틀 업데이트
    document.title = `${product.name} - 오마카세미루`;

    // 로딩 숨기고 상세 정보 표시
    loading.classList.add('hidden');
    productDetail.classList.remove('hidden');
}

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', initializePage);
