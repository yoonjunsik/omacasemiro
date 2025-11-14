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
            { name: 'Chelsea Christmas Product 1', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23034694" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EChelsea%3C/text%3E%3C/svg%3E', url: 'https://store.chelseafc.com/en/c-7104' },
            { name: 'Chelsea Christmas Product 2', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23034694" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EChelsea%3C/text%3E%3C/svg%3E', url: 'https://store.chelseafc.com/en/c-7104' },
            { name: 'Chelsea Christmas Product 3', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23034694" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EChelsea%3C/text%3E%3C/svg%3E', url: 'https://store.chelseafc.com/en/c-7104' },
            { name: 'Chelsea Christmas Product 4', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23034694" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EChelsea%3C/text%3E%3C/svg%3E', url: 'https://store.chelseafc.com/en/c-7104' },
            { name: 'Chelsea Christmas Product 5', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23034694" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EChelsea%3C/text%3E%3C/svg%3E', url: 'https://store.chelseafc.com/en/c-7104' },
            { name: 'Chelsea Christmas Product 6', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23034694" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EChelsea%3C/text%3E%3C/svg%3E', url: 'https://store.chelseafc.com/en/c-7104' },
            { name: 'Chelsea Christmas Product 7', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23034694" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EChelsea%3C/text%3E%3C/svg%3E', url: 'https://store.chelseafc.com/en/c-7104' },
            { name: 'Chelsea Christmas Product 8', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23034694" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EChelsea%3C/text%3E%3C/svg%3E', url: 'https://store.chelseafc.com/en/c-7104' }
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
            { name: 'Spurs Christmas Product 1', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23132257" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3ESpurs%3C/text%3E%3C/svg%3E', url: 'https://shop.tottenhamhotspur.com/spurs-christmas' },
            { name: 'Spurs Christmas Product 2', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23132257" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3ESpurs%3C/text%3E%3C/svg%3E', url: 'https://shop.tottenhamhotspur.com/spurs-christmas' },
            { name: 'Spurs Christmas Product 3', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23132257" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3ESpurs%3C/text%3E%3C/svg%3E', url: 'https://shop.tottenhamhotspur.com/spurs-christmas' },
            { name: 'Spurs Christmas Product 4', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23132257" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3ESpurs%3C/text%3E%3C/svg%3E', url: 'https://shop.tottenhamhotspur.com/spurs-christmas' },
            { name: 'Spurs Christmas Product 5', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23132257" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3ESpurs%3C/text%3E%3C/svg%3E', url: 'https://shop.tottenhamhotspur.com/spurs-christmas' },
            { name: 'Spurs Christmas Product 6', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23132257" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3ESpurs%3C/text%3E%3C/svg%3E', url: 'https://shop.tottenhamhotspur.com/spurs-christmas' },
            { name: 'Spurs Christmas Product 7', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23132257" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3ESpurs%3C/text%3E%3C/svg%3E', url: 'https://shop.tottenhamhotspur.com/spurs-christmas' },
            { name: 'Spurs Christmas Product 8', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23132257" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3ESpurs%3C/text%3E%3C/svg%3E', url: 'https://shop.tottenhamhotspur.com/spurs-christmas' }
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
            { name: 'Man Utd Christmas Product 1', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23DA291C" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EMan%20Utd%3C/text%3E%3C/svg%3E', url: 'https://store.manutd.com/en/c/christmas' },
            { name: 'Man Utd Christmas Product 2', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23DA291C" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EMan%20Utd%3C/text%3E%3C/svg%3E', url: 'https://store.manutd.com/en/c/christmas' },
            { name: 'Man Utd Christmas Product 3', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23DA291C" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EMan%20Utd%3C/text%3E%3C/svg%3E', url: 'https://store.manutd.com/en/c/christmas' },
            { name: 'Man Utd Christmas Product 4', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23DA291C" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EMan%20Utd%3C/text%3E%3C/svg%3E', url: 'https://store.manutd.com/en/c/christmas' },
            { name: 'Man Utd Christmas Product 5', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23DA291C" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EMan%20Utd%3C/text%3E%3C/svg%3E', url: 'https://store.manutd.com/en/c/christmas' },
            { name: 'Man Utd Christmas Product 6', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23DA291C" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EMan%20Utd%3C/text%3E%3C/svg%3E', url: 'https://store.manutd.com/en/c/christmas' },
            { name: 'Man Utd Christmas Product 7', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23DA291C" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EMan%20Utd%3C/text%3E%3C/svg%3E', url: 'https://store.manutd.com/en/c/christmas' },
            { name: 'Man Utd Christmas Product 8', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23DA291C" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EMan%20Utd%3C/text%3E%3C/svg%3E', url: 'https://store.manutd.com/en/c/christmas' }
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
            { name: 'Man City Christmas Product 1', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%236CABDD" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EMan%20City%3C/text%3E%3C/svg%3E', url: 'https://shop.mancity.com/ca/en/christmas/featured/christmas-essentials/' },
            { name: 'Man City Christmas Product 2', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%236CABDD" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EMan%20City%3C/text%3E%3C/svg%3E', url: 'https://shop.mancity.com/ca/en/christmas/featured/christmas-essentials/' },
            { name: 'Man City Christmas Product 3', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%236CABDD" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EMan%20City%3C/text%3E%3C/svg%3E', url: 'https://shop.mancity.com/ca/en/christmas/featured/christmas-essentials/' },
            { name: 'Man City Christmas Product 4', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%236CABDD" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EMan%20City%3C/text%3E%3C/svg%3E', url: 'https://shop.mancity.com/ca/en/christmas/featured/christmas-essentials/' },
            { name: 'Man City Christmas Product 5', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%236CABDD" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EMan%20City%3C/text%3E%3C/svg%3E', url: 'https://shop.mancity.com/ca/en/christmas/featured/christmas-essentials/' },
            { name: 'Man City Christmas Product 6', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%236CABDD" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EMan%20City%3C/text%3E%3C/svg%3E', url: 'https://shop.mancity.com/ca/en/christmas/featured/christmas-essentials/' },
            { name: 'Man City Christmas Product 7', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%236CABDD" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EMan%20City%3C/text%3E%3C/svg%3E', url: 'https://shop.mancity.com/ca/en/christmas/featured/christmas-essentials/' },
            { name: 'Man City Christmas Product 8', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%236CABDD" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EMan%20City%3C/text%3E%3C/svg%3E', url: 'https://shop.mancity.com/ca/en/christmas/featured/christmas-essentials/' }
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
            { name: 'FC 바르셀로나 크리스마스 파자마', image: 'https://store.fcbarcelona.com/cdn/shop/files/FE565501_1.jpg', url: 'https://store.fcbarcelona.com/ko-kr/products/christmas-23-k-navy-pijama-men' },
            { name: '크리스마스 점퍼 레인디어 FC 바르셀로나', image: 'https://store.fcbarcelona.com/cdn/shop/files/Ficha-Producto-COREII4382.jpg', url: 'https://store.fcbarcelona.com/ko-kr/products/christmas-jumper-reindeer-fc-barcelona' },
            { name: 'FC 바르셀로나 크리스마스 파자마 - 아동', image: 'https://store.fcbarcelona.com/cdn/shop/files/FE565501_1_a2a1a30f-28c1-4896-9214-7f7442e0bafc.jpg', url: 'https://store.fcbarcelona.com/ko-kr/products/christmas-23-m-navy-pijama-kids' },
            { name: 'FC 바르셀로나 크리스마스 모자', image: 'https://store.fcbarcelona.com/cdn/shop/files/2022-10-10-BLM-FERRANTORRES-0245.jpg', url: 'https://store.fcbarcelona.com/ko-kr/products/fc-barcelona-christmas-hat' },
            { name: 'FC 바르셀로나 크리스마스 복서 팩', image: 'https://store.fcbarcelona.com/cdn/shop/files/BLMP000850002_1.jpg', url: 'https://store.fcbarcelona.com/ko-kr/products/christmas-23-m-pack-boxer' },
            { name: 'FC 바르셀로나 크리스마스 복서 팩 - 아동', image: 'https://store.fcbarcelona.com/cdn/shop/files/BLMP000850002_3_kids.jpg', url: 'https://store.fcbarcelona.com/ko-kr/products/christmas-23-k-pack-boxer' },
            { name: '크리스마스 점퍼', image: 'https://store.fcbarcelona.com/cdn/shop/files/Ficha-Producto-COREII4337.jpg', url: 'https://store.fcbarcelona.com/ko-kr/products/christmas-24-m-navy-jumper' },
            { name: '크리스마스 팩 오너먼트 FC 바르셀로나', image: 'https://store.fcbarcelona.com/cdn/shop/files/xmas_fcb_17.jpg', url: 'https://store.fcbarcelona.com/ko-kr/products/christmas-pack-ornaments-fc-barcelona' },
            { name: '크리스마스 점퍼 올리브 FC 바르셀로나', image: 'https://store.fcbarcelona.com/cdn/shop/files/BZ3A8874.jpg', url: 'https://store.fcbarcelona.com/ko-kr/products/christmas-jumper-olive-fc-barcelona' },
            { name: '크리스마스 점퍼 네이비 FC 바르셀로나', image: 'https://store.fcbarcelona.com/cdn/shop/files/BZ3A8571.jpg', url: 'https://store.fcbarcelona.com/ko-kr/products/christmas-jumper-navy-fc-barcelona' },
            { name: '크리스마스 팩 머그 + 양말 FC 바르셀로나', image: 'https://store.fcbarcelona.com/cdn/shop/files/xmas_fcb_26.jpg', url: 'https://store.fcbarcelona.com/ko-kr/products/christmas-pack-mug-socks-fc-barcelona' },
            { name: '크리스마스 기프트 백', image: 'https://store.fcbarcelona.com/cdn/shop/files/BLMP000816005_1.jpg', url: 'https://store.fcbarcelona.com/ko-kr/products/christmas-gift-bag' }
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
            { name: 'Bayern Munich Christmas Product 1', image: 'https://img.fcbayern.com/image/upload/f_auto,q_auto,w_1024/eCommerce/produkte/53954', url: 'https://fcbayern.com/store/en-zz/c/specials/x-mas-world' },
            { name: 'Bayern Munich Christmas Product 2', image: 'https://img.fcbayern.com/image/upload/f_auto,q_auto,w_1024/eCommerce/produkte/54602', url: 'https://fcbayern.com/store/en-zz/c/specials/x-mas-world' },
            { name: 'Bayern Munich Christmas Product 3', image: 'https://img.fcbayern.com/image/upload/f_auto,q_auto,w_640/eCommerce/produkte/53961_1', url: 'https://fcbayern.com/store/en-zz/c/specials/x-mas-world' },
            { name: 'Bayern Munich Christmas Product 4', image: 'https://img.fcbayern.com/image/upload/f_auto,q_auto,w_640/eCommerce/produkte/54109_1', url: 'https://fcbayern.com/store/en-zz/c/specials/x-mas-world' },
            { name: 'Bayern Munich Christmas Product 5', image: 'https://img.fcbayern.com/image/upload/f_auto,q_auto,w_640/eCommerce/produkte/54108_1', url: 'https://fcbayern.com/store/en-zz/c/specials/x-mas-world' },
            { name: 'Bayern Munich Christmas Product 6', image: 'https://img.fcbayern.com/image/upload/f_auto,q_auto,w_1024/eCommerce/produkte/53959', url: 'https://fcbayern.com/store/en-zz/c/specials/x-mas-world' },
            { name: 'Bayern Munich Christmas Product 7', image: 'https://img.fcbayern.com/image/upload/f_auto,q_auto,w_1024/eCommerce/produkte/32837_1', url: 'https://fcbayern.com/store/en-zz/c/specials/x-mas-world' },
            { name: 'Bayern Munich Christmas Product 8', image: 'https://img.fcbayern.com/image/upload/f_auto,q_auto,w_1024/eCommerce/produkte/53846', url: 'https://fcbayern.com/store/en-zz/c/specials/x-mas-world' }
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
            { name: 'BVB Christmas Product 1', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23FDE100" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="black" text-anchor="middle" dy=".3em"%3EBVB%3C/text%3E%3C/svg%3E', url: 'https://shop.bvb.de/en-de/christmas' },
            { name: 'BVB Christmas Product 2', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23FDE100" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="black" text-anchor="middle" dy=".3em"%3EBVB%3C/text%3E%3C/svg%3E', url: 'https://shop.bvb.de/en-de/christmas' },
            { name: 'BVB Christmas Product 3', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23FDE100" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="black" text-anchor="middle" dy=".3em"%3EBVB%3C/text%3E%3C/svg%3E', url: 'https://shop.bvb.de/en-de/christmas' },
            { name: 'BVB Christmas Product 4', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23FDE100" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="black" text-anchor="middle" dy=".3em"%3EBVB%3C/text%3E%3C/svg%3E', url: 'https://shop.bvb.de/en-de/christmas' },
            { name: 'BVB Christmas Product 5', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23FDE100" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="black" text-anchor="middle" dy=".3em"%3EBVB%3C/text%3E%3C/svg%3E', url: 'https://shop.bvb.de/en-de/christmas' },
            { name: 'BVB Christmas Product 6', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23FDE100" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="black" text-anchor="middle" dy=".3em"%3EBVB%3C/text%3E%3C/svg%3E', url: 'https://shop.bvb.de/en-de/christmas' },
            { name: 'BVB Christmas Product 7', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23FDE100" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="black" text-anchor="middle" dy=".3em"%3EBVB%3C/text%3E%3C/svg%3E', url: 'https://shop.bvb.de/en-de/christmas' },
            { name: 'BVB Christmas Product 8', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23FDE100" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="black" text-anchor="middle" dy=".3em"%3EBVB%3C/text%3E%3C/svg%3E', url: 'https://shop.bvb.de/en-de/christmas' }
        ]
    },
    {
        name: '레알 마드리드',
        nameEn: 'Real Madrid',
        logo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
        url: 'https://shop.realmadrid.com/en-es/gifts/christmas/jumpers',
        color: 'from-white to-purple-100',
        league: '라리가',
        products: [
            {
                name: 'Rudolph Christmas Sweater',
                image: 'https://cdn.shopify.com/s/files/1/0405/9807/7603/products/RMCFMS0161-01_de3f7920-7e40-4190-bc15-dadf4d6750af.jpg',
                url: 'https://shop.realmadrid.com/en-es/product/rmcfms0161-real-madrid-rudolph-xmas-jumper'
            },
            {
                name: 'Mens Christmas Sweater Crest Ice White',
                image: 'https://legends.broadleafcloud.com/api/asset/content/RMCFMS0337-1.jpg?contextRequest=%7B%22forceCatalogForFetch%22:false,%22forceFilterByCatalogIncludeInheritance%22:false,%22forceFilterByCatalogExcludeInheritance%22:false,%22applicationId%22:%2201H4RD9NXMKQBQ1WVKM1181VD8%22,%22tenantId%22:%22REAL_MADRID%22%7D',
                url: 'https://shop.realmadrid.com/en-es/product/rmcfms0337-mens-christmas-jumper-crest-ice-white-real-madrid'
            },
            {
                name: 'Kids Christmas Sweater Crest Ice White',
                image: 'https://legends.broadleafcloud.com/api/asset/content/RMCFYS0093-1.jpg?contextRequest=%7B%22forceCatalogForFetch%22:false,%22forceFilterByCatalogIncludeInheritance%22:false,%22forceFilterByCatalogExcludeInheritance%22:false,%22applicationId%22:%2201H4RD9NXMKQBQ1WVKM1181VD8%22,%22tenantId%22:%22REAL_MADRID%22%7D',
                url: 'https://shop.realmadrid.com/en-es/product/rmcfys0093-youth-christmas-jumper-crest-ice-white-real-madrid'
            },
            {
                name: 'Crest Christmas Sweater Navy/Grey',
                image: 'https://cdn.shopify.com/s/files/1/0405/9807/7603/products/RMCFMS0160-01_1_076937d3-42a8-4f85-bb5c-e1f5ef1834be.jpg',
                url: 'https://shop.realmadrid.com/en-es/product/rmcfms0160-real-madrid-crest-xmas-jumper-navy-grey'
            },
            {
                name: 'Mens Christmas Sweater Cable Knit',
                image: 'https://legends.broadleafcloud.com/api/asset/content/RMCFMS0335-1.jpg?contextRequest=%7B%22forceCatalogForFetch%22:false,%22forceFilterByCatalogIncludeInheritance%22:false,%22forceFilterByCatalogExcludeInheritance%22:false,%22applicationId%22:%2201H4RD9NXMKQBQ1WVKM1181VD8%22,%22tenantId%22:%22REAL_MADRID%22%7D',
                url: 'https://shop.realmadrid.com/en-es/product/rmcfms0335-mens-christmas-jumper-cable-knit-real-madrid'
            },
            {
                name: 'Mens Christmas Sweater Teddy Bear',
                image: 'https://legends.broadleafcloud.com/api/asset/content/RMCFMS0334-1.jpg?contextRequest=%7B%22forceCatalogForFetch%22:false,%22forceFilterByCatalogIncludeInheritance%22:false,%22forceFilterByCatalogExcludeInheritance%22:false,%22applicationId%22:%2201H4RD9NXMKQBQ1WVKM1181VD8%22,%22tenantId%22:%22REAL_MADRID%22%7D',
                url: 'https://shop.realmadrid.com/en-es/product/rmcfms0334-mens-christmas-jumper-teddy-bear-real-madrid'
            },
            {
                name: 'Kids Christmas Sweater Teddy Bear',
                image: 'https://legends.broadleafcloud.com/api/asset/content/RMCFYS0089-1-1.jpg?contextRequest=%7B%22forceCatalogForFetch%22:false,%22forceFilterByCatalogIncludeInheritance%22:false,%22forceFilterByCatalogExcludeInheritance%22:false,%22applicationId%22:%2201H4RD9NXMKQBQ1WVKM1181VD8%22,%22tenantId%22:%22REAL_MADRID%22%7D',
                url: 'https://shop.realmadrid.com/en-es/product/rmcfys0089-youth-christmas-jumper-teddy-bear-real-madrid'
            },
            {
                name: 'Kids Christmas Sweater Ski Penguin',
                image: 'https://cdn.shopify.com/s/files/1/0405/9807/7603/products/RMCFYS0060_01.jpg',
                url: 'https://shop.realmadrid.com/en-es/product/rmcfys0060-youth-xmas-jumper-ski-penguin'
            },
            {
                name: 'Mens Christmas Sweater Ski Penguin',
                image: 'https://cdn.shopify.com/s/files/1/0405/9807/7603/products/RMCFMS0245-01.jpg',
                url: 'https://shop.realmadrid.com/en-es/product/rmcfms0245-mens-xmas-jumper-ski-penguin'
            },
            {
                name: 'Mens Christmas Sweater Crest Green/Multicolor',
                image: 'https://cdn.shopify.com/s/files/1/0405/9807/7603/products/RMCFMS0244-01.jpg',
                url: 'https://shop.realmadrid.com/en-es/product/rmcfms0244-mens-xmas-jumper-xmas-colors'
            },
            {
                name: 'Kids Rudolph Christmas Sweater',
                image: 'https://cdn.shopify.com/s/files/1/0405/9807/7603/products/RMCFYS0042-01_1_557100a3-7f82-4ff6-a790-2ba7a4911256.jpg',
                url: 'https://shop.realmadrid.com/en-es/product/rmcfys0042-real-madrid-youth-rudolph-xmas-jumper'
            },
            {
                name: 'Ladies Christmas Sweater Pastel Blue',
                image: 'https://cdn.shopify.com/s/files/1/0405/9807/7603/products/RMCFLS0047-01.jpg',
                url: 'https://shop.realmadrid.com/en-es/product/rmcfls0047-ladies-xmas-jumper-pastel-blue'
            }
        ]
    },
    {
        name: '유벤투스',
        nameEn: 'Juventus',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Juventus_FC_2017_logo.svg',
        url: 'https://store.juventus.com/kr/holiday-gifts',
        color: 'from-black to-gray-800',
        league: '세리에 A',
        products: [
            {
                name: 'Juventus Christmas Jumper 2025',
                image: 'https://store.juventus.com/images/juventus/products/large/JU25Q51.webp',
                url: 'https://store.juventus.com/kr/juventus-christmas-jumper-2025'
            },
            {
                name: 'Juventus Christmas Jumper 2025 - Kids',
                image: 'https://store.juventus.com/images/juventus/products/large/JU25Q52.webp',
                url: 'https://store.juventus.com/kr/juventus-christmas-jumper-2025-kids'
            },
            {
                name: 'Juventus Christmas Beanie 2025',
                image: 'https://store.juventus.com/images/juventus/products/large/JU25Q54.webp',
                url: 'https://store.juventus.com/kr/juventus-christmas-beanie-2025'
            },
            {
                name: 'Juventus Christmas Socks 2025',
                image: 'https://store.juventus.com/images/juventus/products/large/JU25Q53.webp',
                url: 'https://store.juventus.com/kr/juventus-christmas-socks-2025'
            },
            {
                name: 'Juventus Christmas Mug 2025',
                image: 'https://store.juventus.com/images/juventus/products/large/JU95007.webp',
                url: 'https://store.juventus.com/kr/juventus-christmas-mug-2025'
            },
            {
                name: 'Juventus Christmas Teddy',
                image: 'https://store.juventus.com/images/juventus/products/large/JU25J08.webp',
                url: 'https://store.juventus.com/kr/juventus-christmas-teddy'
            },
            {
                name: 'Juventus 6 Christmas Ball Set',
                image: 'https://store.juventus.com/images/juventus/products/large/JU25Q56.webp',
                url: 'https://store.juventus.com/kr/juventus-6-christmas-ball-set'
            },
            {
                name: 'Juventus Snowglobe',
                image: 'https://store.juventus.com/images/juventus/products/large/JU25Q57.webp',
                url: 'https://store.juventus.com/kr/juventus-snowglobe'
            }
        ]
    },
    {
        name: 'AC 밀란',
        nameEn: 'AC Milan',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg',
        url: 'https://store.acmilan.com/en-me/collections/christmas',
        color: 'from-red-600 to-black',
        league: '세리에 A',
        products: [
            {
                name: 'AC Milan White Christmas Jumper',
                image: 'https://store.acmilan.com/cdn/shop/files/XMASJMPA25-A01_01_867dabe7-18f0-4392-a1c8-01bbafaf04f0.jpg',
                url: 'https://store.acmilan.com/en-me/products/gnome-wrap-adult'
            },
            {
                name: 'AC Milan Kids White Christmas Jumper',
                image: 'https://store.acmilan.com/cdn/shop/files/XMASJMPK25-A01_01.jpg',
                url: 'https://store.acmilan.com/en-me/products/gnome-wrap-kids'
            },
            {
                name: 'AC Milan Tartan Christmas Jumper',
                image: 'https://store.acmilan.com/cdn/shop/files/AJMPTN-A02_01_6dcffc2a-845d-486f-b046-38f69643762a.png',
                url: 'https://store.acmilan.com/en-me/products/adult-jumper-tartan'
            },
            {
                name: 'AC Milan Christmas Jumper',
                image: 'https://store.acmilan.com/cdn/shop/files/AJMPTB-A02_01_6cf456f5-8a99-47c0-ae30-17cd5eb6cb62.jpg',
                url: 'https://store.acmilan.com/en-me/products/adult-jumper-tremblant'
            },
            {
                name: 'AC Milan Kids Christmas Jumper',
                image: 'https://store.acmilan.com/cdn/shop/files/KJMPTB-A02_01_24a0f698-57af-453c-bb6a-48151332e61e.jpg',
                url: 'https://store.acmilan.com/en-me/products/kids-jumper-tremblant'
            },
            {
                name: 'AC Milan Big Christmas Gnome',
                image: 'https://store.acmilan.com/cdn/shop/files/TCGNOMEBIG-A00_01.jpg',
                url: 'https://store.acmilan.com/en-me/products/felt-gnome-size-40cm'
            },
            {
                name: 'AC Milan Set of 4 Christmas Ornaments',
                image: 'https://store.acmilan.com/cdn/shop/files/TCXMBALLST-A41_01.jpg',
                url: 'https://store.acmilan.com/en-me/products/x-mas-baubles-set-of-4-tcxmballst-a41'
            },
            {
                name: 'AC Milan Christmas Socks Set',
                image: 'https://store.acmilan.com/cdn/shop/files/WBOOSOCKAD-A13_01_9c26c103-e482-49f6-95de-51bc6f955308.jpg',
                url: 'https://store.acmilan.com/en-me/products/xmas-socks-adults-39-42'
            },
            {
                name: 'AC Milan Christmas Mug',
                image: 'https://store.acmilan.com/cdn/shop/files/TCMUGXMBLK-A00_01_75958e67-f987-427b-87a8-25e091009a62.png',
                url: 'https://store.acmilan.com/en-me/products/mug'
            },
            {
                name: 'AC Milan Snow Globe - Devil',
                image: 'https://store.acmilan.com/cdn/shop/files/DVLSNOWGLB-A48_01.jpg',
                url: 'https://store.acmilan.com/en-me/products/milan-snow-globe-devil'
            },
            {
                name: 'AC Milan Snow Globe - Crest',
                image: 'https://store.acmilan.com/cdn/shop/files/ACMSNOWGLB-A48_01.jpg',
                url: 'https://store.acmilan.com/en-me/products/milan-snow-globe-acm-crest'
            },
            {
                name: 'AC Milan Christmas Tree Top',
                image: 'https://store.acmilan.com/cdn/shop/files/XMSTREETP-A48_01.jpg',
                url: 'https://store.acmilan.com/en-me/products/christmas-tree-top'
            }
        ]
    },
    {
        name: '인터 밀란',
        nameEn: 'Inter Milan',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg',
        url: 'https://store.inter.it/kr/xmas-collection',
        color: 'from-blue-600 to-black',
        league: '세리에 A',
        products: [
            {
                name: 'Inter Winter Holiday Jumper',
                image: 'https://store.inter.it/images/inter/products/large/IN25Q71.webp',
                url: 'https://store.inter.it/kr/inter-winter-holiday-jumper'
            },
            {
                name: 'Inter Winter Holiday Beanie',
                image: 'https://store.inter.it/images/inter/products/large/IN25Q72.webp',
                url: 'https://store.inter.it/kr/inter-winter-holiday-beanie'
            },
            {
                name: 'Inter Winter Holiday Pajamas',
                image: 'https://store.inter.it/images/inter/products/large/IN25Q73.webp',
                url: 'https://store.inter.it/kr/inter-winter-holiday-pajamas'
            },
            {
                name: 'Inter Winter Holiday Non Slip Socks',
                image: 'https://store.inter.it/images/inter/products/large/IN25Q76.webp',
                url: 'https://store.inter.it/kr/inter-winter-holiday-non-slip-socks'
            },
            {
                name: 'Inter Winter Holiday Glass Mug',
                image: 'https://store.inter.it/images/inter/products/large/IN25Q80.webp',
                url: 'https://store.inter.it/kr/inter-winter-holiday-glass-mug'
            },
            {
                name: 'Inter 34cm Reindeer',
                image: 'https://store.inter.it/images/inter/products/large/IN23J08.webp',
                url: 'https://store.inter.it/kr/inter-34-cm-reindeer'
            },
            {
                name: 'Inter Christmas Snowglobe',
                image: 'https://store.inter.it/images/inter/products/large/IN23Q53.webp',
                url: 'https://store.inter.it/kr/inter-christmas-snowglobe'
            },
            {
                name: 'Inter Christmas Ball Set',
                image: 'https://store.inter.it/images/inter/products/large/IN22Q52.webp',
                url: 'https://store.inter.it/kr/inter-christmas-ball-set'
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
