/**
 * ExchangeRate-API Service
 *
 * 환율 조회 서비스
 * 무료 플랜: 1,500 requests/month
 */

class ExchangeRateService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://v6.exchangerate-api.com/v6';
        this.cache = null;
        this.cacheExpiry = null;
    }

    /**
     * 환율 조회 (KRW 기준)
     * @param {string} targetCurrency - 목표 통화 (EUR, GBP, USD 등)
     */
    async getExchangeRate(targetCurrency = 'EUR') {
        // 캐시된 데이터가 유효하면 재사용 (24시간)
        if (this.cache && this.cacheExpiry && Date.now() < this.cacheExpiry) {
            return this.cache[targetCurrency] || null;
        }

        try {
            const response = await fetch(
                `${this.baseUrl}/${this.apiKey}/latest/KRW`
            );

            if (!response.ok) {
                throw new Error(`Exchange Rate API Error: ${response.status}`);
            }

            const data = await response.json();

            if (data.result === 'success') {
                // 캐시 저장 (24시간 유효)
                this.cache = data.conversion_rates;
                this.cacheExpiry = Date.now() + (24 * 60 * 60 * 1000);

                return data.conversion_rates[targetCurrency];
            } else {
                throw new Error('Exchange rate fetch failed');
            }
        } catch (error) {
            console.error('Failed to get exchange rate:', error);
            return this.getFallbackRate(targetCurrency);
        }
    }

    /**
     * 모든 주요 통화 환율 조회
     */
    async getAllRates() {
        // 캐시된 데이터가 유효하면 재사용
        if (this.cache && this.cacheExpiry && Date.now() < this.cacheExpiry) {
            return this.formatRates(this.cache);
        }

        try {
            const response = await fetch(
                `${this.baseUrl}/${this.apiKey}/latest/KRW`
            );

            if (!response.ok) {
                throw new Error(`Exchange Rate API Error: ${response.status}`);
            }

            const data = await response.json();

            if (data.result === 'success') {
                // 캐시 저장
                this.cache = data.conversion_rates;
                this.cacheExpiry = Date.now() + (24 * 60 * 60 * 1000);

                return this.formatRates(data.conversion_rates);
            } else {
                throw new Error('Exchange rate fetch failed');
            }
        } catch (error) {
            console.error('Failed to get all exchange rates:', error);
            return this.getFallbackRates();
        }
    }

    /**
     * KRW → 목표 통화 변환
     * @param {number} amountKRW - 원화 금액
     * @param {string} targetCurrency - 목표 통화
     */
    async convertFromKRW(amountKRW, targetCurrency = 'EUR') {
        const rate = await this.getExchangeRate(targetCurrency);
        if (!rate) return null;

        return {
            originalAmount: amountKRW,
            originalCurrency: 'KRW',
            convertedAmount: Math.round(amountKRW * rate * 100) / 100,
            targetCurrency: targetCurrency,
            exchangeRate: rate,
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * 목표 통화 → KRW 변환
     * @param {number} amount - 외화 금액
     * @param {string} sourceCurrency - 원본 통화
     */
    async convertToKRW(amount, sourceCurrency = 'EUR') {
        const rate = await this.getExchangeRate(sourceCurrency);
        if (!rate) return null;

        return {
            originalAmount: amount,
            originalCurrency: sourceCurrency,
            convertedAmount: Math.round(amount / rate),
            targetCurrency: 'KRW',
            exchangeRate: 1 / rate,
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * 환율 데이터 포맷팅
     */
    formatRates(rates) {
        const majorCurrencies = ['EUR', 'GBP', 'USD', 'JPY', 'CNY'];

        return majorCurrencies.map(currency => ({
            currency: currency,
            rate: rates[currency],
            symbol: this.getCurrencySymbol(currency),
            name: this.getCurrencyName(currency),
            krwTo1Unit: Math.round(1 / rates[currency])
        }));
    }

    /**
     * 통화 심볼 반환
     */
    getCurrencySymbol(currency) {
        const symbols = {
            'EUR': '€',
            'GBP': '£',
            'USD': '$',
            'JPY': '¥',
            'CNY': '¥',
            'KRW': '₩'
        };
        return symbols[currency] || currency;
    }

    /**
     * 통화 이름 반환 (한글)
     */
    getCurrencyName(currency) {
        const names = {
            'EUR': '유로',
            'GBP': '파운드',
            'USD': '달러',
            'JPY': '엔',
            'CNY': '위안',
            'KRW': '원'
        };
        return names[currency] || currency;
    }

    /**
     * 여행지별 기본 통화 반환
     */
    getCurrencyByCountry(country) {
        const currencyMap = {
            '영국': 'GBP',
            '스페인': 'EUR',
            '독일': 'EUR',
            '이탈리아': 'EUR',
            '프랑스': 'EUR',
            '포르투갈': 'EUR',
            '네덜란드': 'EUR',
            '벨기에': 'EUR'
        };
        return currencyMap[country] || 'EUR';
    }

    /**
     * 도시별 기본 통화 반환
     */
    getCurrencyByCity(city) {
        const currencyMap = {
            '런던': 'GBP',
            '리버풀': 'GBP',
            '맨체스터': 'GBP',
            '뉴캐슬': 'GBP',
            '마드리드': 'EUR',
            '바르셀로나': 'EUR',
            '뮌헨': 'EUR',
            '도르트문트': 'EUR',
            '밀라노': 'EUR',
            '토리노': 'EUR',
            '로마': 'EUR',
            '파리': 'EUR'
        };
        return currencyMap[city] || 'EUR';
    }

    /**
     * Fallback: API 실패 시 정적 환율 반환 (2024년 11월 평균)
     */
    getFallbackRate(currency) {
        const fallbackRates = {
            'EUR': 0.00069,  // 1원 = 0.00069 유로
            'GBP': 0.00059,  // 1원 = 0.00059 파운드
            'USD': 0.00074,  // 1원 = 0.00074 달러
            'JPY': 0.11,     // 1원 = 0.11 엔
            'CNY': 0.0053    // 1원 = 0.0053 위안
        };
        return fallbackRates[currency] || 0.00069;
    }

    /**
     * Fallback: 모든 환율 정적 데이터
     */
    getFallbackRates() {
        return [
            { currency: 'EUR', rate: 0.00069, symbol: '€', name: '유로', krwTo1Unit: 1450 },
            { currency: 'GBP', rate: 0.00059, symbol: '£', name: '파운드', krwTo1Unit: 1700 },
            { currency: 'USD', rate: 0.00074, symbol: '$', name: '달러', krwTo1Unit: 1350 },
            { currency: 'JPY', rate: 0.11, symbol: '¥', name: '엔', krwTo1Unit: 9 },
            { currency: 'CNY', rate: 0.0053, symbol: '¥', name: '위안', krwTo1Unit: 189 }
        ];
    }

    /**
     * 캐시 수동 초기화
     */
    clearCache() {
        this.cache = null;
        this.cacheExpiry = null;
    }

    /**
     * 캐시 상태 확인
     */
    isCacheValid() {
        return this.cache !== null &&
               this.cacheExpiry !== null &&
               Date.now() < this.cacheExpiry;
    }

    /**
     * 캐시 만료 시간 확인 (분 단위)
     */
    getCacheExpiryMinutes() {
        if (!this.cacheExpiry) return 0;
        const remaining = this.cacheExpiry - Date.now();
        return Math.floor(remaining / 60000);
    }
}

// Node.js 환경에서 사용
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExchangeRateService;
}

// 브라우저 환경에서 사용
if (typeof window !== 'undefined') {
    window.ExchangeRateService = ExchangeRateService;
}
