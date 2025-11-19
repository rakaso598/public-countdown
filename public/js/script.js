// public/js/script.js

// 페이지 로드가 완료되면 함수를 실행
document.addEventListener('DOMContentLoaded', () => {
  // 1. HTML 요소 선택
  const targetElement = document.getElementById('js-status');

  // 2. 내용 변경 (JS 실행 확인)
  if (targetElement) {
    targetElement.innerHTML = '✅ **JavaScript 파일이 성공적으로 로드되어 이 내용을 변경했습니다!**';
    targetElement.style.backgroundColor = '#d4edda'; // 배경색 변경
    targetElement.style.color = '#155724'; // 글자색 변경
  } else {
    console.error('ID "js-status"를 가진 요소를 찾을 수 없습니다.');
  }
});