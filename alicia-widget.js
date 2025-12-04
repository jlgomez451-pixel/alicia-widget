(function () {
    const widgetContainer = document.createElement("div");
    widgetContainer.id = "alicia-widget-container";

    widgetContainer.style.position = "fixed";
    widgetContainer.style.bottom = "20px";
    widgetContainer.style.right = "20px";
    widgetContainer.style.width = "340px";
    widgetContainer.style.height = "500px";
    widgetContainer.style.background = "#fff";
    widgetContainer.style.borderRadius = "12px";
    widgetContainer.style.boxShadow = "0 4px 25px rgba(0,0,0,0.25)";
    widgetContainer.style.zIndex = "999999";
    widgetContainer.style.display = "flex";
    widgetContainer.style.flexDirection = "column";
    widgetContainer.style.overflow = "hidden";

    document.body.appendChild(widgetContainer);

    widgetContainer.innerHTML = `
        <div style="background:black;color:white;padding:10px;font-size:16px;text-align:center;font-weight:bold">
            Alicia – Asistente IA
        </div>

        <div id="alicia-chat-box"
            style="flex:1;padding:10px;overflow-y:auto;background:white;font-size:14px;">
            <div style="background:black;color:white;padding:8px;border-radius:8px;margin-bottom:10px;">
                Hola 👋 Soy Alicia. ¿Quieres saber más acerca de los agentes de texto?
            </div>
        </div>

        <div style="padding:10px;background:#f1f1f1;display:flex;">
            <input id="alicia-input" type="text"
                placeholder="Escribe aquí..."
                style="flex:1;border-radius:8px;border:1px solid #ccc;padding:8px;">
            <button id="alicia-send"
                style="margin-left:10px;background:black;color:white;border:none;padding:8px 12px;border-radius:8px;cursor:pointer;">
                ➤
            </button>
        </div>
    `;

    const sendButton = document.getElementById("alicia-send");
    const input = document.getElementById("alicia-input");
    const chatBox = document.getElementById("alicia-chat-box");

    function sendMessage() {
        const text = input.value.trim();
        if (text === "") return;

        const userMsg = document.createElement("div");
        userMsg.style.cssText = "padding:6px 8px;margin:8px 0;background:#eaeaea;border-radius:6px;";
        userMsg.textContent = text;
        chatBox.appendChild(userMsg);
        chatBox.scrollTop = chatBox.scrollHeight;

        input.value = "";

        // Enviar a n8n
        fetch("https://n8n.thecrewsia.com/webhook/2ca2c7bd-cc2c-4df1-9c59-daf12bf4dc03/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        })
        .then(res => res.json())
        .then(data => {
            const botMsg = document.createElement("div");
            botMsg.style.cssText = "padding:6px 8px;margin:8px 0;background:black;color:white;border-radius:6px;";
            botMsg.textContent = data.reply || "Alicia está respondiendo...";
            chatBox.appendChild(botMsg);
            chatBox.scrollTop = chatBox.scrollHeight;
        })
        .catch(() => {
            const botMsg = document.createElement("div");
            botMsg.style.cssText = "padding:6px 8px;margin:8px 0;background:red;color:white;border-radius:6px;";
            botMsg.textContent = "Error al conectar con el servidor.";
            chatBox.appendChild(botMsg);
        });
    }

    sendButton.onclick = sendMessage;
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });
})();
