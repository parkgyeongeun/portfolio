/* ============================================================
   Gyeongeun Park — Portfolio
   - 실시간 시계/날짜 (HOME 화면 좌하단)
   - HOME의 Works 클릭 → WORKS 화면(소개+프로젝트)으로 전환
   - WORKS 화면의 이름 클릭 → 다시 HOME 화면으로
   - 각 프로젝트의 이미지 슬라이더 (화살표 클릭 · 드래그/스와이프 · 호버 자동 재생)
   자동으로 동작하며, 별도로 수정할 필요는 없습니다.
============================================================= */

// ── 1. 실시간 시계 + 날짜 ──
const clockEl = document.getElementById('clock');
const todayEl = document.getElementById('today');

function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  clockEl.textContent = `${hh}:${mm}:${ss}`;

  todayEl.textContent = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
updateClock();
setInterval(updateClock, 1000);

// ── 2. HOME ↔ WORKS 화면 전환 ──
const homeScreen = document.getElementById('home-screen');
const worksScreen = document.getElementById('works-screen');

document.getElementById('works-toggle-home').addEventListener('click', () => {
  homeScreen.hidden = true;
  worksScreen.hidden = false;
});

document.getElementById('logo-back').addEventListener('click', () => {
  worksScreen.hidden = true;
  homeScreen.hidden = false;
});

// ── 3. 이미지 슬라이더 (화살표 클릭 · 드래그/스와이프 · 호버 자동 재생) ──
document.querySelectorAll('[data-slider]').forEach((slider) => {
  const track = slider.querySelector('.slider-track');
  const slides = Array.from(track.children);
  const prevBtn = slider.querySelector('.slider-btn.prev');
  const nextBtn = slider.querySelector('.slider-btn.next');
  const curEl = slider.querySelector('.slider-count .cur');
  let index = 0;
  let isHovering = false;
  let autoTimer = null;

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    if (curEl) curEl.textContent = index + 1;
  }

  function goTo(i) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    update();
    if (isHovering) startAuto(); // 수동 조작 시 자동 재생 타이머를 리셋
  }

  function startAuto() {
    stopAuto();
    if (slides.length < 2) return;
    autoTimer = setInterval(() => {
      index = (index + 1) % slides.length;
      update();
    }, 1400);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));

  slider.addEventListener('mouseenter', () => { isHovering = true; startAuto(); });
  slider.addEventListener('mouseleave', () => { isHovering = false; stopAuto(); });

  // 드래그 / 스와이프 (마우스 + 터치 공용, Pointer Events)
  let startX = 0;
  let dragging = false;

  track.addEventListener('pointerdown', (e) => {
    dragging = true;
    startX = e.clientX;
    track.classList.add('dragging');
    track.setPointerCapture(e.pointerId);
  });

  track.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    track.style.transform = `translateX(calc(-${index * 100}% + ${dx}px))`;
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('dragging');
    const dx = e.clientX - startX;
    const threshold = slider.clientWidth * 0.15;
    if (dx > threshold) goTo(index - 1);
    else if (dx < -threshold) goTo(index + 1);
    else update();
  }

  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);

  update();
});
