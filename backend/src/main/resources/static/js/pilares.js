/**
 * PILARES.JS — RedMatrixSolutions
 * Animaciones de tarjetas de pilares
 */

'use strict';

(function initPilares() {
  const section = document.querySelector('.pilares');
  if (!section) return;

  // Hover 3D sutil en tarjetas
  const cards = section.querySelectorAll('.pilar-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.matchMedia('(hover: hover)').matches) {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `translateY(-8px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

})();
