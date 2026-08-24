// public/js/index.js
import { api } from './services/apiService.js';
import { CandidatesModule } from './components/candidatesModule.js';
import { ApplicationsModule } from './components/applicationsModule.js';

const TOKEN_KEY = 'jobConnectToken';
const LOGS_KEY  = 'jobConnect_accessLogs';

// =====================================================
// DOM CACHE
// =====================================================
const $ = (id) => document.getElementById(id);

const DOM = {
    loginSection:    $('loginSection'),
    sidebar:         $('sidebar'),
    topbarNav:       $('topbarNav'),
    logoutBtn:       $('logoutBtn'),
    sidebarToggle:   $('sidebarToggle'),
    mainContent:     $('mainContent'),
    userWelcome:     $('userWelcome'),
    sidebarUsername: $('sidebarUsername'),
    avatarCircle:    $('avatarCircle'),
    loginForm:       $('loginForm'),
    usernameInput:   $('username'),
    passwordInput:   $('password'),
    loginSubmitBtn:  $('loginSubmitBtn'),
    loginAlert:      $('loginAlert'),
    logCount:        $('logCount'),
    statsLogs:       $('statsLogs'),
    logBadge:        $('logBadge'),
    navBtns:         document.querySelectorAll('.sidebar-btn'),
    viewSections:    document.querySelectorAll('.view-section'),
};

// =====================================================
// BITÁCORA DE ACCESOS
// =====================================================
function registerAccessLog(username) {
    const logs = JSON.parse(localStorage.getItem(LOGS_KEY)) || [];
    logs.unshift({
        username,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        ip: `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`
    });
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    updateLogCount(logs.length);
}

function updateLogCount(count) {
    if (DOM.logCount)  DOM.logCount.textContent  = count;
    if (DOM.statsLogs) DOM.statsLogs.textContent  = count;
}

// =====================================================
// AUTENTICACIÓN
// =====================================================
async function handleLoginSubmit(e) {
    e.preventDefault();
    DOM.loginAlert.classList.add('hidden');

    const username = DOM.usernameInput.value.trim();
    const password = DOM.passwordInput.value.trim();
    if (!username || !password) return;

    const btnText = DOM.loginSubmitBtn.querySelector('.btn-text');
    const loader  = DOM.loginSubmitBtn.querySelector('.loader');
    DOM.loginSubmitBtn.disabled = true;
    btnText.textContent = 'Verificando...';
    loader.classList.remove('hidden');

    try {
        const data = await api.post('/auth/login', { username, password });
        localStorage.setItem(TOKEN_KEY, data.token);
        registerAccessLog(username);
        DOM.loginForm.reset();
        checkAuthAndRoute();
    } catch (err) {
        DOM.loginAlert.textContent = err.message || 'Credenciales incorrectas';
        DOM.loginAlert.classList.remove('hidden');
        DOM.loginAlert.classList.add('alert-error');
    } finally {
        DOM.loginSubmitBtn.disabled = false;
        btnText.textContent = 'Ingresar';
        loader.classList.add('hidden');
    }
}

function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    checkAuthAndRoute();
}

// =====================================================
// SIDEBAR TOGGLE
// =====================================================
function handleSidebarToggle() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        DOM.sidebar.classList.toggle('open');
    } else {
        DOM.sidebar.classList.toggle('collapsed');
        DOM.mainContent.classList.toggle('full-width');
    }
}

// =====================================================
// ENRUTAMIENTO
// =====================================================
function checkAuthAndRoute() {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
        DOM.loginSection.classList.add('hidden');
        DOM.sidebar.classList.remove('hidden');
        DOM.topbarNav.classList.remove('hidden');

        const logs = JSON.parse(localStorage.getItem(LOGS_KEY)) || [];
        const username = logs[0]?.username || 'Usuario';

        DOM.userWelcome.textContent       = username;
        DOM.sidebarUsername.textContent   = username;
        DOM.avatarCircle.textContent      = username.charAt(0).toUpperCase();
        updateLogCount(logs.length);

        navigateTo('dashboardSection');
    } else {
        // No autenticado
        DOM.loginSection.classList.remove('hidden');
        DOM.sidebar.classList.add('hidden');
        DOM.topbarNav.classList.add('hidden');
        DOM.viewSections.forEach(s => s.classList.add('hidden'));
        DOM.mainContent.classList.remove('full-width');
        // Sin sidebar visible el main no necesita margen
        DOM.mainContent.style.marginLeft = '0';
    }
}

function navigateTo(targetId) {
    // Activar botón del sidebar
    DOM.navBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.target === targetId);
    });

    // Mostrar vista
    DOM.viewSections.forEach(sec => {
        sec.classList.toggle('hidden', sec.id !== targetId);
    });

    // Resetear marginLeft (en caso de que se haya limpiado en logout)
    DOM.mainContent.style.marginLeft = '';

    // Cargar datos de módulos al navegar
    if (targetId === 'candidatesSection')   CandidatesModule.loadData();
    if (targetId === 'applicationsSection') ApplicationsModule.loadData();

    // Cerrar sidebar en mobile al navegar
    if (window.innerWidth <= 768) DOM.sidebar.classList.remove('open');
}

// =====================================================
// INIT
// =====================================================
function initApp() {
    DOM.loginForm.addEventListener('submit', handleLoginSubmit);
    DOM.logoutBtn.addEventListener('click', handleLogout);
    DOM.sidebarToggle.addEventListener('click', handleSidebarToggle);

    DOM.navBtns.forEach(btn => {
        btn.addEventListener('click', () => navigateTo(btn.dataset.target));
    });

    CandidatesModule.init();
    ApplicationsModule.init();

    checkAuthAndRoute();
}

document.addEventListener('DOMContentLoaded', initApp);
