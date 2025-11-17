const puppeteer = require('puppeteer');
const fs = require('fs');

/**
 * 블랙프라이데이 감지기
 *
 * 감지 항목:
 * 1. 블랙프라이데이 전용 페이지 존재 여부
 * 2. 메인 페이지에 Black Friday 키워드/배너 출현
 * 3. 대규모 할인 (30% 이상) 제품 급증
 * 4. 할인 제품 수 급증 (이전 대비 2배 이상)
 */

class BlackFridayDetector {
    constructor(teamConfig) {
        this.team = teamConfig;
        this.browser = null;
        this.page = null;
    }

    /**
     * 브라우저 초기화
     */
    async initialize() {
        this.browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ]
        });
        this.page = await this.browser.newPage();
        await this.page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );
    }

    /**
     * 블랙프라이데이 전용 페이지 체크
     */
    async checkBlackFridayPages() {
        const results = [];

        for (const url of this.team.blackFridayUrls) {
            try {
                const response = await this.page.goto(url, {
                    waitUntil: 'networkidle2',
                    timeout: 30000
                });

                const status = response.status();
                const exists = status === 200;

                if (exists) {
                    // 페이지가 실제로 블랙프라이데이 콘텐츠를 포함하는지 확인
                    const hasContent = await this.page.evaluate(() => {
                        const body = document.body.innerText.toLowerCase();
                        return body.includes('black friday') ||
                               body.includes('cyber monday') ||
                               body.includes('bf sale');
                    });

                    results.push({
                        url,
                        exists: hasContent,
                        status,
                        timestamp: new Date().toISOString()
                    });

                    if (hasContent) {
                        console.log(`🎯 ${this.team.nameKo}: Black Friday 페이지 발견! ${url}`);
                    }
                }
            } catch (error) {
                results.push({
                    url,
                    exists: false,
                    error: error.message
                });
            }

            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        return results;
    }

    /**
     * 메인 페이지에서 블랙프라이데이 키워드/배너 감지
     */
    async checkMainPageBanner() {
        try {
            await this.page.goto(this.team.storeUrl, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            await this.page.waitForTimeout(3000);

            const detection = await this.page.evaluate((selectors, keywords) => {
                const results = {
                    hasKeywords: false,
                    hasBanner: false,
                    foundKeywords: [],
                    bannerText: ''
                };

                // 페이지 전체 텍스트에서 키워드 검색
                const pageText = document.body.innerText.toLowerCase();
                keywords.forEach(keyword => {
                    if (pageText.includes(keyword.toLowerCase())) {
                        results.hasKeywords = true;
                        results.foundKeywords.push(keyword);
                    }
                });

                // 배너 요소에서 키워드 검색
                const bannerSelectors = selectors.banner.split(',').map(s => s.trim());
                for (const selector of bannerSelectors) {
                    const banners = document.querySelectorAll(selector);
                    banners.forEach(banner => {
                        const text = banner.innerText.toLowerCase();
                        keywords.forEach(keyword => {
                            if (text.includes(keyword.toLowerCase())) {
                                results.hasBanner = true;
                                results.bannerText = banner.innerText;
                            }
                        });
                    });
                }

                return results;
            }, this.team.selectors, this.team.keywords);

            if (detection.hasKeywords || detection.hasBanner) {
                console.log(`🎯 ${this.team.nameKo}: 메인 페이지에 Black Friday 감지!`);
                console.log(`   키워드: ${detection.foundKeywords.join(', ')}`);
                if (detection.bannerText) {
                    console.log(`   배너: ${detection.bannerText.substring(0, 100)}`);
                }
            }

            return detection;
        } catch (error) {
            console.error(`❌ ${this.team.nameKo} 메인 페이지 체크 실패:`, error.message);
            return {
                hasKeywords: false,
                hasBanner: false,
                error: error.message
            };
        }
    }

    /**
     * 할인 제품 분석
     */
    async analyzeSaleProducts() {
        try {
            // 세일/할인 페이지로 이동
            const saleUrl = this.team.blackFridayUrls[this.team.blackFridayUrls.length - 1]; // 일반적으로 마지막이 sale

            await this.page.goto(saleUrl, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            await this.page.waitForTimeout(3000);

            // 스크롤하여 제품 로드
            await this.autoScroll();

            const products = await this.page.evaluate((selectors) => {
                const productElements = document.querySelectorAll(selectors.products);
                const results = [];

                productElements.forEach((el, index) => {
                    if (index >= 50) return; // 최대 50개만 분석

                    try {
                        const nameEl = el.querySelector(selectors.productName);
                        const priceEl = el.querySelector(selectors.price);
                        const salePriceEl = el.querySelector(selectors.salePrice);

                        if (!nameEl || !priceEl) return;

                        const name = nameEl.textContent.trim();
                        const priceText = priceEl.textContent.trim();
                        const salePriceText = salePriceEl ? salePriceEl.textContent.trim() : null;

                        // 가격 파싱
                        const regularPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
                        const salePrice = salePriceText ? parseFloat(salePriceText.replace(/[^0-9.]/g, '')) : null;

                        if (salePrice && regularPrice > salePrice) {
                            const discount = ((regularPrice - salePrice) / regularPrice) * 100;
                            results.push({
                                name: name.substring(0, 80),
                                regularPrice,
                                salePrice,
                                discountPercent: Math.round(discount)
                            });
                        }
                    } catch (err) {
                        // Skip product
                    }
                });

                return results;
            }, this.team.selectors);

            // 분석
            const analysis = {
                totalProducts: products.length,
                bigDiscounts: products.filter(p => p.discountPercent >= 30).length,
                averageDiscount: products.length > 0
                    ? Math.round(products.reduce((sum, p) => sum + p.discountPercent, 0) / products.length)
                    : 0,
                maxDiscount: products.length > 0
                    ? Math.max(...products.map(p => p.discountPercent))
                    : 0,
                products: products.slice(0, 10) // 상위 10개만 저장
            };

            if (analysis.bigDiscounts > 5) {
                console.log(`🎯 ${this.team.nameKo}: 30% 이상 대규모 할인 감지! (${analysis.bigDiscounts}개 제품)`);
            }

            return analysis;
        } catch (error) {
            console.error(`❌ ${this.team.nameKo} 할인 분석 실패:`, error.message);
            return {
                totalProducts: 0,
                bigDiscounts: 0,
                averageDiscount: 0,
                maxDiscount: 0,
                error: error.message
            };
        }
    }

    /**
     * 자동 스크롤
     */
    async autoScroll() {
        await this.page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= Math.min(scrollHeight, 3000)) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
    }

    /**
     * 전체 감지 실행
     */
    async detect() {
        console.log(`\n🔍 ${this.team.nameKo} (${this.team.league}) 블랙프라이데이 감지 시작...`);

        await this.initialize();

        const result = {
            team: this.team.nameKo,
            teamEn: this.team.name,
            league: this.team.league,
            timestamp: new Date().toISOString(),
            blackFridayDetected: false,
            confidence: 0, // 0-100
            signals: []
        };

        try {
            // 1. 블랙프라이데이 전용 페이지 체크
            const bfPages = await this.checkBlackFridayPages();
            const hasBFPage = bfPages.some(p => p.exists);

            if (hasBFPage) {
                result.signals.push({
                    type: 'bf_page_exists',
                    severity: 'HIGH',
                    message: '블랙프라이데이 전용 페이지 발견',
                    details: bfPages.filter(p => p.exists)
                });
                result.confidence += 40;
            }

            // 2. 메인 페이지 배너/키워드 체크
            const mainPage = await this.checkMainPageBanner();
            if (mainPage.hasKeywords || mainPage.hasBanner) {
                result.signals.push({
                    type: 'bf_keywords',
                    severity: mainPage.hasBanner ? 'HIGH' : 'MEDIUM',
                    message: '메인 페이지에 블랙프라이데이 키워드/배너 발견',
                    details: mainPage
                });
                result.confidence += mainPage.hasBanner ? 30 : 15;
            }

            // 3. 할인 제품 분석
            const saleAnalysis = await this.analyzeSaleProducts();
            if (saleAnalysis.bigDiscounts > 5) {
                result.signals.push({
                    type: 'massive_discounts',
                    severity: 'HIGH',
                    message: `30% 이상 대규모 할인 제품 ${saleAnalysis.bigDiscounts}개 발견`,
                    details: saleAnalysis
                });
                result.confidence += 30;
            } else if (saleAnalysis.totalProducts > 10) {
                result.signals.push({
                    type: 'sale_products',
                    severity: 'LOW',
                    message: `할인 제품 ${saleAnalysis.totalProducts}개 발견`,
                    details: saleAnalysis
                });
                result.confidence += 10;
            }

            // 최종 판정
            result.blackFridayDetected = result.confidence >= 50;
            result.confidence = Math.min(result.confidence, 100);

            if (result.blackFridayDetected) {
                console.log(`\n🎉 ${this.team.nameKo}: 블랙프라이데이 감지! (신뢰도: ${result.confidence}%)`);
            } else {
                console.log(`✅ ${this.team.nameKo}: 정상 (블랙프라이데이 미감지)`);
            }

        } catch (error) {
            console.error(`❌ ${this.team.nameKo} 감지 중 오류:`, error);
            result.error = error.message;
        } finally {
            if (this.browser) {
                await this.browser.close();
            }
        }

        return result;
    }
}

module.exports = BlackFridayDetector;
