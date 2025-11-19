# 1. Node.js 공식 이미지 사용 (LTS 버전 추천)
FROM node:20-slim

# 2. 작업 디렉토리 설정
WORKDIR /usr/src/app

# 3. package.json과 package-lock.json 파일을 복사하여 의존성을 먼저 설치
#    (캐싱을 활용하여 빌드 속도를 높이는 일반적인 방식)
COPY package*.json ./
RUN npm install --omit=dev

# 4. 나머지 애플리케이션 코드를 복사
#    .gitignore에 정의된 파일은 복사되지 않습니다.
COPY . .

# 5. 서버가 리스닝할 포트 설정 (Cloud Run은 PORT 환경 변수를 주입합니다)
ENV PORT 8080
EXPOSE 8080

# 6. 애플리케이션 실행 명령
CMD [ "node", "server.js" ]