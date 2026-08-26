// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar OpenAI para usar OpenRouter
const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
});

// Middleware para parsing JSON
app.use(express.json());

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// System prompt del chatbot JobConnect
const SYSTEM_PROMPT = `Eres JobBot, el asistente virtual oficial de JobConnect. Tu objetivo principal es ofrecer una atención al cliente impecable, profesional, eficiente y orientada a resolver las necesidades del usuario en la primera interacción.

**Tono de Voz y Estilo:**
- Profesional y cercano: Mantén un lenguaje formal pero accesible, educado, empático y claro.
- Conciso: Da respuestas directas a lo que el usuario pregunta. Evita textos excesivamente largos o redundantes.
- Estructurado: Utiliza viñetas, negritas y listas breves para facilitar la lectura de la información.

**Reglas de Funcionamiento:**
1. **Conocimiento del Negocio:** Respondes basándote estrictamente en los productos, servicios y políticas de JobConnect.
2. **JobConnect** es una plataforma de gestión de talento que ofrece:
   - Gestión de candidatos y perfiles profesionales
   - Publicación y administración de vacantes de empleo
   - Seguimiento de postulaciones y candidaturas
   - Programación de entrevistas
   - Gestión de tareas para el equipo de reclutamiento
   - Pipeline de seguimiento de candidatos
   - Soporte para múltiples roles: Candidato, Empresa, Reclutador, Administrador
3. **Derivación y Casos Complejos:** Si no tienes la respuesta a una pregunta específica o el usuario requiere atención humana, di exactamente: "Con gusto puedo conectar tu caso con un asesor. Por favor, déjame tu correo electrónico o número de teléfono para que se pongan en contacto contigo a la brevedad."
4. **Manejo de Incertidumbre:** Nunca inventes información, datos técnicos, precios ni promociones. Si desconoces un dato, indícalo de manera profesional.
5. **Objetivo de Conversación:** Cuando sea oportuno, guía al usuario a realizar una acción útil (agendar una cita, ver un catálogo, suscribirse o ir al formulario de contacto).

**Mensaje de Bienvenida:**
"¡Hola! Bienvenido/a a JobConnect. Soy JobBot, tu asistente virtual. ¿En qué puedo ayudarte hoy?"`;

// API Endpoint - Chat con IA
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Se requiere un array de mensajes' });
        }

        const completion = await openai.chat.completions.create({
            model: 'openai/gpt-3.5-turbo',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...messages,
            ],
            max_tokens: 1000,
            temperature: 0.7,
        });

        const assistantMessage = completion.choices[0].message.content;

        res.json({
            message: assistantMessage,
            usage: completion.usage,
        });
    } catch (error) {
        console.error('Error en /api/chat:', error.message);
        res.status(500).json({
            error: 'Error al procesar tu mensaje. Por favor, intenta de nuevo.',
        });
    }
});

const pagesDir = path.join(__dirname, 'public', 'pages');

// Ruta raíz → Landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(pagesDir, 'landing.html'));
});

// Rutas de páginas
app.get('/landing',    (req, res) => res.sendFile(path.join(pagesDir, 'landing.html')));
app.get('/login',      (req, res) => res.sendFile(path.join(pagesDir, 'login.html')));
app.get('/dashboard',  (req, res) => res.sendFile(path.join(pagesDir, 'dashboard.html')));
app.get('/candidates', (req, res) => res.sendFile(path.join(pagesDir, 'candidates.html')));
app.get('/vacancies',  (req, res) => res.sendFile(path.join(pagesDir, 'vacancies.html')));
app.get('/companies',  (req, res) => res.sendFile(path.join(pagesDir, 'companies.html')));
app.get('/applications',(req, res) => res.sendFile(path.join(pagesDir, 'applications.html')));
app.get('/interviews', (req, res) => res.sendFile(path.join(pagesDir, 'interviews.html')));
app.get('/tasks',      (req, res) => res.sendFile(path.join(pagesDir, 'tasks.html')));
app.get('/tracking',   (req, res) => res.sendFile(path.join(pagesDir, 'tracking.html')));
app.get('/profile',    (req, res) => res.sendFile(path.join(pagesDir, 'profile.html')));
app.get('/my-applications', (req, res) => res.sendFile(path.join(pagesDir, 'my-applications.html')));

// Fallback: landing page for unmatched routes
app.use((req, res) => {
    res.sendFile(path.join(pagesDir, 'landing.html'));
});

app.listen(PORT, () => {
    console.log(`✅ JobConnect corriendo en http://localhost:${PORT}`);
});
