// public/js/app-page.js
// Entry point for all authenticated app pages (MPA)
import { AuthService } from './services/authService.js';
import { Toast } from './services/toastService.js';
import { ThemeModule, LangModule } from './components/themeLanguage.js';
import { AccessibilityModule } from './components/accessibilityModule.js';

const PAGE_TO_SECTION = {
    'dashboard':     'dashboardSection',
    'candidates':    'candidatesSection',
    'vacancies':     'vacanciesSection',
    'companies':     'companiesSection',
    'applications':  'applicationsSection',
    'interviews':    'interviewsSection',
    'tasks':         'tasksSection',
    'tracking':      'trackingSection',
    'profile':       'profileSection',
    'my-applications':'myApplicationsSection'
};

const PAGE_MODULES = {
    'dashboard':     () => import('./components/dashboardModule.js'),
    'candidates':    () => import('./components/candidatesModule.js'),
    'vacancies':     () => import('./components/vacanciesModule.js'),
    'companies':     () => import('./components/companiesModule.js'),
    'applications':  () => import('./components/applicationsModule.js'),
    'interviews':    () => import('./components/interviewsModule.js'),
    'tasks':         () => import('./components/tasksModule.js'),
    'tracking':      () => import('./components/trackingModule.js'),
    'profile':       () => import('./components/profileModule.js'),
    'my-applications':() => import('./components/myApplicationsModule.js')
};

function getCurrentPage() {
    const segment = window.location.pathname.split('/').filter(Boolean).pop() || 'dashboard';
    return segment.replace('.html', '');
}

async function initPage() {
    const page = getCurrentPage();
    const sectionId = PAGE_TO_SECTION[page];

    // Auth check
    if (!AuthService.isAuthenticated()) {
        window.location.href = '/login';
        return;
    }

    // Access check
    if (sectionId && !AuthService.canAccess(sectionId)) {
        Toast.show('No tienes acceso a este módulo.', 'error');
        window.location.href = '/dashboard';
        return;
    }

    // Update user info
    const username = AuthService.getUsername() || 'Usuario';
    const welcome = document.getElementById('userWelcome');
    const sidebarUsername = document.getElementById('sidebarUsername');
    const avatarCircle = document.getElementById('avatarCircle');
    const roleBadge = document.querySelector('.user-role-badge');
    const logCount = document.getElementById('logCount');

    if (welcome) welcome.textContent = username;
    if (sidebarUsername) sidebarUsername.textContent = username;
    if (avatarCircle) avatarCircle.textContent = username.charAt(0).toUpperCase();
    if (roleBadge) {
        roleBadge.textContent = AuthService.getRoleLabel();
        roleBadge.className = `user-role-badge role-${AuthService.getRole()}`;
    }
    if (logCount) {
        const logs = JSON.parse(localStorage.getItem('jobConnect_accessLogs')) || [];
        logCount.textContent = logs.length;
    }

    // Filter sidebar by role
    filterSidebarByRole();

    // Load page module
    const moduleLoader = PAGE_MODULES[page];
    if (moduleLoader) {
        try {
            const mod = await moduleLoader();
            const m = mod.default || Object.values(mod)[0];
            if (m && m.init) m.init();
            if (m && m.loadData) m.loadData();
        } catch (err) {
            console.error(`Error loading module for ${page}:`, err);
        }
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            AuthService.logout();
            Toast.show('Sesión cerrada correctamente.', 'info');
            window.location.href = '/login';
        });
    }

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                sidebar.classList.toggle('open');
            } else {
                sidebar.classList.toggle('collapsed');
                if (mainContent) mainContent.classList.toggle('full-width');
            }
        });
    }
}

function filterSidebarByRole() {
    const visibleModules = AuthService.getVisibleModules();
    const sidebarBtns = document.querySelectorAll('.sidebar-btn');

    sidebarBtns.forEach(btn => {
        const page = btn.dataset.page;
        const sectionId = PAGE_TO_SECTION[page];
        if (sectionId) {
            const isVisible = visibleModules.includes(sectionId);
            btn.classList.toggle('hidden', !isVisible);
        }
    });

    const sectionLabels = document.querySelectorAll('.sidebar-section-label');
    sectionLabels.forEach(label => {
        if (label.textContent === 'MÓDULOS' || label.textContent === 'MODULES') {
            const nextBtns = [];
            let sibling = label.nextElementSibling;
            while (sibling && sibling.classList.contains('sidebar-btn')) {
                nextBtns.push(sibling);
                sibling = sibling.nextElementSibling;
            }
            const anyVisible = nextBtns.some(btn => !btn.classList.contains('hidden'));
            label.classList.toggle('hidden', !anyVisible);
        }
    });
}

ThemeModule.init();
LangModule.init();
AccessibilityModule.init();
initPage();
