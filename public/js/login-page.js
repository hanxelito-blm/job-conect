// public/js/login-page.js
// Entry point for the login page (MPA version)
import { api } from './services/apiService.js';
import { Toast } from './services/toastService.js';
import { AuthService } from './services/authService.js';
import { LoginAnimation } from './components/loginAnimation.js';
import { ThemeModule, LangModule } from './components/themeLanguage.js';

const TOKEN_KEY = 'jobConnectToken';
const LOGS_KEY  = 'jobConnect_accessLogs';

let selectedRole = 'candidato';

function initLogin() {
    // If already logged in, redirect to dashboard
    if (AuthService.isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }

    const loginRoleSelect = document.getElementById('loginRoleSelect');
    const loginFormScreen = document.getElementById('loginFormScreen');
    const loginRoleLabel  = document.getElementById('loginRoleLabel');
    const btnBackToRoles  = document.getElementById('btnBackToRoles');
    const loginForm       = document.getElementById('loginForm');
    const usernameInput   = document.getElementById('username');
    const passwordInput   = document.getElementById('password');
    const loginSubmitBtn  = document.getElementById('loginSubmitBtn');
    const loginAlert      = document.getElementById('loginAlert');

    // Role selector
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            selectedRole = card.dataset.role;
            const labels = { candidato: 'Candidato', empresa: 'Empresa', reclutador: 'Reclutador', administrador: 'Administrador' };
            if (loginRoleLabel) loginRoleLabel.textContent = labels[selectedRole] || selectedRole;
            loginRoleSelect.classList.add('hidden');
            loginFormScreen.classList.remove('hidden');
            loginAlert.classList.add('hidden');
            usernameInput.focus();
        });
    });

    // Back to roles
    if (btnBackToRoles) {
        btnBackToRoles.addEventListener('click', () => {
            loginFormScreen.classList.add('hidden');
            loginRoleSelect.classList.remove('hidden');
            loginForm.reset();
            loginAlert.classList.add('hidden');
        });
    }

    // Login form submit
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginAlert.classList.add('hidden');

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        if (!username || !password) {
            Toast.show('Por favor ingresa usuario y contraseña.', 'error');
            return;
        }

        const btnText = loginSubmitBtn.querySelector('.btn-text');
        const loader  = loginSubmitBtn.querySelector('.loader');
        loginSubmitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Verificando...';
        if (loader) loader.classList.remove('hidden');

        try {
            const data = await api.post('/auth/login', { username, password });
            AuthService.login(data.token, selectedRole, username);
            registerAccessLog(username);
            loginForm.reset();
            Toast.show(`¡Bienvenido, ${username}! (${AuthService.getRoleLabel()})`, 'success');
            window.location.href = 'dashboard.html';
        } catch (err) {
            const msg = err.message || 'Credenciales incorrectas';
            loginAlert.textContent = msg;
            loginAlert.classList.remove('hidden');
            loginAlert.classList.add('alert-error');
            Toast.show(msg, 'error');
        } finally {
            loginSubmitBtn.disabled = false;
            if (btnText) btnText.textContent = 'Ingresar';
            if (loader) loader.classList.add('hidden');
        }
    });

    LoginAnimation.start();
}

function registerAccessLog(username) {
    const logs = JSON.parse(localStorage.getItem(LOGS_KEY)) || [];
    logs.unshift({
        username,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        ip: `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`
    });
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

ThemeModule.init();
LangModule.init();
initLogin();
