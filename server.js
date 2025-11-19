// server.js 파일 내용

const express = require('express');
const app = express();
const port = 3000;

// EJS 설정 (views 폴더)
app.set('view engine', 'ejs');
app.set('views', './views');

// 💡 핵심: 정적 파일 경로 설정 💡
// 브라우저에서는 'http://localhost:3000/style.css'와 같이 접근 가능
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', {
    title: '정적 파일 연결 테스트'
  });
});

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});