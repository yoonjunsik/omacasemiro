# 캐시 우회하여 최신 버전 확인하기

## 문제
- GitHub Pages와 CDN이 파일을 캐싱하고 있습니다
- 로컬에서는 정상 작동하지만 라이브 서버에서는 오래된 버전이 로드됩니다

## 해결 방법

### 방법 1: 브라우저에서 캐시 완전 삭제 (가장 확실함)

1. **Chrome/Edge:**
   - `Ctrl+Shift+Delete` (Windows) 또는 `Cmd+Shift+Delete` (Mac)
   - 시간 범위: "전체 기간"
   - "캐시된 이미지 및 파일" 체크
   - "데이터 삭제" 클릭

2. **개발자 도구 사용:**
   - F12 눌러 개발자 도구 열기
   - Network 탭 클릭
   - "Disable cache" 체크박스 활성화
   - 개발자 도구를 연 상태로 페이지 새로고침

3. **하드 리프레시:**
   - `Ctrl+F5` (Windows)
   - `Cmd+Shift+R` (Mac)

### 방법 2: URL에 타임스탬프 추가

직접 접속: https://omacasemiro.shop/product.html?id=HJ4590-456&t=12345678

매번 다른 숫자를 사용하면 캐시를 우회합니다.

### 방법 3: 시크릿 모드 사용

- Chrome: `Ctrl+Shift+N`
- 시크릿 창에서 https://omacasemiro.shop/product.html?id=HJ4590-456 접속

## CDN 캐시 정보

현재 GitHub Pages가 Varnish CDN을 사용 중입니다:
- 캐시 유효 시간: 10분 (max-age=600)
- 마지막 수정 시간이 업데이트되면 자동으로 갱신됩니다

## 확인 방법

브라우저 콘솔(F12)에서 다음 로그가 나타나면 최신 버전입니다:
```
✅ Firebase 초기화 완료 (상품 페이지)
🔥 HOTFIX: 인라인 코드 실행됨
🔵 Firebase에서 제품 데이터 로드 중...
✅ Firebase 데이터 로드 완료: 137 개
🔗 Affiliate links applied to uniformData
🔍 검색할 제품 ID: HJ4590-456
```

만약 "❌ 제품을 찾을 수 없음" 메시지만 나온다면 여전히 구버전입니다.
