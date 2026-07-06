/**
 * HEADER.JS — RedMatrixSolutions
 * Scroll effect, hamburger menu, active nav link
 */

'use strict';

(function initHeader() {
  const header    = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!header) return;

  /* ── Efecto scroll ── */
  /* ── Menú hamburguesa ── */
  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !hamburger.classList.contains('open');
    hamburger.classList.toggle('open', isOpen);
    mobileMenu?.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger?.addEventListener('click', () => toggleMenu());

  // Cerrar al hacer click en un enlace del menú móvil
  mobileMenu?.querySelectorAll('.header__mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Cerrar al hacer click fuera
  document.addEventListener('click', (e) => {
    if (
      mobileMenu?.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      toggleMenu(false);
    }
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) {
      toggleMenu(false);
      hamburger.focus();
    }
  });

  /* ── Active nav link por scroll ── */
  const sections = ['inicio', 'quienes-somos', 'pilares', 'servicios', 'conferencias', 'testimonios', 'clientes', 'contacto'];
  const navLinks = header.querySelectorAll('.header__nav-link[data-section]');

  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    let current = sections[0];

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) current = id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

})();
