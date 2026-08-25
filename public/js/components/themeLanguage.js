/**
 * themeLanguage.js
 * Módulo de Tema (oscuro/claro) e Idioma (ES/EN) para JobConnect.
 * Persiste preferencias en localStorage.
 */

// =====================================================
// DICCIONARIO DE TRADUCCIONES
// =====================================================
const I18N = {
    es: {
        'lang.code':              'ES',
        // Sidebar
        'sidebar.principal':      'PRINCIPAL',
        'sidebar.modules':        'MÓDULOS',
        'sidebar.home':           'Inicio',
        'sidebar.candidates':     'Candidatos',
        'sidebar.applications':   'Postulaciones',
        'sidebar.log':            'Bitácora',
        // Dashboard
        'dash.title':             'Panel de Control',
        'dash.welcome':           'Bienvenido de nuevo,',
        'dash.candidates':        'Candidatos',
        'dash.applications':      'Postulaciones',
        'dash.access':            'Accesos',
        // Pages
        'page.candidates':        'Candidatos',
        'page.candidates.sub':    'Gestión del recurso /users',
        'page.applications':      'Postulaciones',
        'page.applications.sub':  'Gestión del recurso /posts',
        'btn.new.candidate':      'Nuevo Candidato',
        'btn.new.application':    'Nueva Postulación',
        // Login
        'login.title':            'Iniciar Sesión',
        'login.subtitle':         'Portal Corporativo',
        'login.user':             'USUARIO',
        'login.pass':             'CONTRASEÑA',
        'login.btn':              'Ingresar',
        'login.verifying':        'Verificando...',
        // Topbar
        'topbar.logout':          'Cerrar Sesión',
        // Landing
        'landing.enter':          'Entrar al sistema',
    },
    en: {
        'lang.code':              'EN',
        // Sidebar
        'sidebar.principal':      'MAIN',
        'sidebar.modules':        'MODULES',
        'sidebar.home':           'Home',
        'sidebar.candidates':     'Candidates',
        'sidebar.applications':   'Applications',
        'sidebar.log':            'Access Log',
        // Dashboard
        'dash.title':             'Control Panel',
        'dash.welcome':           'Welcome back,',
        'dash.candidates':        'Candidates',
        'dash.applications':      'Applications',
        'dash.access':            'Accesses',
        // Pages
        'page.candidates':        'Candidates',
        'page.candidates.sub':    'Resource management /users',
        'page.applications':      'Applications',
        'page.applications.sub':  'Resource management /posts',
        'btn.new.candidate':      'New Candidate',
        'btn.new.application':    'New Application',
        // Login
        'login.title':            'Sign In',
        'login.subtitle':         'Corporate Portal',
        'login.user':             'USERNAME',
        'login.pass':             'PASSWORD',
        'login.btn':              'Sign In',
        'login.verifying':        'Verifying...',
        // Topbar
        'topbar.logout':          'Sign Out',
        // Landing
        'landing.enter':          'Enter the system',
    }
};

// =====================================================
// MÓDULO TEMA
// =====================================================
export const ThemeModule = (() => {
    const STORAGE_KEY = 'jobConnect_theme';
    const DARK_CLASS  = 'dark-mode';
    let current = 'dark'; // default

    const MOON_SVG = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
    const SUN_SVG  = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;

    function apply(theme) {
        current = theme;
        if (theme === 'light') {
            document.documentElement.classList.add('light-mode');
            document.documentElement.classList.remove('dark-mode');
        } else {
            document.documentElement.classList.remove('light-mode');
            document.documentElement.classList.add('dark-mode');
        }
        const icon = document.getElementById('themeIcon');
        if (icon) icon.innerHTML = theme === 'dark' ? MOON_SVG : SUN_SVG;
        localStorage.setItem(STORAGE_KEY, theme);
    }

    function toggle() {
        apply(current === 'dark' ? 'light' : 'dark');
    }

    function init() {
        const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
        apply(saved);
        const btn = document.getElementById('themeToggleBtn');
        if (btn) btn.addEventListener('click', toggle);
    }

    return { init, toggle, apply };
})();

// =====================================================
// MÓDULO IDIOMA
// =====================================================
export const LangModule = (() => {
    const STORAGE_KEY = 'jobConnect_lang';
    let current = 'es'; // default

    function t(key) {
        return (I18N[current] && I18N[current][key]) || key;
    }

    function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            // El label del botón de idioma se actualiza por separado para evitar conflicto
            if (el.classList.contains('lang-label')) return;
            el.textContent = t(key);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.placeholder = t(el.dataset.i18nPlaceholder);
        });
    }

    function apply(lang) {
        current = lang;
        // Actualizar etiqueta del botón
        const label = document.querySelector('.lang-label');
        if (label) label.textContent = lang.toUpperCase();
        // Actualizar atributo lang del HTML para accesibilidad
        document.documentElement.lang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        applyTranslations();
    }

    function toggle() {
        apply(current === 'es' ? 'en' : 'es');
    }

    function init() {
        const saved = localStorage.getItem(STORAGE_KEY) || 'es';
        apply(saved);
        const btn = document.getElementById('langToggleBtn');
        if (btn) btn.addEventListener('click', toggle);
    }

    return { init, toggle, apply, t };
})();
