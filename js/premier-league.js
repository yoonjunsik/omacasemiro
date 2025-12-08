// 프리미어리그 아우터 컬렉션 페이지 JavaScript

// 프리미어리그 구단 데이터 (인기/강팀 순)
const premierLeagueClubs = [
    {
        name: '맨체스터 유나이티드',
        nameEn: 'Manchester United',
        logo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
        url: 'https://store.manutd.com/en/c/clothing/outerwear',
        color: 'from-red-700 to-red-900',
        popularity: 1,
        products: []
    },
    {
        name: '리버풀',
        nameEn: 'Liverpool',
        logo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
        url: 'https://store.liverpoolfc.com/clothing/jackets',
        color: 'from-red-700 to-red-900',
        popularity: 2,
        products: []
    },
    {
        name: '맨체스터 시티',
        nameEn: 'Manchester City',
        logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
        url: 'https://shop.mancity.com/ca/en/clothing/outerwear/',
        color: 'from-sky-400 to-sky-600',
        popularity: 3,
        products: []
    },
    {
        name: '아스널',
        nameEn: 'Arsenal',
        logo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
        url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Outerwear/c/outerwear',
        color: 'from-red-600 to-red-800',
        popularity: 4,
        products: []
    },
    {
        name: '첼시',
        nameEn: 'Chelsea',
        logo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
        url: 'https://store.chelseafc.com/en/c-5112',
        color: 'from-blue-600 to-blue-800',
        popularity: 5,
        products: []
    },
    {
        name: '토트넘',
        nameEn: 'Tottenham',
        logo: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
        url: 'https://shop.tottenhamhotspur.com/outerwear',
        color: 'from-white to-gray-200',
        popularity: 6,
        products: []
    },
    {
        name: '뉴캐슬',
        nameEn: 'Newcastle',
        logo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg',
        url: 'https://shop.newcastleunited.com/collections/outerwear',
        color: 'from-black to-gray-800',
        popularity: 7,
        products: []
    },
    {
        name: '아스톤 빌라',
        nameEn: 'Aston Villa',
        logo: 'images/logos/Aston_Villa_FC_new_crest.svg.png',
        url: 'https://shop.avfc.co.uk/en/aston-villa-outerwear/t-65983654+x-08259219+z-81-3286515707',
        color: 'from-purple-900 to-blue-900',
        popularity: 8,
        products: []
    },
    {
        name: '웨스트햄',
        nameEn: 'West Ham United',
        logo: 'https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg',
        url: 'https://shop.whufc.com/outerwear',
        color: 'from-purple-900 to-sky-400',
        popularity: 9,
        products: []
    },
    {
        name: '브라이튼',
        nameEn: 'Brighton',
        logo: 'https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg',
        url: 'https://shop.brightonandhovealbion.com/outerwear',
        color: 'from-blue-500 to-white',
        popularity: 10,
        products: []
    },
    {
        name: '에버튼',
        nameEn: 'Everton',
        logo: 'https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg',
        url: 'https://store.evertonfc.com/en/everton-clothing/t-21098998+x-64698777+z-87-4155919997',
        color: 'from-blue-700 to-blue-900',
        popularity: 11,
        products: []
    },
    {
        name: '크리스탈 팰리스',
        nameEn: 'Crystal Palace',
        logo: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Crystal_Palace_FC_logo_%282022%29.svg',
        url: 'https://shop.cpfc.co.uk/outerwear',
        color: 'from-blue-600 to-red-600',
        popularity: 12,
        products: []
    },
    {
        name: '레스터',
        nameEn: 'Leicester City',
        logo: 'https://upload.wikimedia.org/wikipedia/en/2/2d/Leicester_City_crest.svg',
        url: 'https://shop.lcfc.com/outerwear',
        color: 'from-blue-600 to-white',
        popularity: 13,
        products: []
    },
    {
        name: '풀럼',
        nameEn: 'Fulham',
        logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Fulham_FC_%28shield%29.svg',
        url: 'https://shop.fulhamfc.com/collections/mens-outerwear',
        color: 'from-white to-black',
        popularity: 14,
        products: []
    },
    {
        name: '본머스',
        nameEn: 'Bournemouth',
        logo: 'https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_%282013%29.svg',
        url: 'https://shop.afcb.co.uk/collections/mens-outerwear',
        color: 'from-red-600 to-black',
        popularity: 15,
        products: []
    },
    {
        name: '울버햄튼',
        nameEn: 'Wolverhampton',
        logo: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg',
        url: 'https://shop.wolves.co.uk/collections/outerwear',
        color: 'from-yellow-600 to-black',
        popularity: 16,
        products: []
    },
    {
        name: '노팅엄 포레스트',
        nameEn: 'Nottingham Forest',
        logo: 'https://upload.wikimedia.org/wikipedia/en/e/e5/Nottingham_Forest_F.C._logo.svg',
        url: 'https://shop.nottinghamforest.co.uk/collections/outerwear',
        color: 'from-red-700 to-red-900',
        popularity: 17,
        products: []
    },
    {
        name: '브렌트포드',
        nameEn: 'Brentford',
        logo: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg',
        url: 'https://shop.brentfordfc.com/collections/mens-outerwear',
        color: 'from-red-600 to-yellow-500',
        popularity: 18,
        products: []
    },
    {
        name: '입스위치',
        nameEn: 'Ipswich Town',
        logo: 'https://upload.wikimedia.org/wikipedia/en/4/43/Ipswich_Town.svg',
        url: 'https://shop.itfc.co.uk/collections/mens-outerwear',
        color: 'from-blue-600 to-blue-800',
        popularity: 19,
        products: []
    },
    {
        name: '사우샘프턴',
        nameEn: 'Southampton',
        logo: 'https://upload.wikimedia.org/wikipedia/en/c/c9/FC_Southampton.svg',
        url: 'https://shop.southamptonfc.com/collections/mens-outerwear',
        color: 'from-red-600 to-white',
        popularity: 20,
        products: []
    }
];

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('⚽ 프리미어리그 페이지 초기화 시작...');
    renderClubs();
    console.log('✅ 프리미어리그 페이지 초기화 완료');
});

// 구단 카드 렌더링
function renderClubs() {
    const grid = document.getElementById('clubsGrid');
    grid.innerHTML = '';

    // 인기/강팀 순서대로 정렬 (popularity 속성 기준)
    const sortedClubs = [...premierLeagueClubs].sort((a, b) => {
        return a.popularity - b.popularity;
    });

    sortedClubs.forEach(club => {
        const card = createClubCard(club);
        grid.appendChild(card);
    });
}

// 구단 카드 생성
function createClubCard(club) {
    const card = document.createElement('div');
    card.className = 'group bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border-2 border-transparent hover:border-purple-600';

    card.innerHTML = `
        <div class="relative h-48 bg-gradient-to-br ${club.color} flex items-center justify-center p-6">
            <img src="${club.logo}" alt="${club.name}" class="w-24 h-24 md:w-32 md:h-32 object-contain filter drop-shadow-2xl group-hover:scale-110 transition-transform">
        </div>
        <div class="p-4">
            <h3 class="text-xl font-black text-gray-800 mb-2">${club.name}</h3>
            <p class="text-sm text-gray-600 mb-3">${club.nameEn}</p>
            <div class="flex items-center justify-between">
                <span class="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold">
                    🧥 아우터 컬렉션
                </span>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        </div>
    `;

    card.onclick = () => {
        window.location.href = `premier-league-club.html?club=${encodeURIComponent(club.nameEn.toLowerCase())}`;
    };

    return card;
}

// 전역으로 내보내기
window.premierLeagueClubs = premierLeagueClubs;
