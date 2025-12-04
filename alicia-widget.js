// ---------- CONFIGURACIÓN ----------
const WEBHOOK_URL = "https://n8n.thecrewsia.com/webhook/2ca2c7bd-cc2c-4df1-9c59-daf12bf4dc03/chat";
const primaryColor = "#000000";
const accentColor = "#ffffff";
const bubbleColor = "#000000";

// ---------- ESTILOS DINÁMICOS ----------
const style = document.createElement("style");
style.innerHTML = `
  #alicia-widget-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 350px;
    height: 420px;
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.25);
    display: none;
    flex-direction: column;
    overflow: hidden;
    z-index: 999999;
  }

  #alicia-header {
    background: ${primaryColor};
    color: white;
    font-weight: bold;
    padding: 12px;
    text-align: center;
    font-size: 16px;
  }

  #alicia-messages {
    flex: 1;
    padding: 12px;
    overflow-y: auto;
    font-size: 14px;
  }

  #alicia-input-area {
    display: flex;
    padding: 10px;
    border-top: 1px solid #ddd;
    background: #fff;
  }

  #alicia-input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
  }

  #alicia-send-btn {
    background: ${primaryColor};
    border: none;
    color: white;
    padding: 8px 12px;
    margin-left: 8px;
    border-radius: 8px;
    cursor: pointer;
  }

  #alicia-bubble {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 65px;
    height: 65px;
    background: ${bubbleColor};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(0,0,0,0.25);
    z-index: 999999;
  }

  #alicia-bubble img {
    width: 32px;
    height: 32px;
  }
`;
document.head.appendChild(style);

// ---------- CREAR ELEMENTOS ----------
const container = document.createElement("div");
container.id = "alicia-widget-container";

container.innerHTML = `
  <div id="alicia-header">Alicia – Asistente IA</div>
  <div id="alicia-messages">
      <div><strong>Alicia:</strong> Hola 👋 Soy Alicia. ¿Quieres saber más acerca de los agentes de texto?</div>
  </div>
  <div id="alicia-input-area">
      <input id="alicia-input" type="text" placeholder="Escribe aquí...">
      <button id="alicia-send-btn">➤</button>
  </div>
`;

document.body.appendChild(container);

// ---------- BURBUJA ----------
const bubble = document.createElement("div");
bubble.id = "alicia-bubble";
bubble.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/134/134914.png">`;
document.body.appendChild(bubble);

// ---------- LOGICA ----------
bubble.addEventListener("click", () => {
  container.style.display = "flex";
  bubble.style.display = "none";
});

document.getElementById("alicia-send-btn").addEventListener("click", sendMessage);
document.getElementById("alicia-input").addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const input = document.getElementById("alicia-input");
  const text = input.value.trim();
  if (!text) return;

  addMessage("Tú", text);
  input.value = "";
  
  fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  })
  .then(res => res.json())
  .then(data => {
    addMessage("Alicia", data.reply || "Lo estoy procesando...");
  })
  .catch(() => addMessage("Alicia", "Hubo un error, intenta nuevamente."));
}

function addMessage(sender, text) {
  const msgBox = document.getElementById("alicia-messages");
  msgBox.innerHTML += `<div><strong>${sender}:</strong> ${text}</div>`;
  msgBox.scrollTop = msgBox.scrollHeight;
}
