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

