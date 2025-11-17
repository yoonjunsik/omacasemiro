# ⚽ 블랙프라이데이 모니터링 시스템

유럽 5대 리그 상위 팀들의 공식 스토어를 자동으로 모니터링하여 블랙프라이데이 시작 여부를 감지하고 Slack으로 알림을 전송하는 시스템입니다.

## 📋 목차

- [기능](#기능)
- [모니터링 대상](#모니터링-대상)
- [설치 방법](#설치-방법)
- [사용 방법](#사용-방법)
- [설정 방법](#설정-방법)
- [GitHub Actions 자동화](#github-actions-자동화)
- [알림 예시](#알림-예시)

## ✨ 기능

### 블랙프라이데이 감지 알고리즘

1. **블랙프라이데이 전용 페이지 감지**
   - `/black-friday`, `/blackfriday` 등의 URL 패턴 체크
   - HTTP 200 응답 및 실제 콘텐츠 확인

2. **메인 페이지 키워드 감지**
   - "Black Friday", "Cyber Monday" 등의 키워드 검색
   - 배너 영역에서 키워드 우선 검색

3. **대규모 할인 감지**
   - 30% 이상 할인 제품 5개 이상 시 HIGH 신호
   - 평균 할인율 및 최대 할인율 분석

4. **신뢰도 점수 (0-100)**
   - BF 전용 페이지 존재: +40점
   - 배너에 키워드: +30점
   - 메인 페이지 키워드: +15점
   - 대규모 할인: +30점
   - 일반 할인: +10점
   - **50점 이상 시 블랙프라이데이로 판정**

## 🎯 모니터링 대상

### 프리미어리그 (8팀)
- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 리버풀 (Liverpool FC)
- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 맨체스터 시티 (Manchester City)
- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 아스널 (Arsenal)
- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 첼시 (Chelsea)
- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 뉴캐슬 (Newcastle United)
- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 맨체스터 유나이티드 (Manchester United)
- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 토트넘 (Tottenham)
- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 애스턴 빌라 (Aston Villa)

### 라리가 (3팀)
- 🇪🇸 레알 마드리드 (Real Madrid)
- 🇪🇸 바르셀로나 (Barcelona)
- 🇪🇸 아틀레티코 마드리드 (Atletico Madrid)

### 분데스리가 (2팀)
- 🇩🇪 바이에른 뮌헨 (Bayern Munich)
- 🇩🇪 도르트문트 (Borussia Dortmund)

### 리그앙 (1팀)
- 🇫🇷 PSG (Paris Saint-Germain)

### 세리에 A (3팀)
- 🇮🇹 인터 밀란 (Inter Milan)
- 🇮🇹 AC 밀란 (AC Milan)
- 🇮🇹 유벤투스 (Juventus)

**총 17개 팀** (확장 가능)

## 🚀 설치 방법

### 1. 의존성 설치

```bash
npm install puppeteer
```

### 2. Slack Webhook URL 설정

#### Slack에서 Webhook URL 생성:
1. https://api.slack.com/apps 접속
2. "Create New App" → "From scratch"
3. 앱 이름 입력 (예: "Black Friday Monitor")
4. Workspace 선택
5. "Incoming Webhooks" 활성화
6. "Add New Webhook to Workspace"
7. 알림받을 채널 선택
8. Webhook URL 복사

#### 환경 변수 설정:

**로컬 실행:**
```bash
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
```

**GitHub Actions:**
1. Repository Settings → Secrets and variables → Actions
2. "New repository secret" 클릭
3. Name: `SLACK_WEBHOOK_URL`
4. Value: Webhook URL 입력

## 💻 사용 방법

### 모든 리그 모니터링

```bash
node monitors/run-monitor.js
```

### 특정 리그만 모니터링

```bash
# 프리미어리그만
node monitors/run-monitor.js premierLeague

# 라리가만
node monitors/run-monitor.js laLiga

# 분데스리가만
node monitors/run-monitor.js bundesliga

# 리그앙만
node monitors/run-monitor.js ligue1

# 세리에 A만
node monitors/run-monitor.js serieA
```

### 테스트 실행 (Slack 알림 없이)

```bash
# Slack Webhook URL 없이 실행
node monitors/run-monitor.js
```

## ⚙️ 설정 방법

### 팀 추가/수정

`monitors/team-configs.js` 파일을 편집:

```javascript
{
    name: 'Team Name',                    // 영문 팀명
    nameKo: '팀 이름',                     // 한글 팀명
    league: 'Premier League',              // 리그명
    storeUrl: 'https://shop.team.com',     // 공식 스토어 URL
    blackFridayUrls: [                     // 체크할 URL 목록
        'https://shop.team.com/black-friday',
        'https://shop.team.com/sale'
    ],
    selectors: {                           // CSS 셀렉터
        products: '.product-tile',
        productName: '.product-name',
        price: '.price',
        salePrice: '.sale-price',
        banner: '.promo-banner'
    },
    keywords: [                            // 감지할 키워드
        'black friday',
        'cyber monday'
    ]
}
```

## 🤖 GitHub Actions 자동화

### 자동 실행 스케줄

- **매일 4회 자동 실행**: 0시, 6시, 12시, 18시 (UTC)
- **한국 시간**: 09시, 15시, 21시, 03시

### 수동 실행

1. GitHub 저장소 → Actions 탭
2. "Black Friday Monitor" 워크플로우 선택
3. "Run workflow" 클릭
4. 원하는 리그 선택 (선택사항)
5. "Run workflow" 실행

### 결과 확인

- **Artifacts**: 각 실행 결과가 30일간 보관됨
- **최신 결과**: `monitor-results/latest.json` 파일 확인

## 📱 알림 예시

### 블랙프라이데이 감지 시

```
🎉 블랙프라이데이 감지: 리버풀

팀: 🏴󠁧󠁢󠁥󠁮󠁧󠁿 리버풀 (Liverpool)
리그: Premier League
신뢰도: 85%
감지 시각: 2024-11-20 09:00:00 KST

감지된 신호:
🔴 블랙프라이데이 전용 페이지 발견
🔴 메인 페이지에 블랙프라이데이 키워드/배너 발견
🔴 30% 이상 대규모 할인 제품 12개 발견

주요 할인 제품:
• Liverpool Home Shirt 24/25 - 40% 할인
• Liverpool Training Kit - 35% 할인
• Liverpool Jacket - 30% 할인
```

### 요약 알림

```
📊 블랙프라이데이 모니터링 요약

전체 모니터링: 17개 팀
블랙프라이데이 감지: 5개 팀

리그별 현황:
• Premier League: 3개 팀
• La Liga: 1개 팀
• Serie A: 1개 팀

감지된 팀 목록:
🏴󠁧󠁢󠁥󠁮󠁧󠁿 리버풀 (신뢰도: 85%)
🏴󠁧󠁢󠁥󠁮󠁧󠁿 맨체스터 시티 (신뢰도: 75%)
🇪🇸 레알 마드리드 (신뢰도: 70%)
```

## 📊 결과 파일 구조

```json
{
  "timestamp": "2024-11-20T00:00:00.000Z",
  "totalTeams": 17,
  "detectedTeams": 5,
  "results": [
    {
      "team": "리버풀",
      "teamEn": "Liverpool",
      "league": "Premier League",
      "blackFridayDetected": true,
      "confidence": 85,
      "signals": [
        {
          "type": "bf_page_exists",
          "severity": "HIGH",
          "message": "블랙프라이데이 전용 페이지 발견"
        }
      ]
    }
  ]
}
```

## 🔧 문제 해결

### Puppeteer 설치 실패

```bash
# macOS
brew install chromium

# Linux
sudo apt-get install chromium-browser
```

### Slack 알림이 오지 않을 때

1. Webhook URL이 올바른지 확인
2. Slack 앱 권한 확인
3. 채널에 앱이 추가되어 있는지 확인

### 크롤링 실패

- 네트워크 연결 확인
- 사이트가 차단하는 경우 User-Agent 변경 필요
- Rate limiting: 팀 간 딜레이 시간 증가

## 📝 향후 개선 사항

- [ ] 더 많은 팀 추가 (각 리그 8팀)
- [ ] 이메일 알림 추가
- [ ] 과거 데이터와 비교하여 변화 추적
- [ ] 웹 대시보드 구축
- [ ] 할인율 히스토리 분석

## 📄 라이선스

MIT License

## 👨‍💻 개발자

Omacasemiro Team

---

**문의사항이나 버그 리포트는 GitHub Issues를 이용해주세요.**
