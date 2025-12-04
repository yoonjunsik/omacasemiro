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

# 포트 설정
ENV PORT=3000
EXPOSE 3000

# 서버 실행
CMD ["node", "server.js"]
