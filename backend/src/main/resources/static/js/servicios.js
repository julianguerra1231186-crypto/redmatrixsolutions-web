/**
 * SERVICIOS.JS — RedMatrixSolutions
 * Interacciones de la sección de servicios numerados
 */

'use strict';

(function initServicios() {
  const section = document.querySelector('.servicios');
  if (!section) return;

  // Hover en items: resaltar número
  const items = section.querySelectorAll('.servicio-item');

  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const num = item.querySelector('.servicio-item__number');
      if (num) num.style.transform = 'scale(1.1)';
    });
    item.addEventListener('mouseleave', () => {
      const num = item.querySelector('.servicio-item__number');
      if (num) num.style.transform = '';
    });
  });

})();
