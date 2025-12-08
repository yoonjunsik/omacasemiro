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
        products: [
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_118_12e7feacf766f5bf5d9a769cbebf03ec.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_119_14258af34ef8b3d512a4f0b03ddd2bc2.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_120_f46a30ff38182203ced025d38461b851.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_122_7bff6f532895de66565f051a5f2cfd26.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_124_64831d8dc6c70b2df19c0df362322caf.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_125_a91bca76b0d37850164520d2c6efdaf1.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_126_e7069fc635a3c0374fc5a23d2c0cdb75.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_127_0e38c3acbb123f1af3239fb258ff6f2d.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_128_d347c34836c9072de9c4a1fa38194f69.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_129_e8d8c5ab711b0dfa5b192c26b2b8cec1.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_131_a316b1122841782f6a6aabc25607b712.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_132_3a84d9cacf393bb3044cb91564cd3065.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_133_48e7bc98b5caff296f0c1310f96f1297.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_134_a5e1ee3a3235a54513ba04b09b7e6cb4.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_135_561811cbfba903cc9211d173e8b87706.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_137_c09ebd11015cb9fd7e38a66271f7438d.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_139_3c9f79a75002e05d0454803e59d10e9b.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_140_35f46b119ce8501251866555b818b8f9.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_141_c9c37ce72e2277321798ac4215c5ff9d.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_142_7050604a9b0d1322f3b57c6585e9012c.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_143_21e3d28d12778f85bfb6aaf4f1a36be8.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_54_48e7bc98b5caff296f0c1310f96f1297.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_55_a5e1ee3a3235a54513ba04b09b7e6cb4.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_56_561811cbfba903cc9211d173e8b87706.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_58_c09ebd11015cb9fd7e38a66271f7438d.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_60_3c9f79a75002e05d0454803e59d10e9b.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_62_c9c37ce72e2277321798ac4215c5ff9d.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_63_7050604a9b0d1322f3b57c6585e9012c.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' },
            { name: 'Manchester United Outerwear Product', image: 'images/products/manunited/imgi_64_21e3d28d12778f85bfb6aaf4f1a36be8.jpg', url: 'https://store.manutd.com/en/c/fashion/mens/jackets-coats' }
        ]
    },
    {
        name: '리버풀',
        nameEn: 'Liverpool',
        logo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
        url: 'https://store.liverpoolfc.com/clothing/jackets',
        color: 'from-red-700 to-red-900',
        popularity: 2,
        products: [
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_103_jv6572_f_model_ecom_1.jpg', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_19_s24he12_1689.jpg', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_21_s24he17_00006.jpg', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_23_s25he12_2.jpg', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_25_s25he09_3_1.jpg', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_27_a25ht02_309.jpg', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_29_jx4132_2_apparel_on_model_standard_view_custom.png', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_31_jw7902_2_apparel_on_model_standard_view_custom.png', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_33_jw5474_2_apparel_on_model_standard_view_custom.png', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_35_jw5464_2_apparel_on_model_standard_view_custom.png', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_37_s25he11.jpg', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_39_s24he15_2571.jpg', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_42_kc7802_2_apparel_on_model_standard_view_custom.png', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_46_a25ls02_1372.jpg', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_50_jz5556_2_apparel_on_model_standard_view_custom.png', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_56_s24he18_2902.jpg', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_59_s23et07_1.jpg', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_65_a21et01_1.jpg', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_67_a25yn01_290.jpg', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_69_s25he13_657.jpg', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_71_jv9009_3_apparel_on_model_standard_view_custom.png', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_85_a13344_konte2.jpg', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_87_jw5469_2_apparel_on_model_standard_view_custom.png', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_89_jv6553_f_model_ecom_1.jpg', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_93_s25pw161_164.jpg', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_95_jv9001_3_apparel_on_model_standard_view_custom.png', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_97_jv6563_f_model_ecom_1.jpg', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' },
            { name: 'Liverpool Outerwear Product', image: 'images/products/liverpool/imgi_99_jv6562_f_model_ecom.jpg', url: 'https://store.liverpoolfc.com/kr/catalogsearch/result/?q=jacket' }
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
            { name: 'Manchester City Outerwear Product', image: 'images/products/mancity/imgi_106_701235147001_pp_01_mcfc.png', url: 'https://shop.mancity.com/en/search/?q=jacket' },
            { name: 'Manchester City Outerwear Product', image: 'images/products/mancity/imgi_108_701235147001_pp_01_mcfc.png', url: 'https://shop.mancity.com/en/search/?q=jacket' },
            { name: 'Manchester City Outerwear Product', image: 'images/products/mancity/imgi_116_701235147001_pp_03_mcfc.png', url: 'https://shop.mancity.com/en/search/?q=jacket' },
            { name: 'Manchester City Outerwear Product', image: 'images/products/mancity/imgi_138_701237201003_pp_01_mcfc.png', url: 'https://shop.mancity.com/en/search/?q=jacket' },
            { name: 'Manchester City Outerwear Product', image: 'images/products/mancity/imgi_142_701238831001_pp_01_mcfc.png', url: 'https://shop.mancity.com/en/search/?q=jacket' },
            { name: 'Manchester City Outerwear Product', image: 'images/products/mancity/imgi_144_701238831001_pp_01_mcfc.png', url: 'https://shop.mancity.com/en/search/?q=jacket' },
            { name: 'Manchester City Outerwear Product', image: 'images/products/mancity/imgi_152_701237562001_pp_01_mcfc.png', url: 'https://shop.mancity.com/en/search/?q=jacket' },
            { name: 'Manchester City Outerwear Product', image: 'images/products/mancity/imgi_162_701237562002_pp_01_mcfc.png', url: 'https://shop.mancity.com/en/search/?q=jacket' },
            { name: 'Manchester City Outerwear Product', image: 'images/products/mancity/imgi_46_701238832001_pp_01_mcfc.png', url: 'https://shop.mancity.com/en/search/?q=jacket' },
            { name: 'Manchester City Outerwear Product', image: 'images/products/mancity/imgi_54_701237124002_pp_01_mcfc.png', url: 'https://shop.mancity.com/en/search/?q=jacket' },
            { name: 'Manchester City Outerwear Product', image: 'images/products/mancity/imgi_56_701237124002_pp_01_mcfc.png', url: 'https://shop.mancity.com/en/search/?q=jacket' },
            { name: 'Manchester City Outerwear Product', image: 'images/products/mancity/imgi_62_701237124001_pp_01_mcfc.png', url: 'https://shop.mancity.com/en/search/?q=jacket' },
            { name: 'Manchester City Outerwear Product', image: 'images/products/mancity/imgi_68_701237124003_pp_01_mcfc.png', url: 'https://shop.mancity.com/en/search/?q=jacket' },
            { name: 'Manchester City Outerwear Product', image: 'images/products/mancity/imgi_70_701238834001_pp_01_mcfc.png', url: 'https://shop.mancity.com/en/search/?q=jacket' },
            { name: 'Manchester City Outerwear Product', image: 'images/products/mancity/imgi_72_701238834001_pp_01_mcfc.png', url: 'https://shop.mancity.com/en/search/?q=jacket' },
            { name: 'Manchester City Outerwear Product', image: 'images/products/mancity/imgi_78_701237205001_pp_01_mcfc.png', url: 'https://shop.mancity.com/en/search/?q=jacket' },
            { name: 'Manchester City Outerwear Product', image: 'images/products/mancity/imgi_80_701237205001_pp_01_mcfc.png', url: 'https://shop.mancity.com/en/search/?q=jacket' },
            { name: 'Manchester City Outerwear Product', image: 'images/products/mancity/imgi_86_701237202001_pp_01_mcfc.png', url: 'https://shop.mancity.com/en/search/?q=jacket' },
            { name: 'Manchester City Outerwear Product', image: 'images/products/mancity/imgi_98_701237231001_pp_01_mcfc.png', url: 'https://shop.mancity.com/en/search/?q=jacket' }
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
            { name: 'Arsenal Outerwear Product', image: 'images/products/arsenal/imgi_132_m06796_f1.webp', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets' },
            { name: 'Arsenal Outerwear Product', image: 'images/products/arsenal/imgi_136_m06793_f1.webp', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets' },
            { name: 'Arsenal Outerwear Product', image: 'images/products/arsenal/imgi_138_u06899_f1.webp', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets' },
            { name: 'Arsenal Outerwear Product', image: 'images/products/arsenal/imgi_140_mjz5802_f1.webp', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets' },
            { name: 'Arsenal Outerwear Product', image: 'images/products/arsenal/imgi_142_u06898_f1.webp', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets' },
            { name: 'Arsenal Outerwear Product', image: 'images/products/arsenal/imgi_144_mkb1800_f1.webp', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets' },
            { name: 'Arsenal Outerwear Product', image: 'images/products/arsenal/imgi_146_mkb1834_f1.webp', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets' },
            { name: 'Arsenal Outerwear Product', image: 'images/products/arsenal/imgi_148_mkb1833_f1.webp', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets' },
            { name: 'Arsenal Outerwear Product', image: 'images/products/arsenal/imgi_150_mkb1825_f1.webp', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets' },
            { name: 'Arsenal Outerwear Product', image: 'images/products/arsenal/imgi_151_u07011_f1.webp', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets' },
            { name: 'Arsenal Outerwear Product', image: 'images/products/arsenal/imgi_152_u07012_f1.webp', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets' },
            { name: 'Arsenal Outerwear Product', image: 'images/products/arsenal/imgi_154_mjm9394_f1.webp', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets' },
            { name: 'Arsenal Outerwear Product', image: 'images/products/arsenal/imgi_156_mjm9390_f1.webp', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets' },
            { name: 'Arsenal Outerwear Product', image: 'images/products/arsenal/imgi_158_mjm9403_f1.webp', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets' },
            { name: 'Arsenal Outerwear Product', image: 'images/products/arsenal/imgi_160_mjm9406_f1.webp', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets' },
            { name: 'Arsenal Outerwear Product', image: 'images/products/arsenal/imgi_164_u06737_f1.webp', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets' },
            { name: 'Arsenal Outerwear Product', image: 'images/products/arsenal/imgi_166_u06736_f1.webp', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets' },
            { name: 'Arsenal Outerwear Product', image: 'images/products/arsenal/imgi_168_m06688_f1.webp', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets' },
            { name: 'Arsenal Outerwear Product', image: 'images/products/arsenal/imgi_172_m06686_f1.webp', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets' },
            { name: 'Arsenal Outerwear Product', image: 'images/products/arsenal/imgi_174_n04689_f1.webp', url: 'https://arsenaldirect.arsenal.com/Clothing/Mens-Clothing/Mens-Jackets' }
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
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_404_T90_Track_PDP_1600x2000__39807.1764147390.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_410_porro__91457.1756912017.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_416_heritage_2__01574.1759225475.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_422_retro_shower_jacket_retouch__33685.1759313762.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_434_MJ02AW25_NAVY_SPURS_FLEECE_ZIP_JACKET_1__13335.1752592640.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_446_retro_shower_parka_retouch__02688.1759313651.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_452_MJ03AW25_NAVY_SPURS_FLEECE_GILET_1__76709.1761231371.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_458_MJ07AW24_LIGHTWEIGHT_PADDED_JACKET_NAVY_1__66509.1760705510.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_464_Heritage__10967.1758878085.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_470_SPURS_RETAIL_040525-45_background__68031.1757408124.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_477_mj10aw25_2__14338.1759155770.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_484_MJ17AW24__40922.1727707751.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_491_SPURS_RETAIL_040525-58_edit__63961.1757499313.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_498_nike-academy-spurs-nike-men-academy-repel-park-long-jack-2023__28480.1704888310.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_505_MJ21AW24_RETRO_1984_CUP_FINAL_ZIP_JACKET_1__10981.1737641066.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_519_jacket__80132.1758878864.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_526_jacket__57340.1762855359.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_533_151027_SPURS_PONCHO_ONE_SIZE_2__92471.1760099237.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_540_Mens_long_Coat__57507.1761755981.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_547_SPURS_RETAIL_040525-76_background__64641.1757681961.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_554_coat__69388.1761751427.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_568_NKMT2225_3R_PADDED_JACKET_1__48292.1758556242.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_575_NKMT2325_3R_GILET_1__01944.1758556302.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_582_NKMT1425_NVY_PADDED_JACKET_1_copy__28559.1750947887.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_589_NKMT0925_NVY_RAIN_JACKET_1__80965.1754477918.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_596_Gilets__02159.1762853924.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_603_NKMT1325_NVY_GILET_1__63180.1756974627.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_610_NKME0225_BLK_A_ANTHEM_JACKET_1__73169.1750927139.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_617_nkme1225__82231.1762866162.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_624_NKME0125_H_ANTHEM_JACKET_1__21945.1756974829.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_631_MJ06AW25_SPURS_HOODED_PADDED_JACKET_1__27895.1758122803.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_638_mj01ss24_1__86059.1741362769.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_652_MH32AW24_Navy_M_SPURS_LONDON_VARSITY_JACKET_1__77442.1754473459.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_666_homeware-spurs-one-size-poncho__99148.1696466815.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_673_NKME2624__21839.1732102794.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_680_running-top-models__29314.1739289969.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_687_MJ11AW24_Navy_RETRO_COLOUR_BLOCK_SHOWER_JACKET_1__01648.1723123863.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_694_nike-spurs-adult-nike-repel-running-jacket__27313.1708146257.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_701_nike-academy-spurs-nike-men-dri-fit-academy-track-jacket-2023__04321.1704887050.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_708_nike-academy-spurs-nike-men-repel-academy-rain-jacket-2023__00187.1704888224.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' },
            { name: 'Tottenham Outerwear Product', image: 'images/products/tottenham/imgi_715_spurs-adults-1984-hummel-zip-through-track-jacket__79094.1760705721.jpg', url: 'https://shop.tottenhamhotspur.com/outerwear' }
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
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_116_JN1825_FLAT_1.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_118_INLINEMENSBLACKZIPUPJACKET2.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_120_NULO16ADULTFULLZIPFLEECE6.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_124_LEWISHALL5.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_126_TinoLivramento9.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_127_NUM162ADULTSSHOWERJACKET8.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_128_LEWIS_HALL_2.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_129_LEWIS_HALL_1.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_130_HARVEYBARNES13.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_131_NUM164ADULTSPUFFERJACKET-BLACK2_e58d68f9-2e0d-4975-a9d1-1103a482fd23.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_132_TinoLivramento6.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_134_JACOBRAMSEY9.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_135_Cagoule_3.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_137_S001543A_MOD_3.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_139_Polaroid.23.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_13_HARVEYBARNES13_webp.jpg', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_143_JM9494_MOD_1.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_145_SA6059A_MOD_NAVY_2.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_147_JD1043_MOD_7.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_151_NUM153-BLACK_MOD_11.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_155_NUM126-BLACK_MOD_4.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_159_S000227A_BLUE_MOD_3.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_161_S000300A_MOD_3.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_165_SA6059A_GREY_MOD_10.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' },
            { name: 'Newcastle Outerwear Product', image: 'images/products/newcastle/imgi_8_KB1815AWJACKET2.webp', url: 'https://shop.newcastleunited.com/collections/mens-outerwear' }
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
            { name: 'Aston Villa Outerwear Product', image: 'images/products/astonvilla/imgi_10_aston-villa-adidas-training-all-weather-jacket-light-green_ss5_p-202699166+u-0ikvbpzlg8cgc92zjefe+v-mxfxrv5ybrbjyvklxv2m.jpg', url: 'https://shop.avfc.co.uk/en/aston-villa-men-jackets/t-19103171+ga-67+d-9027655092+z-9-3887032976?_ref=m-TOPNAV' },
            { name: 'Aston Villa Outerwear Product', image: 'images/products/astonvilla/imgi_11_aston-villa-adidas-training-presentation-jacket-navy_ss5_p-202699213+u-d9yf5ikkrjlo8aiqa3bf+v-3psii7erj0omwf0lrupx.jpg', url: 'https://shop.avfc.co.uk/en/aston-villa-men-jackets/t-19103171+ga-67+d-9027655092+z-9-3887032976?_ref=m-TOPNAV' },
            { name: 'Aston Villa Outerwear Product', image: 'images/products/astonvilla/imgi_13_aston-villa-adidas-training-all-weather-jacket-navy_ss5_p-202699205+u-wjpgpuwoalyw9jsq6bqr+v-1dhpygtk62hsqoofkdcs.jpg', url: 'https://shop.avfc.co.uk/en/aston-villa-men-jackets/t-19103171+ga-67+d-9027655092+z-9-3887032976?_ref=m-TOPNAV' },
            { name: 'Aston Villa Outerwear Product', image: 'images/products/astonvilla/imgi_14_aston-villa-adidas-training-all-weather-jacket-light-blue_ss5_p-202699187+u-miwfz9kkjeevhfohhfdc+v-jdg4plofn5srgslllxhg.jpg', url: 'https://shop.avfc.co.uk/en/aston-villa-men-jackets/t-19103171+ga-67+d-9027655092+z-9-3887032976?_ref=m-TOPNAV' },
            { name: 'Aston Villa Outerwear Product', image: 'images/products/astonvilla/imgi_16_aston-villa-adidas-training-all-weather-jacket-pink_ss5_p-202699173+u-5kg1koitdo3tttk47jyo+v-fhac2ea1soxpci2q1yfk.jpg', url: 'https://shop.avfc.co.uk/en/aston-villa-men-jackets/t-19103171+ga-67+d-9027655092+z-9-3887032976?_ref=m-TOPNAV' },
            { name: 'Aston Villa Outerwear Product', image: 'images/products/astonvilla/imgi_17_aston-villa-adidas-training-presentation-jacket-light-blue_ss5_p-202699182+u-wlq5fxutobqkoltg70gw+v-pklsbjhijssw138gv94k.jpg', url: 'https://shop.avfc.co.uk/en/aston-villa-men-jackets/t-19103171+ga-67+d-9027655092+z-9-3887032976?_ref=m-TOPNAV' },
            { name: 'Aston Villa Outerwear Product', image: 'images/products/astonvilla/imgi_18_aston-villa-trinity-road-lightweight-jacket-navy-unisex_ss5_p-202650788+u-hu7ou9bmgezsxijwxunv+v-lnmsiq4f5k1wcfk8izrn.jpg', url: 'https://shop.avfc.co.uk/en/aston-villa-men-jackets/t-19103171+ga-67+d-9027655092+z-9-3887032976?_ref=m-TOPNAV' },
            { name: 'Aston Villa Outerwear Product', image: 'images/products/astonvilla/imgi_19_aston-villa-adidas-training-stadium-parka-jacket-light-blue_ss5_p-202699198+u-2f8wancpglw4eyijlsr8+v-b44awnpwyin7c5btwy3e.jpg', url: 'https://shop.avfc.co.uk/en/aston-villa-men-jackets/t-19103171+ga-67+d-9027655092+z-9-3887032976?_ref=m-TOPNAV' },
            { name: 'Aston Villa Outerwear Product', image: 'images/products/astonvilla/imgi_2_aston-villa-elements-shacket-classic-pewter-mens_ss5_p-203087805+u-flcis49fspgyxurx0bgl+v-vh2ieed09wivfix2uw2b.jpg', url: 'https://shop.avfc.co.uk/en/aston-villa-men-jackets/t-19103171+ga-67+d-9027655092+z-9-3887032976?_ref=m-TOPNAV' },
            { name: 'Aston Villa Outerwear Product', image: 'images/products/astonvilla/imgi_3_aston-villa-elements-varsity-jacket-cappucino-mens_ss5_p-203087806+u-wflxcs2ikuy9ymxhpkoe+v-hy1amr6zuvpxjlgy6vnr.jpg', url: 'https://shop.avfc.co.uk/en/aston-villa-men-jackets/t-19103171+ga-67+d-9027655092+z-9-3887032976?_ref=m-TOPNAV' },
            { name: 'Aston Villa Outerwear Product', image: 'images/products/astonvilla/imgi_4_aston-villa-windbreaker-navy-mens_ss5_p-202797232+u-ak6in5cqvuoxjpdmbvca+v-fxnsufu3e5macxcfycgr.jpg', url: 'https://shop.avfc.co.uk/en/aston-villa-men-jackets/t-19103171+ga-67+d-9027655092+z-9-3887032976?_ref=m-TOPNAV' },
            { name: 'Aston Villa Outerwear Product', image: 'images/products/astonvilla/imgi_6_aston-villa-padded-jacket-navy-mens_ss5_p-202797231+u-mejxfjz0zk3gs5vfu0dc+v-opcif34qfryljz1no140.jpg', url: 'https://shop.avfc.co.uk/en/aston-villa-men-jackets/t-19103171+ga-67+d-9027655092+z-9-3887032976?_ref=m-TOPNAV' },
            { name: 'Aston Villa Outerwear Product', image: 'images/products/astonvilla/imgi_7_aston-villa-microfleece-jacket-black-mens_ss5_p-202533430+u-h58ekelwecggv2jownk3+v-2gcl8i1p9mbjlex2rzkp.jpg', url: 'https://shop.avfc.co.uk/en/aston-villa-men-jackets/t-19103171+ga-67+d-9027655092+z-9-3887032976?_ref=m-TOPNAV' },
            { name: 'Aston Villa Outerwear Product', image: 'images/products/astonvilla/imgi_9_aston-villa-softshell-jacket-black-mens_ss5_p-202076706+u-etrk9ghy8md1kqqypolw+v-7ti0yjhdnumwybbpsqtu.jpg', url: 'https://shop.avfc.co.uk/en/aston-villa-men-jackets/t-19103171+ga-67+d-9027655092+z-9-3887032976?_ref=m-TOPNAV' }
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
            { name: 'West Ham United Outerwear Product', image: 'images/products/westham/imgi_21_8907.jpg', url: 'https://shop.whufc.com/fashion/mens-fashion/coats-and-jackets/' },
            { name: 'West Ham United Outerwear Product', image: 'images/products/westham/imgi_22_8908.jpg', url: 'https://shop.whufc.com/fashion/mens-fashion/coats-and-jackets/' },
            { name: 'West Ham United Outerwear Product', image: 'images/products/westham/imgi_23_8933-872.jpg', url: 'https://shop.whufc.com/fashion/mens-fashion/coats-and-jackets/' },
            { name: 'West Ham United Outerwear Product', image: 'images/products/westham/imgi_24_11208.jpg', url: 'https://shop.whufc.com/fashion/mens-fashion/coats-and-jackets/' },
            { name: 'West Ham United Outerwear Product', image: 'images/products/westham/imgi_25_11996.jpg', url: 'https://shop.whufc.com/fashion/mens-fashion/coats-and-jackets/' },
            { name: 'West Ham United Outerwear Product', image: 'images/products/westham/imgi_26_12000.jpg', url: 'https://shop.whufc.com/fashion/mens-fashion/coats-and-jackets/' },
            { name: 'West Ham United Outerwear Product', image: 'images/products/westham/imgi_27_12003-872.jpg', url: 'https://shop.whufc.com/fashion/mens-fashion/coats-and-jackets/' },
            { name: 'West Ham United Outerwear Product', image: 'images/products/westham/imgi_28_12075.jpg', url: 'https://shop.whufc.com/fashion/mens-fashion/coats-and-jackets/' }
        ]
    },
    {
        name: '브라이튼',
        nameEn: 'Brighton',
        logo: 'https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg',
        url: 'https://shop.brightonandhovealbion.com/outerwear',
        color: 'from-blue-500 to-white',
        popularity: 10,
        products: [
            { name: 'Brighton Outerwear Product', image: 'images/products/brighton/imgi_17_6645.jpg', url: 'https://shop.brightonandhovealbion.com/listing.php?criteria=jacket' },
            { name: 'Brighton Outerwear Product', image: 'images/products/brighton/imgi_18_5609.jpg', url: 'https://shop.brightonandhovealbion.com/listing.php?criteria=jacket' },
            { name: 'Brighton Outerwear Product', image: 'images/products/brighton/imgi_21_3636.jpg', url: 'https://shop.brightonandhovealbion.com/listing.php?criteria=jacket' },
            { name: 'Brighton Outerwear Product', image: 'images/products/brighton/imgi_22_5853.jpg', url: 'https://shop.brightonandhovealbion.com/listing.php?criteria=jacket' },
            { name: 'Brighton Outerwear Product', image: 'images/products/brighton/imgi_24_5608.jpg', url: 'https://shop.brightonandhovealbion.com/listing.php?criteria=jacket' }
        ]
    },
    {
        name: '에버튼',
        nameEn: 'Everton',
        logo: 'https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg',
        url: 'https://store.evertonfc.com/en/everton-clothing/t-21098998+x-64698777+z-87-4155919997',
        color: 'from-blue-700 to-blue-900',
        popularity: 11,
        products: [
            { name: 'Everton Outerwear Product', image: 'images/products/everton/imgi_10_everton-x-mitchell-and-ness-lightweight-satin-jacket-royal-unisex_ss5_p-201952160+u-cx7l4koxgvnyyvifwt6m+v-ogotkqzxrb40ttfhvlab.jpg', url: 'https://store.evertonfc.com/en/everton-men-jackets/t-20873487+ga-56+d-457276835+z-8-562081417?_ref=m-TOPNAV' },
            { name: 'Everton Outerwear Product', image: 'images/products/everton/imgi_11_everton-castore-coaches-training-rain-jacket-navy_ss5_p-202445354+u-vosz17unosea72dupzir+v-s9alghhh2qwiiypgbprp.jpg', url: 'https://store.evertonfc.com/en/everton-men-jackets/t-20873487+ga-56+d-457276835+z-8-562081417?_ref=m-TOPNAV' },
            { name: 'Everton Outerwear Product', image: 'images/products/everton/imgi_12_everton-castore-players-training-rain-jacket-grey_ss5_p-202445339+u-69ihvzanpu1dbdxkjrgf+v-je2dbdeyt6rrfvws8p6z.jpg', url: 'https://store.evertonfc.com/en/everton-men-jackets/t-20873487+ga-56+d-457276835+z-8-562081417?_ref=m-TOPNAV' },
            { name: 'Everton Outerwear Product', image: 'images/products/everton/imgi_13_everton-active-leisure-softshell-jacket-grey-mens_ss5_p-201881599+u-c6lal5skqmlenn6fprlc+v-04nnxwcahz2drvowlfuf.jpg', url: 'https://store.evertonfc.com/en/everton-men-jackets/t-20873487+ga-56+d-457276835+z-8-562081417?_ref=m-TOPNAV' },
            { name: 'Everton Outerwear Product', image: 'images/products/everton/imgi_2_everton-elements-shacket-classic-pewter-mens_ss5_p-203087811+u-ahnvy5ljdroe5pkzy66v+v-ovrfxizvu2huahajqbl8.jpg', url: 'https://store.evertonfc.com/en/everton-men-jackets/t-20873487+ga-56+d-457276835+z-8-562081417?_ref=m-TOPNAV' },
            { name: 'Everton Outerwear Product', image: 'images/products/everton/imgi_3_everton-castore-third-matchday-anthem-jacket-black_ss5_p-202445327+u-adi3khw4opdjz3mgevpf+v-rcz8mm5xiyygbrm7r6xe.jpg', url: 'https://store.evertonfc.com/en/everton-men-jackets/t-20873487+ga-56+d-457276835+z-8-562081417?_ref=m-TOPNAV' },
            { name: 'Everton Outerwear Product', image: 'images/products/everton/imgi_4_everton-windbreaker-navy-mens_ss5_p-202849360+u-uauwbiukstymyfdlh0wk+v-f52mmpcgysadpjgrqhle.jpg', url: 'https://store.evertonfc.com/en/everton-men-jackets/t-20873487+ga-56+d-457276835+z-8-562081417?_ref=m-TOPNAV' },
            { name: 'Everton Outerwear Product', image: 'images/products/everton/imgi_5_everton-puffer-jacket-navy-mens_ss5_p-202849359+u-o6xbcghunxtaxqrbons8+v-gjh2qrh6x6r5i7qumyjp.jpg', url: 'https://store.evertonfc.com/en/everton-men-jackets/t-20873487+ga-56+d-457276835+z-8-562081417?_ref=m-TOPNAV' },
            { name: 'Everton Outerwear Product', image: 'images/products/everton/imgi_6_everton-castore-league-matchday-anthem-jacket-navy_ss5_p-202445322+u-qbe9ibuwzakfqltvm4kb+v-htphzd7ag7swszpz1u1s.jpg', url: 'https://store.evertonfc.com/en/everton-men-jackets/t-20873487+ga-56+d-457276835+z-8-562081417?_ref=m-TOPNAV' },
            { name: 'Everton Outerwear Product', image: 'images/products/everton/imgi_7_everton-fantech-shower-jacket-navy-mens_ss5_p-13384144+u-phgeabtsh0yebbivsreg+v-trsjly0ojiwnbngwtg5n.jpg', url: 'https://store.evertonfc.com/en/everton-men-jackets/t-20873487+ga-56+d-457276835+z-8-562081417?_ref=m-TOPNAV' },
            { name: 'Everton Outerwear Product', image: 'images/products/everton/imgi_9_everton-active-leisure-gilet-grey-mens_ss5_p-201881597+u-uxr4lsivcgfyma35emxh+v-met6bonq3b2qy8rxolfc.jpg', url: 'https://store.evertonfc.com/en/everton-men-jackets/t-20873487+ga-56+d-457276835+z-8-562081417?_ref=m-TOPNAV' }
        ]
    },
    {
        name: '크리스탈 팰리스',
        nameEn: 'Crystal Palace',
        logo: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Crystal_Palace_FC_logo_%282022%29.svg',
        url: 'https://shop.cpfc.co.uk/outerwear',
        color: 'from-blue-600 to-red-600',
        popularity: 12,
        products: [
            { name: 'Crystal Palace Outerwear Product', image: 'images/products/crystalpalace/imgi_29_6113.jpg', url: 'https://shop.cpfc.co.uk/listing.php?criteria=jacket' },
            { name: 'Crystal Palace Outerwear Product', image: 'images/products/crystalpalace/imgi_30_6333.jpg', url: 'https://shop.cpfc.co.uk/listing.php?criteria=jacket' },
            { name: 'Crystal Palace Outerwear Product', image: 'images/products/crystalpalace/imgi_31_6125.jpg', url: 'https://shop.cpfc.co.uk/listing.php?criteria=jacket' },
            { name: 'Crystal Palace Outerwear Product', image: 'images/products/crystalpalace/imgi_32_6124.jpg', url: 'https://shop.cpfc.co.uk/listing.php?criteria=jacket' },
            { name: 'Crystal Palace Outerwear Product', image: 'images/products/crystalpalace/imgi_33_6132.jpg', url: 'https://shop.cpfc.co.uk/listing.php?criteria=jacket' },
            { name: 'Crystal Palace Outerwear Product', image: 'images/products/crystalpalace/imgi_34_5484.jpg', url: 'https://shop.cpfc.co.uk/listing.php?criteria=jacket' },
            { name: 'Crystal Palace Outerwear Product', image: 'images/products/crystalpalace/imgi_35_6114.jpg', url: 'https://shop.cpfc.co.uk/listing.php?criteria=jacket' },
            { name: 'Crystal Palace Outerwear Product', image: 'images/products/crystalpalace/imgi_36_6334-407.jpg', url: 'https://shop.cpfc.co.uk/listing.php?criteria=jacket' },
            { name: 'Crystal Palace Outerwear Product', image: 'images/products/crystalpalace/imgi_37_1562.jpg', url: 'https://shop.cpfc.co.uk/listing.php?criteria=jacket' }
        ]
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
        products: [
            { name: 'Fulham Outerwear Product', image: 'images/products/fulham/imgi_35_6242.jpg', url: 'https://shop.fulhamfc.com/fashion/mens-fashion/outerwear/' },
            { name: 'Fulham Outerwear Product', image: 'images/products/fulham/imgi_36_6577.jpg', url: 'https://shop.fulhamfc.com/fashion/mens-fashion/outerwear/' },
            { name: 'Fulham Outerwear Product', image: 'images/products/fulham/imgi_37_6573.jpg', url: 'https://shop.fulhamfc.com/fashion/mens-fashion/outerwear/' },
            { name: 'Fulham Outerwear Product', image: 'images/products/fulham/imgi_38_5700.jpg', url: 'https://shop.fulhamfc.com/fashion/mens-fashion/outerwear/' },
            { name: 'Fulham Outerwear Product', image: 'images/products/fulham/imgi_39_5698.jpg', url: 'https://shop.fulhamfc.com/fashion/mens-fashion/outerwear/' },
            { name: 'Fulham Outerwear Product', image: 'images/products/fulham/imgi_40_6572.jpg', url: 'https://shop.fulhamfc.com/fashion/mens-fashion/outerwear/' },
            { name: 'Fulham Outerwear Product', image: 'images/products/fulham/imgi_41_6404.jpg', url: 'https://shop.fulhamfc.com/fashion/mens-fashion/outerwear/' },
            { name: 'Fulham Outerwear Product', image: 'images/products/fulham/imgi_42_5916.jpg', url: 'https://shop.fulhamfc.com/fashion/mens-fashion/outerwear/' },
            { name: 'Fulham Outerwear Product', image: 'images/products/fulham/imgi_43_5917.jpg', url: 'https://shop.fulhamfc.com/fashion/mens-fashion/outerwear/' }
        ]
    },
    {
        name: '본머스',
        nameEn: 'Bournemouth',
        logo: 'https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_%282013%29.svg',
        url: 'https://shop.afcb.co.uk/collections/mens-outerwear',
        color: 'from-red-600 to-black',
        popularity: 15,
        products: [
            { name: 'Bournemouth Outerwear Product', image: 'images/products/bournemouth/imgi_15_PRMCHANORAKBK.jpg', url: 'https://superstore.afcb.co.uk/afc-bournemouth/mens-jackets-48' },
            { name: 'Bournemouth Outerwear Product', image: 'images/products/bournemouth/imgi_16_PRMCHVARJACKBK.jpg', url: 'https://superstore.afcb.co.uk/afc-bournemouth/mens-jackets-48' },
            { name: 'Bournemouth Outerwear Product', image: 'images/products/bournemouth/imgi_17_ALASKAJKADCH.jpg', url: 'https://superstore.afcb.co.uk/afc-bournemouth/mens-jackets-48' },
            { name: 'Bournemouth Outerwear Product', image: 'images/products/bournemouth/imgi_18_COLUMBUSJKADKH.jpg', url: 'https://superstore.afcb.co.uk/afc-bournemouth/mens-jackets-48' },
            { name: 'Bournemouth Outerwear Product', image: 'images/products/bournemouth/imgi_19_OAKLANDJKADBK.jpg', url: 'https://superstore.afcb.co.uk/afc-bournemouth/mens-jackets-48' },
            { name: 'Bournemouth Outerwear Product', image: 'images/products/bournemouth/imgi_20_DAKOTAJKADBK.jpg', url: 'https://superstore.afcb.co.uk/afc-bournemouth/mens-jackets-48' },
            { name: 'Bournemouth Outerwear Product', image: 'images/products/bournemouth/imgi_21_BERKELEYJKADBK.jpg', url: 'https://superstore.afcb.co.uk/afc-bournemouth/mens-jackets-48' },
            { name: 'Bournemouth Outerwear Product', image: 'images/products/bournemouth/imgi_22_MANORJKADBK.jpg', url: 'https://superstore.afcb.co.uk/afc-bournemouth/mens-jackets-48' },
            { name: 'Bournemouth Outerwear Product', image: 'images/products/bournemouth/imgi_23_BROBEOLIVE.jpg', url: 'https://superstore.afcb.co.uk/afc-bournemouth/mens-jackets-48' },
            { name: 'Bournemouth Outerwear Product', image: 'images/products/bournemouth/imgi_24_BROBEBLACK.jpg', url: 'https://superstore.afcb.co.uk/afc-bournemouth/mens-jackets-48' },
            { name: 'Bournemouth Outerwear Product', image: 'images/products/bournemouth/imgi_25_COLLBASEBALLADBK.jpg', url: 'https://superstore.afcb.co.uk/afc-bournemouth/mens-jackets-48' },
            { name: 'Bournemouth Outerwear Product', image: 'images/products/bournemouth/imgi_26_GRANGESHKADNV.jpg', url: 'https://superstore.afcb.co.uk/afc-bournemouth/mens-jackets-48' }
        ]
    },
    {
        name: '울버햄튼',
        nameEn: 'Wolverhampton',
        logo: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg',
        url: 'https://shop.wolves.co.uk/collections/outerwear',
        color: 'from-yellow-600 to-black',
        popularity: 16,
        products: [
            { name: 'Wolverhampton Outerwear Product', image: 'images/products/wolves/imgi_30_6074.jpg', url: 'https://shop.wolves.co.uk/clothing/mens-clothing/jackets-coats/' },
            { name: 'Wolverhampton Outerwear Product', image: 'images/products/wolves/imgi_31_6073.jpg', url: 'https://shop.wolves.co.uk/clothing/mens-clothing/jackets-coats/' },
            { name: 'Wolverhampton Outerwear Product', image: 'images/products/wolves/imgi_32_5166.jpg', url: 'https://shop.wolves.co.uk/clothing/mens-clothing/jackets-coats/' },
            { name: 'Wolverhampton Outerwear Product', image: 'images/products/wolves/imgi_33_6091.jpg', url: 'https://shop.wolves.co.uk/clothing/mens-clothing/jackets-coats/' },
            { name: 'Wolverhampton Outerwear Product', image: 'images/products/wolves/imgi_34_5147.jpg', url: 'https://shop.wolves.co.uk/clothing/mens-clothing/jackets-coats/' },
            { name: 'Wolverhampton Outerwear Product', image: 'images/products/wolves/imgi_35_6089.jpg', url: 'https://shop.wolves.co.uk/clothing/mens-clothing/jackets-coats/' },
            { name: 'Wolverhampton Outerwear Product', image: 'images/products/wolves/imgi_36_6092.jpg', url: 'https://shop.wolves.co.uk/clothing/mens-clothing/jackets-coats/' },
            { name: 'Wolverhampton Outerwear Product', image: 'images/products/wolves/imgi_37_4462.jpg', url: 'https://shop.wolves.co.uk/clothing/mens-clothing/jackets-coats/' }
        ]
    },
    {
        name: '노팅엄 포레스트',
        nameEn: 'Nottingham Forest',
        logo: 'https://upload.wikimedia.org/wikipedia/en/e/e5/Nottingham_Forest_F.C._logo.svg',
        url: 'https://shop.nottinghamforest.co.uk/collections/outerwear',
        color: 'from-red-700 to-red-900',
        popularity: 17,
        products: [
            { name: 'Nottingham Forest Outerwear Product', image: 'images/products/nottingham/imgi_14_NFFCTRENTSTYLE11104011.jpg', url: 'https://shop.nottinghamforest.co.uk/collections/mens-jackets-coats' },
            { name: 'Nottingham Forest Outerwear Product', image: 'images/products/nottingham/imgi_16_5561-Nottingham-Ecom-04.11.250719.jpg', url: 'https://shop.nottinghamforest.co.uk/collections/mens-jackets-coats' },
            { name: 'Nottingham Forest Outerwear Product', image: 'images/products/nottingham/imgi_18_5561-Nottingham-Ecom-04.11.250783.jpg', url: 'https://shop.nottinghamforest.co.uk/collections/mens-jackets-coats' },
            { name: 'Nottingham Forest Outerwear Product', image: 'images/products/nottingham/imgi_20_KA795515229.jpg', url: 'https://shop.nottinghamforest.co.uk/collections/mens-jackets-coats' },
            { name: 'Nottingham Forest Outerwear Product', image: 'images/products/nottingham/imgi_22_JL791415111.jpg', url: 'https://shop.nottinghamforest.co.uk/collections/mens-jackets-coats' },
            { name: 'Nottingham Forest Outerwear Product', image: 'images/products/nottingham/imgi_24_KB287015299.jpg', url: 'https://shop.nottinghamforest.co.uk/collections/mens-jackets-coats' },
            { name: 'Nottingham Forest Outerwear Product', image: 'images/products/nottingham/imgi_26_nffc-navy-essential-shower-jacket-nottingham-forest-fc-873034.jpg', url: 'https://shop.nottinghamforest.co.uk/collections/mens-jackets-coats' }
        ]
    },
    {
        name: '브렌트포드',
        nameEn: 'Brentford',
        logo: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg',
        url: 'https://shop.brentfordfc.com/collections/mens-outerwear',
        color: 'from-red-600 to-yellow-500',
        popularity: 18,
        products: [
            { name: 'Brentford Outerwear Product', image: 'images/products/brentford/imgi_41_5494.jpg', url: 'https://shop.brentfordfc.com/training/2526-training/jacket/' },
            { name: 'Brentford Outerwear Product', image: 'images/products/brentford/imgi_44_5491.jpg', url: 'https://shop.brentfordfc.com/training/2526-training/jacket/' }
        ]
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
