/**
 * Match Cache Service
 * 백그라운드에서 경기 데이터를 자동으로 수집하고 캐싱하는 서비스
 * Rate Limit을 고려하여 점진적으로 데이터 수집
 */

const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');

class MatchCacheService {
    constructor(footballDataService) {
        this.footballDataService = footballDataService;
        this.cacheDir = path.join(__dirname, '../cache');
        this.cacheFile = path.join(this.cacheDir, 'matches-cache.json');
        this.isCollecting = false;
        this.lastUpdateTime = null;

        // Rate limit: 분당 10회
        this.REQUESTS_PER_MINUTE = 10;
        this.REQUEST_INTERVAL = 60000 / this.REQUESTS_PER_MINUTE; // 6초마다 1회

        // 수집 기간: 현재부터 4개월 후까지
        this.COLLECTION_MONTHS = 4;
    }

    /**
     * 서비스 초기화
     */
    async initialize() {
        try {
            // 캐시 디렉토리 생성
            await this.ensureCacheDirectory();

            console.log('🗄️  Match Cache Service 초기화 중...');

            // 기존 캐시 로드
            const cache = await this.loadCache();

            if (cache && cache.lastUpdate) {
                this.lastUpdateTime = new Date(cache.lastUpdate);
                console.log(`✅ 기존 캐시 로드 완료 (마지막 업데이트: ${this.lastUpdateTime.toLocaleString('ko-KR')})`);
                console.log(`📊 캐시된 경기 수: ${Object.keys(cache.matches || {}).length}일치`);
            } else {
                console.log('📭 기존 캐시 없음 - 새로 수집 시작');
                // 즉시 첫 수집 시작
                this.collectMatchData();
            }

            // 매일 새벽 3시에 자동 업데이트
            this.scheduleDaily();

            console.log('✅ Match Cache Service 초기화 완료');
        } catch (error) {
            console.error('❌ Match Cache Service 초기화 실패:', error);
        }
    }

    /**
     * 캐시 디렉토리 생성
     */
    async ensureCacheDirectory() {
        try {
            await fs.access(this.cacheDir);
        } catch {
            await fs.mkdir(this.cacheDir, { recursive: true });
            console.log('📁 캐시 디렉토리 생성:', this.cacheDir);
        }
    }

    /**
     * 캐시 로드
     */
    async loadCache() {
        try {
            const data = await fs.readFile(this.cacheFile, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return null;
        }
    }

    /**
     * 캐시 저장
     */
    async saveCache(matches) {
        try {
            const cacheData = {
                lastUpdate: new Date().toISOString(),
                matches: matches
            };
            await fs.writeFile(this.cacheFile, JSON.stringify(cacheData, null, 2));
            this.lastUpdateTime = new Date();
            console.log('💾 캐시 저장 완료:', this.cacheFile);
        } catch (error) {
            console.error('❌ 캐시 저장 실패:', error);
        }
    }

    /**
     * 캐시된 경기 데이터 조회
     */
    async getCachedMatches(date) {
        const cache = await this.loadCache();
        if (!cache || !cache.matches) {
            return null;
        }
        return cache.matches[date] || null;
    }

    /**
     * 특정 날짜의 모든 캐시된 경기 조회
     */
    async getAllCachedMatches() {
        const cache = await this.loadCache();
        return cache ? cache.matches : {};
    }

    /**
     * 경기 데이터 수집 (Rate Limit 고려)
     * 주 단위 범위 조회로 API 호출 최적화
     */
    async collectMatchData() {
        if (this.isCollecting) {
            console.log('⏳ 이미 데이터 수집 중입니다...');
            return;
        }

        this.isCollecting = true;
        console.log('\n🚀 경기 데이터 수집 시작...');
        console.log(`📅 수집 기간: 현재부터 ${this.COLLECTION_MONTHS}개월`);
        console.log(`⏱️  Rate Limit: 분당 ${this.REQUESTS_PER_MINUTE}회 (${this.REQUEST_INTERVAL / 1000}초마다 1회 요청)\n`);

        const matches = {};
        const weekRanges = this.generateWeekRanges();

        console.log(`📊 총 ${weekRanges.length}주치 데이터 수집 예정 (약 ${weekRanges.length * 7}일)`);
        console.log(`⏰ 예상 소요 시간: 약 ${Math.ceil(weekRanges.length * this.REQUEST_INTERVAL / 60000)}분\n`);

        let totalMatches = 0;
        let errorCount = 0;

        for (let i = 0; i < weekRanges.length; i++) {
            const { dateFrom, dateTo } = weekRanges[i];

            try {
                // Rate Limit 준수를 위한 대기
                if (i > 0) {
                    await this.sleep(this.REQUEST_INTERVAL);
                }

                // API 호출 (주 단위 범위 조회)
                console.log(`🔍 [${i + 1}/${weekRanges.length}] ${dateFrom} ~ ${dateTo} 조회 중...`);
                const weekMatches = await this.footballDataService.getAllMatches(dateFrom, dateTo);

                if (weekMatches && weekMatches.length > 0) {
                    // 날짜별로 분류
                    weekMatches.forEach(match => {
                        const matchDate = match.date.split('T')[0]; // YYYY-MM-DD 추출
                        if (!matches[matchDate]) {
                            matches[matchDate] = [];
                        }
                        matches[matchDate].push(match);
                    });

                    totalMatches += weekMatches.length;
                    console.log(`✅ [${i + 1}/${weekRanges.length}] ${weekMatches.length}경기 수집 완료`);
                } else {
                    console.log(`⚪ [${i + 1}/${weekRanges.length}] 경기 없음`);
                }

                // 5주마다 중간 저장
                if ((i + 1) % 5 === 0) {
                    await this.saveCache(matches);
                    console.log(`💾 중간 저장 완료 (${i + 1}/${weekRanges.length}주, ${totalMatches}경기)\n`);
                }

            } catch (error) {
                errorCount++;
                console.error(`❌ [${i + 1}/${weekRanges.length}] ${dateFrom} ~ ${dateTo}: 수집 실패 -`, error.message);

                // 429 에러면 추가 대기
                if (error.message.includes('429')) {
                    console.log('⏸️  Rate Limit 감지 - 60초 대기 중...');
                    await this.sleep(60000);
                }
            }
        }

        // 최종 저장
        await this.saveCache(matches);

        console.log('\n✅ 경기 데이터 수집 완료!');
        console.log(`📊 총 ${totalMatches}경기 수집 완료`);
        console.log(`📅 ${Object.keys(matches).length}일치 데이터 캐시됨`);
        console.log(`❌ 실패: ${errorCount}주\n`);

        this.isCollecting = false;
    }

    /**
     * 주 단위 날짜 범위 생성 (오늘부터 N개월 후까지)
     * API 호출 횟수를 줄이기 위해 7일 단위로 그룹화
     */
    generateWeekRanges() {
        const ranges = [];
        const today = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + this.COLLECTION_MONTHS);

        let currentDate = new Date(today);

        while (currentDate <= endDate) {
            const dateFrom = currentDate.toISOString().split('T')[0];

            // 7일 후 계산
            const weekEnd = new Date(currentDate);
            weekEnd.setDate(weekEnd.getDate() + 6);

            // endDate를 넘지 않도록 조정
            const dateTo = weekEnd <= endDate
                ? weekEnd.toISOString().split('T')[0]
                : endDate.toISOString().split('T')[0];

            ranges.push({ dateFrom, dateTo });

            // 다음 주로 이동
            currentDate.setDate(currentDate.getDate() + 7);
        }

        return ranges;
    }

    /**
     * 날짜 범위 생성 (오늘부터 N개월 후까지) - 레거시 함수
     */
    generateDateRange() {
        const dates = [];
        const today = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + this.COLLECTION_MONTHS);

        let currentDate = new Date(today);

        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split('T')[0];
            dates.push(dateStr);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    }

    /**
     * Sleep 함수
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 매일 자동 업데이트 스케줄링
     */
    scheduleDaily() {
        // 매일 새벽 3시에 실행 (Cron: 분 시 일 월 요일)
        cron.schedule('0 3 * * *', () => {
            console.log('\n⏰ 스케줄된 자동 업데이트 시작 (매일 새벽 3시)');
            this.collectMatchData();
        }, {
            timezone: "Asia/Seoul"
        });

        console.log('⏰ 매일 새벽 3시 자동 업데이트 스케줄 등록 완료');
    }

    /**
     * 수동 업데이트 트리거
     */
    async triggerManualUpdate() {
        console.log('🔄 수동 업데이트 시작...');
        await this.collectMatchData();
    }

    /**
     * 캐시 상태 조회
     */
    async getCacheStatus() {
        const cache = await this.loadCache();

        if (!cache) {
            return {
                hasCache: false,
                lastUpdate: null,
                totalDays: 0,
                totalMatches: 0
            };
        }

        let totalMatches = 0;
        Object.values(cache.matches || {}).forEach(dayMatches => {
            totalMatches += dayMatches.length;
        });

        return {
            hasCache: true,
            lastUpdate: cache.lastUpdate,
            totalDays: Object.keys(cache.matches || {}).length,
            totalMatches: totalMatches,
            isCollecting: this.isCollecting
        };
    }
}

module.exports = MatchCacheService;
