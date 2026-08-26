// chatbot.js - Widget de Chat IA para JobConnect

const ICONS = {
    briefcase: '<svg class="chatbot-msg-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    file: '<svg class="chatbot-msg-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    calendar: '<svg class="chatbot-msg-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    users: '<svg class="chatbot-msg-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    check: '<svg class="chatbot-msg-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 1"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    building: '<svg class="chatbot-msg-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V7l9-4 9 4v14"/><path d="M9 21v-8h6v8"/><path d="M3 7h18"/></svg>',
    user: '<svg class="chatbot-msg-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    activity: '<svg class="chatbot-msg-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
    wave: '<svg class="chatbot-msg-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11l1.5-4.5a1.5 1.5 0 0 1 2.8-1l1.2 3.5"/><path d="M11 10l1.5-4.5a1.5 1.5 0 0 1 2.8-1L17 11"/><path d="M15 9.5l1-3a1.5 1.5 0 0 1 2.8-1L20 10v1a9 9 0 0 1-9 9h-1a9 9 0 0 1-9-9V9.5a1.5 1.5 0 0 1 2.8-1L7 11"/></svg>'
};

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
        const welcomeEl = document.createElement('div');
        welcomeEl.className = 'chatbot-message chatbot-message--bot';
        welcomeEl.innerHTML = `
            <div class="chatbot-message-avatar">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                </svg>
            </div>
            <div class="chatbot-message-content">
                ¡Hola! Bienvenido/a a <strong>JobConnect</strong>. Soy <strong>JobBot</strong>, tu asistente virtual. ¿En qué puedo ayudarte?<br><br>
                <div class="chatbot-suggestions">
                    <button class="chatbot-suggestion-btn" data-msg="Quiero ver las vacantes disponibles">${ICONS.briefcase} Ver vacantes</button>
                    <button class="chatbot-suggestion-btn" data-msg="Quiero ver mis postulaciones">${ICONS.file} Mis postulaciones</button>
                    <button class="chatbot-suggestion-btn" data-msg="Quiero agendar una entrevista">${ICONS.calendar} Agendar entrevista</button>
                    <button class="chatbot-suggestion-btn" data-msg="Quiero gestionar candidatos">${ICONS.users} Gestionar candidatos</button>
                    <button class="chatbot-suggestion-btn" data-msg="Quiero ver mis tareas pendientes">${ICONS.check} Mis tareas</button>
                    <button class="chatbot-suggestion-btn" data-msg="Quiero ver las empresas registradas">${ICONS.building} Empresas</button>
                </div>
            </div>
        `;
        document.getElementById('chatbotMessages').appendChild(welcomeEl);

        welcomeEl.querySelectorAll('.chatbot-suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const input = document.getElementById('chatbotInput');
                input.value = btn.dataset.msg;
                this.sendMessage();
            });
        });
    }

    getLocalResponse(message) {
        const msg = message.toLowerCase();

        const responses = [
            {
                keywords: ['vacante', 'vacantes', 'empleo', 'trabajo', 'puesto'],
                answer: `${ICONS.briefcase} Puedo ayudarte con vacantes. En **JobConnect** puedes:\n\n- Ver todas las vacantes activas en la sección **Vacantes**\n- Filtrar por empresa, categoría o ubicación\n- Postularte directamente desde la plataforma\n\n¿Te gustaría que te guíe hacia la página de vacantes?`
            },
            {
                keywords: ['postulacion', 'postulaciones', 'candidatura', 'aplicar', 'aplique'],
                answer: `${ICONS.file} Para ver tus postulaciones, ve a **Mis Postulaciones** desde el menú lateral. Allí podrás:\n\n- Seguir el estado de cada postulación (Pendiente, En revisión, Entrevista, Aceptada, Rechazada)\n- Ver detalles de cada proceso\n- Actualizar tu perfil para mejorar tus oportunidades`
            },
            {
                keywords: ['entrevista', 'entrevistas', 'agendar', 'cita', 'reunion'],
                answer: `${ICONS.calendar} Para agendar o ver entrevistas:\n\n- Ve a la sección **Entrevistas** desde el menú lateral\n- Puedes ver entrevistas programadas y pendientes\n- Los reclutadores pueden crear nuevas entrevistas desde ahí\n\n¿Necesitas ayuda con algo específico sobre entrevistas?`
            },
            {
                keywords: ['candidato', 'candidatos', 'talento', 'perfil'],
                answer: `${ICONS.users} En la sección **Candidatos** puedes:\n\n- Explorar el talento disponible en la plataforma\n- Ver perfiles profesionales detallados\n- Filtrar por habilidades, experiencia y más\n\nSi eres candidato, asegúrate de completar tu perfil en **Mi Perfil** para destacar.`
            },
            {
                keywords: ['tarea', 'tareas', 'pendiente', 'pendientes'],
                answer: `${ICONS.check} En **Mis Tareas** puedes gestionar tus actividades pendientes:\n\n- Crear nuevas tareas de reclutamiento\n- Marcar tareas como completadas\n- Organizar tu flujo de trabajo diario`
            },
            {
                keywords: ['empresa', 'empresas', 'compañia', 'compañia'],
                answer: `${ICONS.building} En la sección **Empresas** puedes:\n\n- Ver todas las empresas registradas en JobConnect\n- Explorar las vacantes de cada empresa\n- Conocer más sobre cada organización`
            },
            {
                keywords: ['perfil', 'mi perfil', 'datos', 'editar perfil', 'informacion personal'],
                answer: `${ICONS.user} Para gestionar tu perfil:\n\n- Ve a **Mi Perfil** desde el menú lateral\n- Actualiza tu información personal\n- Agrega experiencia, habilidades y educación\n- Un perfil completo aumenta tus oportunidades`
            },
            {
                keywords: ['seguimiento', 'tracking', 'pipeline', 'proceso'],
                answer: `${ICONS.activity} El **Pipeline de Seguimiento** te permite:\n\n- Ver el flujo completo de candidatos por etapa\n- Mover candidatos entre fases del proceso\n- Hacer seguimiento en tiempo real de cada postulación`
            },
            {
                keywords: ['hola', 'buenos dias', 'buenas tardes', 'hey', 'hi'],
                answer: `¡Hola! ${ICONS.wave} ¿Cómo puedo ayudarte? Puedo asistirte con:\n\n- ${ICONS.briefcase} **Vacantes** disponibles\n- ${ICONS.file} **Mis postulaciones**\n- ${ICONS.calendar} **Entrevistas**\n- ${ICONS.users} **Candidatos**\n- ${ICONS.check} **Tareas** pendientes\n- ${ICONS.building} **Empresas** registradas\n\nSolo pregúntame lo que necesites.`
            },
            {
                keywords: ['ayuda', 'help', 'como funciona', 'que puedes hacer', 'que puedes'],
                answer: `Soy **JobBot**, tu asistente virtual de **JobConnect**. Puedo ayudarte con:\n\n- ${ICONS.briefcase} Información sobre **vacantes** disponibles\n- ${ICONS.file} Consultar el estado de tus **postulaciones**\n- ${ICONS.calendar} Gestionar tus **entrevistas**\n- ${ICONS.users} Explorar **candidatos** y talento\n- ${ICONS.check} Revisar tus **tareas** pendientes\n- ${ICONS.building} Conocer las **empresas** registradas\n- ${ICONS.user} Gestionar tu **perfil**\n\n¿Sobre qué tema necesitas ayuda?`
            }
        ];

        for (const r of responses) {
            if (r.keywords.some(kw => msg.includes(kw))) {
                return r.answer;
            }
        }

        return `Entiendo tu consulta. Actualmente puedo ayudarte con:\n\n- ${ICONS.briefcase} **Vacantes** disponibles\n- ${ICONS.file} **Mis postulaciones**\n- ${ICONS.calendar} **Entrevistas**\n- ${ICONS.users} **Candidatos**\n- ${ICONS.check} **Tareas** pendientes\n- ${ICONS.building} **Empresas**\n\n¿Sobre cuál de estos temas te gustaría más información?`;
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
        const sendBtn = document.getElementById('chatbotSend');

        window.classList.add('chatbot-window--open');
        toggleBtn.classList.add('chatbot-toggle--active');
        iconOpen.style.display = 'none';
        iconClose.style.display = 'block';
        input.disabled = false;
        sendBtn.disabled = false;
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
            console.warn('API no disponible, usando respuestas locales:', error.message);
            const localReply = this.getLocalResponse(message);
            this.addMessage('bot', localReply);
            this.messages.push({ role: 'assistant', content: localReply });
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
