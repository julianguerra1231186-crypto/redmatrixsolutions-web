/**
 * CLIENTES.JS — RedMatrixSolutions
 * Animación de contadores numéricos
 */

'use strict';

(function initClientes() {
  const section = document.querySelector('.clientes');
  if (!section) return;

  const counters = section.querySelectorAll('.clientes__trust-number[data-target]');
  let animated = false;

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.querySelector('span')?.textContent || '';
    const duration = 1800;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = Math.round(eased * target);
      el.textContent = value;
      const span = document.createElement('span');
      span.textContent = suffix;
      el.appendChild(span);

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some(e => e.isIntersecting) && !animated) {
        animated = true;
        counters.forEach(animateCounter);
        observer.disconnect();
      }
    },
    { threshold: 0.3 }
  );

  const trustSection = section.querySelector('.clientes__trust');
  if (trustSection) observer.observe(trustSection);

})();
