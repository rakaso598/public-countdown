# Dockerfile

# 1. 베이스 이미지 설정: 안정적인 Node.js LTS slim 버전을 사용합니다.
FROM node:20-slim

# 2. 작업 디렉토리 설정
WORKDIR /usr/src/app

# 3. package.json과 package-lock.json 복사 및 의존성 설치
# (의존성 레이어를 분리하여 빌드 캐싱 효율을 높입니다.)
COPY package*.json ./
RUN npm install

# 4. 나머지 애플리케이션 코드 복사
# (.gitignore에 의해 node_modules 등은 복사되지 않습니다.)
COPY . .

# 5. 환경 변수 설정: Cloud Run은 기본적으로 8080 포트를 사용합니다.
ENV PORT 8080
EXPOSE 8080

# 6. 컨테이너 시작 시 실행될 명령 (Express 서버 시작)
CMD [ "node", "server.js" ]