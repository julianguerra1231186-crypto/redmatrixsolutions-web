/**
 * TESTIMONIOS.JS — RedMatrixSolutions
 * Carrusel funcional con autoplay, dots y controles
 */

'use strict';

(function initTestimonios() {
  const track   = document.getElementById('testimoniosTrack');
  const prevBtn = document.getElementById('testimoniosPrev');
  const nextBtn = document.getElementById('testimoniosNext');
  const dots    = document.querySelectorAll('.testimonios__dot');

  if (!track) return;

  const slides = track.querySelectorAll('.testimonio-card');
  const total  = slides.length;
  let current  = 0;
  let autoplayTimer = null;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-selected', String(i === current));
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  /* ── Autoplay ── */
  function startAutoplay() {
    autoplayTimer = setInterval(next, 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  nextBtn?.addEventListener('click', () => { stopAutoplay(); next(); startAutoplay(); });
  prevBtn?.addEventListener('click', () => { stopAutoplay(); prev(); startAutoplay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAutoplay(); goTo(i); startAutoplay(); });
  });

  /* ── Swipe táctil ── */
  let touchStartX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      stopAutoplay();
      diff > 0 ? next() : prev();
      startAutoplay();
    }
  }, { passive: true });

  /* ── Pausa en hover ── */
  const carousel = document.querySelector('.testimonios__carousel');
  carousel?.addEventListener('mouseenter', stopAutoplay);
  carousel?.addEventListener('mouseleave', startAutoplay);

  /* ── Iniciar ── */
  goTo(0);
  startAutoplay();

})();
