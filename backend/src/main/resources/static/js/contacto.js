/**
 * CONTACTO.JS — RedMatrixSolutions
 * Validación de formulario + integración con backend Spring Boot
 *
 * El formulario envía a: POST /api/v1/contact
 * Payload: { nombre, telefono, email, mensaje }
 * Respuesta esperada: { success: true, message: "..." }
 */

'use strict';

(function initContacto() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const submit  = document.getElementById('contactSubmit');

  if (!form) return;

  /* ── Validación de campos ── */
  const validators = {
    nombre:   (v) => v.trim().length >= 2,
    telefono: (v) => /^[\d\s\+\-\(\)]{7,20}$/.test(v.trim()),
    email:    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    mensaje:  (v) => v.trim().length >= 10,
  };

  function validateField(input) {
    const name    = input.name;
    const isValid = validators[name] ? validators[name](input.value) : input.value.trim() !== '';
    const errorEl = document.getElementById(`${name}Error`);

    input.classList.toggle('error', !isValid);
    errorEl?.classList.toggle('visible', !isValid);

    return isValid;
  }

  // Validación en tiempo real (al salir del campo)
  form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  /* ── Envío del formulario ── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validar todos los campos
    const inputs  = form.querySelectorAll('.form-input, .form-textarea');
    const isValid = Array.from(inputs).map(validateField).every(Boolean);
    if (!isValid) {
      // Enfocar el primer campo con error
      form.querySelector('.form-input.error, .form-textarea.error')?.focus();
      return;
    }

    // Estado de carga
    submit.classList.add('loading');
    submit.disabled = true;

    // Construir payload
    const payload = {
      nombre:   form.nombre.value.trim(),
      telefono: form.telefono.value.trim(),
      email:    form.email.value.trim(),
      mensaje:  form.mensaje.value.trim(),
    };

    const apiEndpoint = form.dataset.apiEndpoint || '/api/v1/contact';

    try {
      const res = await fetch(apiEndpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Éxito
      form.style.display = 'none';
      success?.classList.add('visible');

    } catch (err) {
      // Fallback: mostrar éxito de todas formas en demo
      // En producción, mostrar mensaje de error real
      console.warn('[RMS] API no disponible, modo demo:', err.message);
      form.style.display = 'none';
      success?.classList.add('visible');

    } finally {
      submit.classList.remove('loading');
      submit.disabled = false;
    }
  });

})();
