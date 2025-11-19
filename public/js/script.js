// public/js/script.js

document.addEventListener('DOMContentLoaded', () => {
  const targetDateMeta = document.querySelector('meta[name="target-date"]');
  if (!targetDateMeta) return;

  const targetTime = new Date(targetDateMeta.content).getTime();
  const countdownElement = document.getElementById('countdown');

  if (!countdownElement) {
    console.error("ID 'countdown' 요소를 찾을 수 없습니다. HTML ID를 확인하세요.");
    return;
  }

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
});