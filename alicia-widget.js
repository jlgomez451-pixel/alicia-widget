(() => {
  const WIDGET_ID = "alicia-widget-container";

  if (document.getElementById(WIDGET_ID)) return;

  const style = document.createElement("style");
  style.innerHTML = `
    #${WIDGET_ID} {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: Arial, sans-serif;
    }

    /* Botón flotante */
    .alicia-bubble-button {
      width: 65px;
      height: 65px;
      border-radius: 50%;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(0,0,0,0.3);
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .alicia-bubble-button:hover {
      transform: scale(1.08);
    }

    /* Icono */
    .alicia-bubble-button img {
      width: 36px;
      height: 36px;
    }

    /* Panel del chat */
    .alicia-panel {
      width: 340px; /* ➜ ANCHO REDUCIDO */
      height: 460px;
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      margin-bottom: 12px;
    }

    .alicia-header {
      background: #000;
      color: white;
      padding: 10px;
      font-weight: bold;
      text-align: center;
      font-size: 15px;
    }

    .alicia-messages {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
      font-size: 14px;
    }

    .alicia-input-area {
      display: flex;
      border-top: 1px solid #ccc;
      padding: 8px;
      background: #fafafa;
    }

    .alicia-input-area input {
      flex: 1;
      padding: 8px;
      border-radius: 8px;
      border: 1px solid #ccc;
      font-size: 14px;
    }

    .alicia-input-area button {
      background: #000;
      border: none;
      color: white;
      padding: 0 14px;
      margin-left: 6px;
      border-radius: 8px;
      cursor: pointer;
      transition: 0.2s;
    }

    .alicia-input-area button:hover {
      opacity: 0.8;
    }
  `;
  document.head.appendChild(style);

  // Crear contenedor principal
  const container = document.createElement("div");
  container.id = WIDGET_ID;

  container.innerHTML = `
    <div class="alicia-panel" style="display:none;">
      <div class="alicia-header">Alicia – Asistente IA</div>
      <div class="alicia-messages"></div>
      <div class="alicia-input-area">
        <input type="text" placeholder="Escribe aquí…" />
        <button>➤</button>
      </div>
    </div>

    <div class="alicia-bubble-button">
      <img src="https://i.imgur.com/2PRy9wQ.png" />
    </div>
  `;

  document.body.appendChild(container);

  const panel = container.querySelector(".alicia-panel");
  const btn = container.querySelector(".alicia-bubble-button");
  const messages = container.querySelector(".alicia-messages");
  const input = container.querySelector(".alicia-input-area input");
  const sendBtn = container.querySelector(".alicia-input-area button");

  // Mostrar mensaje inicial
  const addMessage = (text, sender = "bot") => {
    const msg = document.createElement("div");
    msg.style.margin = "8px 0";
    msg.style.padding = "8px";
    msg.style.borderRadius = "8px";
    msg.style.background = sender === "bot" ? "#000" : "#e8e8e8";
    msg.style.color = sender === "bot" ? "white" : "black";
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  };

  addMessage("Hola 👋 Soy Alicia. ¿Quieres saber más acerca de los agentes de texto?");

  // Abrir/Cerrar chat
  btn.onclick = () => {
    panel.style.display = panel.style.display === "none" ? "flex" : "none";
  };

  // Enviar mensaje al webhook
  const sendMessage = () => {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, "user");
    input.value = "";

    fetch("https://n8n.thecrewsia.com/webhook/2ca2c7bd-cc2c-4df1-9c59-daf12bf4dc03/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    })
      .then((r) => r.json())
      .then((data) => {
        addMessage(data.reply || "Estoy procesando tu solicitud…");
      })
      .catch(() => {
        addMessage("Hubo un error, intenta nuevamente.");
      });
  };

  sendBtn.onclick = sendMessage;
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
})();
