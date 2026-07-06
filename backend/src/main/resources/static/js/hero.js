/**
 * HERO.JS — RedMatrixSolutions
 * Animaciones de entrada y contador de stats
 */

'use strict';

(function initHero() {
  /* ── Animación de entrada del hero ── */
  const heroText = document.querySelector('.hero__text');
  if (!heroText) return;

  // Forzar visibilidad de elementos fade-in dentro del hero
  // (están en viewport desde el inicio)
  const heroFadeEls = document.querySelectorAll('.hero .fade-in, .hero .fade-in-left, .hero .fade-in-right');
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.05 }
  );

  heroFadeEls.forEach(el => observer.observe(el));

  // Activar inmediatamente si ya está visible
  setTimeout(() => {
    heroFadeEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('visible');
      }
    });
  }, 100);

  /* ── Parallax sutil en el fondo ── */
  const heroBgRight = document.querySelector('.hero__bg-right img');
  if (heroBgRight && window.matchMedia('(min-width: 768px)').matches) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBgRight.style.transform = `translateY(${scrolled * 0.15}px)`;
      }
    }, { passive: true });
  }

})();
