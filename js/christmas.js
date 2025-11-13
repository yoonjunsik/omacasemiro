// 크리스마스 에디션 페이지 JavaScript

// 크리스마스 샵 구단 데이터
const christmasClubs = [
    {
        name: '아스널',
        nameEn: 'Arsenal',
        logo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
        url: 'https://arsenaldirect.arsenal.com/Christmas-Shop/c/christmas',
        color: 'from-red-600 to-red-800',
        league: '프리미어리그'
    },
    {
        name: '첼시',
        nameEn: 'Chelsea',
        logo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
        url: 'https://store.chelseafc.com/en/c-7104',
        color: 'from-blue-600 to-blue-800',
        league: '프리미어리그'
    }
];

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎄 크리스마스 페이지 초기화 시작...');
    renderClubs();
    console.log('✅ 크리스마스 페이지 초기화 완료');
});

// 구단 카드 렌더링
function renderClubs() {
    const grid = document.getElementById('clubsGrid');
    grid.innerHTML = '';

    christmasClubs.forEach(club => {
        const card = createClubCard(club);
        grid.appendChild(card);
    });
}

// 구단 카드 생성
function createClubCard(club) {
    const card = document.createElement('div');
    card.className = 'group bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border-2 border-transparent hover:border-red-500';

    card.innerHTML = `
        <div class="relative h-48 bg-gradient-to-br ${club.color} flex items-center justify-center p-6">
            <div class="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-bold text-gray-700">
                ${club.league}
            </div>
            <div class="absolute top-2 right-2 text-2xl">
                🎄
            </div>
            <img src="${club.logo}" alt="${club.name}" class="w-24 h-24 md:w-32 md:h-32 object-contain filter drop-shadow-2xl group-hover:scale-110 transition-transform">
        </div>
        <div class="p-4">
            <h3 class="text-xl font-black text-gray-800 mb-2">${club.name}</h3>
            <p class="text-sm text-gray-600 mb-3">${club.nameEn}</p>
            <div class="flex items-center justify-between">
                <span class="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold">
                    🎁 크리스마스 샵
                </span>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        </div>
    `;

    card.onclick = () => {
        window.location.href = `christmas-club.html?club=${encodeURIComponent(club.nameEn.toLowerCase())}`;
    };

    return card;
}

// 전역으로 내보내기
window.christmasClubs = christmasClubs;
