(function () {
    // Crear contenedor del widget
    const widgetContainer = document.createElement("div");
    widgetContainer.id = "alicia-widget-container";

    widgetContainer.innerHTML = `
        <style>
            #alicia-widget-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 999999;
                font-family: Arial, sans-serif;
            }

            #alicia-widget {
                width: 360px;
                height: 420px;
                background: #ffffff;
                border-radius: 15px;
                box-shadow: 0 0 20px rgba(0,0,0,0.25);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            #alicia-header {
                background: #000;
                color: white;
                padding: 12px;
                font-weight: bold;
                text-align: center;
                font-size: 16px;
            }

            #alicia-messages {
                flex: 1;
                padding: 12px;
                overflow-y: auto;
                background: #f5f5f5;
            }

            .alicia-msg {
                background: #000000;
                color: #ffffff;
                padding: 8px 12px;
                border-radius: 10px;
                margin-bottom: 10px;
                display: inline-block;
                max-width: 85%;
                font-size: 14px;
            }

            #alicia-input-area {
                padding: 10px;
                background: #ffffff;
                display: flex;
                border-top: 1px solid #ddd;
            }

            #alicia-input {
                flex: 1;
                padding: 10px;
                border-radius: 10px;
                border: 1px solid #ccc;
                outline: none;
            }

            #alicia-send {
                width: 45px;
                height: 45px;
                background: black;
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 10px;
                margin-left: 8px;
                cursor: pointer;
            }

            /* Botón flotante */
            #alicia-open-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: #000000;
                color: white;
                font-size: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                z-index: 999999;
                box-shadow: 0 0 15px rgba(0,0,0,0.3);
            }

            #alicia-widget { display: none; }
        </style>

        <div id="alicia-open-btn">💬</div>

        <div id="alicia-widget">
            <div id="alicia-header">Alicia – Asistente IA</div>
            <div id="alicia-messages">
                <div class="alicia-msg">Hola 👋 Soy Alicia. ¿Quieres saber más acerca de los agentes de texto?</div>
            </div>

            <div id="alicia-input-area">
                <input id="alicia-input" type="text" placeholder="Escribe aquí..." />
                <div id="alicia-send">➤</div>
            </div>
        </div>
    `;

    document.body.appendChild(widgetContainer);

    // Abrir/Cerrar widget
    const widget = document.getElementById("alicia-widget");
    const btn = document.getElementById("alicia-open-btn");

    btn.onclick = () => {
        widget.style.display = widget.style.display === "none" ? "flex" : "none";
    };

    // Enviar mensajes a n8n
    const sendBtn = document.getElementById("alicia-send");
    const input = document.getElementById("alicia-input");
    const msgContainer = document.getElementById("alicia-messages");

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // Mostrar mensaje del usuario
        const userMsg = document.createElement("div");
        userMsg.className = "alicia-msg";
        userMsg.style.background = "#333";
        userMsg.textContent = text;
        msgContainer.appendChild(userMsg);

        input.value = "";

        // Enviar a webhook
        fetch("https://n8n.thecrewsia.com/webhook/2ca2c7bd-cc2c-4df1-9c59-daf12bf4dc03/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        })
            .then((res) => res.json())
            .then((data) => {
                const botMsg = document.createElement("div");
                botMsg.className = "alicia-msg";
                botMsg.textContent = data.reply || "Gracias por tu mensaje.";
                msgContainer.appendChild(botMsg);
            });
    }

    sendBtn.onclick = sendMessage;
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });
})();
