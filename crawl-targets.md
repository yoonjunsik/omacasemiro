# 크롤링 대상 사이트 목록

> ⚠️ **주의**: 각 사이트의 robots.txt와 이용약관을 먼저 확인해야 합니다.
> 크롤링 전에 반드시 법적 검토가 필요합니다.

---

## 📋 목차
1. [공식 브랜드 홈페이지](#공식-브랜드-홈페이지)
2. [공식 편집샵](#공식-편집샵)
3. [클럽 공식샵](#클럽-공식샵)
4. [기타 쇼핑몰](#기타-쇼핑몰)

---

## 공식 브랜드 홈페이지

### 1. 나이키 코리아
- **URL**: https://www.nike.com/kr/
- **제품 검색 URL**: https://www.nike.com/kr/w/clearance-soccer-tops-tshirts-1gdj0z3yaepz9om13
- **Robots.txt**: https://www.nike.com/robots.txt
- **크롤링 난이도**: 🔴 높음 (JavaScript 렌더링, Anti-bot)
- **제휴 프로그램**: https://www.nike.com/kr/help/a/affiliate-program-kr
- **메모**:
  - React 기반, 동적 렌더링
  - Puppeteer/Playwright 필요
  - API 엔드포인트: `/product_feed/threads/v2/` (확인 필요)

### 2. 아디다스 코리아
- **URL**: https://www.adidas.co.kr/
- **제품 검색 URL**: https://www.adidas.co.kr/football
- **Robots.txt**: https://www.adidas.co.kr/robots.txt
- **크롤링 난이도**: 🔴 높음 (Cloudflare 보호)
- **제휴 프로그램**: 확인 필요
- **메모**:
  - Cloudflare 사용
  - API: `/api/plp/content-engine/` (확인 필요)

### 3. 푸마 코리아
- **URL**: https://kr.puma.com/
- **제품 검색 URL**: https://kr.puma.com/football
- **Robots.txt**: https://kr.puma.com/robots.txt
- **크롤링 난이도**: 🟡 중간
- **제휴 프로그램**: 확인 필요
- **메모**:
  - 상대적으로 단순한 구조

---

## 공식 편집샵

### 4. 스포츠다이렉트 (UK)
- **URL**: https://www.sportsdirect.com/
- **제품 검색 URL**:
  - https://www.sportsdirect.com/football/football-kits
  - https://www.sportsdirect.com/search?q=manchester+united
- **Robots.txt**: https://www.sportsdirect.com/robots.txt
- **크롤링 난이도**: 🟢 낮음
- **제휴 프로그램**: https://www.sportsdirect.com/affiliate
- **제품 URL 패턴**: `/[brand]-[product-name]-[id]`
- **메모**:
  - 가장 크롤링하기 쉬운 사이트
  - HTML 구조가 명확
  - 현재 data.js에 많은 제품 링크 있음
- **예시 제품**:
  - https://www.sportsdirect.com/adidas-manchester-united-home-shirt-2025-2026-adults-377822

### 5. Kitbag
- **URL**: https://www.kitbag.com/
- **제품 검색 URL**: https://www.kitbag.com/en/football-kits/
- **Robots.txt**: https://www.kitbag.com/robots.txt
- **크롤링 난이도**: 🟡 중간
- **제휴 프로그램**: 확인 필요
- **메모**:
  - Fanatics 계열 사이트
  - 공식 라이선스 제품

### 6. 유니스포츠 (Unisport)
- **URL**: https://www.unisportstore.com/
- **제품 검색 URL**: https://www.unisportstore.com/football-shirts/
- **Robots.txt**: https://www.unisportstore.com/robots.txt
- **크롤링 난이도**: 🟡 중간
- **제휴 프로그램**: https://www.unisportstore.com/pages/affiliates
- **메모**:
  - 유럽 기반 편집샵
  - 현재 data.js에 일부 제품 링크 있음
- **예시 제품**:
  - https://www.unisportstore.com/football-shirts/chelsea-away-shirt-202425/

---

## 클럽 공식샵

### 7. 맨체스터 유나이티드 공식샵
- **URL**: https://store.manutd.com/
- **제품 검색 URL**: https://store.manutd.com/en/manchester-united-kits/t-10893481+d-6772103364+z-94-2990716093
- **Robots.txt**: https://store.manutd.com/robots.txt
- **크롤링 난이도**: 🟡 중간
- **메모**:
  - Fanatics 플랫폼 사용
  - 공식 유니폼만 판매

### 8. 리버풀 공식샵
- **URL**: https://store.liverpoolfc.com/
- **제품 검색 URL**: https://store.liverpoolfc.com/en/liverpool-kits/
- **Robots.txt**: https://store.liverpoolfc.com/robots.txt
- **크롤링 난이도**: 🟡 중간

### 9. 토트넘 공식샵
- **URL**: https://shop.tottenhamhotspur.com/
- **제품 검색 URL**: https://shop.tottenhamhotspur.com/en/spurs-kits/
- **Robots.txt**: https://shop.tottenhamhotspur.com/robots.txt
- **크롤링 난이도**: 🟡 중간

### 10. 맨체스터 시티 공식샵
- **URL**: https://shop.mancity.com/
- **제품 검색 URL**: https://shop.mancity.com/en/manchester-city-kits/
- **Robots.txt**: https://shop.mancity.com/robots.txt
- **크롤링 난이도**: 🟡 중간

### 11. 첼시 공식샵
- **URL**: https://www.chelseamegastore.com/
- **제품 검색 URL**: https://www.chelseamegastore.com/en/chelsea-kits/
- **Robots.txt**: https://www.chelseamegastore.com/robots.txt
- **크롤링 난이도**: 🟡 중간

### 12. 아스널 공식샵
- **URL**: https://arsenaldirect.arsenal.com/
- **제품 검색 URL**: https://arsenaldirect.arsenal.com/Football-Shirts/
- **Robots.txt**: https://arsenaldirect.arsenal.com/robots.txt
- **크롤링 난이도**: 🟡 중간

### 13. 레알 마드리드 공식샵
- **URL**: https://shop.realmadrid.com/
- **제품 검색 URL**: https://shop.realmadrid.com/en/real-madrid-kits/
- **Robots.txt**: https://shop.realmadrid.com/robots.txt
- **크롤링 난이도**: 🟡 중간
- **메모**:
  - Fanatics 플랫폼 사용
  - 다국어 지원 (en, es)

### 14. 바르셀로나 공식샵
- **URL**: https://store.fcbarcelona.com/
- **제품 검색 URL**: https://store.fcbarcelona.com/en/fc-barcelona-kits/
- **Robots.txt**: https://store.fcbarcelona.com/robots.txt
- **크롤링 난이도**: 🟡 중간
- **메모**:
  - Nike 제품 판매
  - Fanatics 플랫폼

### 15. 바이에른 뮌헨 공식샵
- **URL**: https://fcbayern.com/shop/en
- **제품 검색 URL**: https://fcbayern.com/shop/en/fc-bayern-kits
- **Robots.txt**: https://fcbayern.com/robots.txt
- **크롤링 난이도**: 🟡 중간
- **메모**:
  - Adidas 제품
  - 독일/영어 지원

### 16. 보루시아 도르트문트 공식샵
- **URL**: https://shop.bvb.de/
- **제품 검색 URL**: https://shop.bvb.de/en/BVB-Kits/
- **Robots.txt**: https://shop.bvb.de/robots.txt
- **크롤링 난이도**: 🟡 중간
- **메모**:
  - Puma 제품
  - 독일/영어 지원

### 17. 울버햄튼 원더러스 공식샵
- **URL**: https://shop.wolves.co.uk/
- **제품 검색 URL**: https://shop.wolves.co.uk/kits
- **Robots.txt**: https://shop.wolves.co.uk/robots.txt
- **크롤링 난이도**: 🟡 중간
- **메모**:
  - Sudu 제품

### 18. AC 밀란 공식샵
- **URL**: https://store.acmilan.com/
- **제품 검색 URL**: https://store.acmilan.com/en/ac-milan-kits/
- **Robots.txt**: https://store.acmilan.com/robots.txt
- **크롤링 난이도**: 🟡 중간
- **메모**:
  - Puma 제품
  - 이탈리아/영어 지원

### 19. 인터 밀란 공식샵
- **URL**: https://store.inter.it/
- **제품 검색 URL**: https://store.inter.it/en/inter-kits/
- **Robots.txt**: https://store.inter.it/robots.txt
- **크롤링 난이도**: 🟡 중간
- **메모**:
  - Nike 제품
  - 이탈리아/영어 지원

### 20. AS 로마 공식샵
- **URL**: https://store.asroma.com/
- **제품 검색 URL**: https://store.asroma.com/en/as-roma-kits/
- **Robots.txt**: https://store.asroma.com/robots.txt
- **크롤링 난이도**: 🟡 중간
- **메모**:
  - Adidas 제품
  - 이탈리아/영어 지원

### 21. SSC 나폴리 공식샵
- **URL**: https://store.sscnapoli.it/
- **제품 검색 URL**: https://store.sscnapoli.it/en/ssc-napoli-kits/
- **Robots.txt**: https://store.sscnapoli.it/robots.txt
- **크롤링 난이도**: 🟡 중간
- **메모**:
  - EA7 Emporio Armani 제품
  - 이탈리아/영어 지원

### 22. 유벤투스 공식샵
- **URL**: https://store.juventus.com/
- **제품 검색 URL**: https://store.juventus.com/en/juventus-kits/
- **Robots.txt**: https://store.juventus.com/robots.txt
- **크롤링 난이도**: 🟡 중간
- **메모**:
  - Adidas 제품
  - 이탈리아/영어 지원

---

## 기타 쇼핑몰

### 13. Pro:Direct Soccer
- **URL**: https://www.prodirectsoccer.com/
- **제품 검색 URL**: https://www.prodirectsoccer.com/soccer-equipment/football-shirts.aspx
- **Robots.txt**: https://www.prodirectsoccer.com/robots.txt
- **크롤링 난이도**: 🟡 중간

### 14. Soccer.com
- **URL**: https://www.soccer.com/
- **제품 검색 URL**: https://www.soccer.com/shop/jerseys/
- **Robots.txt**: https://www.soccer.com/robots.txt
- **크롤링 난이도**: 🟡 중간

### 15. FANATICS
- **URL**: https://www.fanatics.com/
- **제품 검색 URL**: https://www.fanatics.com/soccer/o-5477+z-981438-3509039460
- **Robots.txt**: https://www.fanatics.com/robots.txt
- **크롤링 난이도**: 🟡 중간
- **제휴 프로그램**: https://www.fanatics.com/affiliates
- **메모**:
  - 세계 최대 스포츠 상품 편집샵
  - 많은 클럽 공식샵 플랫폼 제공
  - 맨유, 리버풀, 레알, 바르샤 등 공식 파트너
  - API 제공 가능성 있음

---

## 📊 우선순위 (추천)

### Phase 1: 테스트 (난이도 낮음)
1. ✅ **스포츠다이렉트** - 가장 쉬움, HTML 구조 명확
2. 🟡 유니스포츠 - 구조 단순, 제휴 프로그램 있음

### Phase 2: 확장 (난이도 중간)
3. 클럽 공식샵 (Fanatics 플랫폼 공통 구조)
4. Kitbag, Pro:Direct Soccer

### Phase 3: 고급 (난이도 높음, 제휴 우선)
5. 나이키 - 제휴 프로그램 신청 필요
6. 아디다스 - API 접근 협상 필요

---

## 🔧 크롤링 전 체크리스트

### 각 사이트별로 확인할 것
- [ ] robots.txt 확인
- [ ] 이용약관에서 자동화 접근 금지 여부 확인
- [ ] 제휴 프로그램 존재 여부
- [ ] API 제공 여부
- [ ] HTML 구조 분석 (개발자 도구)
- [ ] JavaScript 렌더링 필요 여부
- [ ] Rate Limiting 정책
- [ ] Anti-bot 시스템 (Cloudflare, reCAPTCHA 등)

### 법적 확인
- [ ] 저작권 침해 여부
- [ ] 개인정보 수집 여부
- [ ] 상업적 이용 가능 여부

---

## 📝 다음 단계

1. **robots.txt 확인**: 각 사이트의 robots.txt를 확인하고 결과를 이 문서에 기록
2. **제휴 프로그램 조사**: 가능한 모든 사이트의 제휴 프로그램 신청
3. **HTML 구조 분석**: 우선순위 높은 사이트부터 개발자 도구로 분석
4. **테스트 크롤러 작성**: 스포츠다이렉트로 먼저 테스트

---

## 🚨 중요 공지

**절대 하지 말 것:**
- ❌ robots.txt를 무시하고 크롤링
- ❌ 로그인이 필요한 페이지 자동 로그인
- ❌ 초당 여러 요청 (최소 5초 간격 권장)
- ❌ User-Agent 속이기

**권장 사항:**
- ✅ 제휴 프로그램 우선 고려
- ✅ API 제공 여부 문의
- ✅ 새벽 시간대 크롤링 (트래픽 낮을 때)
- ✅ 에러 발생 시 즉시 중단
- ✅ 모든 요청 로그 기록

---

**마지막 업데이트**: 2025-01-13
**작성자**: 오마카세미루 개발팀
