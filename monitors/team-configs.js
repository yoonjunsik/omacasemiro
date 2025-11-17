// 팀별 공식 스토어 설정 및 블랙프라이데이 감지 패턴

const teamConfigs = {
    // ==================== 프리미어리그 ====================
    premierLeague: [
        {
            name: 'Liverpool',
            nameKo: '리버풀',
            league: 'Premier League',
            storeUrl: 'https://store.liverpoolfc.com',
            blackFridayUrls: [
                'https://store.liverpoolfc.com/black-friday',
                'https://store.liverpoolfc.com/sale'
            ],
            selectors: {
                products: '.product-tile, .product-card',
                productName: '.product-name, h3',
                price: '.price, .product-price',
                salePrice: '.sale-price, .price-sales',
                banner: '.promo-banner, .hero-banner'
            },
            keywords: ['black friday', 'cyber monday', 'bf sale', 'blackfriday']
        },
        {
            name: 'Manchester City',
            nameKo: '맨체스터 시티',
            league: 'Premier League',
            storeUrl: 'https://shop.mancity.com',
            blackFridayUrls: [
                'https://shop.mancity.com/ca/en/black-friday',
                'https://shop.mancity.com/ca/en/sale'
            ],
            selectors: {
                products: '.product-tile, .ProductCard',
                productName: '.product-name, .ProductCard-title',
                price: '.price',
                salePrice: '.sale-price',
                banner: '.hero, .banner'
            },
            keywords: ['black friday', 'cyber monday', 'special offer']
        },
        {
            name: 'Arsenal',
            nameKo: '아스널',
            league: 'Premier League',
            storeUrl: 'https://arsenaldirect.arsenal.com',
            blackFridayUrls: [
                'https://arsenaldirect.arsenal.com/black-friday',
                'https://arsenaldirect.arsenal.com/sale'
            ],
            selectors: {
                products: '.product-tile, .product',
                productName: '.product-name',
                price: '.price',
                salePrice: '.sale-price',
                banner: '.promo-banner'
            },
            keywords: ['black friday', 'cyber week', 'big sale']
        },
        {
            name: 'Chelsea',
            nameKo: '첼시',
            league: 'Premier League',
            storeUrl: 'https://store.chelseafc.com',
            blackFridayUrls: [
                'https://store.chelseafc.com/en/black-friday',
                'https://store.chelseafc.com/en/sale'
            ],
            selectors: {
                products: '.product-tile',
                productName: '.product-title',
                price: '.price',
                salePrice: '.sale-price',
                banner: '.banner'
            },
            keywords: ['black friday', 'cyber monday']
        },
        {
            name: 'Newcastle United',
            nameKo: '뉴캐슬',
            league: 'Premier League',
            storeUrl: 'https://shop.newcastleunited.com',
            blackFridayUrls: [
                'https://shop.newcastleunited.com/collections/black-friday',
                'https://shop.newcastleunited.com/collections/sale'
            ],
            selectors: {
                products: '.product-card, .grid-item',
                productName: '.product-title',
                price: '.price',
                salePrice: '.sale-price',
                banner: '.announcement-bar, .hero'
            },
            keywords: ['black friday', 'cyber monday', 'bf2024', 'bf2025']
        },
        {
            name: 'Manchester United',
            nameKo: '맨체스터 유나이티드',
            league: 'Premier League',
            storeUrl: 'https://store.manutd.com',
            blackFridayUrls: [
                'https://store.manutd.com/en/black-friday',
                'https://store.manutd.com/en/c/sale'
            ],
            selectors: {
                products: '.product-tile',
                productName: '.product-name',
                price: '.price',
                salePrice: '.sale-price',
                banner: '.hero-banner'
            },
            keywords: ['black friday', 'cyber monday', 'special offers']
        },
        {
            name: 'Tottenham',
            nameKo: '토트넘',
            league: 'Premier League',
            storeUrl: 'https://shop.tottenhamhotspur.com',
            blackFridayUrls: [
                'https://shop.tottenhamhotspur.com/black-friday',
                'https://shop.tottenhamhotspur.com/sale'
            ],
            selectors: {
                products: '.product-tile, .product-card',
                productName: '.product-title',
                price: '.price',
                salePrice: '.sale-price',
                banner: '.banner, .hero'
            },
            keywords: ['black friday', 'cyber week']
        },
        {
            name: 'Aston Villa',
            nameKo: '애스턴 빌라',
            league: 'Premier League',
            storeUrl: 'https://shop.avfc.co.uk',
            blackFridayUrls: [
                'https://shop.avfc.co.uk/black-friday',
                'https://shop.avfc.co.uk/sale'
            ],
            selectors: {
                products: '.product-tile',
                productName: '.product-name',
                price: '.price',
                salePrice: '.sale-price',
                banner: '.promo-banner'
            },
            keywords: ['black friday', 'cyber monday']
        }
    ],

    // ==================== 라리가 ====================
    laLiga: [
        {
            name: 'Real Madrid',
            nameKo: '레알 마드리드',
            league: 'La Liga',
            storeUrl: 'https://shop.realmadrid.com',
            blackFridayUrls: [
                'https://shop.realmadrid.com/en-es/black-friday',
                'https://shop.realmadrid.com/en-es/sales'
            ],
            selectors: {
                products: '.product-card, .product-tile',
                productName: '.product-name',
                price: '.price',
                salePrice: '.sale-price',
                banner: '.hero-banner'
            },
            keywords: ['black friday', 'cyber monday', 'viernes negro']
        },
        {
            name: 'Barcelona',
            nameKo: '바르셀로나',
            league: 'La Liga',
            storeUrl: 'https://store.fcbarcelona.com',
            blackFridayUrls: [
                'https://store.fcbarcelona.com/ko-kr/black-friday',
                'https://store.fcbarcelona.com/ko-kr/sale'
            ],
            selectors: {
                products: '.product-card',
                productName: '.product-title',
                price: '.price',
                salePrice: '.sale-price',
                banner: '.banner'
            },
            keywords: ['black friday', 'cyber monday', 'viernes negro']
        },
        {
            name: 'Atletico Madrid',
            nameKo: '아틀레티코 마드리드',
            league: 'La Liga',
            storeUrl: 'https://tienda.atleticodemadrid.com',
            blackFridayUrls: [
                'https://tienda.atleticodemadrid.com/black-friday',
                'https://tienda.atleticodemadrid.com/ofertas'
            ],
            selectors: {
                products: '.product',
                productName: '.product-name',
                price: '.price',
                salePrice: '.sale-price',
                banner: '.banner'
            },
            keywords: ['black friday', 'cyber monday', 'viernes negro']
        },
        // 나머지 라리가 팀들은 필요시 추가
    ],

    // ==================== 분데스리가 ====================
    bundesliga: [
        {
            name: 'Bayern Munich',
            nameKo: '바이에른 뮌헨',
            league: 'Bundesliga',
            storeUrl: 'https://fcbayern.com/store',
            blackFridayUrls: [
                'https://fcbayern.com/store/en-zz/black-friday',
                'https://fcbayern.com/store/en-zz/sale'
            ],
            selectors: {
                products: '.product-tile',
                productName: '.product-name',
                price: '.price',
                salePrice: '.sale-price',
                banner: '.hero'
            },
            keywords: ['black friday', 'cyber monday']
        },
        {
            name: 'Borussia Dortmund',
            nameKo: '도르트문트',
            league: 'Bundesliga',
            storeUrl: 'https://shop.bvb.de',
            blackFridayUrls: [
                'https://shop.bvb.de/en-de/black-friday',
                'https://shop.bvb.de/en-de/sale'
            ],
            selectors: {
                products: '.product-tile',
                productName: '.product-name',
                price: '.price',
                salePrice: '.sale-price',
                banner: '.banner'
            },
            keywords: ['black friday', 'cyber monday']
        }
    ],

    // ==================== 리그앙 ====================
    ligue1: [
        {
            name: 'PSG',
            nameKo: 'PSG',
            league: 'Ligue 1',
            storeUrl: 'https://shop.psg.fr',
            blackFridayUrls: [
                'https://shop.psg.fr/en/black-friday',
                'https://shop.psg.fr/en/sale'
            ],
            selectors: {
                products: '.product-card',
                productName: '.product-name',
                price: '.price',
                salePrice: '.sale-price',
                banner: '.hero'
            },
            keywords: ['black friday', 'cyber monday', 'vendredi noir']
        }
    ],

    // ==================== 세리에 A ====================
    serieA: [
        {
            name: 'Inter Milan',
            nameKo: '인터 밀란',
            league: 'Serie A',
            storeUrl: 'https://store.inter.it',
            blackFridayUrls: [
                'https://store.inter.it/kr/black-friday',
                'https://store.inter.it/kr/sale'
            ],
            selectors: {
                products: '.product-card',
                productName: '.product-name',
                price: '.price',
                salePrice: '.sale-price',
                banner: '.banner'
            },
            keywords: ['black friday', 'cyber monday', 'venerdì nero']
        },
        {
            name: 'AC Milan',
            nameKo: 'AC 밀란',
            league: 'Serie A',
            storeUrl: 'https://store.acmilan.com',
            blackFridayUrls: [
                'https://store.acmilan.com/en-me/black-friday',
                'https://store.acmilan.com/en-me/sales'
            ],
            selectors: {
                products: '.product-card',
                productName: '.product-name',
                price: '.price',
                salePrice: '.sale-price',
                banner: '.hero'
            },
            keywords: ['black friday', 'cyber monday', 'venerdì nero']
        },
        {
            name: 'Juventus',
            nameKo: '유벤투스',
            league: 'Serie A',
            storeUrl: 'https://store.juventus.com',
            blackFridayUrls: [
                'https://store.juventus.com/kr/black-friday',
                'https://store.juventus.com/kr/sale'
            ],
            selectors: {
                products: '.product-card',
                productName: '.product-name',
                price: '.price',
                salePrice: '.sale-price',
                banner: '.banner'
            },
            keywords: ['black friday', 'cyber monday', 'venerdì nero']
        }
    ]
};

module.exports = teamConfigs;
