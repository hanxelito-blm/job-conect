const TOKEN_KEY = 'jobConnectToken';
const ROLE_KEY = 'jobconnect_role';
const USER_KEY = 'jobconnect_user';
const REMEMBER_USER_KEY = 'jobConnect_rememberedUser';

const ROLE_ACCESS = {
    candidato: {
        label: 'Candidato',
        sidebar: ['dashboardSection', 'profileSection', 'myApplicationsSection', 'interviewsSection'],
        modules: {
            dashboardSection: 'read',
            profileSection: 'read',
            myApplicationsSection: 'read',
            interviewsSection: 'read'
        }
    },
    empresa: {
        label: 'Empresa',
        sidebar: ['dashboardSection', 'companiesSection', 'vacanciesSection', 'candidatesSection'],
        modules: {
            dashboardSection: 'read',
            companiesSection: 'read',
            vacanciesSection: 'full',
            candidatesSection: 'read'
        }
    },
    reclutador: {
        label: 'Reclutador',
        sidebar: ['dashboardSection', 'companiesSection', 'vacanciesSection', 'interviewsSection', 'candidatesSection', 'applicationsSection', 'tasksSection', 'trackingSection', 'userManagementSection'],
        modules: {
            dashboardSection: 'read',
            companiesSection: 'read',
            vacanciesSection: 'full',
            interviewsSection: 'full',
            candidatesSection: 'full',
            applicationsSection: 'full',
            tasksSection: 'full',
            trackingSection: 'read',
            userManagementSection: 'read'
        }
    },
    administrador: {
        label: 'Administrador',
        sidebar: ['dashboardSection', 'companiesSection', 'vacanciesSection', 'interviewsSection', 'candidatesSection', 'applicationsSection', 'tasksSection', 'trackingSection', 'userManagementSection'],
        modules: {
            dashboardSection: 'full',
            companiesSection: 'full',
            vacanciesSection: 'full',
            interviewsSection: 'full',
            candidatesSection: 'full',
            applicationsSection: 'full',
            tasksSection: 'full',
            trackingSection: 'full',
            userManagementSection: 'full'
        }
    }
};

const ROLE_LABELS = {
    es: { candidato: 'Candidato', empresa: 'Empresa', reclutador: 'Reclutador', administrador: 'Administrador' },
    en: { candidato: 'Candidate', empresa: 'Company', reclutador: 'Recruiter', administrador: 'Administrator' }
};

const callbacks = [];

export const AuthService = {
    login(token, role, username, remember = true) {
        const store = remember ? localStorage : sessionStorage;
        store.setItem(TOKEN_KEY, token);
        store.setItem(ROLE_KEY, role);
        store.setItem(USER_KEY, username || '');
        localStorage.setItem(REMEMBER_USER_KEY, username || '');
        callbacks.forEach(fn => fn());
    },

    logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ROLE_KEY);
        localStorage.removeItem(USER_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(ROLE_KEY);
        sessionStorage.removeItem(USER_KEY);
        callbacks.forEach(fn => fn());
    },

    _getFromAny(key) {
        return localStorage.getItem(key) || sessionStorage.getItem(key);
    },

    getToken() {
        return this._getFromAny(TOKEN_KEY);
    },

    getRole() {
        return this._getFromAny(ROLE_KEY) || 'candidato';
    },

    getUsername() {
        return this._getFromAny(USER_KEY) || '';
    },

    isAuthenticated() {
        return !!(localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY));
    },

    getStoredUsername() {
        return localStorage.getItem(REMEMBER_USER_KEY) || '';
    },

    getRoleConfig() {
        return ROLE_ACCESS[this.getRole()] || ROLE_ACCESS.candidato;
    },

    canAccess(moduleId) {
        const config = this.getRoleConfig();
        return config.modules[moduleId] !== undefined;
    },

    canPerformAction(moduleId, action) {
        const config = this.getRoleConfig();
        const level = config.modules[moduleId];
        if (!level) return false;
        if (level === 'full') return true;
        if (level === 'read') return action === 'read';
        return false;
    },

    getVisibleModules() {
        const config = this.getRoleConfig();
        return config.sidebar;
    },

    getRoleLabel(lang) {
        return ROLE_LABELS[lang || 'es'][this.getRole()] || this.getRole();
    },

    onUpdate(fn) {
        callbacks.push(fn);
    },

    isCandidato() { return this.getRole() === 'candidato'; },
    isEmpresa() { return this.getRole() === 'empresa'; },
    isReclutador() { return this.getRole() === 'reclutador'; },
    isAdministrador() { return this.getRole() === 'administrador'; },

    getCurrentCandidateId() {
        return localStorage.getItem('jc_currentCandidateId') || 'can-001';
    }
};
