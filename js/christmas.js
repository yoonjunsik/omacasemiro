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
                name: 'Arsenal Christmas Jumper',
                image: 'https://arsenaldirect.arsenal.com/dw/image/v2/BDWV_PRD/on/demandware.static/-/Sites-Arsenal-Library/default/dwfc8ca36e/images/large/b5bf76f0-d77c-4f08-b055-df76fb5e3806.jpg',
                url: 'https://arsenaldirect.arsenal.com/Christmas-Shop/christmas-jumpers/Arsenal-Christmas-Jumper-2024-25/p/N01419'
            },
            {
                name: 'Arsenal Snowman Ornament',
                image: 'https://arsenaldirect.arsenal.com/dw/image/v2/BDWV_PRD/on/demandware.static/-/Sites-Arsenal-Library/default/dw07c0cc55/images/large/d0d3f5db-f0b4-4e33-9c49-8e7f3db6f35f.jpg',
                url: 'https://arsenaldirect.arsenal.com/Christmas-Shop/christmas-decorations/Arsenal-Snowman-Ornament/p/N01401'
            },
            {
                name: 'Arsenal Christmas Stocking',
                image: 'https://arsenaldirect.arsenal.com/dw/image/v2/BDWV_PRD/on/demandware.static/-/Sites-Arsenal-Library/default/dw1c8b4b2a/images/large/85a0ecca-ba05-4089-aede-9db2c5a6f34a.jpg',
                url: 'https://arsenaldirect.arsenal.com/Christmas-Shop/christmas-decorations/Arsenal-Christmas-Stocking/p/N01400'
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
            {
                name: 'Chelsea Christmas Jumper',
                image: 'https://store.chelseafc.com/dw/image/v2/BFMH_PRD/on/demandware.static/-/Sites-CFC-Library/default/dwf6c5e5b4/images/large/94028603_pp_01_chelsea_christmas_jumper_2024.jpg',
                url: 'https://store.chelseafc.com/en/chelsea-christmas-jumper-2024/p-94028603'
            },
            {
                name: 'Chelsea Bauble Set',
                image: 'https://store.chelseafc.com/dw/image/v2/BFMH_PRD/on/demandware.static/-/Sites-CFC-Library/default/dw0e8a9c5f/images/large/94028589_pp_01_chelsea_bauble_set.jpg',
                url: 'https://store.chelseafc.com/en/chelsea-bauble-set/p-94028589'
            },
            {
                name: 'Chelsea Christmas Stocking',
                image: 'https://store.chelseafc.com/dw/image/v2/BFMH_PRD/on/demandware.static/-/Sites-CFC-Library/default/dw92e7a7f4/images/large/94028592_pp_01_chelsea_christmas_stocking.jpg',
                url: 'https://store.chelseafc.com/en/chelsea-christmas-stocking/p-94028592'
            }
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
            {
                name: 'Spurs Christmas Jumper',
                image: 'https://shop.tottenhamhotspur.com/dw/image/v2/BKVC_PRD/on/demandware.static/-/Sites-THFC-Library/default/dw8c0d4d5e/images/products/UG0304.jpg',
                url: 'https://shop.tottenhamhotspur.com/ug0304-christmas-jumper'
            },
            {
                name: 'Spurs Tree Ornament',
                image: 'https://shop.tottenhamhotspur.com/dw/image/v2/BKVC_PRD/on/demandware.static/-/Sites-THFC-Library/default/dw9a9c7f3e/images/products/UG0283.jpg',
                url: 'https://shop.tottenhamhotspur.com/ug0283-tree-ornament'
            },
            {
                name: 'Spurs Christmas Stocking',
                image: 'https://shop.tottenhamhotspur.com/dw/image/v2/BKVC_PRD/on/demandware.static/-/Sites-THFC-Library/default/dw8f5c2b1a/images/products/UG0282.jpg',
                url: 'https://shop.tottenhamhotspur.com/ug0282-christmas-stocking'
            }
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
            {
                name: 'Manchester United Christmas Jumper',
                image: 'https://store.manutd.com/dw/image/v2/BDWV_PRD/on/demandware.static/-/Sites-Manchester-United-Library/default/dw6f8c5e9b/images/products/N01567_pp_01.jpg',
                url: 'https://store.manutd.com/en/manchester-united-christmas-jumper-2024/p/N01567'
            },
            {
                name: 'Manchester United Bauble Set',
                image: 'https://store.manutd.com/dw/image/v2/BDWV_PRD/on/demandware.static/-/Sites-Manchester-United-Library/default/dw9c8a7f2e/images/products/N01545_pp_01.jpg',
                url: 'https://store.manutd.com/en/manchester-united-bauble-set/p/N01545'
            },
            {
                name: 'Manchester United Christmas Stocking',
                image: 'https://store.manutd.com/dw/image/v2/BDWV_PRD/on/demandware.static/-/Sites-Manchester-United-Library/default/dw7e9f6c3b/images/products/N01544_pp_01.jpg',
                url: 'https://store.manutd.com/en/manchester-united-christmas-stocking/p/N01544'
            }
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
            {
                name: 'Man City Christmas Jumper',
                image: 'https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-MAN-Library/default/dw8f7c6e5d/images/products/701231486001_pp_01.jpg',
                url: 'https://shop.mancity.com/ca/en/man-city-christmas-jumper-2024/p-701231486001'
            },
            {
                name: 'Man City Tree Decorations',
                image: 'https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-MAN-Library/default/dw9d8e7f6c/images/products/701231472001_pp_01.jpg',
                url: 'https://shop.mancity.com/ca/en/man-city-tree-decorations/p-701231472001'
            },
            {
                name: 'Man City Christmas Stocking',
                image: 'https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-MAN-Library/default/dw6e7f8c9d/images/products/701231470001_pp_01.jpg',
                url: 'https://shop.mancity.com/ca/en/man-city-christmas-stocking/p-701231470001'
            }
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
            {
                name: 'FC Barcelona Christmas Ornament',
                image: 'https://store.fcbarcelona.com/cdn/shop/files/DM6300_pp_01.jpg',
                url: 'https://store.fcbarcelona.com/ko-kr/products/fc-barcelona-christmas-ornament'
            },
            {
                name: 'FC Barcelona Holiday Scarf',
                image: 'https://store.fcbarcelona.com/cdn/shop/files/DM6301_pp_01.jpg',
                url: 'https://store.fcbarcelona.com/ko-kr/products/fc-barcelona-holiday-scarf'
            },
            {
                name: 'FC Barcelona Christmas Gift Set',
                image: 'https://store.fcbarcelona.com/cdn/shop/files/DM6302_pp_01.jpg',
                url: 'https://store.fcbarcelona.com/ko-kr/products/fc-barcelona-christmas-gift-set'
            }
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
            {
                name: 'FC Bayern Christmas Jumper',
                image: 'https://fcbayern.com/binaries/content/gallery/fc-bayern/shop/fcb-24-x-mas-pullover.jpg',
                url: 'https://fcbayern.com/store/en-zz/fc-bayern-christmas-jumper-2024/p/30254'
            },
            {
                name: 'FC Bayern Christmas Bauble',
                image: 'https://fcbayern.com/binaries/content/gallery/fc-bayern/shop/fcb-24-x-mas-bauble.jpg',
                url: 'https://fcbayern.com/store/en-zz/fc-bayern-christmas-bauble/p/30241'
            },
            {
                name: 'FC Bayern Advent Calendar',
                image: 'https://fcbayern.com/binaries/content/gallery/fc-bayern/shop/fcb-24-advent-calendar.jpg',
                url: 'https://fcbayern.com/store/en-zz/fc-bayern-advent-calendar/p/30235'
            }
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
            {
                name: 'BVB Christmas Jumper',
                image: 'https://shop.bvb.de/media/image/f2/c4/8e/22119000_Christmas-Sweater-Black_1.jpg',
                url: 'https://shop.bvb.de/en-de/christmas-jumper-black'
            },
            {
                name: 'BVB Christmas Baubles',
                image: 'https://shop.bvb.de/media/image/e5/d3/9f/22119010_Christmas-Baubles-Set_1.jpg',
                url: 'https://shop.bvb.de/en-de/christmas-baubles-set'
            },
            {
                name: 'BVB Christmas Stocking',
                image: 'https://shop.bvb.de/media/image/a8/b6/c2/22119015_Christmas-Stocking_1.jpg',
                url: 'https://shop.bvb.de/en-de/christmas-stocking'
            }
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
