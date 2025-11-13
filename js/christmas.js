// 크리스마스 에디션 페이지 JavaScript

// 크리스마스 샵 구단 데이터
const christmasClubs = [
    {
        name: '아스널',
        nameEn: 'Arsenal',
        logo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
        url: 'https://arsenaldirect.arsenal.com/Christmas-Shop/c/christmas',
        color: 'from-red-600 to-red-800',
        league: '프리미어리그',
        products: [
            {
                name: 'Arsenal Highbury Wonderland Christmas Jumper',
                image: 'https://i1.adis.ws/i/ArsenalDirect/u06904_f?$plpImages$',
                url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Knitwear/Arsenal-Highbury-Wonderland-Christmas-Jumper/p/U06904'
            },
            {
                name: 'Arsenal Crest Christmas Jumper',
                image: 'https://i1.adis.ws/i/ArsenalDirect/u06903_f?$plpImages$',
                url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Knitwear/Arsenal-Crest-Christmas-Jumper/p/U06903'
            },
            {
                name: 'Arsenal 6pk Bauble Set',
                image: 'https://i1.adis.ws/i/ArsenalDirect/g06870_f?$plpImages$',
                url: 'https://arsenaldirect.arsenal.com/Christmas-Shop/Arsenal-6pk-Bauble-Set/p/G06870'
            },
            {
                name: 'Arsenal 9pk Bauble Set',
                image: 'https://i1.adis.ws/i/ArsenalDirect/g06869_f?$plpImages$',
                url: 'https://arsenaldirect.arsenal.com/Christmas-Shop/Arsenal-9pk-Bauble-Set/p/G06869'
            },
            {
                name: 'Arsenal 2pk Bauble Set',
                image: 'https://i1.adis.ws/i/ArsenalDirect/g06871_f?$plpImages$',
                url: 'https://arsenaldirect.arsenal.com/Christmas-Shop/Arsenal-2pk-Bauble-Set/p/G06871'
            },
            {
                name: 'Arsenal Large Glitter Bauble',
                image: 'https://i1.adis.ws/i/ArsenalDirect/g06868_f?$plpImages$',
                url: 'https://arsenaldirect.arsenal.com/Christmas-Shop/Arsenal-Large-Glitter-Bauble/p/G06868'
            },
            {
                name: 'Arsenal Christmas Bear',
                image: 'https://i1.adis.ws/i/ArsenalDirect/g06842_f?$plpImages$',
                url: 'https://arsenaldirect.arsenal.com/Gifts/Toys/Arsenal-Christmas-Bear/p/G06842'
            },
            {
                name: 'Arsenal Christmas Elf',
                image: 'https://i1.adis.ws/i/ArsenalDirect/g06841_f?$plpImages$',
                url: 'https://arsenaldirect.arsenal.com/Gifts/Toys/Arsenal-Christmas-Elf/p/G06841'
            },
            {
                name: 'Arsenal Christmas Stocking',
                image: 'https://i1.adis.ws/i/ArsenalDirect/g06838_f?$plpImages$',
                url: 'https://arsenaldirect.arsenal.com/Clothing/Accessories/Arsenal-Christmas-Stocking/p/G06838'
            },
            {
                name: 'Arsenal Christmas Sack',
                image: 'https://i1.adis.ws/i/ArsenalDirect/g06839_f?$plpImages$',
                url: 'https://arsenaldirect.arsenal.com/Clothing/Accessories/Bags-%26-Wallets/Arsenal-Christmas-Sack/p/G06839'
            },
            {
                name: 'Arsenal Kids Highbury Wonderland Christmas Jumper',
                image: 'https://i1.adis.ws/i/ArsenalDirect/k06703_f?$plpImages$',
                url: 'https://arsenaldirect.arsenal.com/Clothing/Kids-Clothing/Kids-Sweatshirts-%26-Hoodies/Arsenal-Kids-Highbury-Wonderland-Christmas-Jumper/p/K06703'
            },
            {
                name: 'Arsenal Kids Crest Christmas Jumper',
                image: 'https://i1.adis.ws/i/ArsenalDirect/k06702_f?$plpImages$',
                url: 'https://arsenaldirect.arsenal.com/Clothing/Kids-Clothing/Kids-Sweatshirts-%26-Hoodies/Arsenal-Kids-Crest-Christmas-Jumper/p/K06702'
            }
        ]
    },
    {
        name: '첼시',
        nameEn: 'Chelsea',
        logo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
        url: 'https://store.chelseafc.com/en/c-7104',
        color: 'from-blue-600 to-blue-800',
        league: '프리미어리그',
        products: [
            { name: 'Chelsea Christmas Product 1', image: 'https://via.placeholder.com/400x400/034694/ffffff?text=Chelsea+Christmas+1', url: 'https://store.chelseafc.com/en/c-7104' },
            { name: 'Chelsea Christmas Product 2', image: 'https://via.placeholder.com/400x400/034694/ffffff?text=Chelsea+Christmas+2', url: 'https://store.chelseafc.com/en/c-7104' },
            { name: 'Chelsea Christmas Product 3', image: 'https://via.placeholder.com/400x400/034694/ffffff?text=Chelsea+Christmas+3', url: 'https://store.chelseafc.com/en/c-7104' },
            { name: 'Chelsea Christmas Product 4', image: 'https://via.placeholder.com/400x400/034694/ffffff?text=Chelsea+Christmas+4', url: 'https://store.chelseafc.com/en/c-7104' },
            { name: 'Chelsea Christmas Product 5', image: 'https://via.placeholder.com/400x400/034694/ffffff?text=Chelsea+Christmas+5', url: 'https://store.chelseafc.com/en/c-7104' },
            { name: 'Chelsea Christmas Product 6', image: 'https://via.placeholder.com/400x400/034694/ffffff?text=Chelsea+Christmas+6', url: 'https://store.chelseafc.com/en/c-7104' },
            { name: 'Chelsea Christmas Product 7', image: 'https://via.placeholder.com/400x400/034694/ffffff?text=Chelsea+Christmas+7', url: 'https://store.chelseafc.com/en/c-7104' },
            { name: 'Chelsea Christmas Product 8', image: 'https://via.placeholder.com/400x400/034694/ffffff?text=Chelsea+Christmas+8', url: 'https://store.chelseafc.com/en/c-7104' }
        ]
    },
    {
        name: '토트넘',
        nameEn: 'Tottenham',
        logo: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
        url: 'https://shop.tottenhamhotspur.com/spurs-christmas',
        color: 'from-white to-gray-200',
        league: '프리미어리그',
        products: [
            { name: 'Spurs Christmas Product 1', image: 'https://via.placeholder.com/400x400/132257/ffffff?text=Spurs+Christmas+1', url: 'https://shop.tottenhamhotspur.com/spurs-christmas' },
            { name: 'Spurs Christmas Product 2', image: 'https://via.placeholder.com/400x400/132257/ffffff?text=Spurs+Christmas+2', url: 'https://shop.tottenhamhotspur.com/spurs-christmas' },
            { name: 'Spurs Christmas Product 3', image: 'https://via.placeholder.com/400x400/132257/ffffff?text=Spurs+Christmas+3', url: 'https://shop.tottenhamhotspur.com/spurs-christmas' },
            { name: 'Spurs Christmas Product 4', image: 'https://via.placeholder.com/400x400/132257/ffffff?text=Spurs+Christmas+4', url: 'https://shop.tottenhamhotspur.com/spurs-christmas' },
            { name: 'Spurs Christmas Product 5', image: 'https://via.placeholder.com/400x400/132257/ffffff?text=Spurs+Christmas+5', url: 'https://shop.tottenhamhotspur.com/spurs-christmas' },
            { name: 'Spurs Christmas Product 6', image: 'https://via.placeholder.com/400x400/132257/ffffff?text=Spurs+Christmas+6', url: 'https://shop.tottenhamhotspur.com/spurs-christmas' },
            { name: 'Spurs Christmas Product 7', image: 'https://via.placeholder.com/400x400/132257/ffffff?text=Spurs+Christmas+7', url: 'https://shop.tottenhamhotspur.com/spurs-christmas' },
            { name: 'Spurs Christmas Product 8', image: 'https://via.placeholder.com/400x400/132257/ffffff?text=Spurs+Christmas+8', url: 'https://shop.tottenhamhotspur.com/spurs-christmas' }
        ]
    },
    {
        name: '맨체스터 유나이티드',
        nameEn: 'Manchester United',
        logo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
        url: 'https://store.manutd.com/en/c/christmas',
        color: 'from-red-700 to-red-900',
        league: '프리미어리그',
        products: [
            { name: 'Man Utd Christmas Product 1', image: 'https://via.placeholder.com/400x400/DA291C/ffffff?text=Man+Utd+Christmas+1', url: 'https://store.manutd.com/en/c/christmas' },
            { name: 'Man Utd Christmas Product 2', image: 'https://via.placeholder.com/400x400/DA291C/ffffff?text=Man+Utd+Christmas+2', url: 'https://store.manutd.com/en/c/christmas' },
            { name: 'Man Utd Christmas Product 3', image: 'https://via.placeholder.com/400x400/DA291C/ffffff?text=Man+Utd+Christmas+3', url: 'https://store.manutd.com/en/c/christmas' },
            { name: 'Man Utd Christmas Product 4', image: 'https://via.placeholder.com/400x400/DA291C/ffffff?text=Man+Utd+Christmas+4', url: 'https://store.manutd.com/en/c/christmas' },
            { name: 'Man Utd Christmas Product 5', image: 'https://via.placeholder.com/400x400/DA291C/ffffff?text=Man+Utd+Christmas+5', url: 'https://store.manutd.com/en/c/christmas' },
            { name: 'Man Utd Christmas Product 6', image: 'https://via.placeholder.com/400x400/DA291C/ffffff?text=Man+Utd+Christmas+6', url: 'https://store.manutd.com/en/c/christmas' },
            { name: 'Man Utd Christmas Product 7', image: 'https://via.placeholder.com/400x400/DA291C/ffffff?text=Man+Utd+Christmas+7', url: 'https://store.manutd.com/en/c/christmas' },
            { name: 'Man Utd Christmas Product 8', image: 'https://via.placeholder.com/400x400/DA291C/ffffff?text=Man+Utd+Christmas+8', url: 'https://store.manutd.com/en/c/christmas' }
        ]
    },
    {
        name: '맨체스터 시티',
        nameEn: 'Manchester City',
        logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
        url: 'https://shop.mancity.com/ca/en/christmas/featured/christmas-essentials/',
        color: 'from-sky-400 to-sky-600',
        league: '프리미어리그',
        products: [
            { name: 'Man City Christmas Product 1', image: 'https://via.placeholder.com/400x400/6CABDD/ffffff?text=Man+City+Christmas+1', url: 'https://shop.mancity.com/ca/en/christmas/featured/christmas-essentials/' },
            { name: 'Man City Christmas Product 2', image: 'https://via.placeholder.com/400x400/6CABDD/ffffff?text=Man+City+Christmas+2', url: 'https://shop.mancity.com/ca/en/christmas/featured/christmas-essentials/' },
            { name: 'Man City Christmas Product 3', image: 'https://via.placeholder.com/400x400/6CABDD/ffffff?text=Man+City+Christmas+3', url: 'https://shop.mancity.com/ca/en/christmas/featured/christmas-essentials/' },
            { name: 'Man City Christmas Product 4', image: 'https://via.placeholder.com/400x400/6CABDD/ffffff?text=Man+City+Christmas+4', url: 'https://shop.mancity.com/ca/en/christmas/featured/christmas-essentials/' },
            { name: 'Man City Christmas Product 5', image: 'https://via.placeholder.com/400x400/6CABDD/ffffff?text=Man+City+Christmas+5', url: 'https://shop.mancity.com/ca/en/christmas/featured/christmas-essentials/' },
            { name: 'Man City Christmas Product 6', image: 'https://via.placeholder.com/400x400/6CABDD/ffffff?text=Man+City+Christmas+6', url: 'https://shop.mancity.com/ca/en/christmas/featured/christmas-essentials/' },
            { name: 'Man City Christmas Product 7', image: 'https://via.placeholder.com/400x400/6CABDD/ffffff?text=Man+City+Christmas+7', url: 'https://shop.mancity.com/ca/en/christmas/featured/christmas-essentials/' },
            { name: 'Man City Christmas Product 8', image: 'https://via.placeholder.com/400x400/6CABDD/ffffff?text=Man+City+Christmas+8', url: 'https://shop.mancity.com/ca/en/christmas/featured/christmas-essentials/' }
        ]
    },
    {
        name: '바르셀로나',
        nameEn: 'Barcelona',
        logo: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
        url: 'https://store.fcbarcelona.com/ko-kr/search?q=christmas&options%5Bprefix%5D=last',
        color: 'from-blue-900 to-red-700',
        league: '라리가',
        products: [
            { name: 'Barcelona Christmas Product 1', image: 'https://via.placeholder.com/400x400/004D98/ffffff?text=Barca+Christmas+1', url: 'https://store.fcbarcelona.com/ko-kr/search?q=christmas&options%5Bprefix%5D=last' },
            { name: 'Barcelona Christmas Product 2', image: 'https://via.placeholder.com/400x400/004D98/ffffff?text=Barca+Christmas+2', url: 'https://store.fcbarcelona.com/ko-kr/search?q=christmas&options%5Bprefix%5D=last' },
            { name: 'Barcelona Christmas Product 3', image: 'https://via.placeholder.com/400x400/004D98/ffffff?text=Barca+Christmas+3', url: 'https://store.fcbarcelona.com/ko-kr/search?q=christmas&options%5Bprefix%5D=last' },
            { name: 'Barcelona Christmas Product 4', image: 'https://via.placeholder.com/400x400/004D98/ffffff?text=Barca+Christmas+4', url: 'https://store.fcbarcelona.com/ko-kr/search?q=christmas&options%5Bprefix%5D=last' },
            { name: 'Barcelona Christmas Product 5', image: 'https://via.placeholder.com/400x400/004D98/ffffff?text=Barca+Christmas+5', url: 'https://store.fcbarcelona.com/ko-kr/search?q=christmas&options%5Bprefix%5D=last' },
            { name: 'Barcelona Christmas Product 6', image: 'https://via.placeholder.com/400x400/004D98/ffffff?text=Barca+Christmas+6', url: 'https://store.fcbarcelona.com/ko-kr/search?q=christmas&options%5Bprefix%5D=last' },
            { name: 'Barcelona Christmas Product 7', image: 'https://via.placeholder.com/400x400/004D98/ffffff?text=Barca+Christmas+7', url: 'https://store.fcbarcelona.com/ko-kr/search?q=christmas&options%5Bprefix%5D=last' },
            { name: 'Barcelona Christmas Product 8', image: 'https://via.placeholder.com/400x400/004D98/ffffff?text=Barca+Christmas+8', url: 'https://store.fcbarcelona.com/ko-kr/search?q=christmas&options%5Bprefix%5D=last' }
        ]
    },
    {
        name: '바이에른 뮌헨',
        nameEn: 'Bayern Munich',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg',
        url: 'https://fcbayern.com/store/en-zz/c/specials/x-mas-world',
        color: 'from-red-600 to-blue-800',
        league: '분데스리가',
        products: [
            { name: 'Bayern Christmas Product 1', image: 'https://via.placeholder.com/400x400/DC052D/ffffff?text=Bayern+Christmas+1', url: 'https://fcbayern.com/store/en-zz/c/specials/x-mas-world' },
            { name: 'Bayern Christmas Product 2', image: 'https://via.placeholder.com/400x400/DC052D/ffffff?text=Bayern+Christmas+2', url: 'https://fcbayern.com/store/en-zz/c/specials/x-mas-world' },
            { name: 'Bayern Christmas Product 3', image: 'https://via.placeholder.com/400x400/DC052D/ffffff?text=Bayern+Christmas+3', url: 'https://fcbayern.com/store/en-zz/c/specials/x-mas-world' },
            { name: 'Bayern Christmas Product 4', image: 'https://via.placeholder.com/400x400/DC052D/ffffff?text=Bayern+Christmas+4', url: 'https://fcbayern.com/store/en-zz/c/specials/x-mas-world' },
            { name: 'Bayern Christmas Product 5', image: 'https://via.placeholder.com/400x400/DC052D/ffffff?text=Bayern+Christmas+5', url: 'https://fcbayern.com/store/en-zz/c/specials/x-mas-world' },
            { name: 'Bayern Christmas Product 6', image: 'https://via.placeholder.com/400x400/DC052D/ffffff?text=Bayern+Christmas+6', url: 'https://fcbayern.com/store/en-zz/c/specials/x-mas-world' },
            { name: 'Bayern Christmas Product 7', image: 'https://via.placeholder.com/400x400/DC052D/ffffff?text=Bayern+Christmas+7', url: 'https://fcbayern.com/store/en-zz/c/specials/x-mas-world' },
            { name: 'Bayern Christmas Product 8', image: 'https://via.placeholder.com/400x400/DC052D/ffffff?text=Bayern+Christmas+8', url: 'https://fcbayern.com/store/en-zz/c/specials/x-mas-world' }
        ]
    },
    {
        name: '도르트문트',
        nameEn: 'Borussia Dortmund',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg',
        url: 'https://shop.bvb.de/en-de/christmas',
        color: 'from-yellow-400 to-black',
        league: '분데스리가',
        products: [
            { name: 'BVB Christmas Product 1', image: 'https://via.placeholder.com/400x400/FDE100/000000?text=BVB+Christmas+1', url: 'https://shop.bvb.de/en-de/christmas' },
            { name: 'BVB Christmas Product 2', image: 'https://via.placeholder.com/400x400/FDE100/000000?text=BVB+Christmas+2', url: 'https://shop.bvb.de/en-de/christmas' },
            { name: 'BVB Christmas Product 3', image: 'https://via.placeholder.com/400x400/FDE100/000000?text=BVB+Christmas+3', url: 'https://shop.bvb.de/en-de/christmas' },
            { name: 'BVB Christmas Product 4', image: 'https://via.placeholder.com/400x400/FDE100/000000?text=BVB+Christmas+4', url: 'https://shop.bvb.de/en-de/christmas' },
            { name: 'BVB Christmas Product 5', image: 'https://via.placeholder.com/400x400/FDE100/000000?text=BVB+Christmas+5', url: 'https://shop.bvb.de/en-de/christmas' },
            { name: 'BVB Christmas Product 6', image: 'https://via.placeholder.com/400x400/FDE100/000000?text=BVB+Christmas+6', url: 'https://shop.bvb.de/en-de/christmas' },
            { name: 'BVB Christmas Product 7', image: 'https://via.placeholder.com/400x400/FDE100/000000?text=BVB+Christmas+7', url: 'https://shop.bvb.de/en-de/christmas' },
            { name: 'BVB Christmas Product 8', image: 'https://via.placeholder.com/400x400/FDE100/000000?text=BVB+Christmas+8', url: 'https://shop.bvb.de/en-de/christmas' }
        ]
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
