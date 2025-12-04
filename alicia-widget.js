// Crear el contenedor flotante
const widgetContainer = document.createElement("div");
widgetContainer.id = "alicia-widget-container";
widgetContainer.innerHTML = `
  <div id="alicia-bubble">
    <img src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png" width="32" />
  </div>

  <div id="alicia-window" class="hidden">
    <div id="alicia-header">Alicia – Agente IA</div>
    <div id="alicia-messages"></div>

    <div id="alicia-input-area">
      <input id="alicia-input" placeholder="Escribe aquí..." />
      <button id="alicia-send">➤</button>
    </div>
  </div>
`;
document.body.appendChild(widgetContainer);

// Estilos del widget
const style = document.createElement("style");
style.textContent = `
  #alicia-widget-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999999;
    font-family: Arial, sans-serif;
  }

  /* Burbuja negra como estaba antes */
  #alicia-bubble {
    width: 65px;
    height: 65px;
    border-radius: 50%;
    background: #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.25);
  }
  #alicia-bubble img {
    width: 32px;
    height: 32px;
  }

  /* Ventana del chat */
  #alicia-window {
    width: 330px;
    height: 450px;
    background: #ffffff;
    border-radius: 14px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
  }
  .hidden { display: none; }

  /* Cabecera negra */
  #alicia-header {
    background: #000000;
    color: white;
    padding: 12px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 14px 14px 0 0;
  }

  #alicia-messages {
    flex: 1;
    padding: 12px;
    overflow-y: auto;
  }

  .msg {
    margin-bottom: 10px;
    padding: 10px;
    background: #e8e8e8;
    border-radius: 8px;
    max-width: 85%;
  }

  .me {
    background: #ffe27c; /* amarillo suave similar al botón */
    margin-left: auto;
  }

  #alicia-input-area {
    display: flex;
    padding: 10px;
    border-top: 1px solid #ddd;
  }

  #alicia-input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }

  #alicia-send {
    margin-left: 6px;
    padding: 8px 12px;
    background: #000000;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
`;
document.head.appendChild(style);

// Alternar ventana del chat
document.getElementById("alicia-bubble").onclick = () => {
  document.getElementById("alicia-window").classList.toggle("hidden");
};

// Función para agregar mensajes
function addMessage(sender, text) {
  const box = document.getElementById("alicia-messages");
  const div = document.createElement("div");

  div.className = "msg " + (sender === "Yo" ? "me" : "");
  div.textContent = text;

  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

// Enviar mensaje al webhook
document.getElementById("alicia-send").onclick = () => {
  const input = document.getElementById("alicia-input");
  const msg = input.value.trim();
  if (!msg) return;

  addMessage("Yo", msg);
  input.value = "";

  fetch("https://n8n.thecrewsia.com/webhook/2ca2c7bd-cc2c-4df1-9c59-daf12bf4dc03/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatInput: msg })
  })
    .then(r => r.json())
    .then(data => {
      addMessage("Alicia", data.reply || "No entendí 🤖");
    })
    .catch(() => addMessage("Alicia", "Hubo un error al conectar con el servidor 😕"));
};
