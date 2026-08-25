// ============================================================================
// JobConnect - Lógica de autenticación
// ============================================================================

(function () {
  'use strict';

  // ---------------------------------------------------------------------
  // Configuración
  // ---------------------------------------------------------------------
  const AUTH_ENDPOINT = '/auth/login';
  const TOKEN_KEY = 'jobconnect_token';
  const ROLE_KEY = 'jobconnect_role'; // info mínima de sesión (no sensible)

  // ---------------------------------------------------------------------
  // Referencias a elementos del DOM
  // ---------------------------------------------------------------------
  const screens = {
    roleSelect: document.getElementById('screen-role-select'),
    formUser: document.getElementById('screen-form-user'),
    formAdmin: document.getElementById('screen-form-admin'),
    formCompany: document.getElementById('screen-form-company'),
    dashboard: document.getElementById('screen-dashboard'),
  };

  const messageArea = document.getElementById('message-area');

  const btnRoleUser = document.getElementById('btn-role-user');
  const btnRoleAdmin = document.getElementById('btn-role-admin');
  const btnRoleCompany = document.getElementById('btn-role-company');
  const backButtons = document.querySelectorAll('.btn-back');

  const formUser = document.getElementById('form-user');
  const formAdmin = document.getElementById('form-admin');
  const formCompany = document.getElementById('form-company');

  const btnLogout = document.getElementById('btn-logout');
  const dashboardWelcome = document.getElementById('dashboard-welcome');

  // ---------------------------------------------------------------------
  // Utilidades de navegación entre pantallas
  // ---------------------------------------------------------------------
  function hideAllScreens() {
    Object.values(screens).forEach(function (el) {
      if (el) el.hidden = true;
    });
  }

  function showScreen(name) {
    hideAllScreens();
    if (screens[name]) {
      screens[name].hidden = false;
    }
  }

  // ---------------------------------------------------------------------
  // Mensajes al usuario (no solo console.log)
  // ---------------------------------------------------------------------
  function showMessage(text, type) {
    // type: 'error' | 'success'
    messageArea.textContent = text;
    messageArea.hidden = false;
    messageArea.setAttribute('data-type', type || 'error');
  }

  function clearMessage() {
    messageArea.textContent = '';
    messageArea.hidden = true;
    messageArea.removeAttribute('data-type');
  }

  // ---------------------------------------------------------------------
  // Manejo del token
  // ---------------------------------------------------------------------
  function saveToken(token, role) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      if (role) localStorage.setItem(ROLE_KEY, role);
    } catch (e) {
      // localStorage puede fallar (modo privado, cuota, etc.)
      showMessage('No se pudo guardar la sesión en este navegador.', 'error');
    }
  }

  function getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (e) {
      return null;
    }
  }

  function getRole() {
    try {
      return localStorage.getItem(ROLE_KEY);
    } catch (e) {
      return null;
    }
  }

  function clearSession() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ROLE_KEY);
    } catch (e) {
      // Si localStorage no está disponible, no hay nada más que limpiar
    }
  }

  function isAuthenticated() {
    const token = getToken();
    return typeof token === 'string' && token.length > 0;
  }

  // ---------------------------------------------------------------------
  // Petición autenticada reutilizable (agrega Authorization: Bearer TOKEN)
  // ---------------------------------------------------------------------
  async function authorizedFetch(url, options) {
    const token = getToken();
    if (!token) {
      throw new Error('NO_TOKEN');
    }

    const opts = options || {};
    const headers = Object.assign({}, opts.headers, {
      Authorization: 'Bearer ' + token,
    });

    const response = await fetch(url, Object.assign({}, opts, { headers: headers }));

    if (response.status === 401 || response.status === 403) {
      // Token inválido o expirado / rechazado por el backend
      clearSession();
      showMessage('Tu sesión expiró o no es válida. Inicia sesión de nuevo.', 'error');
      protectAndRedirect();
      throw new Error('TOKEN_REJECTED');
    }

    return response;
  }

  // ---------------------------------------------------------------------
  // Login genérico contra /auth/login
  // credentials: objeto con los campos que espera la API real
  // AJUSTAR: los nombres de los campos del body deben coincidir con la API real.
  // ---------------------------------------------------------------------
  async function login(credentials, role) {
    let response;

    try {
      response = await fetch(AUTH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
    } catch (networkError) {
      // Error de conexión (servidor caído, sin internet, endpoint no disponible, etc.)
      showMessage(
        'No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.',
        'error'
      );
      return false;
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      showMessage('El servidor devolvió una respuesta inesperada.', 'error');
      return false;
    }

    if (!response.ok) {
      if (response.status === 401) {
        showMessage('Usuario o contraseña incorrectos.', 'error');
      } else if (response.status === 403) {
        showMessage('Acceso denegado. Verifica tus credenciales.', 'error');
      } else {
        // AJUSTAR: adaptar al formato real de error de la API (data.message, data.error, etc.)
        const serverMessage = data && (data.message || data.error);
        showMessage(serverMessage || 'El servidor rechazó la autenticación.', 'error');
      }
      return false;
    }

    // AJUSTAR: el nombre del campo del token depende de la API real (data.token, data.accessToken, etc.)
    const token = data && (data.token || data.accessToken);

    if (!token) {
      showMessage('La respuesta del servidor no incluyó un token válido.', 'error');
      return false;
    }

    saveToken(token, role);
    clearMessage();
    return true;
  }

  // ---------------------------------------------------------------------
  // Handlers de selección de rol
  // ---------------------------------------------------------------------
  btnRoleUser.addEventListener('click', function () {
    clearMessage();
    showScreen('formUser');
  });

  btnRoleAdmin.addEventListener('click', function () {
    clearMessage();
    showScreen('formAdmin');
  });

  btnRoleCompany.addEventListener('click', function () {
    clearMessage();
    showScreen('formCompany');
  });

  backButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      clearMessage();
      showScreen('roleSelect');
    });
  });

  // ---------------------------------------------------------------------
  // Handler: formulario USUARIO
  // ---------------------------------------------------------------------
  formUser.addEventListener('submit', async function (event) {
    event.preventDefault();
    clearMessage();

    const username = document.getElementById('user-username').value.trim();
    const password = document.getElementById('user-password').value;

    if (!username || !password) {
      showMessage('Debes ingresar usuario y contraseña.', 'error');
      return;
    }

    // AJUSTAR: nombres de campos según la API real
    const success = await login(
      { role: 'user', username: username, password: password },
      'user'
    );

    if (success) {
      enterDashboard('user', username);
    }
  });

  // ---------------------------------------------------------------------
  // Handler: formulario ADMINISTRADOR
  // ---------------------------------------------------------------------
  formAdmin.addEventListener('submit', async function (event) {
    event.preventDefault();
    clearMessage();

    const adminPasswordInput = document.getElementById('admin-password');
    const adminPassword = adminPasswordInput.value;

    if (!adminPassword) {
      showMessage('Debes ingresar la contraseña de administrador.', 'error');
      return;
    }

    // AJUSTAR: nombres de campos según la API real
    const success = await login(
      { role: 'admin', adminPassword: adminPassword },
      'admin'
    );

    // No exponer la contraseña más allá de este punto
    adminPasswordInput.value = '';

    if (success) {
      enterDashboard('admin', 'Administrador');
    }
  });

  // ---------------------------------------------------------------------
  // Handler: formulario EMPRESA
  // ---------------------------------------------------------------------
  formCompany.addEventListener('submit', async function (event) {
    event.preventDefault();
    clearMessage();

    const companyName = document.getElementById('company-name').value.trim();
    const companyPassword = document.getElementById('company-password').value;
    const employerCode = document.getElementById('company-employer-code').value.trim();

    if (!companyName || !companyPassword || !employerCode) {
      showMessage('Debes completar empresa, contraseña y código de empleador.', 'error');
      return;
    }

    // AJUSTAR: nombres de campos según la API real
    const success = await login(
      {
        role: 'company',
        companyName: companyName,
        password: companyPassword,
        employerCode: employerCode,
      },
      'company'
    );

    if (success) {
      enterDashboard('company', companyName);
    }
  });

  // ---------------------------------------------------------------------
  // Dashboard / protección de módulos
  // ---------------------------------------------------------------------
  function enterDashboard(role, displayName) {
    dashboardWelcome.textContent = 'Bienvenido, ' + displayName + ' (' + role + ')';
    showScreen('dashboard');
  }

  // Comprueba el token y decide si se puede mostrar el dashboard,
  // o si hay que regresar a la pantalla de login.
  function protectAndRedirect() {
    if (isAuthenticated()) {
      const role = getRole() || 'user';
      dashboardWelcome.textContent = 'Bienvenido (' + role + ')';
      showScreen('dashboard');
    } else {
      showScreen('roleSelect');
      showMessage('Debes iniciar sesión para continuar.', 'error');
    }
  }

  // ---------------------------------------------------------------------
  // Cerrar sesión
  // ---------------------------------------------------------------------
  btnLogout.addEventListener('click', function () {
    clearSession();
    clearMessage();
    showScreen('roleSelect');
  });

  // ---------------------------------------------------------------------
  // Inicialización al cargar la página / módulo protegido
  // ---------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    if (isAuthenticated()) {
      protectAndRedirect();
    } else {
      showScreen('roleSelect');
    }
  });

  // Exponer utilidades por si otros módulos del proyecto las necesitan
  window.JobConnectAuth = {
    getToken: getToken,
    isAuthenticated: isAuthenticated,
    authorizedFetch: authorizedFetch,
    clearSession: clearSession,
  };
})();