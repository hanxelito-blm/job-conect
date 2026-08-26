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
        'sidebar.home':           'Inicio / Dashboard',
        'sidebar.companies':      'Empresas',
        'sidebar.vacancies':      'Vacantes',
        'sidebar.interviews':     'Entrevistas',
        'sidebar.candidates':     'Candidatos',
        'sidebar.applications':   'Postulaciones',
        'sidebar.tasks':          'Tareas',
        'sidebar.log':            'Bitácora',
        // Dashboard
        'dash.title':             'Panel de Control',
        'dash.subtitle':          'Visión general y analítica en tiempo real',
        'dash.welcome':           'Bienvenido de nuevo,',
        'dash.refresh':           'Actualizar',
        'dash.kpi.vacancies':     'Vacantes Activas',
        'dash.kpi.interviews':    'Entrevistas Programadas',
        'dash.kpi.companies':     'Empresas Registradas',
        'dash.kpi.candidates':    'Candidatos Totales',
        'dash.quick.title':       'Accesos Rápidos',
        'dash.quick.newVacancy':  'Publicar nueva vacante',
        'dash.quick.newInterview':'Agendar entrevista',
        'dash.quick.newCompany':  'Registrar empresa',
        'dash.quick.newCandidate':'Nuevo candidato',
        'dash.section.vacancies': 'Últimas Vacantes Publicadas',
        'dash.section.interviews':'Próximas Entrevistas',
        'dash.section.companies': 'Directorio y Actividad de Empresas',
        'dash.btn.viewAll':       'Ver todas',
        'dash.candidates':        'Candidatos',
        'dash.applications':      'Postulaciones',
        'dash.access':            'Accesos',
        // Pages
        'page.candidates':        'Candidatos',
        'page.applications':      'Postulaciones',
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
        // Accesibilidad
        'a11y.title':             'Ajuste Daltónico',
        'a11y.normal':            'Normal',
        'a11y.deuteranopia':      'Deuteranopía / Protanopía',
        'a11y.tritanopia':        'Tritanopía',
        'a11y.monochrome':        'Alto Contraste',
        // Loading
        'loading.candidates':     'Cargando candidatos...',
        // Tour
        'tour.guide':             'Guía',
        // Filters
        'filter.all':             'Todos',
        'filter.clear':           'Limpiar',
        'filter.noResults':       'No se encontraron resultados con estos filtros.',
        'filter.search.placeholder': 'Buscar...',
        // Roles
        'role.candidato':         'Candidato',
        'role.empresa':           'Empresa',
        'role.reclutador':        'Reclutador',
        'role.administrador':     'Administrador',
        'login.selectRole':       'Selecciona tu rol para acceder',
        'login.loginAs':          'Iniciar como',
        'login.back':             '← Volver',
        'login.remember':         'Recordar usuario',
        // Sidebar
        'sidebar.tracking':       'Seguimiento',
        'sidebar.profile':        'Mi Perfil',
        'sidebar.myApplications': 'Mis Postulaciones',
        // Profile
        'profile.title':          'Mi Perfil',
        'profile.subtitle':       'Administra tu información personal y profesional',
        'profile.firstName':      'Nombre',
        'profile.lastName':       'Apellido',
        'profile.email':          'Correo electrónico',
        'profile.phone':          'Teléfono',
        'profile.titleField':     'Título profesional',
        'profile.location':       'Ubicación',
        'profile.summary':        'Resumen profesional',
        'profile.linkedin':       'LinkedIn URL',
        'profile.github':         'GitHub URL',
        'profile.portfolio':      'Portafolio URL',
        'profile.cvUrl':          'URL del CV',
        'profile.skills':         'Habilidades',
        'profile.addSkill':       'Agregar',
        'profile.addSkillPlaceholder': 'Agregar habilidad...',
        'profile.save':           'Guardar cambios',
        'profile.saved':          'Perfil guardado correctamente',
        // My Applications
        'myApps.title':           'Mis Postulaciones',
        'myApps.subtitle':        'Seguimiento en tiempo real de tus aplicaciones',
        'myApps.search':          'Buscar por vacante o empresa...',
        'myApps.allStatuses':     'Todos los estados',
        'myApps.clear':           'Limpiar',
        'myApps.empty':           'No se encontraron postulaciones',
        'myApps.interview':       'Entrevista',
        // Tracking
        'tracking.title':         'Seguimiento de Candidatos',
        'tracking.subtitle':      'Pipeline de reclutamiento y progreso de candidatos',
    },
    en: {
        'lang.code':              'EN',
        // Sidebar
        'sidebar.principal':      'MAIN',
        'sidebar.modules':        'MODULES',
        'sidebar.home':           'Home / Dashboard',
        'sidebar.companies':      'Companies',
        'sidebar.vacancies':      'Job Vacancies',
        'sidebar.interviews':     'Interviews',
        'sidebar.candidates':     'Candidates',
        'sidebar.applications':   'Applications',
        'sidebar.tasks':          'Tasks',
        'sidebar.log':            'Access Log',
        // Dashboard
        'dash.title':             'Dashboard Overview',
        'dash.subtitle':          'Real-time talent metrics and operations',
        'dash.welcome':           'Welcome back,',
        'dash.refresh':           'Refresh',
        'dash.kpi.vacancies':     'Active Vacancies',
        'dash.kpi.interviews':    'Scheduled Interviews',
        'dash.kpi.companies':     'Registered Companies',
        'dash.kpi.candidates':    'Total Candidates',
        'dash.quick.title':       'Quick Actions',
        'dash.quick.newVacancy':  'Post New Vacancy',
        'dash.quick.newInterview':'Schedule Interview',
        'dash.quick.newCompany':  'Register Company',
        'dash.quick.newCandidate':'New Candidate',
        'dash.section.vacancies': 'Latest Published Vacancies',
        'dash.section.interviews':'Upcoming Interviews',
        'dash.section.companies': 'Company Directory & Activity',
        'dash.btn.viewAll':       'View all',
        'dash.candidates':        'Candidates',
        'dash.applications':      'Applications',
        'dash.access':            'Accesses',
        // Pages
        'page.candidates':        'Candidates',
        'page.applications':      'Applications',
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
        'topbar.logout':          'Log Out',
        // Landing
        'landing.enter':          'Enter the system',
        // Accessibility
        'a11y.title':             'Color Blindness',
        'a11y.normal':            'Normal',
        'a11y.deuteranopia':      'Deuteranopia / Protanopia',
        'a11y.tritanopia':        'Tritanopia',
        'a11y.monochrome':        'High Contrast',
        // Loading
        'loading.candidates':     'Loading candidates...',
        // Tour
        'tour.guide':             'Guide',
        // Filters
        'filter.all':             'All',
        'filter.clear':           'Clear',
        'filter.noResults':       'No results found with these filters.',
        'filter.search.placeholder': 'Search...',
        // Roles
        'role.candidato':         'Candidate',
        'role.empresa':           'Company',
        'role.reclutador':        'Recruiter',
        'role.administrador':     'Administrator',
        'login.selectRole':       'Select your role to access',
        'login.loginAs':          'Sign in as',
        'login.back':             '← Back',
        'login.remember':         'Remember username',
        // Sidebar
        'sidebar.tracking':       'Tracking',
        'sidebar.profile':        'My Profile',
        'sidebar.myApplications': 'My Applications',
        // Profile
        'profile.title':          'My Profile',
        'profile.subtitle':       'Manage your personal and professional information',
        'profile.firstName':      'First Name',
        'profile.lastName':       'Last Name',
        'profile.email':          'Email',
        'profile.phone':          'Phone',
        'profile.titleField':     'Professional Title',
        'profile.location':       'Location',
        'profile.summary':        'Professional Summary',
        'profile.linkedin':       'LinkedIn URL',
        'profile.github':         'GitHub URL',
        'profile.portfolio':      'Portfolio URL',
        'profile.cvUrl':          'CV URL',
        'profile.skills':         'Skills',
        'profile.addSkill':       'Add',
        'profile.addSkillPlaceholder': 'Add skill...',
        'profile.save':           'Save Changes',
        'profile.saved':          'Profile saved successfully',
        // My Applications
        'myApps.title':           'My Applications',
        'myApps.subtitle':        'Real-time tracking of your applications',
        'myApps.search':          'Search by vacancy or company...',
        'myApps.allStatuses':     'All statuses',
        'myApps.clear':           'Clear',
        'myApps.empty':           'No applications found',
        'myApps.interview':       'Interview',
        // Tracking
        'tracking.title':         'Candidate Tracking',
        'tracking.subtitle':      'Recruitment pipeline and candidate progress',
    }
};

// =====================================================
// THEME MODULE
// =====================================================
export const ThemeModule = (() => {
    const STORAGE_KEY = 'jobConnect_theme';
    const DARK_CLASS  = '';
    const LIGHT_CLASS = 'light-mode';

    function apply(theme) {
        if (theme === 'light') {
            document.documentElement.classList.add(LIGHT_CLASS);
        } else {
            document.documentElement.classList.remove(LIGHT_CLASS);
        }
        localStorage.setItem(STORAGE_KEY, theme);
        updateIcon(theme);
    }

    function updateIcon(theme) {
        const icon = document.getElementById('themeIcon');
        if (!icon) return;
        icon.innerHTML = theme === 'light'
            ? `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`
            : `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
    }

    function init() {
        const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
        apply(saved);

        const btn = document.getElementById('themeToggleBtn');
        if (btn) {
            btn.addEventListener('click', () => {
                const current = document.documentElement.classList.contains(LIGHT_CLASS) ? 'light' : 'dark';
                apply(current === 'light' ? 'dark' : 'light');
            });
        }
    }

    return { init, apply };
})();

// =====================================================
// LANG MODULE
// =====================================================
export const LangModule = (() => {
    const STORAGE_KEY = 'jobConnect_lang';
    let currentLang = 'es';

    function apply(lang) {
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        document.documentElement.lang = lang;
        const dict = I18N[lang] || I18N.es;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (dict[key] !== undefined) el.textContent = dict[key];
        });
    }

    function init() {
        const saved = localStorage.getItem(STORAGE_KEY) || 'es';
        apply(saved);

        const btn = document.getElementById('langToggleBtn');
        if (btn) {
            btn.addEventListener('click', () => {
                apply(currentLang === 'es' ? 'en' : 'es');
            });
        }
    }

    function t(key) {
        return (I18N[currentLang] || I18N.es)[key] || key;
    }

    return { init, apply, t };
})();
