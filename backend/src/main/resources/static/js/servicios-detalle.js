/**
 * SERVICIOS-DETALLE.JS — RedMatrixSolutions
 * Interacciones de tarjetas visuales de servicios
 */

'use strict';

(function initServiciosDetalle() {
  const section = document.querySelector('.servicios-detalle');
  if (!section) return;

  // Accesibilidad: activar hover con teclado
  const cards = section.querySelectorAll('.servicio-card');

  cards.forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const href = card.dataset.href;
        if (href) window.location.href = href;
      }
    });
  });

})();
