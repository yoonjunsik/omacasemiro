# 🚂 Railway 재배포 가이드

## ✅ 준비 완료된 항목

- [x] `.gitignore` 업데이트 (보안 파일 보호)
- [x] `goalroute.html` API URL 수정 (환경별 자동 전환)
- [x] `Dockerfile` 준비
- [x] `railway.json` 설정 완료
- [x] Firebase 인증 정보 Base64 인코딩 (`firebase-credentials-base64.txt`)

---

## 📋 Railway 수동 배포 단계

### 1️⃣ Railway 로그인 (터미널)

```bash
railway login
```

브라우저가 열리면 GitHub 계정으로 로그인하세요.

---

### 2️⃣ 프로젝트 연결 (기존 프로젝트가 있는 경우)

```bash
# 기존 프로젝트 목록 확인
railway list

# 프로젝트 연결
railway link
```

**또는 새 프로젝트 생성:**

```bash
railway init
```

---

### 3️⃣ 환경 변수 설정 (매우 중요!)

#### 방법 A: Railway CLI로 설정

```bash
# Football Data API
railway variables set FOOTBALL_DATA_API_KEY="your_football_data_api_key_here"

# Amadeus API
railway variables set AMADEUS_API_KEY="your_amadeus_api_key_here"
railway variables set AMADEUS_API_SECRET="your_amadeus_secret_here"

# ExchangeRate API
railway variables set EXCHANGE_RATE_API_KEY="your_exchange_rate_key_here"

# Notion API
railway variables set NOTION_API_KEY="your_notion_api_key_here"
railway variables set NOTION_DATABASE_ID="your_notion_database_id_here"

# Firebase Credentials (Base64 인코딩된 값)
railway variables set FIREBASE_CREDENTIALS_BASE64="$(cat firebase-credentials-base64.txt)"

# 환경 설정
railway variables set NODE_ENV="production"
```

#### 방법 B: Railway Dashboard에서 설정 (더 간편)

1. https://railway.app/dashboard 접속
2. 프로젝트 선택
3. **Variables** 탭 클릭
4. 아래 환경 변수들을 하나씩 추가:

| Variable Name | Value |
|--------------|-------|
| `FOOTBALL_DATA_API_KEY` | `.env` 파일에서 복사 |
| `AMADEUS_API_KEY` | `.env` 파일에서 복사 |
| `AMADEUS_API_SECRET` | `.env` 파일에서 복사 |
| `EXCHANGE_RATE_API_KEY` | `.env` 파일에서 복사 |
| `NOTION_API_KEY` | `.env` 파일에서 복사 |
| `NOTION_DATABASE_ID` | `.env` 파일에서 복사 |
| `NODE_ENV` | `production` |
| `FIREBASE_CREDENTIALS_BASE64` | `firebase-credentials-base64.txt` 파일 내용 복사 |

---

### 4️⃣ 배포 실행

#### 방법 A: Railway CLI

```bash
# 현재 브랜치 배포
railway up

# 또는 강제 재배포
railway up --detach
```

#### 방법 B: GitHub 연동 (권장)

1. Railway Dashboard에서 **Settings** → **Service**
2. **Connect Repo** 클릭
3. GitHub 레포지토리 선택
4. Branch 선택 (main 또는 master)
5. **Deploy** 자동 시작

**자동 배포 설정:**
- GitHub에 push할 때마다 자동으로 Railway에 배포됩니다
- `main` 브랜치에 변경사항이 생기면 자동 재배포

---

### 5️⃣ 배포 상태 확인

```bash
# 로그 확인
railway logs

# 배포 상태 확인
railway status

# 서비스 URL 확인
railway domain
```

또는 Railway Dashboard에서:
- **Deployments** 탭: 배포 진행 상황
- **Logs** 탭: 실시간 로그
- **Metrics** 탭: CPU, 메모리 사용량

---

### 6️⃣ 커스텀 도메인 설정 (선택)

현재 Railway URL:
```
https://omacasemiro-production.up.railway.app
```

**커스텀 도메인 연결:**

1. Railway Dashboard → **Settings** → **Domains**
2. **Custom Domain** 추가
3. DNS 레코드 설정 (CNAME):
   ```
   api.omacasemiro.shop → omacasemiro-production.up.railway.app
   ```
4. SSL 자동 발급 (Railway가 자동 처리)

**프론트엔드 수정 (커스텀 도메인 사용 시):**
```javascript
// goalroute.html & js/goalroute-api.js
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://api.omacasemiro.shop/api'; // 커스텀 도메인
```

---

## 🧪 배포 후 테스트

### API 엔드포인트 테스트

```bash
# 1. 서버 헬스 체크
curl https://omacasemiro-production.up.railway.app/

# 2. 전체 캐시 데이터 조회
curl https://omacasemiro-production.up.railway.app/api/matches/all

# 3. 특정 날짜 경기 조회
curl "https://omacasemiro-production.up.railway.app/api/matches?date=2026-01-23"

# 4. 환율 조회
curl https://omacasemiro-production.up.railway.app/api/exchange-rate
```

### 웹사이트 테스트

1. https://omacasemiro.shop/goalroute.html 접속
2. **다가오는 빅매치** 섹션에 경기가 표시되는지 확인
3. **코스 설계 시작하기** 클릭 → plan-route.html 이동
4. 달력에서 날짜 클릭 → 경기 목록 표시 확인

---

## 🔄 자동 업데이트 확인

매일 **새벽 3시 (한국 시간)** 에 자동으로 경기 데이터가 업데이트됩니다.

**확인 방법:**
```bash
# Railway 로그 확인 (새벽 3시 이후)
railway logs --tail 100

# 로그에서 다음 메시지 확인:
# "⏰ 스케줄된 자동 업데이트 시작 (매일 새벽 3시)"
# "✅ 경기 데이터 수집 완료!"
```

---

## ⚠️ 문제 해결

### 1. 배포 실패 시

```bash
# 로그 확인
railway logs --tail 200

# 일반적인 원인:
# - 환경 변수 누락 → railway variables 확인
# - Firebase 인증 실패 → FIREBASE_CREDENTIALS_BASE64 확인
# - API 키 오류 → .env 파일과 비교
```

### 2. API 응답 없음

```bash
# Railway 서비스 재시작
railway restart

# 환경 변수 확인
railway variables
```

### 3. Firebase 연결 실패

**증상:** 로그에 "Firebase Admin 초기화 실패" 메시지

**해결:**
```bash
# Base64 인코딩 재생성
base64 -i omacasemiro-8fd4c-firebase-adminsdk-fbsvc-8c438c494c.json | tr -d '\n'

# 출력된 값을 Railway Variables에 FIREBASE_CREDENTIALS_BASE64로 재설정
```

---

## 📊 예상 비용

Railway 무료 플랜:
- **$5/월 무료 크레딧**
- 월 500시간 실행 가능
- 1GB 메모리
- 충분히 사용 가능!

초과 시:
- $0.000231/GB-second (메모리)
- $0.000463/vCPU-second (CPU)

**예상 월 비용:** $0 ~ $5 (무료 범위 내)

---

## 🎯 다음 단계

1. [ ] Railway 로그인
2. [ ] 프로젝트 생성/연결
3. [ ] 환경 변수 설정
4. [ ] 배포 실행
5. [ ] API 테스트
6. [ ] 웹사이트 동작 확인
7. [ ] 매일 새벽 3시 자동 업데이트 확인 (다음날)

---

**문제가 있으면 Railway 로그를 확인하거나 질문해주세요!**
