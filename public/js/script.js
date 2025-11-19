// public/js/script.js

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. 카운트다운 로직 ---
  const targetDateMeta = document.querySelector('meta[name="target-date"]');
  if (!targetDateMeta) return;

  const targetTime = new Date(targetDateMeta.content).getTime();
  const countdownElement = document.getElementById('countdown');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetTime - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance < 0) {
      clearInterval(timer);
      countdownElement.innerHTML = "✅ 실적 발표가 시작되었습니다!";
      countdownElement.classList.add('finished');
    } else {
      countdownElement.innerHTML = `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
    }
  }

  const timer = setInterval(updateCountdown, 1000);
  updateCountdown();


  // --- 2. Socket.IO 실시간 접속자 로직 ---
  const socket = io(); // io()는 socket.io.js가 로드된 후 사용 가능
  const visitorDisplay = document.querySelector('.visitor-display span');

  if (visitorDisplay) {
    // 서버로부터 'activeUsers' 이벤트 수신 시 실시간 업데이트
    socket.on('activeUsers', (count) => {
      visitorDisplay.textContent = count;
    });
  }
});