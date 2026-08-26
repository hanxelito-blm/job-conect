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
    if (AuthService.isAuthenticated()) {
        window.location.href = '/dashboard';
        return;
    }

    const loginRoleSelect = document.getElementById('loginRoleSelect');
    const loginFormScreen = document.getElementById('loginFormScreen');
    const registerScreen  = document.getElementById('registerScreen');
    const loginRoleLabel  = document.getElementById('loginRoleLabel');
    const btnBackToRoles  = document.getElementById('btnBackToRoles');
    const loginForm       = document.getElementById('loginForm');
    const usernameInput   = document.getElementById('username');
    const passwordInput   = document.getElementById('password');
    const loginSubmitBtn  = document.getElementById('loginSubmitBtn');
    const loginAlert      = document.getElementById('loginAlert');
    const rememberMe      = document.getElementById('rememberMe');

    const btnGoToRegister      = document.getElementById('btnGoToRegister');
    const btnBackToLogin       = document.getElementById('btnBackToLogin');
    const btnBackToLoginFromReg = document.getElementById('btnBackToLoginFromReg');
    const registerForm         = document.getElementById('registerForm');
    const registerSubmitBtn    = document.getElementById('registerSubmitBtn');
    const registerAlert        = document.getElementById('registerAlert');

    const storedUser = AuthService.getStoredUsername();
    if (storedUser && usernameInput) {
        usernameInput.value = storedUser;
    }

    // ─── Role selector ───
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            selectedRole = card.dataset.role;
            const labels = { candidato: 'Candidato', empresa: 'Empresa', reclutador: 'Reclutador', administrador: 'Administrador' };
            if (loginRoleLabel) loginRoleLabel.textContent = labels[selectedRole] || selectedRole;
            loginRoleSelect.classList.add('hidden');
            loginFormScreen.classList.remove('hidden');
            registerScreen.classList.add('hidden');
            loginAlert.classList.add('hidden');
            usernameInput.focus();
        });
    });

    // ─── Back to roles ───
    if (btnBackToRoles) {
        btnBackToRoles.addEventListener('click', () => {
            loginFormScreen.classList.add('hidden');
            loginRoleSelect.classList.remove('hidden');
            loginForm.reset();
            loginAlert.classList.add('hidden');
        });
    }

    // ─── Navigate to register ───
    if (btnGoToRegister) {
        btnGoToRegister.addEventListener('click', () => {
            loginFormScreen.classList.add('hidden');
            registerScreen.classList.remove('hidden');
            registerAlert.classList.add('hidden');
            registerForm.reset();
            document.getElementById('regRole').value = selectedRole;
        });
    }

    // ─── Back to login from register ───
    function showLoginForm() {
        registerScreen.classList.add('hidden');
        loginFormScreen.classList.remove('hidden');
        loginAlert.classList.add('hidden');
        registerAlert.classList.add('hidden');
    }
    if (btnBackToLogin) btnBackToLogin.addEventListener('click', showLoginForm);
    if (btnBackToLoginFromReg) btnBackToLoginFromReg.addEventListener('click', showLoginForm);

    // ─── Demo user buttons ───
    const demoButtons = document.querySelectorAll('.btn-demo');
    demoButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const demoRole = btn.dataset.demoRole;
            const demoUser = btn.dataset.demoUser;
            const demoPass = btn.dataset.demoPass;

            selectedRole = demoRole;
            usernameInput.value = demoUser;
            passwordInput.value = demoPass;
            if (rememberMe) rememberMe.checked = true;

            const labels = { candidato: 'Candidato', empresa: 'Empresa', reclutador: 'Reclutador', administrador: 'Administrador' };
            if (loginRoleLabel) loginRoleLabel.textContent = labels[demoRole] || demoRole;
            loginRoleSelect.classList.add('hidden');
            registerScreen.classList.add('hidden');
            loginFormScreen.classList.remove('hidden');
            loginAlert.classList.add('hidden');

            loginForm.requestSubmit();
        });
    });

    // ─── Login form submit ───
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
            const registeredUsers = AuthService.getRegisteredUsers();
            const localUser = registeredUsers.find(u => u.username === username);
            const demoUsers = ['emilys', 'sophiaw', 'james', 'oliviab'];
            const isDemoUser = demoUsers.includes(username);

            if (localUser && localUser.password === password) {
                const fakeToken = 'local_' + btoa(username + ':' + Date.now());
                AuthService.login(fakeToken, selectedRole, username, rememberMe.checked);
                registerAccessLog(username);
                loginForm.reset();
                Toast.show(`¡Bienvenido, ${username}! (${AuthService.getRoleLabel()})`, 'success');
                window.location.href = '/dashboard';
            } else if (isDemoUser) {
                const fakeToken = 'demo_' + btoa(username + ':' + Date.now());
                AuthService.login(fakeToken, selectedRole, username, rememberMe.checked);
                registerAccessLog(username);
                loginForm.reset();
                Toast.show(`¡Bienvenido, ${username}! (${AuthService.getRoleLabel()})`, 'success');
                window.location.href = '/dashboard';
            } else {
                const data = await api.post('/auth/login', { username, password });
                AuthService.login(data.token, selectedRole, username, rememberMe.checked);
                registerAccessLog(username);
                loginForm.reset();
                Toast.show(`¡Bienvenido, ${username}! (${AuthService.getRoleLabel()})`, 'success');
                window.location.href = '/dashboard';
            }
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

    // ─── Register form submit ───
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            registerAlert.classList.add('hidden');

            const role     = document.getElementById('regRole').value;
            const username = document.getElementById('regUsername').value.trim();
            const email    = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value;
            const confirm  = document.getElementById('regConfirmPassword').value;

            clearRegErrors();

            let hasError = false;
            if (!username) { showRegError('regUsernameError', 'El usuario es obligatorio.'); hasError = true; }
            if (!email)    { showRegError('regEmailError', 'El correo es obligatorio.'); hasError = true; }
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showRegError('regEmailError', 'Formato de correo inválido.'); hasError = true; }
            if (!password) { showRegError('regPasswordError', 'La contraseña es obligatoria.'); hasError = true; }
            else if (password.length < 6) { showRegError('regPasswordError', 'Mínimo 6 caracteres.'); hasError = true; }
            if (!confirm) { showRegError('regConfirmPasswordError', 'Confirma tu contraseña.'); hasError = true; }
            else if (password !== confirm) { showRegError('regConfirmPasswordError', 'Las contraseñas no coinciden.'); hasError = true; }
            if (hasError) return;

            const registeredUsers = AuthService.getRegisteredUsers();
            if (registeredUsers.find(u => u.username === username)) {
                showRegError('regUsernameError', 'Este usuario ya existe.');
                return;
            }

            const btnText = registerSubmitBtn.querySelector('.btn-text');
            const loader  = registerSubmitBtn.querySelector('.loader');
            registerSubmitBtn.disabled = true;
            if (btnText) btnText.textContent = 'Creando...';
            if (loader) loader.classList.remove('hidden');

            try {
                AuthService.register({ username, email, password, role });
                Toast.show('¡Cuenta creada! Ahora puedes iniciar sesión.', 'success');
                registerForm.reset();
                showLoginForm();
                usernameInput.value = username;
            } catch (err) {
                registerAlert.textContent = err.message || 'Error al registrar.';
                registerAlert.classList.remove('hidden');
                registerAlert.classList.add('alert-error');
                Toast.show(err.message || 'Error al registrar.', 'error');
            } finally {
                registerSubmitBtn.disabled = false;
                if (btnText) btnText.textContent = 'Crear Cuenta';
                if (loader) loader.classList.add('hidden');
            }
        });
    }

    LoginAnimation.start();
}

function clearRegErrors() {
    ['regUsernameError', 'regEmailError', 'regPasswordError', 'regConfirmPasswordError'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
    });
}

function showRegError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
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
