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
        products: [
            { name: 'LFC adidas Mens 25/26 Home Anthem Jacket', image: 'https://store.liverpoolfc.com/media/catalog/product/a/0/a06535-lfc-mens-25-26-home-anthem-jacket.jpg', url: 'https://store.liverpoolfc.com/lfc-adidas-mens-25-26-home-anthem-jacket' },
            { name: 'LFC adidas Mens 25/26 Icons Third Anthem Jacket', image: 'https://store.liverpoolfc.com/media/catalog/product/i/z/iz7543-lfc-adidas-mens-25-26-icons-third-anthem-jacket.jpg', url: 'https://store.liverpoolfc.com/lfc-adidas-mens-25-26-icons-third-anthem-jacket' },
            { name: 'LFC adidas Mens 25/26 Vis Tech Travel Jacket', image: 'https://store.liverpoolfc.com/media/catalog/product/i/z/iz7587-lfc-adidas-mens-25-26-vis-tech-travel-jacket.jpg', url: 'https://store.liverpoolfc.com/lfc-adidas-mens-25-26-vis-tech-travel-jacket' },
            { name: 'LFC adidas Mens 25/26 Domestic All Weather Jacket Black', image: 'https://store.liverpoolfc.com/media/catalog/product/i/z/iz7594-lfc-adidas-mens-25-26-domestic-all-weather-jacket-black.jpg', url: 'https://store.liverpoolfc.com/lfc-adidas-mens-25-26-domestic-all-weather-jacket-black' },
            { name: 'LFC adidas Mens 25/26 Domestic All Weather Jacket White', image: 'https://store.liverpoolfc.com/media/catalog/product/i/z/iz7595-lfc-adidas-mens-25-26-domestic-all-weather-jacket-white.jpg', url: 'https://store.liverpoolfc.com/lfc-adidas-mens-25-25-domestic-all-weather-jacket-white' },
            { name: 'LFC Mens Bomber Jacket Black', image: 'https://store.liverpoolfc.com/media/catalog/product/2/4/24lfc1101-lfc-mens-bomber-jacket-black.jpg', url: 'https://store.liverpoolfc.com/lfc-mens-bomber-jacket-black' },
            { name: 'LFC adidas Terrace Icons Half-Zip Jacket Green', image: 'https://store.liverpoolfc.com/media/catalog/product/i/z/iz7550-lfc-adidas-mens-terrace-icons-half-zip-jacket-green.jpg', url: 'https://store.liverpoolfc.com/lfc-adidas-mens-terrace-icons-half-zip-jacket-green' },
            { name: 'LFC adidas DNA Full-Zip Track Jacket Red', image: 'https://store.liverpoolfc.com/media/catalog/product/i/x/ix3734-lfc-adidas-dna-full-zip-track-jacket-red.jpg', url: 'https://store.liverpoolfc.com/lfc-adidas-dna-full-zip-track-jacket-red' }
        ]
    },
    {
        name: '맨체스터 시티',
        nameEn: 'Manchester City',
        logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
        url: 'https://shop.mancity.com/ca/en/clothing/outerwear/',
        color: 'from-sky-400 to-sky-600',
        popularity: 3,
        products: [
            { name: 'Manchester City Showerproof Jacket', image: 'https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog-MAN/default/dwf6d72d94/images/large/701238832001_pp_01_mcfc.png?sw=800&sh=800&sm=fit', url: 'https://shop.mancity.com/en/manchester-city-showerproof-jacket/701238832-black.html' },
            { name: 'Kids Manchester City Showerproof Jacket', image: 'https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog-MAN/default/dw856c7794/images/large/701238970001_pp_01_mcfc.png?sw=800&sh=800&sm=fit', url: 'https://shop.mancity.com/en/kids-manchester-city-showerproof-jacket/701238970-blue.html' },
            { name: 'Manchester City Pre-Match KING Anthem Jacket', image: 'https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog-MAN/default/dw7186efa6/images/large/701237124002_pp_01_mcfc.png?sw=800&sh=800&sm=fit', url: 'https://shop.mancity.com/en/manchester-city-pre-match-king-anthem-jacket/701237124-blue.html' },
            { name: 'Kids Manchester City Essentials Fleece Lined Hoodie Jacket', image: 'https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog-MAN/default/dw785cecac/images/large/701221095002_pp_01_mcfc.png?sw=800&sh=800&sm=fit', url: 'https://shop.mancity.com/en/kids-manchester-city-essentials-fleece-lined-hoodie-jacket/701221095-grey.html' },
            { name: 'Manchester City Quilted Jacket', image: 'https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog-MAN/default/images/large/701238834001_pp_01_mcfc.png?sw=800&sh=800&sm=fit', url: 'https://shop.mancity.com/en/manchester-city-quilted-jacket/701238834-black.html' },
            { name: 'Manchester City Training Winter Jacket 2025/26', image: 'https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog-MAN/default/images/large/701237205001_pp_01_mcfc.png?sw=800&sh=800&sm=fit', url: 'https://shop.mancity.com/en/manchester-city-training-winter-jacket-2025-26/701237205-black.html' },
            { name: 'Manchester City Training All Weather Jacket 2025/26', image: 'https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog-MAN/default/images/large/701237202001_pp_01_mcfc.png?sw=800&sh=800&sm=fit', url: 'https://shop.mancity.com/en/manchester-city-training-all-weather-jacket-2025-26/701237202-black.html' },
            { name: 'Manchester City FtblCulture Jacket 2025/26', image: 'https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog-MAN/default/images/large/701237231001_pp_01_mcfc.png?sw=800&sh=800&sm=fit', url: 'https://shop.mancity.com/en/manchester-city-ftblculture-jacket-2025-26/701237231-grey.html' }
        ]
    },
    {
        name: '아스널',
        nameEn: 'Arsenal',
        logo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
        url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Outerwear/c/outerwear',
        color: 'from-red-600 to-red-800',
        popularity: 4,
        products: [
            { name: 'Arsenal N7 Barrell Hooded Puffer Jacket', image: 'https://i1.adis.ws/i/ArsenalDirect/m06796_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets/Arsenal-N7-Barrell-Hooded-Puffer-Jacket/p/M06796' },
            { name: 'Arsenal N7 Force Reversible Fleece Jacket', image: 'https://i1.adis.ws/i/ArsenalDirect/m06795_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets/Arsenal-N7-Force-Reversible-Fleece-Jacket/p/M06795' },
            { name: 'Arsenal N7 Artillery Harrington Jacket', image: 'https://i1.adis.ws/i/ArsenalDirect/m06793_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets/Arsenal-N7-Artillery-Harrington-Jacket/p/M06793' },
            { name: 'Arsenal Essentials Unisex Green Cannon Hooded Puffer Jacket', image: 'https://i1.adis.ws/i/ArsenalDirect/u06899_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Clothing/Womens-Clothing/Womens-Jackets/Arsenal-Essentials-Unisex-Green-Cannon-Hooded-Puffer-Jacket/p/U06899' },
            { name: 'Arsenal adidas 25/26 Lifestyler Track Top', image: 'https://i1.adis.ws/i/ArsenalDirect/mjz5802_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets/Arsenal-adidas-25-26-Lifestyler-Track-Top/p/MJZ5802' },
            { name: 'Arsenal Essentials Unisex Red Cannon Hooded Puffer Jacket', image: 'https://i1.adis.ws/i/ArsenalDirect/u06898_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Clothing/Womens-Clothing/Womens-Jackets/Arsenal-Essentials-Unisex-Red-Cannon-Hooded-Puffer-Jacket/p/U06898' },
            { name: 'Arsenal adidas 25/26 Rain Jacket', image: 'https://i1.adis.ws/i/ArsenalDirect/mkb1834_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Training/Mens-Training/Mens-Training-Jackets/Arsenal-adidas-25-26-Rain-Jacket/p/MKB1834' },
            { name: 'Arsenal adidas 25/26 Stadium Parka', image: 'https://i1.adis.ws/i/ArsenalDirect/mkb1833_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Training/Mens-Training/Mens-Training-Jackets/Arsenal-adidas-25-26-Stadium-Parka/p/MKB1833' },
            { name: 'Arsenal adidas 25/26 Presentation Jacket', image: 'https://i1.adis.ws/i/ArsenalDirect/mkb1825_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Training/Mens-Training/Mens-Training-Jackets/Arsenal-adidas-25-26-Presentation-Jacket/p/MKB1825' },
            { name: 'Arsenal adidas 25/26 Anthem Jacket', image: 'https://i1.adis.ws/i/ArsenalDirect/mkb1800_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Training/Mens-Training/Mens-Training-Jackets/Arsenal-adidas-25-26-Anthem-Jacket/p/MKB1800' },
            { name: 'Arsenal adidas 25/26 Terrace Icons Track Top', image: 'https://i1.adis.ws/i/ArsenalDirect/mjm9390_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Clothing/Terrace-Icons/Arsenal-adidas-25-26-Terrace-Icons-Track-Top/p/MJM9390' },
            { name: 'Arsenal adidas 25/26 Seasonal Down Jacket', image: 'https://i1.adis.ws/i/ArsenalDirect/mjm9406_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets/Arsenal-adidas-25-26-Seasonal-Down-Jacket/p/MJM9406' },
            { name: 'Arsenal adidas 25/26 Urban Purist Windbreaker', image: 'https://i1.adis.ws/i/ArsenalDirect/mjm9418_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets/Arsenal-adidas-25-26-Urban-Purist-Windbreaker/p/MJM9418' },
            { name: 'Arsenal adidas 25/26 Terrace Icons Parka', image: 'https://i1.adis.ws/i/ArsenalDirect/mjm9394_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Clothing/Terrace-Icons/Arsenal-adidas-25-26-Terrace-Icons-Parka/p/MJM9394' },
            { name: 'Arsenal adidas 25/26 Terrace Icons Half Zip Jacket', image: 'https://i1.adis.ws/i/ArsenalDirect/mjm9399_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Clothing/Terrace-Icons/Arsenal-adidas-25-26-Terrace-Icons-Half-Zip-Jacket/p/MJM9399' },
            { name: 'Arsenal adidas 25/26 Urban Purist Track Top', image: 'https://i1.adis.ws/i/ArsenalDirect/mjm9400_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets/Arsenal-adidas-25-26-Urban-Purist-Track-Top/p/MJM9400' },
            { name: 'Arsenal adidas 25/26 Home Anthem Jacket', image: 'https://i1.adis.ws/i/ArsenalDirect/mjm9409_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Training/Pre-Match/Arsenal-adidas-25-26-Home-Anthem-Jacket/p/MJM9409' },
            { name: 'Arsenal x A-COLD-WALL* Terrace Harrington Jacket', image: 'https://i1.adis.ws/i/ArsenalDirect/m06960_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets/Arsenal-x-A-COLD-WALL-Terrace-Harrington-Jacket/p/M06960' },
            { name: 'Arsenal x A-COLD-WALL* Caledonian Jacket', image: 'https://i1.adis.ws/i/ArsenalDirect/m06968_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets/Arsenal-x-A-COLD-WALL-Caledonian-Jacket/p/M06968' },
            { name: 'Arsenal Red Printed Cannon Puffer Jacket', image: 'https://i1.adis.ws/i/ArsenalDirect/u06777_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets/Arsenal-Red-Printed-Cannon-Puffer-Jacket/p/U06777' },
            { name: 'Arsenal Off White NPC Worker Jacket', image: 'https://i1.adis.ws/i/ArsenalDirect/m06717_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets/Arsenal-Off-White-NPC-Worker-Jacket/p/M06717' },
            { name: 'Arsenal Burgundy Cannon Puffer Jacket', image: 'https://i1.adis.ws/i/ArsenalDirect/u06733_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets/Arsenal-Burgundy-Cannon-Puffer-Jacket/p/U06733' },
            { name: 'Arsenal Navy Cannon Puffer Jacket', image: 'https://i1.adis.ws/i/ArsenalDirect/u06735_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets/Arsenal-Navy-Cannon-Puffer-Jacket/p/U06735' },
            { name: 'Arsenal Navy Chapman Padded Jacket', image: 'https://i1.adis.ws/i/ArsenalDirect/u06736_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets/Arsenal-Navy-Chapman-Padded-Jacket/p/U06736' },
            { name: 'Arsenal Grey Cannon Puffer Jacket', image: 'https://i1.adis.ws/i/ArsenalDirect/u06734_f1?$plpImages$', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets/Arsenal-Grey-Cannon-Puffer-Jacket/p/U06734' }
        ]
    },
    {
        name: '첼시',
        nameEn: 'Chelsea',
        logo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
        url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615',
        color: 'from-blue-600 to-blue-800',
        popularity: 5,
        products: [
            { name: 'Chelsea 120 Reimagined Icons Renaissance Track Jacket', image: 'images/products/chelsea/chelsea-120-reimagined-icons-renaissance-track-jacket_ss5_p-202697229+u-1hc6ooutvrzkwwrnzhsa+v-8s5yeecxajfwtomvgbih.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' },
            { name: 'Chelsea 120 Reimagined Icons Ted Drake Bomber', image: 'images/products/chelsea/chelsea-120-reimagined-icons-ted-drake-bomber_ss5_p-202697233+u-aflsbfsf4j76u3uvl5a2+v-betoi2x1vfvagfropndu.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' },
            { name: 'Chelsea Active Camoflague Gilet Khaki Mens', image: 'images/products/chelsea/chelsea-active-camoflague-gilet-khaki-mens_ss5_p-202454847+u-idae3mhppdajxdksdolz+v-gytru2ky0etldtjdzgme.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' },
            { name: 'Chelsea Active Contrast Anorak Khaki Mens', image: 'images/products/chelsea/chelsea-active-contrast-anorak-khaki-mens_ss5_p-202454839+u-sixf4kolgdxd0hnpvv6y+v-9enljzuqa6wbapc07q5s.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' },
            { name: 'Chelsea Elements Shacket Whitecap Gray', image: 'images/products/chelsea/chelsea-elements-shacket-whitecap-gray_ss5_p-203103154+u-nk7saq6fykc9u8wy3x8g+v-32zoklec5yajfraowiph.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' },
            { name: 'Chelsea Gilet Black Mens', image: 'images/products/chelsea/chelsea-gilet-black-mens_ss5_p-201642105+u-nnxphixeukxopabrafxg+v-xk1yfeo7smosfnlsowp4.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' },
            { name: 'Chelsea Gilet Navy Mens', image: 'images/products/chelsea/chelsea-gilet-navy-mens_ss5_p-203395863+u-z8roxgrfltyozvdldbss+v-klwagv9x1nfstv0xxapq.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' },
            { name: 'Chelsea Nike Anthem Jacket Blue', image: 'images/products/chelsea/chelsea-nike-anthem-jacket-blue_ss5_p-200851207+u-gvrvxpfbyndqmh9jvklm+v-evsg11gapqiads6g65hw.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' },
            { name: 'Chelsea Nike Anthem Jacket Blue', image: 'images/products/chelsea/chelsea-nike-anthem-jacket-blue_ss5_p-202492512+u-nd9veunixlxhibxgnbvh+v-fqpz7e7hli9quuu6uu5f.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' },
            { name: 'Chelsea Nike Club Futura Hooded Jacket Blue', image: 'images/products/chelsea/chelsea-nike-club-futura-hooded-jacket-blue_ss5_p-202697141+u-njwcfycjf4ona4lfv3gx+v-5lmfynssrj2jj3xtjapu.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' },
            { name: 'Chelsea Nike Club Knit Jacket Blue', image: 'images/products/chelsea/chelsea-nike-club-knit-jacket-blue_ss5_p-202313499+u-sbfdwxo7lky3v4taqglg+v-m2akgr9ikr16ryb57o3z.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' },
            { name: 'Chelsea Nike Coach Jacket Obsidian', image: 'images/products/chelsea/chelsea-nike-coach-jacket-obsidian_ss5_p-202697153+u-1z2vblzr8lhmqsnm4ghi+v-bgsnerjpghvddfzkzxtm.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' },
            { name: 'Chelsea Nike Down Fill Jacket Obsidian', image: 'images/products/chelsea/chelsea-nike-down-fill-jacket-obsidian_ss5_p-202998011+u-c78ejc6vc5exnlsfy6dt+v-cvuffmvtekyduxmdsx33.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' },
            { name: 'Chelsea Nike N98 Tech Fleece Jacket Navy', image: 'images/products/chelsea/chelsea-nike-n98-tech-fleece-jacket-navy_ss5_p-200851208+u-rytxxcnb7eabmg1dytke+v-zzobcs78ymy8lpjjcmlh.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' },
            { name: 'Chelsea Nike Tech Fleece Jacket Black', image: 'images/products/chelsea/chelsea-nike-tech-fleece-jacket-black_ss5_p-202697155+u-jycm45smycq9jrpsxnid+v-g1sqsb2h0tc8g7vgabqq.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' },
            { name: 'Chelsea Nike Tech Woven Windrunner Jacket Green', image: 'images/products/chelsea/chelsea-nike-tech-woven-windrunner-jacket-green_ss5_p-202492510+u-u2ns8cjrnbjhhdirfqfz+v-ele4pswhj78lkyhxu8ye.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' },
            { name: 'Chelsea Nike Woven Twill Premium Overshirt Black', image: 'images/products/chelsea/chelsea-nike-woven-twill-premium-overshirt-black_ss5_p-201455169+u-9zdwjracpafx3b5zgt5t+v-wmx2cvuifdspvhsythpc.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' },
            { name: 'Chelsea Padded Jacket Navy', image: 'images/products/chelsea/chelsea-padded-jacket-navy_ss5_p-202908222+u-hmsteuw56jiqamomk8ms+v-ttgre49lrvipufstucee.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' },
            { name: 'Chelsea Parka Jacket Black Mens', image: 'images/products/chelsea/chelsea-parka-jacket-black-mens_ss5_p-203376605+u-yh5temgpnoo7sytcc7pj+v-p2fjgx0dmxbe9c4pa46c.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' },
            { name: 'Chelsea Speedway Reversible Bomber Jacket Dark Green', image: 'images/products/chelsea/chelsea-speedway-reversible-bomber-jacket-dark-green_ss5_p-203090280+u-rsib62ge61kncnhrpsx9+v-x1lgc89jd98fdxsnd4en.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' },
            { name: 'Chelsea Speedway Track Jacket Dark Green', image: 'images/products/chelsea/chelsea-speedway-track-jacket-dark-green_ss5_p-203090277+u-xxypwfs8y85gdldd5sup+v-zkkjik0x2g2bb9wjrls7.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' },
            { name: 'Chelsea Varsity Badge Bomber Jacket Navy', image: 'images/products/chelsea/chelsea-varsity-badge-bomber-jacket-navy_ss5_p-202991203+u-uboh1qjm2cjsuoprbgq5+v-h1xywtqkk1asa0zqlptw.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' },
            { name: 'Chelsea Windbreaker Navy', image: 'images/products/chelsea/chelsea-windbreaker-navy_ss5_p-202908223+u-ubhr71mdhrw7n7xefclm+v-wkvosppgfduubtoh6vwq.jpeg', url: 'https://store.chelseafc.com/en/chelsea-men-jackets/t-32334068+ga-78+d-5694871603+z-9-1938741615' }
        ]
    },
    {
        name: '토트넘',
        nameEn: 'Tottenham',
        logo: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
        url: 'https://shop.tottenhamhotspur.com/outerwear',
        color: 'from-white to-gray-200',
        popularity: 6,
        products: [
            { name: 'Spurs Nike Mens Navy Home Anthem Jacket 2025/26', image: 'https://cdn11.bigcommerce.com/s-5e8c3uvulz/images/stencil/1280x1280/products/30874/37218/NKME0125_H_ANTHEM_JACKET_1__21945.1756974829.jpg?c=1', url: 'https://shop.tottenhamhotspur.com/nk-h-anthem-jacket-2025-26-nkme0125/nkme0125' },
            { name: 'Spurs Nike Mens Black Away Anthem Jacket 2025/26', image: 'https://cdn11.bigcommerce.com/s-5e8c3uvulz/images/stencil/1280x1280/products/30867/37694/NKME0225_BLK_A_ANTHEM_JACKET_1__73169.1750927139.jpg?c=1', url: 'https://shop.tottenhamhotspur.com/nk-a-anthem-jacket-2025-26-nkme0225/nkme0225' },
            { name: 'Spurs Nike Mens Navy T90 Track Jacket 2025/26', image: 'https://cdn11.bigcommerce.com/s-5e8c3uvulz/images/stencil/1280x1280/products/30696/40086/T90_Track_PDP_1600x2000__39807.1764147390.jpg?c=1', url: 'https://shop.tottenhamhotspur.com/nk-t90-track-jacket-2025-26-nkme2825/nkme2825' },
            { name: 'Spurs Nike Mens Navy Padded Jacket 2025/26', image: 'https://cdn11.bigcommerce.com/s-5e8c3uvulz/images/stencil/1280x1280/products/30718/37742/NKMT1425_NVY_PADDED_JACKET_1_copy__28559.1750947887.jpg?c=1', url: 'https://shop.tottenhamhotspur.com/nk-padded-jacket-2025-26-nkmt1425/nkmt1425' },
            { name: 'Spurs Nike Mens Tech Fleece Hoodie 2025/26', image: 'https://cdn11.bigcommerce.com/s-5e8c3uvulz/images/stencil/1280x1280/products/30872/39957/Tech_men__79379.1761751894.jpg?c=1', url: 'https://shop.tottenhamhotspur.com/nk-tech-fleece-hoodie-2025-26-nkme0325/nkme0325' },
            { name: 'Spurs Nike Mens Navy Third Padded Jacket 2025/26', image: 'https://cdn11.bigcommerce.com/s-5e8c3uvulz/images/stencil/1280x1280/products/30701/39283/NKMT2225_3R_PADDED_JACKET_1__48292.1758556242.jpg?c=1', url: 'https://shop.tottenhamhotspur.com/nk-3r-padded-jacket-2025-26-nkmt2225/nkmt2225' }
        ]
    },
    {
        name: '뉴캐슬',
        nameEn: 'Newcastle',
        logo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg',
        url: 'https://shop.newcastleunited.com/collections/outerwear',
        color: 'from-black to-gray-800',
        popularity: 7,
        products: [
            { name: 'Newcastle United adidas 2025/26 Anthem Full-Zip Hoodie Jacket Black', image: 'https://images.fanatics.com/lf?set=source[/images/products/default/jf7256_pp.jpg],w[800],h[800],type[jpeg]&call=url[file:product]', url: 'https://shop.newcastleunited.com/newcastle-adidas-anthem-jacket-black' },
            { name: 'Newcastle United adidas Tiro 24 Track Jacket Black', image: 'https://images.fanatics.com/lf?set=source[/images/products/default/ix8007_pp.jpg],w[800],h[800],type[jpeg]&call=url[file:product]', url: 'https://shop.newcastleunited.com/newcastle-adidas-tiro-24-track-jacket' },
            { name: 'Newcastle United adidas All Weather Jacket', image: 'https://images.fanatics.com/lf?set=source[/images/products/default/jf7260_pp.jpg],w[800],h[800],type[jpeg]&call=url[file:product]', url: 'https://shop.newcastleunited.com/newcastle-adidas-all-weather-jacket' },
            { name: 'Newcastle United adidas Pre-Match Jacket', image: 'https://images.fanatics.com/lf?set=source[/images/products/default/jf7258_pp.jpg],w[800],h[800],type[jpeg]&call=url[file:product]', url: 'https://shop.newcastleunited.com/newcastle-adidas-pre-match-jacket' },
            { name: 'Newcastle United adidas Travel Jacket', image: 'https://images.fanatics.com/lf?set=source[/images/products/default/jf7259_pp.jpg],w[800],h[800],type[jpeg]&call=url[file:product]', url: 'https://shop.newcastleunited.com/newcastle-adidas-travel-jacket' },
            { name: 'Newcastle United Terrace Coaches Jacket', image: 'https://images.fanatics.com/lf?set=source[/images/products/default/nufc-terrace-coaches-jacket_pp.jpg],w[800],h[800],type[jpeg]&call=url[file:product]', url: 'https://shop.newcastleunited.com/newcastle-terrace-coaches-jacket' }
        ]
    },
    {
        name: '아스톤 빌라',
        nameEn: 'Aston Villa',
        logo: 'images/logos/Aston_Villa_FC_new_crest.svg.png',
        url: 'https://shop.avfc.co.uk/en/aston-villa-outerwear/t-65983654+x-08259219+z-81-3286515707',
        color: 'from-purple-900 to-blue-900',
        popularity: 8,
        products: [
            { name: 'Aston Villa adidas Anthem Jacket', image: 'https://images.fanatics.com/lf?set=source[/images/products/default/avfc-anthem-jacket_pp.jpg],w[800],h[800],type[jpeg]&call=url[file:product]', url: 'https://shop.avfc.co.uk/aston-villa-anthem-jacket' },
            { name: 'Aston Villa adidas All Weather Jacket', image: 'https://images.fanatics.com/lf?set=source[/images/products/default/avfc-all-weather_pp.jpg],w[800],h[800],type[jpeg]&call=url[file:product]', url: 'https://shop.avfc.co.uk/aston-villa-all-weather-jacket' },
            { name: 'Aston Villa adidas Travel Jacket', image: 'https://images.fanatics.com/lf?set=source[/images/products/default/avfc-travel-jacket_pp.jpg],w[800],h[800],type[jpeg]&call=url[file:product]', url: 'https://shop.avfc.co.uk/aston-villa-travel-jacket' },
            { name: 'Aston Villa Varsity Jacket', image: 'https://images.fanatics.com/lf?set=source[/images/products/default/avfc-varsity_pp.jpg],w[800],h[800],type[jpeg]&call=url[file:product]', url: 'https://shop.avfc.co.uk/aston-villa-varsity-jacket' },
            { name: 'Aston Villa Coaches Jacket', image: 'https://images.fanatics.com/lf?set=source[/images/products/default/avfc-coaches_pp.jpg],w[800],h[800],type[jpeg]&call=url[file:product]', url: 'https://shop.avfc.co.uk/aston-villa-coaches-jacket' }
        ]
    },
    {
        name: '웨스트햄',
        nameEn: 'West Ham United',
        logo: 'https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg',
        url: 'https://shop.whufc.com/outerwear',
        color: 'from-purple-900 to-sky-400',
        popularity: 9,
        products: [
            { name: 'West Ham United Padded Hoodie Full-Zip Jacket Navy', image: 'https://images.fanatics.com/lf?set=source[/images/products/default/wham-padded-jacket-navy_pp.jpg],w[800],h[800],type[jpeg]&call=url[file:product]', url: 'https://shop.whufc.com/west-ham-padded-jacket-navy' },
            { name: 'West Ham United Coaches Jacket', image: 'https://images.fanatics.com/lf?set=source[/images/products/default/wham-coaches-jacket_pp.jpg],w[800],h[800],type[jpeg]&call=url[file:product]', url: 'https://shop.whufc.com/west-ham-coaches-jacket' },
            { name: 'West Ham United Varsity Jacket', image: 'https://images.fanatics.com/lf?set=source[/images/products/default/wham-varsity_pp.jpg],w[800],h[800],type[jpeg]&call=url[file:product]', url: 'https://shop.whufc.com/west-ham-varsity-jacket' },
            { name: 'West Ham United Bomber Jacket', image: 'https://images.fanatics.com/lf?set=source[/images/products/default/wham-bomber_pp.jpg],w[800],h[800],type[jpeg]&call=url[file:product]', url: 'https://shop.whufc.com/west-ham-bomber-jacket' },
            { name: 'West Ham United Track Jacket', image: 'https://images.fanatics.com/lf?set=source[/images/products/default/wham-track-jacket_pp.jpg],w[800],h[800],type[jpeg]&call=url[file:product]', url: 'https://shop.whufc.com/west-ham-track-jacket' }
        ]
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
        products: [
            { name: 'Premium Cherries Windbreaker Anorak', image: 'https://www.superstore.afcb.co.uk/images/web-products/department-thumbs/PRMCHANORAKBK.jpg', url: 'https://www.superstore.afcb.co.uk/afc-bournemouth/PRMCHANORAKBK' },
            { name: 'Premium Cherries Varsity Jacket - Black', image: 'https://www.superstore.afcb.co.uk/images/web-products/department-thumbs/PRMCHVARJACKBK.jpg', url: 'https://www.superstore.afcb.co.uk/afc-bournemouth/PRMCHVARJACKBK' },
            { name: 'Adults Alaska Long Coat - Charcoal', image: 'https://www.superstore.afcb.co.uk/images/web-products/department-thumbs/ALASKAJKADCH.jpg', url: 'https://www.superstore.afcb.co.uk/afc-bournemouth/ALASKAJKADCH' },
            { name: 'Adults Columbus Coat - Khaki', image: 'https://www.superstore.afcb.co.uk/images/web-products/department-thumbs/COLUMBUSJKADKH.jpg', url: 'https://www.superstore.afcb.co.uk/afc-bournemouth/COLUMBUSJKADKH' },
            { name: 'Adults Oakland Puffer Jacket - Black', image: 'https://www.superstore.afcb.co.uk/images/web-products/department-thumbs/OAKLANDJKADBK.jpg', url: 'https://www.superstore.afcb.co.uk/afc-bournemouth/OAKLANDJKADBK' },
            { name: 'Adults Dakota Lightweight Jacket - Black', image: 'https://www.superstore.afcb.co.uk/images/web-products/department-thumbs/DAKOTAJKADBK.jpg', url: 'https://www.superstore.afcb.co.uk/afc-bournemouth/DAKOTAJKADBK' },
            { name: 'Adults Berkeley Jacket - Black', image: 'https://www.superstore.afcb.co.uk/images/web-products/department-thumbs/BERKELEYJKADBK.jpg', url: 'https://www.superstore.afcb.co.uk/afc-bournemouth/BERKELEYJKADBK' },
            { name: 'Adults Manor Jacket - Black', image: 'https://www.superstore.afcb.co.uk/images/web-products/department-thumbs/MANORJKADBK.jpg', url: 'https://www.superstore.afcb.co.uk/afc-bournemouth/MANORJKADBK' },
            { name: 'Beachbum X AFCB Beach Robe - Olive', image: 'https://www.superstore.afcb.co.uk/images/web-products/department-thumbs/BROBEOLIVE.jpg', url: 'https://www.superstore.afcb.co.uk/afc-bournemouth/BROBEOLIVE' },
            { name: 'Beachbum X AFCB Beach Robe - Black', image: 'https://www.superstore.afcb.co.uk/images/web-products/department-thumbs/BROBEBLACK.jpg', url: 'https://www.superstore.afcb.co.uk/afc-bournemouth/BROBEBLACK' },
            { name: 'Adults College Baseball Jacket - Black / White', image: 'https://www.superstore.afcb.co.uk/images/web-products/department-thumbs/COLLBASEBALLADBK.jpg', url: 'https://www.superstore.afcb.co.uk/afc-bournemouth/COLLBASEBALLADBK' },
            { name: 'Adults Grange Shacket - Navy Blue', image: 'https://www.superstore.afcb.co.uk/images/web-products/department-thumbs/GRANGESHKADNV.jpg', url: 'https://www.superstore.afcb.co.uk/afc-bournemouth/GRANGESHKADNV' }
        ]
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
