// 판매처 정보 업데이트 스크립트
const fs = require('fs');

// 환율
const rates = {
    GBP: 1931.33,
    EUR: 1700.69
};

// 추가할 판매처 정보
const newOffers = [
    {
        model_code: "GM4545",
        offer: {
            site_name: "스포츠다이렉트",
            currency: "GBP",
            regular_price: 69.99,
            sale_price: 16.50,
            regular_price_krw: Math.round(69.99 * rates.GBP),
            sale_price_krw: Math.round(16.50 * rates.GBP),
            discount_rate: 76,
            affiliate_link: "https://www.sportsdirect.com/adidas-manchester-united-fc-home-shirt-2022/2023-mens-377311"
        }
    },
    {
        model_code: "LFC-2526",
        offer: {
            site_name: "스포츠다이렉트 UK",
            currency: "GBP",
            regular_price: 84.99,
            sale_price: 70,
            regular_price_krw: Math.round(84.99 * rates.GBP),
            sale_price_krw: Math.round(70 * rates.GBP),
            discount_rate: 18,
            affiliate_link: "https://www.sportsdirect.com/adidas-liverpool-home-shirt-2025-2026-adults-378725"
        }
    },
    {
        model_code: "775075-01",
        offer: {
            site_name: "스포츠다이렉트",
            currency: "GBP",
            regular_price: 79.99,
            sale_price: 25,
            regular_price_krw: Math.round(79.99 * rates.GBP),
            sale_price_krw: Math.round(25 * rates.GBP),
            discount_rate: 69,
            affiliate_link: "https://www.sportsdirect.com/puma-manchester-city-home-shirt-2024-2025-adults-377790"
        }
    },
    {
        model_code: "JJ5114",
        offer: {
            site_name: "스포츠다이렉트",
            currency: "GBP",
            regular_price: 79.99,
            sale_price: 24,
            regular_price_krw: Math.round(79.99 * rates.GBP),
            sale_price_krw: Math.round(24 * rates.GBP),
            discount_rate: 70,
            affiliate_link: "https://www.sportsdirect.com/adidas-benfica-third-shirt-2024-2025-adults-367363"
        }
    },
    {
        model_code: "FN8786-839",
        offer: {
            site_name: "유니스포츠",
            currency: "EUR",
            regular_price: 99.95,
            sale_price: 49.95,
            regular_price_krw: Math.round(99.95 * rates.EUR),
            sale_price_krw: Math.round(49.95 * rates.EUR),
            discount_rate: 50,
            affiliate_link: "https://www.unisportstore.com/football-shirts/chelsea-away-shirt-202425/"
        }
    }
];

// data.js 파일 읽기
const dataFile = fs.readFileSync('./js/data.js', 'utf8');
const dataMatch = dataFile.match(/const uniformData = (\[[\s\S]*\]);/);

if (!dataMatch) {
    console.error('uniformData를 찾을 수 없습니다.');
    process.exit(1);
}

const uniformData = JSON.parse(dataMatch[1]);

// 판매처 추가
let updatedCount = 0;

newOffers.forEach(({ model_code, offer }) => {
    const product = uniformData.find(p => p.model_code === model_code);

    if (!product) {
        console.log(`⚠️ 제품을 찾을 수 없음: ${model_code}`);
        return;
    }

    // 이미 동일한 판매처가 있는지 확인
    const existingOfferIndex = product.site_offers.findIndex(
        o => o.site_name === offer.site_name
    );

    if (existingOfferIndex >= 0) {
        // 기존 판매처 업데이트
        product.site_offers[existingOfferIndex] = offer;
        console.log(`🔄 업데이트: ${product.name} - ${offer.site_name}`);
    } else {
        // 새 판매처 추가
        product.site_offers.push(offer);
        console.log(`✅ 추가: ${product.name} - ${offer.site_name}`);
    }

    updatedCount++;
});

// 파일 저장
const newContent = `// 유니폼 데이터
const uniformData = ${JSON.stringify(uniformData, null, 4)};
`;

fs.writeFileSync('./js/data.js', newContent, 'utf8');

console.log(`\n✨ 완료! ${updatedCount}개 제품에 판매처 정보가 추가되었습니다.`);
