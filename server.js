// server.js

// 💡 dotenv 로드: 가장 먼저 실행하여 .env 파일 내용을 process.env에 주입
require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const session = require('express-session');
const bodyParser = require('body-parser');

// ----------------------------------------------------
// I. 설정 및 전역 상태
// ----------------------------------------------------

// 💡 환경 변수에서 관리자 정보 로드 (실제 배포 환경에서 설정되어야 함)
const ADMIN_USERNAME = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASS || 'default-password';
const SESSION_SECRET = process.env.SESSION_SECRET || 'a_default_secret_key_for_dev';

// 💡 카운트다운 설정 (메모리 내 저장소)
let countdownSettings = {
  title: '엔비디아 3분기 실적 발표 카운트다운',
  h1Title: '엔비디아 3분기 실적 발표 카운트다운',
  targetDate: '2025-11-19T21:00:00Z', // UTC 기준
  note: '발표 시간: 2025년 11월 20일 오전 6시 이후 (한국 기준)',
  subNote: '참고: 발표 시각은 ±30분 변동 가능성이 있습니다.',
  buttonText: '📈 엔비디아 정보 자세히 확인하기',
  buttonLink: 'https://kr.investing.com/equities/nvidia-corp'
};

const port = process.env.PORT || 8080;
let activeUsers = 0;

// ----------------------------------------------------
// II. 미들웨어 설정
// ----------------------------------------------------

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); // POST 요청 처리

// 💡 세션 미들웨어 설정
app.use(session({
  secret: SESSION_SECRET, // 세션 암호화 키
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' } // 프로덕션 환경에서만 HTTPS
}));

// 💡 인증 확인 미들웨어
const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/login');
};

// ----------------------------------------------------
// III. 라우트 정의
// ----------------------------------------------------

// 1. 메인 카운트다운 페이지
app.get('/', (req, res) => {
  res.render('index', {
    ...countdownSettings,
    visitorCount: activeUsers,
    isAdmin: req.session.isAuthenticated
  });
});

// 2. 로그인 페이지 (GET: 폼 제공)
app.get('/login', (req, res) => {
  if (req.session.isAuthenticated) {
    return res.redirect('/admin');
  }
  res.render('login', { error: null });
});

// 3. 로그인 처리 (POST: 인증)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // 💡 환경 변수와 입력값 비교 💡
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isAuthenticated = true;
    req.session.username = username;
    return res.redirect('/admin');
  }

  res.render('login', { error: '아이디 또는 비밀번호가 잘못되었습니다.' });
});

// 4. 관리자 설정 페이지 (인증 필요)
app.get('/admin', isAuthenticated, (req, res) => {
  res.render('admin', {
    ...countdownSettings,
    message: null
  });
});

// 5. 설정 업데이트 처리 (POST: 설정 저장)
app.post('/update', isAuthenticated, (req, res) => {
  // 폼에서 받은 새 설정을 저장
  countdownSettings.title = req.body.title || countdownSettings.title;
  countdownSettings.h1Title = req.body.h1Title || countdownSettings.h1Title;
  countdownSettings.targetDate = req.body.targetDate || countdownSettings.targetDate;
  countdownSettings.note = req.body.note || countdownSettings.note;
  countdownSettings.subNote = req.body.subNote || countdownSettings.subNote;
  countdownSettings.buttonText = req.body.buttonText || countdownSettings.buttonText;
  countdownSettings.buttonLink = req.body.buttonLink || countdownSettings.buttonLink;

  // 업데이트 메시지를 띄우기 위해 admin 페이지로 리다이렉트
  res.render('admin', {
    ...countdownSettings,
    message: '설정이 성공적으로 업데이트되었습니다!'
  });
});

// 6. 로그아웃 (세션 파괴)
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Logout failed.');
    }
    res.redirect('/');
  });
});

// ----------------------------------------------------
// IV. Socket.IO 및 서버 시작
// ----------------------------------------------------

io.on('connection', (socket) => {
  activeUsers++;
  io.emit('activeUsers', activeUsers);

  socket.on('disconnect', () => {
    activeUsers--;
    io.emit('activeUsers', activeUsers);
  });
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});