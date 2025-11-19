// server.js

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const port = 3000;

// EJS 설정
app.set('view engine', 'ejs');
app.set('views', './views');

// 정적 파일 경로 설정
app.use(express.static('public'));

// 현재 접속자 수 변수
let activeUsers = 0;

// EJS 라우트: 현재 접속자 수를 템플릿에 전달
app.get('/', (req, res) => {
  res.render('index', {
    title: '엔비디아 3분기 실적 발표 카운트다운',
    // EJS 렌더링 시 현재 카운트를 초기값으로 전달
    visitorCount: activeUsers
  });
});

// Socket.IO 연결 로직
io.on('connection', (socket) => {
  // 1. 사용자 접속 시
  activeUsers++;
  console.log(`User connected. Current active users: ${activeUsers}`);

  // 모든 클라이언트에게 업데이트된 카운트 전달
  io.emit('activeUsers', activeUsers);

  socket.on('disconnect', () => {
    // 2. 사용자 연결 해제 시
    activeUsers--;
    console.log(`User disconnected. Current active users: ${activeUsers}`);

    // 모든 클라이언트에게 업데이트된 카운트 전달
    io.emit('activeUsers', activeUsers);
  });
});

// 서버 리스닝
server.listen(port, () => {
  console.log(`Express and Socket.IO listening at http://localhost:${port}`);
});