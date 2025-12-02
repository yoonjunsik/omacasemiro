/**
 * Amadeus API Service
 *
 * 항공권 및 숙소 검색 서비스
 * 무료 플랜: 2,000 requests/month
 */

class AmadeusService {
    constructor(apiKey, apiSecret) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.baseUrl = 'https://test.api.amadeus.com'; // Test environment
        this.accessToken = null;
        this.tokenExpiry = null;
    }

    /**
     * Access Token 발급 (24시간 유효)
     */
    async getAccessToken() {
        // 기존 토큰이 유효하면 재사용
        if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }

        try {
            const response = await fetch(`${this.baseUrl}/v1/security/oauth2/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: this.apiKey,
                    client_secret: this.apiSecret
                })
            });

            if (!response.ok) {
                throw new Error(`Amadeus Auth Error: ${response.status}`);
            }

            const data = await response.json();
            this.accessToken = data.access_token;
            this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1분 여유

            return this.accessToken;
        } catch (error) {
            console.error('Failed to get Amadeus access token:', error);
            throw error;
        }
    }

    /**
     * 항공권 검색
     * @param {string} origin - 출발 공항 코드 (예: ICN, GMP, PUS)
     * @param {string} destination - 도착 공항 코드 (예: LHR, MAD, FCO)
     * @param {string} departureDate - 출발 날짜 (YYYY-MM-DD)
     * @param {string} returnDate - 귀국 날짜 (YYYY-MM-DD)
     * @param {number} adults - 성인 인원수
     */
    async searchFlights(origin, destination, departureDate, returnDate, adults = 1) {
        try {
            const token = await this.getAccessToken();

            const params = new URLSearchParams({
                originLocationCode: origin,
                destinationLocationCode: destination,
                departureDate: departureDate,
                returnDate: returnDate,
                adults: adults.toString(),
                currencyCode: 'KRW',
                max: 20 // 최대 20개 결과 (직항/경유 모두 포함하기 위해 증가)
            });

            const response = await fetch(
                `${this.baseUrl}/v2/shopping/flight-offers?${params}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Flight Search Error: ${response.status}`);
            }

            const data = await response.json();
            return this.formatFlights(data.data);
        } catch (error) {
            console.error('Failed to search flights:', error);
            return this.getFallbackFlights(origin, destination);
        }
    }

    /**
     * 항공권 데이터 포맷팅
     */
    formatFlights(flights) {
        if (!flights || flights.length === 0) return [];

        return flights.map(flight => {
            const outbound = flight.itineraries[0];
            const inbound = flight.itineraries[1];

            return {
                price: Math.round(parseFloat(flight.price.total)),
                currency: flight.price.currency,

                // 출발편 정보
                outbound: {
                    departure: outbound.segments[0].departure.at,
                    arrival: outbound.segments[outbound.segments.length - 1].arrival.at,
                    duration: outbound.duration,
                    stops: outbound.segments.length - 1,
                    airline: outbound.segments[0].carrierCode
                },

                // 귀국편 정보
                inbound: {
                    departure: inbound.segments[0].departure.at,
                    arrival: inbound.segments[inbound.segments.length - 1].arrival.at,
                    duration: inbound.duration,
                    stops: inbound.segments.length - 1,
                    airline: inbound.segments[0].carrierCode
                },

                validatingAirline: flight.validatingAirlineCodes[0],
                bookingUrl: `https://www.amadeus.com/booking/${flight.id}`
            };
        });
    }

    /**
     * 호텔 검색
     * @param {string} cityCode - 도시 코드 (예: LON, MAD, ROM)
     * @param {string} checkInDate - 체크인 날짜 (YYYY-MM-DD)
     * @param {string} checkOutDate - 체크아웃 날짜 (YYYY-MM-DD)
     * @param {number} adults - 성인 인원수
     */
    async searchHotels(cityCode, checkInDate, checkOutDate, adults = 1) {
        try {
            const token = await this.getAccessToken();

            // 1단계: 호텔 목록 조회
            const listParams = new URLSearchParams({
                cityCode: cityCode,
                radius: 5,
                radiusUnit: 'KM',
                hotelSource: 'ALL'
            });

            const listResponse = await fetch(
                `${this.baseUrl}/v1/reference-data/locations/hotels/by-city?${listParams}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!listResponse.ok) {
                throw new Error(`Hotel List Error: ${listResponse.status}`);
            }

            const listData = await listResponse.json();
            const hotelIds = listData.data.slice(0, 20).map(h => h.hotelId).join(',');

            // 2단계: 호텔 가격 조회
            const offerParams = new URLSearchParams({
                hotelIds: hotelIds,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                adults: adults.toString(),
                currency: 'KRW',
                bestRateOnly: 'true'
            });

            const offerResponse = await fetch(
                `${this.baseUrl}/v3/shopping/hotel-offers?${offerParams}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!offerResponse.ok) {
                throw new Error(`Hotel Offers Error: ${offerResponse.status}`);
            }

            const offerData = await offerResponse.json();
            return this.formatHotels(offerData.data);
        } catch (error) {
            console.error('Failed to search hotels:', error);
            return this.getFallbackHotels(cityCode);
        }
    }

    /**
     * 호텔 데이터 포맷팅
     */
    formatHotels(hotels) {
        if (!hotels || hotels.length === 0) return [];

        return hotels.map(hotel => {
            const offer = hotel.offers[0];

            return {
                name: hotel.hotel.name,
                hotelId: hotel.hotel.hotelId,
                price: Math.round(parseFloat(offer.price.total)),
                currency: offer.price.currency,
                roomType: offer.room.typeEstimated?.category || 'Standard',
                checkIn: offer.checkInDate,
                checkOut: offer.checkOutDate,
                rating: hotel.hotel.rating || 'N/A',
                bookingUrl: `https://www.amadeus.com/hotel/${hotel.hotel.hotelId}`
            };
        });
    }

    /**
     * 공항/도시 코드 검색
     * @param {string} keyword - 검색 키워드
     */
    async searchLocation(keyword) {
        try {
            const token = await this.getAccessToken();

            const params = new URLSearchParams({
                keyword: keyword,
                subType: 'AIRPORT,CITY'
            });

            const response = await fetch(
                `${this.baseUrl}/v1/reference-data/locations?${params}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Location Search Error: ${response.status}`);
            }

            const data = await response.json();
            return data.data.map(loc => ({
                name: loc.name,
                code: loc.iataCode,
                type: loc.subType,
                city: loc.address?.cityName,
                country: loc.address?.countryName
            }));
        } catch (error) {
            console.error('Failed to search location:', error);
            return [];
        }
    }

    /**
     * Fallback: API 실패 시 정적 데이터 반환
     */
    getFallbackFlights(origin, destination) {
        const prices = {
            'ICN-LHR': { budget: 650000, premium: 1200000 },
            'ICN-MAD': { budget: 750000, premium: 1350000 },
            'ICN-FCO': { budget: 700000, premium: 1300000 },
            'ICN-MUC': { budget: 720000, premium: 1320000 },
            'ICN-CDG': { budget: 680000, premium: 1250000 }
        };

        const key = `${origin}-${destination}`;
        const price = prices[key] || { budget: 800000, premium: 1400000 };

        return [
            {
                price: price.budget,
                currency: 'KRW',
                outbound: { stops: 1, airline: 'OZ' },
                inbound: { stops: 1, airline: 'OZ' },
                type: 'budget'
            },
            {
                price: price.premium,
                currency: 'KRW',
                outbound: { stops: 0, airline: 'KE' },
                inbound: { stops: 0, airline: 'KE' },
                type: 'direct'
            }
        ];
    }

    /**
     * Fallback: API 실패 시 정적 데이터 반환
     */
    getFallbackHotels(cityCode) {
        const prices = {
            'LON': { budget: 80000, premium: 200000 },
            'MAD': { budget: 70000, premium: 180000 },
            'ROM': { budget: 75000, premium: 190000 },
            'MUC': { budget: 85000, premium: 210000 },
            'PAR': { budget: 90000, premium: 220000 }
        };

        const price = prices[cityCode] || { budget: 80000, premium: 200000 };

        return [
            {
                name: `Budget Hotel in ${cityCode}`,
                price: price.budget,
                currency: 'KRW',
                roomType: 'Standard',
                rating: '3',
                type: 'budget'
            },
            {
                name: `Premium Hotel in ${cityCode}`,
                price: price.premium,
                currency: 'KRW',
                roomType: 'Deluxe',
                rating: '4',
                type: 'premium'
            }
        ];
    }
}

// Node.js 환경에서 사용
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AmadeusService;
}

// 브라우저 환경에서 사용
if (typeof window !== 'undefined') {
    window.AmadeusService = AmadeusService;
}
