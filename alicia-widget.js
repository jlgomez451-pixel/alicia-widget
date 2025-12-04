(function () {
  const webhook = "https://n8n.thecrewsia.com/webhook/2ca2c7bd-cc2c-4df1-9c59-daf12bf4dc03/chat";

  // ===== Estilos del widget (actualizados para tamaño fijo) =====
  const style = document.createElement("style");
  style.innerHTML = `
    #alicia-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 360px !important;
      max-width: 360px !important;
      height: 520px;
      font-family: Arial, sans-serif;
      z-index: 999999 !important;
    }

    #alicia-bubble {
      width: 65px;
      height: 65px;
      background: #000000;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      transition: 0.3s;
    }

    #alicia-bubble:hover {
      transform: scale(1.07);
    }

    #alicia-window {
      display: none;
      width: 360px !important;
      max-width: 360px !important;
      height: 520px;
      background: #ffffff;
      border-radius: 22px;
      overflow: hidden;
      box-shadow: 0 5px 20px rgba(0,0,0,0.35);
      flex-direction: column;
    }

    #alicia-header {
      background: #000000;
      color: white;
      padding: 16px;
      font-size: 17px;
      font-weight: bold;
      text-align: center;
    }

    #alicia-chat-box {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
    }

    .msg {
      margin: 5px 0;
      padding: 10px;
      border-radius: 10px;
      max-width: 85%;
      font-size: 14px;
      line-height: 1.3;
    }

    .user {
      background: #e9e9e9;
      margin-left: auto;
    }

    .bot {
      background: #000000;
      color: white;
      margin-right: auto;
    }

    #alicia-input-area {
      padding: 10px;
      display: flex;
      gap: 10px;
      border-top: 1px solid #ddd;
      background: #f7f7f7;
    }

    #alicia-input {
      flex: 1;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid #ccc;
    }

    #aliciaSend {
      background: #000000;
      color: white;
      border: none;
      padding: 0 16px;
      border-radius: 10px;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  // ===== Crear estructura del widget =====
  const widget = document.createElement("div");
  widget.id = "alicia-widget";
  widget.innerHTML = `
    <div id="alicia-bubble">
      <img src="https://i.imgur.com/3z1ZQMc.png" width="36" />
    </div>

    <div id="alicia-window">
      <div id="alicia-header">Alicia – Asistente IA</div>

      <div id="alicia-chat-box"></div>

      <div id="alicia-input-area">
        <input id="alicia-input" type="text" placeholder="Escribe aquí..." />
        <button id="aliciaSend">➤</button>
      </div>
    </div>
  `;
  document.body.appendChild(widget);

  // ===== Lógica =====
  const bubble = document.getElementById("alicia-bubble");
  const windowBox = document.getElementById("alicia-window");
  const chat = document.getElementById("alicia-chat-box");

  bubble.onclick = () => {
    windowBox.style.display = "flex";
    bubble.style.display = "none";

    // Mensaje inicial
    addMessage("Alicia", "Hola 👋 Soy Alicia. ¿Quieres saber más acerca de los agentes de texto?");
  };

  document.getElementById("aliciaSend").onclick = sendMsg;
  document.getElementById("alicia-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMsg();
  });

  function addMessage(sender, text) {
    const div = document.createElement("div");
    div.className = "msg " + (sender === "Yo" ? "user" : "bot");
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  // ===== Enviar mensaje al webhook =====
  function sendMsg() {
    const input = document.getElementById("alicia-input");
    const msg = input.value.trim();
    if (!msg) return;

    addMessage("Yo", msg);
    input.value = "";

    fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatInput: msg })
    })
      .then((r) => r.json())
      .then((data) => {
        const reply = data.reply || data.text || "No entendí eso 😊";
        addMessage("Alicia", reply);
      })
      .catch(() => {
        addMessage("Alicia", "Hubo un error al conectar con el servidor.");
      });
  }
})();
