// chatbot.js - Widget de Chat IA para JobConnect

class JobConnectChatbot {
    constructor() {
        this.messages = [];
        this.isOpen = false;
        this.isLoading = false;
        this.init();
    }

    init() {
        this.createWidget();
        this.bindEvents();
        this.addWelcomeMessage();
    }

    createWidget() {
        // Contenedor principal del chatbot
        this.container = document.createElement('div');
        this.container.id = 'jobconnect-chatbot';
        this.container.innerHTML = `
            <!-- Botón flotante -->
            <button class="chatbot-toggle" id="chatbotToggle" aria-label="Abrir chat de ayuda">
                <svg class="chatbot-icon-open" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <svg class="chatbot-icon-close" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>

            <!-- Ventana del chat -->
            <div class="chatbot-window" id="chatbotWindow">
                <!-- Header -->
                <div class="chatbot-header">
                    <div class="chatbot-header-info">
                        <div class="chatbot-avatar">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                <path d="M2 17l10 5 10-5"/>
                                <path d="M2 12l10 5 10-5"/>
                            </svg>
                        </div>
                        <div>
                            <h3 class="chatbot-title">JobBot</h3>
                            <span class="chatbot-status">Asistente Virtual</span>
                        </div>
                    </div>
                    <button class="chatbot-close" id="chatbotClose" aria-label="Cerrar chat">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                <!-- Mensajes -->
                <div class="chatbot-messages" id="chatbotMessages">
                    <!-- Los mensajes se insertan aquí -->
                </div>

                <!-- Input -->
                <div class="chatbot-input-container">
                    <form class="chatbot-form" id="chatbotForm">
                        <input 
                            type="text" 
                            class="chatbot-input" 
                            id="chatbotInput" 
                            placeholder="Escribe tu mensaje..." 
                            autocomplete="off"
                            disabled
                        >
                        <button type="submit" class="chatbot-send" id="chatbotSend" disabled aria-label="Enviar mensaje">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"/>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(this.container);
    }

    bindEvents() {
        const toggle = document.getElementById('chatbotToggle');
        const close = document.getElementById('chatbotClose');
        const form = document.getElementById('chatbotForm');
        const input = document.getElementById('chatbotInput');

        toggle.addEventListener('click', () => this.toggleChat());
        close.addEventListener('click', () => this.closeChat());
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
            }
        });
    }

    addWelcomeMessage() {
        this.addMessage(
            'bot',
            '¡Hola! Bienvenido/a a **JobConnect**. Soy **JobBot**, tu asistente virtual. ¿En qué puedo ayudarte hoy?'
        );
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.isOpen = true;
        const window = document.getElementById('chatbotWindow');
        const toggleBtn = document.getElementById('chatbotToggle');
        const iconOpen = toggleBtn.querySelector('.chatbot-icon-open');
        const iconClose = toggleBtn.querySelector('.chatbot-icon-close');
        const input = document.getElementById('chatbotInput');

        window.classList.add('chatbot-window--open');
        toggleBtn.classList.add('chatbot-toggle--active');
        iconOpen.style.display = 'none';
        iconClose.style.display = 'block';
        input.disabled = false;
        input.focus();
    }

    closeChat() {
        this.isOpen = false;
        const window = document.getElementById('chatbotWindow');
        const toggleBtn = document.getElementById('chatbotToggle');
        const iconOpen = toggleBtn.querySelector('.chatbot-icon-open');
        const iconClose = toggleBtn.querySelector('.chatbot-icon-close');

        window.classList.remove('chatbot-window--open');
        toggleBtn.classList.remove('chatbot-toggle--active');
        iconOpen.style.display = 'block';
        iconClose.style.display = 'none';
    }

    async sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();

        if (!message || this.isLoading) return;

        // Agregar mensaje del usuario
        this.addMessage('user', message);
        this.messages.push({ role: 'user', content: message });

        input.value = '';
        this.setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: this.messages }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al obtener respuesta');
            }

            // Agregar respuesta del bot
            this.addMessage('bot', data.message);
            this.messages.push({ role: 'assistant', content: data.message });
        } catch (error) {
            console.error('Error:', error);
            this.addMessage(
                'bot',
                'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo o déjame tu correo electrónico para que un asesor te contacte.'
            );
        } finally {
            this.setLoading(false);
        }
    }

    addMessage(type, content) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageEl = document.createElement('div');
        messageEl.className = `chatbot-message chatbot-message--${type}`;

        const avatar = type === 'bot'
            ? `<div class="chatbot-message-avatar">
                   <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                       <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                       <path d="M2 17l10 5 10-5"/>
                       <path d="M2 12l10 5 10-5"/>
                   </svg>
               </div>`
            : '';

        // Convertir markdown básico a HTML
        const formattedContent = this.formatMessage(content);

        messageEl.innerHTML = `
            ${avatar}
            <div class="chatbot-message-content">${formattedContent}</div>
        `;

        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    formatMessage(text) {
        // Negritas: **texto**
        let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Itálicas: *texto*
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Listas con guiones
        formatted = formatted.replace(/^- (.+)$/gm, '<li>$1</li>');
        formatted = formatted.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
        // Saltos de línea
        formatted = formatted.replace(/\n/g, '<br>');
        return formatted;
    }

    setLoading(loading) {
        this.isLoading = loading;
        const input = document.getElementById('chatbotInput');
        const sendBtn = document.getElementById('chatbotSend');

        input.disabled = loading;
        sendBtn.disabled = loading;

        if (loading) {
            input.placeholder = 'JobBot está pensando...';
            this.addTypingIndicator();
        } else {
            input.placeholder = 'Escribe tu mensaje...';
            this.removeTypingIndicator();
            input.focus();
        }
    }

    addTypingIndicator() {
        const messagesContainer = document.getElementById('chatbotMessages');
        const typingEl = document.createElement('div');
        typingEl.className = 'chatbot-message chatbot-message--bot chatbot-typing';
        typingEl.id = 'chatbotTyping';
        typingEl.innerHTML = `
            <div class="chatbot-message-avatar">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                </svg>
            </div>
            <div class="chatbot-message-content">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        messagesContainer.appendChild(typingEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    removeTypingIndicator() {
        const typing = document.getElementById('chatbotTyping');
        if (typing) typing.remove();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.jobConnectChatbot = new JobConnectChatbot();
});
