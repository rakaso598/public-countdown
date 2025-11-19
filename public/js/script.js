// public/js/script.js

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. 카운트다운 및 타이틀 업데이트 로직 ---
  const targetDateMeta = document.querySelector('meta[name="target-date"]');
  if (!targetDateMeta) return;

  // 💡 targetDate는 서버에서 EJS를 통해 삽입된 값을 읽어옴 💡
  const targetTime = new Date(targetDateMeta.content).getTime();
  const countdownElement = document.getElementById('countdown');

  // 💡 시간을 HH:MM:SS 형식으로 포맷하고 타이틀을 업데이트하는 핵심 함수 💡
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetTime - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // 💡 브라우저 타이틀에 사용될 제목을 EJS에서 직접 가져옴 💡
    const eventTitle = document.title.split(' | ')[1] || '카운트다운';


    if (distance < 0) {
      clearInterval(timer);
      countdownElement.innerHTML = "✅ 실적 발표가 시작되었습니다!";
      countdownElement.classList.add('finished');

      // 타이틀 업데이트: 발표 종료 시
      document.title = `✅ 발표 시작! | ${eventTitle}`;

    } else {
      // 메인 카운트다운 디스플레이 업데이트 (일, 시, 분, 초)
      countdownElement.innerHTML = `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;

      // --- 타이틀 업데이트 로직 ---
      const formatNumber = (num) => String(num).padStart(2, '0');

      let titleTime;
      if (days > 0) {
        // 1일 이상 남았으면 일, 시, 분 포맷
        titleTime = `${days}일 ${formatNumber(hours)}:${formatNumber(minutes)}`;
      } else {
        // 1일 미만 남았으면 시, 분, 초 포맷
        titleTime = `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
      }

      // 💡 최종 타이틀 형식: [시간] | [이벤트 이름] 💡
      document.title = `${titleTime} | ${eventTitle}`;
    }
  }

  const timer = setInterval(updateCountdown, 1000);
  updateCountdown();


  // --- 2. Socket.IO 실시간 접속자 로직 ---
  const socket = io();
  const visitorDisplay = document.querySelector('.visitor-display span');

  if (visitorDisplay) {
    socket.on('activeUsers', (count) => {
      visitorDisplay.textContent = count;
    });
  }
});