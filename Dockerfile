# Railway 배포용 Dockerfile
# Puppeteer/Chromium 없이 Node.js 서버만 실행

FROM node:18-slim

WORKDIR /app

# package.json과 package-lock.json만 먼저 복사 (캐싱 최적화)
COPY package*.json ./

# 프로덕션 의존성만 설치, 스크립트 실행 건너뛰기
RUN npm ci --production --ignore-scripts

# 소스 코드 복사
COPY . .

# Railway는 런타임에 환경 변수를 자동으로 주입합니다
# 기본 포트만 설정 (Railway가 PORT를 오버라이드할 수 있음)
ENV PORT=3000
EXPOSE 3000

# 서버 실행
CMD ["node", "server.js"]
