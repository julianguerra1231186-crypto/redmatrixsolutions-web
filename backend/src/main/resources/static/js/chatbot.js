(function () {
  const WHATSAPP = "573115243424";
  const fallbackServices = [
    {
      name: "Paquete Emprendedor",
      price: "$430.000 / mes",
      description: "Gestión estratégica de redes hasta 2 perfiles, 3 publicaciones mensuales, 3 piezas gráficas, optimización de perfiles, soporte por WhatsApp y reuniones quincenales."
    },
    {
      name: "Paquete Empresarial",
      price: "Desde $750.000 / mes",
      description: "8 a 12 piezas mensuales, estrategia por tipo de cliente, reporte mensual, capacitaciones y acompañamiento profesional."
    },
    {
      name: "Paquete Premium",
      price: "Desde $1.250.000 / mes",
      description: "16 a 20 piezas mensuales, estrategia avanzada, análisis constante, reuniones estratégicas, capacitaciones y opción de página web por $350.000 adicionales."
    }
  ];

  function readServicesFromPage() {
    const cards = Array.from(document.querySelectorAll("[data-service-card]"));
    if (!cards.length) return fallbackServices;
    return cards.map((card) => ({
      name: card.dataset.name,
      price: card.dataset.price,
      description: card.dataset.description
    }));
  }

  function waLink(text) {
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
  }

  function createBot() {
    const launcher = document.createElement("button");
    launcher.className = "chatbot-launch";
    launcher.type = "button";
    launcher.setAttribute("aria-label", "Abrir chat de Red Matrix Solutions");
    launcher.innerHTML = `
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
      </svg>
    `;

    const panel = document.createElement("section");
    panel.className = "chatbot-panel";
    panel.setAttribute("aria-label", "Chatbot Red Matrix Solutions");
    panel.innerHTML = `
      <div class="chatbot-head">
        <div>
          <strong>Asistente Red Matrix</strong>
          <span>Servicios, precios, pagos y contacto</span>
        </div>
        <button class="chatbot-close" type="button" aria-label="Cerrar chat">x</button>
      </div>
      <div class="chatbot-messages" data-chat-messages></div>
      <div>
        <div class="quick-replies">
          <button type="button" data-quick="servicios">Servicios</button>
          <button type="button" data-quick="precios">Precios</button>
          <button type="button" data-quick="pagos">Pagos</button>
          <button type="button" data-quick="asesor">Asesor</button>
        </div>
        <form class="chatbot-form" data-chat-form>
          <input name="message" autocomplete="off" placeholder="Escribe tu pregunta" aria-label="Mensaje">
          <button type="submit">Enviar</button>
        </form>
      </div>
    `;

    document.body.append(launcher, panel);

    const messages = panel.querySelector("[data-chat-messages]");
    const form = panel.querySelector("[data-chat-form]");
    const input = form.querySelector("input");
    const close = panel.querySelector(".chatbot-close");

    function addMessage(text, who) {
      const item = document.createElement("div");
      item.className = who === "user" ? "user-msg" : "bot-msg";
      item.innerHTML = text;
      messages.appendChild(item);
      messages.scrollTop = messages.scrollHeight;
    }

    function servicesSummary() {
      return readServicesFromPage()
        .map((service) => `<strong>${service.name}</strong>: ${service.price}. ${service.description}`)
        .join("<br><br>");
    }

    function answer(rawText) {
      const text = rawText.toLowerCase();
      if (text.includes("precio") || text.includes("cuanto") || text.includes("cuánto") || text.includes("paquete") || text.includes("servicio")) {
        return `Estos son los paquetes publicados en servicios.html:<br><br>${servicesSummary()}<br><br><a href="servicios.html" class="accent">Ver servicios completos</a>`;
      }
      if (text.includes("pago") || text.includes("qr") || text.includes("nequi") || text.includes("bancolombia") || text.includes("breb")) {
        return `Puedes pagar escaneando los QR en <a href="pagos.html" class="accent">pagos.html</a>. Tenemos QR de Nequi y BreB. Después de pagar, envía el comprobante por WhatsApp.`;
      }
      if (text.includes("whatsapp") || text.includes("asesor") || text.includes("contact") || text.includes("cotizar")) {
        return `Claro. Habla con un asesor aquí: <a href="${waLink("Hola, quiero hablar con un asesor de Red Matrix Solutions.")}" target="_blank" rel="noopener" class="accent">abrir WhatsApp</a>.`;
      }
      if (text.includes("ia") || text.includes("inteligencia") || text.includes("software") || text.includes("marketing")) {
        return "Trabajamos marketing digital, automatización con IA, sistemas de ventas, software web, estrategia de crecimiento y acompañamiento empresarial.";
      }
      return `Puedo ayudarte con servicios, paquetes, precios y pagos. Si necesitas una respuesta personalizada, te conecto con un asesor por <a href="${waLink("Hola, necesito asesoria personalizada.")}" target="_blank" rel="noopener" class="accent">WhatsApp</a>.`;
    }

    launcher.addEventListener("click", () => {
      panel.classList.toggle("open");
      if (panel.classList.contains("open") && !messages.children.length) {
        addMessage("Hola. Soy el asistente de Red Matrix Solutions. Puedo ayudarte con servicios, precios, pagos o contacto con un asesor.", "bot");
      }
      input.focus();
    });
    close.addEventListener("click", () => panel.classList.remove("open"));

    panel.querySelectorAll("[data-quick]").forEach((button) => {
      button.addEventListener("click", () => {
        const text = button.dataset.quick;
        addMessage(button.textContent, "user");
        addMessage(answer(text), "bot");
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = input.value.trim();
      if (!value) return;
      addMessage(value, "user");
      addMessage(answer(value), "bot");
      input.value = "";
    });
  }

  document.addEventListener("DOMContentLoaded", createBot);
})();






