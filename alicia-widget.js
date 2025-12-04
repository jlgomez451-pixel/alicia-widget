/* --- WIDGET ALICIA versión completa --- */
document.addEventListener("DOMContentLoaded", () => {

  const webhook = "https://n8n.thecrewsia.com/webhook/2ca2c7bd-cc2c-4df1-9c59-daf12bf4dc03/chat";

  // Crear botón flotante
  const btn = document.createElement("div");
  btn.style.position = "fixed";
  btn.style.bottom = "20px";
  btn.style.right = "20px";
  btn.style.width = "62px";
  btn.style.height = "62px";
  btn.style.borderRadius = "50%";
  btn.style.background = "#000";
  btn.style.display = "flex";
  btn.style.alignItems = "center";
  btn.style.justifyContent = "center";
  btn.style.cursor = "pointer";
  btn.style.zIndex = "999999";

  btn.innerHTML = `
    <img src="https://cdn-icons-png.flaticon.com/512/1084/1084658.png"
         style="width:40px;height:40px;border-radius:50%">
  `;

  document.body.appendChild(btn);

  // Crear panel de chat
  const panel = document.createElement("div");
  panel.style.position = "fixed";
  panel.style.bottom = "100px";
  panel.style.right = "20px";
  panel.style.width = "330px";
  panel.style.height = "470px";
  panel.style.borderRadius = "14px";
  panel.style.background = "#fff";
  panel.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
  panel.style.display = "none";
  panel.style.flexDirection = "column";
  panel.style.overflow = "hidden";
  panel.style.zIndex = "999999";

  panel.innerHTML = `
    <div style="background:#000;color:#fff;padding:12px;font-size:16px;font-weight:bold">
      Chat con Alicia
    </div>
    <div id="aliciaMessages" style="flex:1;padding:12px;overflow-y:auto;font-size:14px;color:#333"></div>
    <div style="padding:10px;display:flex;gap:6px;border-top:1px solid #ddd">
      <input id="aliciaInput" type="text" placeholder="Escribe aquí..."
        style="flex:1;padding:8px;border:1px solid #ccc;border-radius:8px">
      <button id="aliciaSend"
        style="background:#000;color:#fff;padding:8px 14px;border-radius:8px;border:none;cursor:pointer">
        ➤
      </button>
    </div>
  `;

  document.body.appendChild(panel);

  // Abrir / cerrar
  btn.onclick = () => {
    panel.style.display = panel.style.display === "none" ? "flex" : "none";

    // Mensaje inicial
    if (!panel.dataset.loaded) {
      panel.dataset.loaded = "true";
      addMessage("Alicia", "Hola 👋 Soy Alicia. ¿Quieres saber más acerca de los agentes de texto?");
    }
  };

  // Añadir mensaje al panel
  function addMessage(from, text) {
    const box = document.getElementById("aliciaMessages");
    const bubble = document.createElement("div");
    bubble.style.margin = "8px 0";
    bubble.style.padding = "8px 10px";
    bubble.style.borderRadius = "10px";
    bubble.style.maxWidth = "80%";

    if (from === "Alicia") {
      bubble.style.background = "#f1f1f1";
      bubble.style.alignSelf = "flex-start";
    } else {
      bubble.style.background = "#000";
      bubble.style.color = "#fff";
      bubble.style.alignSelf = "flex-end";
    }

    bubble.textContent = text;
    box.appendChild(bubble);
    box.scrollTop = box.scrollHeight;
  }

  // Enviar
  document.getElementById("aliciaSend").onclick = sendMsg;

  function sendMsg() {
    const input = document.getElementById("aliciaInput");
    const msg = input.value.trim();
    if (!msg) return;

    addMessage("Yo", msg);
    input.value = "";

    fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatInput: msg })
    })
      .then(res => res.json())
      .then(data => {
        const reply = data.reply || data.text || "No entendí eso 🤖";
        addMessage("Alicia", reply);
      })
      .catch(() => addMessage("Alicia", "Error de conexión 😔"));
  }
});
