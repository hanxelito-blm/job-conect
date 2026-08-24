// public/js/index.js

/**
 * Lógica modular para JobConnect
 * Arquitectura basada en separación de responsabilidades.
 */

// ==========================================
// CONSTANTES GLOBALES
// ==========================================
const API_AUTH_URL = 'https://dummyjson.com/auth/login';
const TOKEN_KEY = 'jobConnectToken';

// ==========================================
// GESTIÓN DEL DOM (UI)
// ==========================================
const DOMElements = {
    loginSection: document.getElementById('loginSection'),
    dashboardSection: document.getElementById('dashboardSection'),
    loginForm: document.getElementById('loginForm'),
    usernameInput: document.getElementById('username'),
    passwordInput: document.getElementById('password'),
    usernameError: document.getElementById('usernameError'),
    passwordError: document.getElementById('passwordError'),
    loginSubmitBtn: document.getElementById('loginSubmitBtn'),
    loginAlert: document.getElementById('loginAlert'),
    logoutBtn: document.getElementById('logoutBtn'),
    userWelcome: document.getElementById('userWelcome')
};

// ==========================================
// FUNCIONES PURAS Y UTILIDADES
// ==========================================

/**
 * Valida si un campo está vacío
 * @param {string} value - Valor a validar
 * @returns {boolean} - true si es válido (no vacío)
 */
const isNotEmpty = (value) => value.trim().length > 0;

/**
 * Limpia los mensajes de error en la UI
 */
const clearErrors = () => {
    DOMElements.usernameError.textContent = '';
    DOMElements.passwordError.textContent = '';
    DOMElements.loginAlert.classList.add('hidden');
    DOMElements.loginAlert.textContent = '';
};

/**
 * Muestra el estado de carga en el botón
 * @param {boolean} isLoading 
 */
const setLoadingState = (isLoading) => {
    const btnText = DOMElements.loginSubmitBtn.querySelector('.btn-text');
    const loader = DOMElements.loginSubmitBtn.querySelector('.loader');
    
    DOMElements.loginSubmitBtn.disabled = isLoading;
    
    if (isLoading) {
        btnText.textContent = 'Verificando...';
        loader.classList.remove('hidden');
    } else {
        btnText.textContent = 'Ingresar';
        loader.classList.add('hidden');
    }
};

/**
 * Alterna entre las vistas de Login y Dashboard
 */
const toggleViews = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (token) {
        DOMElements.loginSection.classList.add('hidden');
        DOMElements.dashboardSection.classList.remove('hidden');
        DOMElements.logoutBtn.classList.remove('hidden');
        
        // Simulación: Decodificaríamos el JWT para obtener el nombre, 
        // aquí ponemos uno genérico para la demostración.
        DOMElements.userWelcome.textContent = DOMElements.usernameInput.value || 'Miembro Corporativo';
    } else {
        DOMElements.loginSection.classList.remove('hidden');
        DOMElements.dashboardSection.classList.add('hidden');
        DOMElements.logoutBtn.classList.add('hidden');
    }
};

// ==========================================
// SERVICIOS (LÓGICA ASÍNCRONA)
// ==========================================

/**
 * Autentica al usuario contra la API
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<Object>} Datos del usuario y token
 */
async function authenticateUser(username, password) {
    try {
        const response = await fetch(API_AUTH_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error('Credenciales incorrectas');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

// ==========================================
// CONTROLADORES Y EVENTOS
// ==========================================

/**
 * Manejador del envío del formulario de login
 */
const handleLoginSubmit = async (event) => {
    event.preventDefault();
    clearErrors();

    const username = DOMElements.usernameInput.value;
    const password = DOMElements.passwordInput.value;

    // Validación temprana (Guard Clauses)
    let hasErrors = false;
    if (!isNotEmpty(username)) {
        DOMElements.usernameError.textContent = 'El usuario es requerido.';
        hasErrors = true;
    }
    if (!isNotEmpty(password)) {
        DOMElements.passwordError.textContent = 'La contraseña es requerida.';
        hasErrors = true;
    }

    if (hasErrors) return; // Detener ejecución si hay errores

    // Proceso asíncrono seguro
    try {
        setLoadingState(true);
        const data = await authenticateUser(username, password);
        
        // Guardar Token
        localStorage.setItem(TOKEN_KEY, data.token);
        
        // Actualizar UI
        DOMElements.loginForm.reset();
        toggleViews();

    } catch (error) {
        console.error('Error de autenticación:', error);
        DOMElements.loginAlert.textContent = `Error: ${error.message}`;
        DOMElements.loginAlert.classList.remove('hidden');
        DOMElements.loginAlert.classList.add('alert-error');
    } finally {
        setLoadingState(false);
    }
};

/**
 * Manejador de cierre de sesión
 */
const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    toggleViews();
};

// ==========================================
// INICIALIZACIÓN
// ==========================================

const initApp = () => {
    // Configurar Event Listeners
    DOMElements.loginForm.addEventListener('submit', handleLoginSubmit);
    DOMElements.logoutBtn.addEventListener('click', handleLogout);
    
    // Verificar estado inicial
    toggleViews();
};

// Iniciar la app cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp);
