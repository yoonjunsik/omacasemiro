// 어필리에이트 링크 관리

// 링크프라이스 설정
const LINKPRICE_CONFIG = {
    enabled: true,
    affiliateId: 'A100700570', // 링크프라이스 회원 ID
    clickUrl: 'https://click.linkprice.com/click.php'
};

// 링크프라이스 승인된 쇼핑몰 코드 매핑
// 각 쇼핑몰별 파라미터 설정
const LINKPRICE_MERCHANTS = {
    '지그재그': {
        merchantCode: 'zigzag',
        linkType: '9999',
        categoryCode1: '3',
        categoryCode2: '0'
    },
    // 추가 승인된 쇼핑몰을 여기에 등록
    // 예시:
    // '무신사': {
    //     merchantCode: 'musinsa',
    //     linkType: '9999',
    //     categoryCode1: '3',
    //     categoryCode2: '0'
    // }
};

// FlexOffers, Awin 등 다른 어필리에이트 네트워크 설정
const OTHER_AFFILIATES = {
    'Sports Direct': {
        network: 'flexoffers',
        enabled: false, // 승인 후 true로 변경
        affiliateId: ''
    },
    'Chelsea Megastore': {
        network: 'flexoffers',
        enabled: false,
        affiliateId: ''
    },
    'Tottenham Shop': {
        network: 'flexoffers',
        enabled: false,
        affiliateId: ''
    },
    'Manchester United Store': {
        network: 'awin',
        enabled: false,
        affiliateId: ''
    },
    'Arsenal Direct': {
        network: 'awin',
        enabled: false,
        affiliateId: ''
    },
    'Real Madrid Shop': {
        network: 'awin',
        enabled: false,
        affiliateId: ''
    }
};

/**
 * 링크프라이스 어필리에이트 링크 생성
 */
function generateLinkPriceUrl(merchantConfig, originalUrl) {
    if (!LINKPRICE_CONFIG.enabled || !LINKPRICE_CONFIG.affiliateId) {
        return originalUrl;
    }

    // URL 인코딩
    const encodedUrl = encodeURIComponent(originalUrl);

    const params = new URLSearchParams({
        m: merchantConfig.merchantCode,
        a: LINKPRICE_CONFIG.affiliateId,
        l: merchantConfig.linkType,
        l_cd1: merchantConfig.categoryCode1,
        l_cd2: merchantConfig.categoryCode2,
        tu: originalUrl // tu 파라미터는 자동으로 인코딩됨
    });

    return `${LINKPRICE_CONFIG.clickUrl}?${params.toString()}`;
}

/**
 * 판매처명으로 어필리에이트 링크 생성
 */
function convertToAffiliateLink(storeName, originalUrl) {
    // 링크프라이스 가맹점 확인
    const merchantConfig = LINKPRICE_MERCHANTS[storeName];
    if (merchantConfig) {
        return generateLinkPriceUrl(merchantConfig, originalUrl);
    }

    // 다른 어필리에이트 네트워크 확인
    const affiliate = OTHER_AFFILIATES[storeName];
    if (affiliate && affiliate.enabled) {
        // 각 네트워크별 링크 생성 로직
        switch (affiliate.network) {
            case 'flexoffers':
                // FlexOffers 링크 형식
                return `https://track.flexlinkspro.com/a.ashx?foid=${affiliate.affiliateId}&foc=1&fot=9999&fos=${storeName}&url=${encodeURIComponent(originalUrl)}`;

            case 'awin':
                // Awin 링크 형식
                return `https://www.awin1.com/cread.php?awinmid=${affiliate.affiliateId}&awinaffid=YOUR_AWIN_ID&clickref=&p=${encodeURIComponent(originalUrl)}`;

            default:
                return originalUrl;
        }
    }

    // 어필리에이트 미등록 판매처는 원본 URL 반환
    return originalUrl;
}

/**
 * 제품 데이터의 모든 링크를 어필리에이트 링크로 변환
 */
function processAffiliateLinks(uniformData) {
    return uniformData.map(product => {
        const processedProduct = { ...product };

        processedProduct.site_offers = product.site_offers.map(offer => {
            const processedOffer = { ...offer };

            // 어필리에이트 링크 생성
            processedOffer.affiliate_link = convertToAffiliateLink(
                offer.site_name,
                offer.affiliate_link
            );

            return processedOffer;
        });

        return processedProduct;
    });
}

/**
 * 페이지 로드 시 링크 변환 적용
 */
function initializeAffiliateLinks() {
    if (typeof uniformData !== 'undefined') {
        const processedData = processAffiliateLinks(uniformData);

        // 전역 uniformData 업데이트
        if (typeof window !== 'undefined') {
            window.uniformData = processedData;
        }

        console.log('✅ Affiliate links processed:', {
            linkpriceEnabled: LINKPRICE_CONFIG.enabled,
            merchantCount: Object.keys(LINKPRICE_MERCHANTS).length
        });

        return processedData;
    }

    return [];
}

// 모듈로 내보내기 (Node.js 환경)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LINKPRICE_CONFIG,
        LINKPRICE_MERCHANTS,
        OTHER_AFFILIATES,
        convertToAffiliateLink,
        processAffiliateLinks,
        initializeAffiliateLinks
    };
}
