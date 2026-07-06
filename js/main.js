(function () {
  const WHATSAPP = "573115243424";

  function encode(text) {
    return encodeURIComponent(text);
  }

  function initNavigation() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const links = document.querySelector("[data-nav-links]");
    if (!toggle || !links) return;

    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    links.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function initActiveNav() {
    const page = document.body.dataset.page;
    document.querySelectorAll("[data-nav]").forEach((link) => {
      if (link.dataset.nav === page) link.classList.add("active");
    });
  }

  function initReveal() {
    const items = document.querySelectorAll(".fade-up");
    if (!items.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    items.forEach((item) => observer.observe(item));
  }

  function initContactForms() {
    document.querySelectorAll("[data-whatsapp-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const name = data.get("nombre") || "Cliente";
        const service = data.get("servicio") || "servicios de Red Matrix Solutions";
        const message = data.get("mensaje") || "Quiero recibir asesoria.";
        const text = `Hola, soy ${name}. Me interesa ${service}. ${message}`;
        window.open(`https://wa.me/${WHATSAPP}?text=${encode(text)}`, "_blank", "noopener");
      });
    });
  }

  function initCareerForms() {
    document.querySelectorAll("[data-career-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const name = data.get("nombre") || "Candidato";
        const phone = data.get("telefono") || "No especificado";
        const email = data.get("correo") || "No especificado";
        const city = data.get("ciudad") || "No especificada";
        const area = data.get("area") || "un área de Red Matrix Solutions";
        const availability = data.get("disponibilidad") || "No especificada";
        const experience = data.get("experiencia") || "No especificada";
        const portfolio = data.get("portafolio") || "No adjunto";
        const message = data.get("mensaje") || "Quiero postularme para trabajar con ustedes.";
        const text = `Hola, soy ${name}. Quiero postularme para ${area}. Teléfono: ${phone}. Correo: ${email}. Ciudad: ${city}. Disponibilidad: ${availability}. Experiencia: ${experience}. Portafolio o enlace: ${portfolio}. ${message}`;
        window.open(`https://wa.me/${WHATSAPP}?text=${encode(text)}`, "_blank", "noopener");
      });
    });
  }

  function initCareerModal() {
    const modal = document.querySelector("[data-career-modal]");
    const openers = document.querySelectorAll("[data-career-open]");
    if (!modal || !openers.length) return;

    const close = modal.querySelector("[data-career-close]");
    const firstField = modal.querySelector("input, textarea, button");

    function openModal() {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (firstField) firstField.focus();
    }

    function closeModal() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    openers.forEach((button) => button.addEventListener("click", openModal));
    if (close) close.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
  }

  function initTrustedClientModal() {
    const triggers = document.querySelectorAll("[data-client-logo]");
    if (!triggers.length) return;

    const modal = document.createElement("div");
    modal.className = "trusted-client-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Marca aliada");
    modal.innerHTML = `
      <div class="trusted-client-modal__box">
        <button class="trusted-client-modal__close" type="button" aria-label="Cerrar">x</button>
        <img src="" alt="">
        <h3 data-client-modal-name></h3>
        <p data-client-modal-description></p>
      </div>
    `;
    document.body.appendChild(modal);

    const image = modal.querySelector("img");
    const title = modal.querySelector("[data-client-modal-name]");
    const description = modal.querySelector("[data-client-modal-description]");
    const close = modal.querySelector(".trusted-client-modal__close");

    function open(trigger) {
      const name = trigger.dataset.clientName || "Marca aliada";
      image.src = trigger.dataset.clientLogo;
      image.alt = name;
      title.textContent = name;
      description.textContent = trigger.dataset.clientDescription || "Marca aliada de Red Matrix Solutions.";
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
      close.focus();
    }

    function closeModal() {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }

    triggers.forEach((trigger) => trigger.addEventListener("click", () => open(trigger)));
    close.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
  }

  function initPackageButtons() {
    document.querySelectorAll("[data-quote-package]").forEach((button) => {
      button.addEventListener("click", () => {
        const packageName = button.dataset.quotePackage;
        const price = button.dataset.price || "";
        const text = `Hola, quiero cotizar el ${packageName}${price ? ` (${price})` : ""}.`;
        window.open(`https://wa.me/${WHATSAPP}?text=${encode(text)}`, "_blank", "noopener");
      });
    });
  }

  function initServiceOfferModal() {
    const cards = document.querySelectorAll(".service-offer-card");
    if (!cards.length) return;

    const modal = document.createElement("div");
    modal.className = "service-offer-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Detalle del servicio");
    modal.innerHTML = `
      <div class="service-offer-modal__box">
        <button class="service-offer-modal__close" type="button" aria-label="Cerrar">×</button>
        <div class="service-offer-modal__head">
          <div data-service-modal-icon></div>
          <h3 data-service-modal-title></h3>
        </div>
        <div class="service-offer-modal__body" data-service-modal-body></div>
      </div>
    `;
    document.body.appendChild(modal);

    const close = modal.querySelector(".service-offer-modal__close");
    const title = modal.querySelector("[data-service-modal-title]");
    const iconSlot = modal.querySelector("[data-service-modal-icon]");
    const body = modal.querySelector("[data-service-modal-body]");

    function quote(button) {
      const packageName = button.dataset.quotePackage;
      const price = button.dataset.price || "";
      const text = `Hola, quiero cotizar el ${packageName}${price ? ` (${price})` : ""}.`;
      window.open(`https://wa.me/${WHATSAPP}?text=${encode(text)}`, "_blank", "noopener");
    }

    function open(card) {
      const summary = card.querySelector("summary");
      const sourceBody = card.querySelector(".service-offer-card__body");
      const sourceIcon = card.querySelector(".service-offer-icon");
      const sourceTitle = summary ? summary.querySelector("span:not(.service-offer-icon)") : null;
      title.textContent = sourceTitle ? sourceTitle.textContent : "Servicio";
      iconSlot.innerHTML = "";
      if (sourceIcon) iconSlot.appendChild(sourceIcon.cloneNode(true));
      body.innerHTML = sourceBody ? sourceBody.innerHTML : "";
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
      close.focus();
    }

    function closeModal() {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }

    cards.forEach((card) => {
      const summary = card.querySelector("summary");
      if (!summary) return;
      summary.addEventListener("click", (event) => {
        event.preventDefault();
        open(card);
      });
    });

    body.addEventListener("click", (event) => {
      const button = event.target.closest("[data-quote-package]");
      if (button) quote(button);
    });
    close.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
  }

  function initQrLightbox() {
    const triggers = document.querySelectorAll("[data-qr-fullscreen]");
    if (!triggers.length) return;

    const lightbox = document.createElement("div");
    lightbox.className = "qr-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "QR en pantalla completa");
    lightbox.innerHTML = `
      <div class="qr-lightbox__content">
        <div class="qr-lightbox__top">
          <strong>Escanea el QR para realizar tu pago</strong>
          <button class="qr-lightbox__close" type="button" aria-label="Cerrar QR">×</button>
        </div>
        <img src="" alt="QR ampliado">
      </div>
    `;
    document.body.appendChild(lightbox);

    const image = lightbox.querySelector("img");
    const close = lightbox.querySelector(".qr-lightbox__close");

    function openLightbox(src, alt) {
      image.src = src;
      image.alt = alt || "QR de pago ampliado";
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
      close.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const img = trigger.querySelector("img");
        openLightbox(trigger.dataset.qrFullscreen, img ? img.alt : "");
      });
    });

    close.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
    });
  }

  function initInstagramPreview() {
    const triggers = document.querySelectorAll("[data-instagram-preview]");
    if (!triggers.length) return;

    const modal = document.createElement("div");
    modal.className = "instagram-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Vista previa de Instagram");
    modal.innerHTML = `
      <div class="instagram-modal__box">
        <div class="instagram-modal__top">
          <h3 data-instagram-title></h3>
          <button class="instagram-modal__close" type="button" aria-label="Cerrar">×</button>
        </div>
        <p class="instagram-modal__description" data-instagram-description></p>
        <div class="instagram-modal__actions">
          <a class="btn btn-gold" href="#" target="_blank" rel="noopener" data-instagram-link>Quieres ver?</a>
          <button class="btn btn-outline" type="button" data-instagram-cancel>Ahora no</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const title = modal.querySelector("[data-instagram-title]");
    const description = modal.querySelector("[data-instagram-description]");
    const link = modal.querySelector("[data-instagram-link]");
    const close = modal.querySelector(".instagram-modal__close");
    const cancel = modal.querySelector("[data-instagram-cancel]");

    function open(trigger) {
      title.textContent = trigger.dataset.title || "Instagram";
      description.textContent = trigger.dataset.description || "";
      link.href = trigger.dataset.url || "#";
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
      link.focus();
    }

    function closeModal() {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => open(trigger));
    });
    close.addEventListener("click", closeModal);
    cancel.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
  }

  function initSocialDock() {
    if (document.querySelector(".social-dock")) return;

    const dock = document.createElement("nav");
    dock.className = "social-dock";
    dock.setAttribute("aria-label", "Redes sociales");
    dock.innerHTML = `
      <a href="https://www.instagram.com/redmatrixsolutions/" target="_blank" rel="noopener" aria-label="Instagram">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm4.2 3.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2Zm0 2A2.8 2.8 0 1 0 14.8 12 2.8 2.8 0 0 0 12 9.2Zm5.05-2.95a1.15 1.15 0 1 1-1.15 1.15 1.15 1.15 0 0 1 1.15-1.15Z"/></svg>
      </a>
      <a href="https://www.facebook.com/profile.php?id=61581120860151&locale=es_LA" target="_blank" rel="noopener" aria-label="Facebook">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8.6V6.8c0-.86.2-1.3 1.38-1.3H17V2.25A21.1 21.1 0 0 0 14.25 2C11.52 2 9.65 3.67 9.65 6.73V8.6H6.6v3.65h3.05V22H14v-9.75h2.93l.47-3.65H14Z"/></svg>
      </a>
      <a href="https://www.tiktok.com/@_julian_guerra_?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener" aria-label="TikTok">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 2c.25 2.33 1.55 3.72 3.9 3.88v3.44a7.2 7.2 0 0 1-3.82-1.08v6.58c0 3.35-2.05 6.3-5.45 6.98-4.7.93-8.61-2.75-8.18-7.23.37-3.77 3.85-6.45 7.62-5.84v3.58c-.55-.18-1.22-.18-1.88.06-1.25.45-2.09 1.7-1.96 3.03.18 1.77 1.93 2.94 3.6 2.38 1.25-.42 2.02-1.58 2.02-2.9V2h4.15Z"/></svg>
      </a>
      <a href="https://linktr.ee/RedMatrixSolutions?utm_source=linktree_profile_share&ltsid=a24e66bf-4e8d-4c56-98c3-1aeb7f580d1d" target="_blank" rel="noopener" aria-label="Linktree">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 14.5a3.8 3.8 0 0 1 0-5.37l2.32-2.32a3.8 3.8 0 0 1 5.38 0l.7.7-1.92 1.92-.7-.7a1.08 1.08 0 0 0-1.54 0L9.12 11.05a1.08 1.08 0 0 0 0 1.54l.7.7-1.92 1.92-.7-.71Zm2.9 2 1.92-1.92.7.7a1.08 1.08 0 0 0 1.54 0l2.32-2.32a1.08 1.08 0 0 0 0-1.54l-.7-.7 1.92-1.92.7.7a3.8 3.8 0 0 1 0 5.37l-2.32 2.32a3.8 3.8 0 0 1-5.38 0l-.7-.69Zm.18-5.02 4.24-4.24 1.7 1.7-4.24 4.24-1.7-1.7Z"/></svg>
      </a>
      <a href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2a9.92 9.92 0 0 0-8.53 15.04L2.4 22l5.08-1.07A9.96 9.96 0 1 0 12.04 2Zm0 2a7.96 7.96 0 0 1 6.78 12.12 7.93 7.93 0 0 1-9.53 2.95l-.35-.16-3.78.8.82-3.66-.2-.37A7.93 7.93 0 0 1 12.04 4Zm-3.2 3.82c-.18 0-.46.07-.7.34-.25.28-.92.9-.92 2.2s.94 2.56 1.07 2.73c.14.18 1.84 2.95 4.56 4.02 2.26.9 2.72.72 3.21.67.5-.04 1.6-.65 1.83-1.28.23-.62.23-1.16.16-1.28-.07-.12-.25-.19-.52-.32-.27-.14-1.6-.79-1.85-.88-.25-.09-.44-.14-.62.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.18-1.34-.81-.72-1.35-1.61-1.51-1.88-.16-.27-.02-.42.12-.56.12-.12.27-.32.4-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.13-.62-1.5-.85-2.04-.22-.54-.45-.46-.62-.47h-.39Z"/></svg>
      </a>
    `;
    document.body.appendChild(dock);
  }

  function setYear() {
    document.querySelectorAll("[data-year]").forEach((item) => {
      item.textContent = new Date().getFullYear();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initActiveNav();
    initReveal();
    initContactForms();
    initCareerForms();
    initCareerModal();
    initTrustedClientModal();
    initPackageButtons();
    initServiceOfferModal();
    initQrLightbox();
    initInstagramPreview();
    initSocialDock();
    setYear();
  });
})();









