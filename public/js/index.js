// public/js/index.js
import { api } from './services/apiService.js';
import { Toast } from './services/toastService.js';
import { CandidatesModule } from './components/candidatesModule.js';
import { ApplicationsModule } from './components/applicationsModule.js';
import { CompaniesModule } from './components/companiesModule.js';
import { DashboardModule } from './components/dashboardModule.js';
import { InterviewsModule } from './components/interviewsModule.js';
import { LoginAnimation } from './components/loginAnimation.js';
import { TasksModule } from './components/tasksModule.js';
import { TrackingModule } from './components/trackingModule.js';
import { ThemeModule, LangModule } from './components/themeLanguage.js';
import { AccessibilityModule } from './components/accessibilityModule.js';
import { VacanciesModule } from './components/vacanciesModule.js';
import { TourModule } from './components/tourModule.js';


const TOKEN_KEY = 'jobConnectToken';
const LOGS_KEY  = 'jobConnect_accessLogs';

// =====================================================
// DOM CACHE
// =====================================================
const $ = (id) => document.getElementById(id);

const DOM = {
    landingSection:  $('landingSection'),
    landingEnterBtn: $('landingEnterBtn'),
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
    if (!username || !password) {
        Toast.show('Por favor ingresa usuario y contraseña.', 'error');
        return;
    }

    const btnText = DOM.loginSubmitBtn.querySelector('.btn-text');
    const loader  = DOM.loginSubmitBtn.querySelector('.loader');
    DOM.loginSubmitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Verificando...';
    if (loader) loader.classList.remove('hidden');

    try {
        const data = await api.post('/auth/login', { username, password });
        localStorage.setItem(TOKEN_KEY, data.token);
        registerAccessLog(username);
        DOM.loginForm.reset();
        Toast.show(`¡Bienvenido de nuevo, ${username}!`, 'success');
        checkAuthAndRoute();
    } catch (err) {
        const msg = err.message || 'Credenciales incorrectas';
        DOM.loginAlert.textContent = msg;
        DOM.loginAlert.classList.remove('hidden');
        DOM.loginAlert.classList.add('alert-error');
        Toast.show(msg, 'error');
    } finally {
        DOM.loginSubmitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Ingresar';
        if (loader) loader.classList.add('hidden');
    }
}

function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    Toast.show('Sesión cerrada correctamente.', 'info');
    checkAuthAndRoute();
}

function handleLandingEnter() {
    DOM.landingSection.classList.add('hidden');
    DOM.loginSection.classList.remove('hidden');
    DOM.loginAlert.classList.add('hidden');
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
// SINCRONIZACIÓN DE DASHBOARD
// =====================================================
async function syncDashboardStats() {
    try {
        await Promise.allSettled([
            CandidatesModule.loadData(),
            VacanciesModule.loadData(),
            CompaniesModule.loadData(),
            ApplicationsModule.loadData(),
            InterviewsModule.loadData(),
            TasksModule.loadData(),
            TrackingModule.loadData()
        ]);

        CandidatesModule.updateStats();
        VacanciesModule.updateStats();
        CompaniesModule.updateStats();
        ApplicationsModule.updateStats();
        InterviewsModule.updateStats();
        TasksModule.updateStats();
    } catch (err) {
        console.error('Error sincronizando estadísticas del Dashboard:', err);
    }
}

// =====================================================
// ENRUTAMIENTO
// =====================================================
function checkAuthAndRoute() {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
        DOM.landingSection.classList.add('hidden');
        DOM.loginSection.classList.add('hidden');
        DOM.sidebar.classList.remove('hidden');
        DOM.topbarNav.classList.remove('hidden');
        LoginAnimation.stop();

        const logs = JSON.parse(localStorage.getItem(LOGS_KEY)) || [];
        const username = logs[0]?.username || 'Usuario';

        DOM.userWelcome.textContent       = username;
        DOM.sidebarUsername.textContent   = username;
        DOM.avatarCircle.textContent      = username.charAt(0).toUpperCase();
        updateLogCount(logs.length);

        navigateTo('dashboardSection');
    } else {
        DOM.landingSection.classList.remove('hidden');
        DOM.loginSection.classList.add('hidden');
        DOM.sidebar.classList.add('hidden');
        DOM.topbarNav.classList.add('hidden');
        DOM.viewSections.forEach(s => s.classList.add('hidden'));
        DOM.mainContent.classList.remove('full-width');
        DOM.mainContent.style.marginLeft = '0';
        LoginAnimation.start();
    }
}

function navigateTo(targetId) {
    DOM.navBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.target === targetId);
    });

    DOM.viewSections.forEach(sec => {
        sec.classList.toggle('hidden', sec.id !== targetId);
    });

    DOM.mainContent.style.marginLeft = '';


    const moduleLoaders = {
        candidatesSection: () => CandidatesModule.loadData(),
        vacanciesSection: () => VacanciesModule.loadData(),
        companiesSection: () => CompaniesModule.loadData(),
        applicationsSection: () => ApplicationsModule.loadData(),
        interviewsSection: () => InterviewsModule.loadData(),
        tasksSection: () => TasksModule.loadData(),
        trackingSection: () => TrackingModule.loadData()
    };
    moduleLoaders[targetId]?.();


    if (window.innerWidth <= 768) DOM.sidebar.classList.remove('open');
}

// =====================================================
// INIT
// =====================================================
function initApp() {
    DOM.loginForm.addEventListener('submit', handleLoginSubmit);
    DOM.logoutBtn.addEventListener('click', handleLogout);
    DOM.sidebarToggle.addEventListener('click', handleSidebarToggle);
    DOM.landingEnterBtn.addEventListener('click', handleLandingEnter);

    DOM.navBtns.forEach(btn => {
        btn.addEventListener('click', () => navigateTo(btn.dataset.target));
    });

    DashboardModule.init();
    CandidatesModule.init();
    VacanciesModule.init();
    CompaniesModule.init();
    ApplicationsModule.init();
    InterviewsModule.init();
    TasksModule.init();
    TrackingModule.init();
    DashboardModule.loadData();


    checkAuthAndRoute();
}

ThemeModule.init();
LangModule.init();
AccessibilityModule.init();
TourModule.init();
initApp();

