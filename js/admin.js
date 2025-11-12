// 관리자 페이지 JavaScript

// 전역 변수
let currentProduct = null;
let exchangeRates = {
    USD: 1469.60,   // 미국 달러 (네이버 증권 실시간)
    EUR: 1700.69,   // 유럽 유로
    GBP: 1931.33,   // 영국 파운드
    JPY: 950.27     // 일본 100엔
};

// 환율 정보 가져오기 (네이버 증권 실시간 환율 기준)
async function fetchExchangeRates() {
    try {
        // 네이버 증권 실시간 환율 기준 (2025년 11월 12일 13:46 기준)
        // 실제 서비스에서는 백엔드 API를 통해 실시간으로 가져와야 함
        const currentRates = {
            USD: 1469.60,  // 미국 달러
            EUR: 1700.69,  // 유럽 유로
            GBP: 1931.33,  // 영국 파운드 (USD 1,469.60 × 1.3145)
            JPY: 950.27    // 일본 100엔
        };

        exchangeRates = currentRates;
        updateExchangeRateDisplay();

        console.log('환율 정보 업데이트 완료 (네이버 증권 기준)');
        return true;
    } catch (error) {
        console.error('환율 정보 가져오기 실패:', error);
        return false;
    }
}

// 환율 표시 업데이트
function updateExchangeRateDisplay() {
    document.getElementById('rate-USD').textContent = `₩${exchangeRates.USD.toLocaleString('ko-KR')}`;
    document.getElementById('rate-EUR').textContent = `₩${exchangeRates.EUR.toLocaleString('ko-KR')}`;
    document.getElementById('rate-GBP').textContent = `₩${exchangeRates.GBP.toLocaleString('ko-KR')}`;
    document.getElementById('rate-JPY').textContent = `₩${exchangeRates.JPY.toLocaleString('ko-KR')}`;
}

// 원화 환산
function convertToKRW(amount, currency) {
    if (currency === 'KRW') return amount;

    const rate = exchangeRates[currency];
    if (!rate) return 0;

    if (currency === 'JPY') {
        // 엔화는 100엔 기준
        return (amount / 100) * rate;
    }

    return amount * rate;
}

// 환산 가격 표시 업데이트
function updatePriceConversion() {
    const currency = document.getElementById('newCurrency').value;
    const regularPrice = parseFloat(document.getElementById('newRegularPrice').value) || 0;
    const salePrice = parseFloat(document.getElementById('newSalePrice').value) || 0;

    const regularPriceKRW = document.getElementById('regularPriceKRW');
    const salePriceKRW = document.getElementById('salePriceKRW');

    if (currency === 'KRW') {
        regularPriceKRW.textContent = '';
        salePriceKRW.textContent = '';
    } else {
        if (regularPrice > 0) {
            const krwAmount = convertToKRW(regularPrice, currency);
            regularPriceKRW.textContent = `≈ ₩${Math.round(krwAmount).toLocaleString('ko-KR')}`;
        } else {
            regularPriceKRW.textContent = '';
        }

        if (salePrice > 0) {
            const krwAmount = convertToKRW(salePrice, currency);
            salePriceKRW.textContent = `≈ ₩${Math.round(krwAmount).toLocaleString('ko-KR')}`;
        } else {
            salePriceKRW.textContent = '';
        }
    }

    // 할인율 계산
    if (regularPrice > 0 && salePrice > 0) {
        const discount = Math.round(((regularPrice - salePrice) / regularPrice) * 100);
        document.getElementById('calculatedDiscount').textContent = `${discount}%`;
    } else {
        document.getElementById('calculatedDiscount').textContent = '0%';
    }
}

// 탭 전환
function switchTab(tabName) {
    // 모든 탭 버튼과 컨텐츠 비활성화
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    // 선택된 탭 활성화
    document.getElementById(`tab-${tabName}`).classList.add('active');
    document.getElementById(`content-${tabName}`).classList.remove('hidden');
}

// 제품 추가
function addNewProduct() {
    const team = document.getElementById('newProductTeam').value.trim();
    const kitType = document.getElementById('newProductKitType').value;
    const season = document.getElementById('newProductSeason').value;
    const version = document.getElementById('newProductVersion').value;
    const name = document.getElementById('newProductName').value.trim();
    const modelCode = document.getElementById('newProductModelCode').value.trim();
    const image = document.getElementById('newProductImage').value.trim();

    // 유효성 검사
    if (!team || !name || !modelCode || !image) {
        alert('모든 필수 항목을 입력해주세요');
        return;
    }

    // 중복 모델 코드 확인
    if (uniformData.find(p => p.model_code === modelCode)) {
        alert('이미 존재하는 모델 코드입니다');
        return;
    }

    // 새 제품 생성
    const newProduct = {
        team: team,
        kit_type: kitType,
        season: season,
        version: version,
        name: name,
        model_code: modelCode,
        image: image,
        site_offers: []
    };

    uniformData.push(newProduct);

    // 폼 초기화
    document.getElementById('newProductTeam').value = '';
    document.getElementById('newProductName').value = '';
    document.getElementById('newProductModelCode').value = '';
    document.getElementById('newProductImage').value = '';

    // 목록 새로고침
    renderProductList();
    updateProductFilters();

    alert('제품이 추가되었습니다!');
}

// 제품 수정
function editProduct(modelCode) {
    const product = uniformData.find(p => p.model_code === modelCode);
    if (!product) return;

    const newName = prompt('제품명:', product.name);
    if (newName && newName.trim()) {
        product.name = newName.trim();
        renderProductList();
        alert('제품명이 수정되었습니다');
    }
}

// 제품 삭제
function deleteProduct(modelCode) {
    const index = uniformData.findIndex(p => p.model_code === modelCode);
    if (index === -1) return;

    const product = uniformData[index];

    if (confirm(`"${product.name}"을(를) 삭제하시겠습니까?`)) {
        uniformData.splice(index, 1);
        renderProductList();
        updateProductFilters();
        alert('제품이 삭제되었습니다');
    }
}

// 제품 노출 토글
function toggleVisibility(modelCode) {
    const product = uniformData.find(p => p.model_code === modelCode);
    if (!product) return;

    // visible 필드 토글 (기본값은 true)
    product.visible = product.visible === false ? true : false;

    renderProductList();

    const status = product.visible ? '노출됨' : '숨김';
    alert(`"${product.name}" 제품이 ${status} 상태로 변경되었습니다.`);
}

// 제품 목록 렌더링
function renderProductList() {
    const tbody = document.getElementById('productListBody');
    const searchTerm = document.getElementById('searchProduct').value.toLowerCase();
    const filterTeam = document.getElementById('filterProductTeam').value;

    // 필터링
    let filtered = uniformData.filter(p => {
        const matchSearch = !searchTerm ||
            p.name.toLowerCase().includes(searchTerm) ||
            p.team.toLowerCase().includes(searchTerm) ||
            p.model_code.toLowerCase().includes(searchTerm);

        const matchTeam = !filterTeam || p.team === filterTeam;

        return matchSearch && matchTeam;
    });

    // 정렬 (시즌 최신순, 팀명순)
    filtered.sort((a, b) => {
        if (a.season !== b.season) {
            return b.season.localeCompare(a.season);
        }
        return a.team.localeCompare(b.team);
    });

    tbody.innerHTML = '';

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="py-8 text-center text-gray-500">
                    검색 결과가 없습니다
                </td>
            </tr>
        `;
        return;
    }

    filtered.forEach(product => {
        const row = document.createElement('tr');
        row.className = 'border-b hover:bg-gray-50';

        const versionBadge = product.version === '어센틱' ?
            '<span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">어센틱</span>' :
            '<span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">레플리카</span>';

        row.innerHTML = `
            <td class="px-4 py-3">
                <img src="${product.image}" alt="${product.name}" class="w-16 h-16 object-cover rounded">
            </td>
            <td class="px-4 py-3">
                <div class="font-medium text-sm">${product.name}</div>
                <div class="text-xs text-gray-500 mt-1">${product.kit_type}</div>
            </td>
            <td class="px-4 py-3 text-sm">${product.team}</td>
            <td class="px-4 py-3 text-sm">${product.season}</td>
            <td class="px-4 py-3">${versionBadge}</td>
            <td class="px-4 py-3">
                <code class="text-xs bg-gray-100 px-2 py-1 rounded">${product.model_code}</code>
            </td>
            <td class="px-4 py-3 text-center">
                <span class="text-sm font-bold ${product.site_offers?.length > 0 ? 'text-green-600' : 'text-gray-400'}">
                    ${product.site_offers?.length || 0}개
                </span>
            </td>
            <td class="px-4 py-3 text-center">
                <button onclick="toggleVisibility('${product.model_code}')"
                        class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${product.visible !== false ? 'bg-green-500' : 'bg-gray-300'}">
                    <span class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${product.visible !== false ? 'translate-x-6' : 'translate-x-1'}"></span>
                </button>
            </td>
            <td class="px-4 py-3 text-center">
                <div class="flex gap-2 justify-center">
                    <button onclick="editProduct('${product.model_code}')"
                            class="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                        수정
                    </button>
                    <button onclick="deleteProduct('${product.model_code}')"
                            class="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                        삭제
                    </button>
                </div>
            </td>
        `;

        tbody.appendChild(row);
    });
}

// 제품 필터 업데이트
function updateProductFilters() {
    const teams = [...new Set(uniformData.map(p => p.team))].sort();
    const filterSelect = document.getElementById('filterProductTeam');

    filterSelect.innerHTML = '<option value="">모든 팀</option>';
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team;
        option.textContent = team;
        filterSelect.appendChild(option);
    });
}

// 페이지 초기화
function initializePage() {
    // 환율 정보 가져오기
    fetchExchangeRates();

    // 팀 목록 채우기
    const teams = [...new Set(uniformData.map(p => p.team))].sort();
    const teamFilter = document.getElementById('adminTeamFilter');
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team;
        option.textContent = team;
        teamFilter.appendChild(option);
    });

    // 시즌 목록 채우기
    const seasons = [...new Set(uniformData.map(p => p.season))].sort().reverse();
    const seasonFilter = document.getElementById('adminSeasonFilter');
    seasons.forEach(season => {
        const option = document.createElement('option');
        option.value = season;
        option.textContent = season;
        seasonFilter.appendChild(option);
    });

    // 키트 유형 목록 채우기
    const kitTypes = [...new Set(uniformData.map(p => p.kit_type))];
    const kitFilter = document.getElementById('adminKitFilter');
    kitTypes.forEach(kit => {
        const option = document.createElement('option');
        option.value = kit;
        option.textContent = kit;
        kitFilter.appendChild(option);
    });

    // 이벤트 리스너
    teamFilter.addEventListener('change', updateProductList);
    seasonFilter.addEventListener('change', updateProductList);
    kitFilter.addEventListener('change', updateProductList);
    document.getElementById('productSelect').addEventListener('change', selectProduct);
    document.getElementById('refreshRates').addEventListener('click', fetchExchangeRates);

    // 가격 입력 필드 이벤트
    document.getElementById('newCurrency').addEventListener('change', updatePriceConversion);
    document.getElementById('newRegularPrice').addEventListener('input', updatePriceConversion);
    document.getElementById('newSalePrice').addEventListener('input', updatePriceConversion);

    // 탭 전환 이벤트
    document.getElementById('tab-products').addEventListener('click', () => switchTab('products'));
    document.getElementById('tab-offers').addEventListener('click', () => switchTab('offers'));

    // 제품 관리 탭 이벤트
    document.getElementById('addProductBtn').addEventListener('click', addNewProduct);
    document.getElementById('searchProduct').addEventListener('input', renderProductList);
    document.getElementById('filterProductTeam').addEventListener('change', renderProductList);

    // 제품 관리 탭 초기화
    renderProductList();
    updateProductFilters();

    // 버튼 이벤트 (판매처 관리 탭)
    document.getElementById('addOfferBtn').addEventListener('click', addOffer);
    document.getElementById('saveChangesBtn').addEventListener('click', saveChanges);
}

// 제품 목록 업데이트
function updateProductList() {
    const team = document.getElementById('adminTeamFilter').value;
    const season = document.getElementById('adminSeasonFilter').value;
    const kit = document.getElementById('adminKitFilter').value;

    const productSelect = document.getElementById('productSelect');
    productSelect.innerHTML = '<option value="">제품을 선택하세요</option>';

    const filtered = uniformData.filter(p => {
        return (!team || p.team === team) &&
               (!season || p.season === season) &&
               (!kit || p.kit_type === kit);
    });

    filtered.forEach((product, index) => {
        const option = document.createElement('option');
        option.value = product.model_code;
        option.textContent = `${product.name} [${product.model_code}]`;
        productSelect.appendChild(option);
    });
}

// 제품 선택
function selectProduct() {
    const modelCode = document.getElementById('productSelect').value;

    if (!modelCode) {
        currentProduct = null;
        document.getElementById('selectedProductInfo').classList.add('hidden');
        document.getElementById('offersList').innerHTML = '<p class="text-gray-500 text-center py-8">제품을 먼저 선택해주세요</p>';
        return;
    }

    currentProduct = uniformData.find(p => p.model_code === modelCode);

    if (currentProduct) {
        // 제품 정보 표시
        document.getElementById('selectedProductInfo').classList.remove('hidden');
        document.getElementById('selectedProductImage').src = currentProduct.image;
        document.getElementById('selectedProductName').textContent = currentProduct.name;
        document.getElementById('selectedProductCode').textContent = `모델 코드: ${currentProduct.model_code}`;

        // 판매처 목록 표시
        renderOffersList();
    }
}

// 판매처 목록 렌더링
function renderOffersList() {
    const offersList = document.getElementById('offersList');

    if (!currentProduct || !currentProduct.site_offers || currentProduct.site_offers.length === 0) {
        offersList.innerHTML = '<p class="text-gray-500 text-center py-8">등록된 판매처가 없습니다</p>';
        return;
    }

    offersList.innerHTML = '';

    currentProduct.site_offers.forEach((offer, index) => {
        const offerCard = document.createElement('div');
        offerCard.className = 'border-2 border-gray-200 rounded-lg p-4 hover:border-green-500 transition';

        // 통화 정보 (원화가 아닌 경우)
        const currency = offer.currency || 'KRW';
        const currencySymbol = {
            'KRW': '₩',
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'JPY': '¥'
        }[currency];

        const regularPriceKRW = currency !== 'KRW' ?
            `<span class="text-xs text-gray-500 ml-2">(약 ₩${Math.round(convertToKRW(offer.regular_price, currency)).toLocaleString('ko-KR')})</span>` : '';

        const salePriceKRW = currency !== 'KRW' ?
            `<span class="text-xs text-gray-500 ml-2">(약 ₩${Math.round(convertToKRW(offer.sale_price, currency)).toLocaleString('ko-KR')})</span>` : '';

        offerCard.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                        <h4 class="font-bold text-lg">${offer.site_name}</h4>
                        ${currency !== 'KRW' ? `<span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">${currency}</span>` : ''}
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-sm mb-2">
                        <div>
                            <span class="text-gray-600">정가:</span>
                            <span class="font-semibold">${currencySymbol}${offer.regular_price.toLocaleString('ko-KR')}</span>
                            ${regularPriceKRW}
                        </div>
                        <div>
                            <span class="text-gray-600">판매가:</span>
                            <span class="font-semibold text-green-600">${currencySymbol}${offer.sale_price.toLocaleString('ko-KR')}</span>
                            ${salePriceKRW}
                        </div>
                    </div>
                    <div class="text-sm mb-2">
                        <span class="text-gray-600">할인율:</span>
                        <span class="font-bold text-red-600">${offer.discount_rate}%</span>
                    </div>
                    <div class="text-sm">
                        <a href="${offer.affiliate_link}" target="_blank" class="text-blue-600 hover:underline text-xs break-all">
                            ${offer.affiliate_link}
                        </a>
                    </div>
                </div>
                <button onclick="deleteOffer(${index})"
                        class="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                    삭제
                </button>
            </div>
        `;

        offersList.appendChild(offerCard);
    });
}

// 판매처 추가
function addOffer() {
    if (!currentProduct) {
        alert('제품을 먼저 선택해주세요');
        return;
    }

    const siteName = document.getElementById('newSiteName').value.trim();
    const currency = document.getElementById('newCurrency').value;
    const regularPrice = parseFloat(document.getElementById('newRegularPrice').value);
    const salePrice = parseFloat(document.getElementById('newSalePrice').value);
    const affiliateLink = document.getElementById('newAffiliateLink').value.trim();

    // 유효성 검사
    if (!siteName) {
        alert('판매처 이름을 입력해주세요');
        return;
    }

    if (!regularPrice || regularPrice <= 0) {
        alert('유효한 정가를 입력해주세요');
        return;
    }

    if (!salePrice || salePrice <= 0) {
        alert('유효한 판매가를 입력해주세요');
        return;
    }

    if (salePrice > regularPrice) {
        alert('판매가는 정가보다 클 수 없습니다');
        return;
    }

    if (!affiliateLink || !affiliateLink.startsWith('http')) {
        alert('유효한 URL을 입력해주세요');
        return;
    }

    // 할인율 계산
    const discountRate = Math.round(((regularPrice - salePrice) / regularPrice) * 100);

    // 원화로 환산한 가격도 저장
    const regularPriceKRW = Math.round(convertToKRW(regularPrice, currency));
    const salePriceKRW = Math.round(convertToKRW(salePrice, currency));

    // 새 판매처 추가
    const newOffer = {
        site_name: siteName,
        currency: currency,
        regular_price: regularPrice,
        sale_price: salePrice,
        regular_price_krw: regularPriceKRW,
        sale_price_krw: salePriceKRW,
        discount_rate: discountRate,
        affiliate_link: affiliateLink
    };

    if (!currentProduct.site_offers) {
        currentProduct.site_offers = [];
    }

    currentProduct.site_offers.push(newOffer);

    // 폼 초기화
    document.getElementById('newSiteName').value = '';
    document.getElementById('newCurrency').value = 'KRW';
    document.getElementById('newRegularPrice').value = '';
    document.getElementById('newSalePrice').value = '';
    document.getElementById('newAffiliateLink').value = '';
    updatePriceConversion();

    // 목록 다시 렌더링
    renderOffersList();

    alert('판매처가 추가되었습니다!');
}

// 판매처 삭제
function deleteOffer(index) {
    if (!currentProduct) return;

    if (confirm('이 판매처를 삭제하시겠습니까?')) {
        currentProduct.site_offers.splice(index, 1);
        renderOffersList();
    }
}

// 변경사항 저장
function saveChanges() {
    const dataString = JSON.stringify(uniformData, null, 4);
    const fileContent = `// 유니폼 데이터\nconst uniformData = ${dataString};\n`;

    // Blob 생성 및 다운로드
    const blob = new Blob([fileContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('data.js 파일이 다운로드되었습니다.\n다운로드된 파일을 js/data.js로 교체해주세요.');
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', initializePage);
