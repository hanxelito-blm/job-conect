"use strict";

/*
 * JobConnect - Client Companies
 *
 * API:
 * GET    /carts
 * POST   /carts
 * PUT    /carts/{id}
 * DELETE /carts/{id}
 *
 * The API base is intentionally relative so the module can be
 * served from the same backend that exposes /carts.
 */

const API_BASE = "/carts";

const STORAGE_KEYS = {
    language: "jobconnect_language",
    theme: "jobconnect_theme",
    colorblindMode: "jobconnect_colorblind_mode",
    userProfile: "jobconnect_user_profile",
    passwordHash: "jobconnect_password_hash"
};

const DEFAULT_PROFILE = {
    firstName: "Alanie",
    lastName: "Castillo",
    email: "recruiter@jobconnect.local",
    phone: "",
    role: "Recruiter"
};

const translations = {
    en: {
        workspace: "CLIENT WORKSPACE",
        clientCompanies: "Client Companies",
        companiesDescription: "Manage the companies that trust JobConnect with their recruitment processes.",
        refresh: "Refresh",
        addCompany: "Add Company",
        totalCompanies: "Total Companies",
        activeCompanies: "Active Companies",
        newCompanies: "New Companies",
        hiringCompanies: "Hiring Processes",
        companies: "Companies",
        companiesListDescription: "Your connected client companies.",
        searchCompanies: "Search companies...",
        allStatuses: "All statuses",
        active: "Active",
        inactive: "Inactive",
        pending: "Pending",
        company: "Company",
        contact: "Contact",
        email: "Email",
        phone: "Phone",
        status: "Status",
        date: "Date",
        actions: "Actions",
        loadingCompanies: "Loading companies...",
        unableLoad: "Unable to load companies",
        tryAgain: "Try Again",
        noCompanies: "No companies found",
        noCompaniesDescription: "Add your first client company to start managing recruitment processes.",
        addFirstCompany: "Add First Company",
        companyDetails: "COMPANY DETAILS",
        account: "ACCOUNT",
        myAccount: "My Account",
        accountDescription: "Manage your recruiter profile and security.",
        profile: "Profile",
        changePassword: "Change Password",
        firstName: "First Name *",
        lastName: "Last Name *",
        role: "Role",
        saveChanges: "Save Changes",
        currentPassword: "Current Password",
        newPassword: "New Password *",
        confirmPassword: "Confirm New Password *",
        updatePassword: "Update Password",
        localPasswordNote: "Password changes are stored locally when no authentication endpoint is available.",
        preferences: "PREFERENCES",
        settings: "Settings",
        settingsDescription: "Personalize your JobConnect workspace.",
        language: "Language",
        languageDescription: "Choose your interface language.",
        appearance: "Appearance",
        appearanceDescription: "Choose light or dark mode.",
        light: "Light",
        dark: "Dark",
        accessibility: "Accessibility",
        accessibilityDescription: "Color schemes for different types of color blindness.",
        normal: "Normal",
        protanopia: "Protanopia",
        deuteranopia: "Deuteranopia",
        tritanopia: "Tritanopia",
        accountSettingsDescription: "Manage profile and security.",
        editProfile: "Edit Profile",
        logout: "Log out",
        companyName: "Company Name *",
        contactPerson: "Contact Person *",
        address: "Address",
        additionalInformation: "Additional Information",
        saveCompany: "Save Company",
        cancel: "Cancel",
        close: "Close",
        editCompany: "Edit Company",
        createCompanyDescription: "Create a new client company.",
        editCompanyDescription: "Update the information of this client company.",
        confirmDeleteTitle: "Delete Company?",
        confirmDeleteMessage: "Are you sure you want to delete this company?",
        deleteCompany: "Delete Company",
        companyCreated: "Company created successfully.",
        companyUpdated: "Company updated successfully.",
        companyDeleted: "Company deleted successfully.",
        unableLoadCompanies: "Unable to load companies.",
        unableCreateCompany: "Unable to create company.",
        unableUpdateCompany: "Unable to update company.",
        unableDeleteCompany: "Unable to delete company.",
        connectionError: "Connection error. Please check your network.",
        invalidInformation: "Please correct the highlighted fields.",
        companyNotFound: "Company not found.",
        invalidCompanyId: "Invalid company ID.",
        unauthorized: "Your session is not authorized for this request.",
        forbidden: "You do not have permission to perform this operation.",
        serverError: "The server encountered an error.",
        unexpectedResponse: "The server returned an unexpected response.",
        required: "This field is required.",
        invalidEmail: "Please enter a valid email address.",
        invalidPhone: "Please enter a valid phone number.",
        minimumLength: "This field is too short.",
        passwordRequired: "Please enter your current password.",
        passwordIncorrect: "The current password is incorrect.",
        passwordMinimum: "Password must contain at least 8 characters.",
        passwordMismatch: "Passwords do not match.",
        profileSaved: "Profile updated successfully.",
        passwordUpdated: "Password updated successfully.",
        loggedOut: "Local session data cleared.",
        companyId: "ID",
        companyNameDetail: "Company Name",
        contactDetail: "Contact",
        emailDetail: "Email",
        phoneDetail: "Phone",
        addressDetail: "Address",
        statusDetail: "Status",
        dateDetail: "Date",
        additionalDetail: "Additional Information",
        yes: "Yes",
        no: "No",
        noResults: "No companies match your search.",
        results: "companies",
        hiringProcess: "Hiring process",
        noHiringProcess: "No hiring process",
        unknown: "Unknown"
    },

    es: {
        workspace: "ESPACIO DE CLIENTES",
        clientCompanies: "Empresas clientes",
        companiesDescription: "Administra las empresas que confían en JobConnect para sus procesos de reclutamiento.",
        refresh: "Actualizar",
        addCompany: "Agregar empresa",
        totalCompanies: "Total de empresas",
        activeCompanies: "Empresas activas",
        newCompanies: "Empresas nuevas",
        hiringCompanies: "Procesos de contratación",
        companies: "Empresas",
        companiesListDescription: "Tus empresas clientes conectadas.",
        searchCompanies: "Buscar empresas...",
        allStatuses: "Todos los estados",
        active: "Activa",
        inactive: "Inactiva",
        pending: "Pendiente",
        company: "Empresa",
        contact: "Contacto",
        email: "Correo",
        phone: "Teléfono",
        status: "Estado",
        date: "Fecha",
        actions: "Acciones",
        loadingCompanies: "Cargando empresas...",
        unableLoad: "No se pudieron cargar las empresas",
        tryAgain: "Intentar de nuevo",
        noCompanies: "No se encontraron empresas",
        noCompaniesDescription: "Agrega tu primera empresa cliente para comenzar a gestionar procesos de reclutamiento.",
        addFirstCompany: "Agregar primera empresa",
        companyDetails: "DETALLES DE LA EMPRESA",
        account: "CUENTA",
        myAccount: "Mi cuenta",
        accountDescription: "Administra tu perfil y seguridad de reclutador.",
        profile: "Perfil",
        changePassword: "Cambiar contraseña",
        firstName: "Nombre *",
        lastName: "Apellido *",
        role: "Cargo",
        saveChanges: "Guardar cambios",
        currentPassword: "Contraseña actual",
        newPassword: "Nueva contraseña *",
        confirmPassword: "Confirmar nueva contraseña *",
        updatePassword: "Actualizar contraseña",
        localPasswordNote: "Los cambios de contraseña se almacenan localmente cuando no existe un endpoint de autenticación.",
        preferences: "PREFERENCIAS",
        settings: "Configuración",
        settingsDescription: "Personaliza tu espacio de trabajo de JobConnect.",
        language: "Idioma",
        languageDescription: "Selecciona el idioma de la interfaz.",
        appearance: "Apariencia",
        appearanceDescription: "Selecciona el modo claro u oscuro.",
        light: "Claro",
        dark: "Oscuro",
        accessibility: "Accesibilidad",
        accessibilityDescription: "Esquemas de color para diferentes tipos de daltonismo.",
        normal: "Normal",
        protanopia: "Protanopía",
        deuteranopia: "Deuteranopía",
        tritanopia: "Tritanopía",
        accountSettingsDescription: "Administra el perfil y la seguridad.",
        editProfile: "Editar perfil",
        logout: "Cerrar sesión",
        companyName: "Nombre de empresa *",
        contactPerson: "Persona de contacto *",
        address: "Dirección",
        additionalInformation: "Información adicional",
        saveCompany: "Guardar empresa",
        cancel: "Cancelar",
        close: "Cerrar",
        editCompany: "Editar empresa",
        createCompanyDescription: "Crea una nueva empresa cliente.",
        editCompanyDescription: "Actualiza la información de esta empresa cliente.",
        confirmDeleteTitle: "¿Eliminar empresa?",
        confirmDeleteMessage: "¿Seguro que deseas eliminar esta empresa?",
        deleteCompany: "Eliminar empresa",
        companyCreated: "Empresa creada correctamente.",
        companyUpdated: "Empresa actualizada correctamente.",
        companyDeleted: "Empresa eliminada correctamente.",
        unableLoadCompanies: "No se pudieron cargar las empresas.",
        unableCreateCompany: "No se pudo crear la empresa.",
        unableUpdateCompany: "No se pudo actualizar la empresa.",
        unableDeleteCompany: "No se pudo eliminar la empresa.",
        connectionError: "Error de conexión. Revisa tu red.",
        invalidInformation: "Corrige los campos marcados.",
        companyNotFound: "Empresa no encontrada.",
        invalidCompanyId: "ID de empresa inválido.",
        unauthorized: "Tu sesión no está autorizada para esta solicitud.",
        forbidden: "No tienes permiso para realizar esta operación.",
        serverError: "El servidor encontró un error.",
        unexpectedResponse: "El servidor devolvió una respuesta inesperada.",
        required: "Este campo es obligatorio.",
        invalidEmail: "Ingresa un correo electrónico válido.",
        invalidPhone: "Ingresa un número de teléfono válido.",
        minimumLength: "Este campo es demasiado corto.",
        passwordRequired: "Ingresa tu contraseña actual.",
        passwordIncorrect: "La contraseña actual es incorrecta.",
        passwordMinimum: "La contraseña debe tener al menos 8 caracteres.",
        passwordMismatch: "Las contraseñas no coinciden.",
        profileSaved: "Perfil actualizado correctamente.",
        passwordUpdated: "Contraseña actualizada correctamente.",
        loggedOut: "Datos de sesión local eliminados.",
        companyId: "ID",
        companyNameDetail: "Nombre de empresa",
        contactDetail: "Contacto",
        emailDetail: "Correo",
        phoneDetail: "Teléfono",
        addressDetail: "Dirección",
        statusDetail: "Estado",
        dateDetail: "Fecha",
        additionalDetail: "Información adicional",
        yes: "Sí",
        no: "No",
        noResults: "Ninguna empresa coincide con la búsqueda.",
        results: "empresas",
        hiringProcess: "Proceso de contratación",
        noHiringProcess: "Sin proceso de contratación",
        unknown: "Desconocido"
    }
};

let currentLanguage = localStorage.getItem(STORAGE_KEYS.language) || "en";
let currentTheme = localStorage.getItem(STORAGE_KEYS.theme) || "dark";
let currentColorblindMode = localStorage.getItem(STORAGE_KEYS.colorblindMode) || "normal";

let companies = [];
let filteredCompanies = [];
let companyToDelete = null;
let activeAccountTab = "profile";
let lastFocusedElement = null;

/* ---------------------------------------------------------
   DOM
--------------------------------------------------------- */

const elements = {
    companiesBody: document.getElementById("companiesBody"),
    loadingState: document.getElementById("loadingState"),
    emptyState: document.getElementById("emptyState"),
    tableErrorState: document.getElementById("tableErrorState"),
    tableErrorMessage: document.getElementById("tableErrorMessage"),
    tableWrapper: document.getElementById("tableWrapper"),
    paginationBar: document.getElementById("paginationBar"),
    resultsCount: document.getElementById("resultsCount"),

    totalCompanies: document.getElementById("totalCompanies"),
    activeCompanies: document.getElementById("activeCompanies"),
    newCompanies: document.getElementById("newCompanies"),
    hiringCompanies: document.getElementById("hiringCompanies"),

    companySearch: document.getElementById("companySearch"),
    statusFilter: document.getElementById("statusFilter"),

    companyModal: document.getElementById("companyModal"),
    companyModalEyebrow: document.getElementById("companyModalEyebrow"),
    companyModalTitle: document.getElementById("companyModalTitle"),
    companyModalDescription: document.getElementById("companyModalDescription"),
    companyForm: document.getElementById("companyForm"),
    companyId: document.getElementById("companyId"),
    companySubmitBtn: document.getElementById("companySubmitBtn"),
    companySubmitText: document.getElementById("companySubmitText"),
    companySubmitLoader: document.getElementById("companySubmitLoader"),

    // Form fields (required for create/edit)
    companyName: document.getElementById("companyName"),
    contactName: document.getElementById("contactName"),
    companyEmail: document.getElementById("companyEmail"),
    companyPhone: document.getElementById("companyPhone"),
    companyAddress: document.getElementById("companyAddress"),
    companyInfo: document.getElementById("companyInfo"),
    companyStatus: document.getElementById("companyStatus"),

    viewModal: document.getElementById("viewModal"),
    companyDetails: document.getElementById("companyDetails"),
    viewModalTitle: document.getElementById("viewModalTitle"),

    accountModal: document.getElementById("accountModal"),
    settingsModal: document.getElementById("settingsModal"),
    confirmModal: document.getElementById("confirmModal"),

    accountTrigger: document.getElementById("accountTrigger"),
    accountMenu: document.getElementById("accountMenu"),

    headerAvatar: document.getElementById("headerAvatar"),
    headerUserName: document.getElementById("headerUserName"),
    headerUserRole: document.getElementById("headerUserRole"),

    accountAvatar: document.getElementById("accountAvatar"),
    accountPreviewName: document.getElementById("accountPreviewName"),
    accountPreviewEmail: document.getElementById("accountPreviewEmail"),

    profileForm: document.getElementById("profileForm"),
    passwordForm: document.getElementById("passwordForm"),

    firstName: document.getElementById("firstName"),
    lastName: document.getElementById("lastName"),
    profileEmail: document.getElementById("profileEmail"),
    profilePhone: document.getElementById("profilePhone"),
    profileRole: document.getElementById("profileRole"),

    currentPassword: document.getElementById("currentPassword"),
    newPassword: document.getElementById("newPassword"),
    confirmPassword: document.getElementById("confirmPassword"),

    colorblindSelect: document.getElementById("colorblindSelect"),

    toastContainer: document.getElementById("toastContainer"),

    confirmMessage: document.getElementById("confirmMessage"),
    confirmDelete: document.getElementById("confirmDelete"),
    confirmCancel: document.getElementById("confirmCancel")
};

/* ---------------------------------------------------------
   Initialization
--------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
    loadPreferences();
    loadUserAccount();
    bindEvents();
    updateTranslations();
    loadCompanies();
}

/* ---------------------------------------------------------
   Authentication
--------------------------------------------------------- */

function getAuthHeaders() {
    const token = localStorage.getItem("token");

    if (!token) {
        return {
            Accept: "application/json",
            "Content-Type": "application/json"
        };
    }

    return {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };
}

/* ---------------------------------------------------------
   API
--------------------------------------------------------- */

async function apiRequest(url, options = {}) {
    const requestOptions = {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...(options.headers || {})
        }
    };

    let response;

    try {
        response = await fetch(url, requestOptions);
    } catch (error) {
        const networkError = new Error("NETWORK_ERROR");
        networkError.cause = error;
        throw networkError;
    }

    let data = null;
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        try {
            data = await response.json();
        } catch {
            if (response.ok) {
                throw new Error("INVALID_JSON");
            }
        }
    } else {
        try {
            const text = await response.text();
            data = text ? { message: text } : null;
        } catch {
            data = null;
        }
    }

    if (!response.ok) {
        const error = new Error(`HTTP_${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

async function fetchCompanies() {
    const data = await apiRequest(API_BASE, {
        method: "GET"
    });

    return normalizeCompaniesResponse(data);
}

async function createCompanyRequest(company) {
    return apiRequest(API_BASE, {
        method: "POST",
        body: JSON.stringify(company)
    });
}

async function updateCompanyRequest(id, company) {
    if (!isValidId(id)) {
        throw new Error("INVALID_ID");
    }

    return apiRequest(`${API_BASE}/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify(company)
    });
}

async function deleteCompanyRequest(id) {
    if (!isValidId(id)) {
        throw new Error("INVALID_ID");
    }

    return apiRequest(`${API_BASE}/${encodeURIComponent(id)}`, {
        method: "DELETE"
    });
}

/* ---------------------------------------------------------
   GET /carts
--------------------------------------------------------- */

async function loadCompanies() {
    setLoadingState(true);
    hideTableError();

    try {
        const data = await fetchCompanies();

        companies = data.map(normalizeCompany);
        applyFilters();
    } catch (error) {
        companies = [];
        filteredCompanies = [];
        renderCompanies();
        updateStatistics();
        showTableError(getFriendlyError(error, "load"));
        showNotification(getFriendlyError(error, "load"), "error");
    } finally {
        setLoadingState(false);
    }
}

/*
 * Supports common API response shapes:
 *
 * [
 *   {...}
 * ]
 *
 * {
 *   carts: [...]
 * }
 *
 * {
 *   data: [...]
 * }
 */
function normalizeCompaniesResponse(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (data && Array.isArray(data.carts)) {
        return data.carts;
    }

    if (data && Array.isArray(data.data)) {
        return data.data;
    }

    if (data && Array.isArray(data.companies)) {
        return data.companies;
    }

    if (data && typeof data === "object" && ("id" in data || "companyName" in data || "name" in data)) {
        return [data];
    }

    throw new Error("INVALID_RESPONSE");
}

/* ---------------------------------------------------------
   Data normalization
--------------------------------------------------------- */

function normalizeCompany(raw, index = 0) {
    const source = raw && typeof raw === "object" ? raw : {};

    const id = source.id ?? source._id ?? source.companyId ?? index + 1;

    const companyName =
        source.companyName ??
        source.company_name ??
        source.name ??
        source.title ??
        `Company ${id}`;

    const contactName =
        source.contactName ??
        source.contact ??
        source.contactPerson ??
        source.contact_person ??
        source.customerName ??
        source.userName ??
        extractCustomerName(source) ??
        "—";

    const email =
        source.email ??
        source.contactEmail ??
        source.contact_email ??
        source.customerEmail ??
        extractCustomerEmail(source) ??
        "—";

    const phone =
        source.phone ??
        source.telephone ??
        source.contactPhone ??
        source.contact_phone ??
        "—";

    const address =
        source.address ??
        source.location ??
        source.companyAddress ??
        source.company_address ??
        "—";

    const status = normalizeStatus(
        source.status ??
        source.companyStatus ??
        source.company_status ??
        source.state
    );

    const date =
        source.createdAt ??
        source.created_at ??
        source.date ??
        source.updatedAt ??
        source.updated_at ??
        null;

    const information =
        source.additionalInformation ??
        source.additional_information ??
        source.description ??
        source.notes ??
        "";

    const hiringProcess = detectHiringProcess(source);

    return {
        ...source,
        id,
        companyName: String(companyName),
        contactName: String(contactName),
        email: String(email),
        phone: String(phone),
        address: String(address),
        status,
        date,
        information,
        hiringProcess,
        raw: source
    };
}

function extractCustomerName(source) {
    if (source.user && typeof source.user === "object") {
        return source.user.name || source.user.username;
    }

    if (source.customer && typeof source.customer === "object") {
        return source.customer.name || source.customer.username;
    }

    return null;
}

function extractCustomerEmail(source) {
    if (source.user && typeof source.user === "object") {
        return source.user.email;
    }

    if (source.customer && typeof source.customer === "object") {
        return source.customer.email;
    }

    return null;
}

function normalizeStatus(value) {
    if (!value) {
        return "active";
    }

    const normalized = String(value).trim().toLowerCase();

    if (
        ["active", "activo", "activa", "enabled", "open"].includes(normalized)
    ) {
        return "active";
    }

    if (
        ["inactive", "inactivo", "inactiva", "disabled", "closed"].includes(normalized)
    ) {
        return "inactive";
    }

    if (
        ["pending", "pendiente", "waiting", "processing"].includes(normalized)
    ) {
        return "pending";
    }

    return "active";
}

function detectHiringProcess(source) {
    const values = [
        source.hiringProcess,
        source.hiringProcesses,
        source.hasHiringProcess,
        source.hasHiringProcesses,
        source.recruitmentProcess,
        source.recruitmentProcesses,
        source.jobs,
        source.openings,
        source.openPositions,
        source.activeJobs
    ];

    for (const value of values) {
        if (Array.isArray(value)) {
            if (value.length > 0) return true;
        }

        if (typeof value === "number" && value > 0) {
            return true;
        }

        if (typeof value === "boolean") {
            if (value) return true;
        }

        if (
            typeof value === "string" &&
            ["true", "yes", "active", "open", "hiring"].includes(value.toLowerCase())
        ) {
            return true;
        }
    }

    return false;
}

/* ---------------------------------------------------------
   Rendering
--------------------------------------------------------- */

function renderCompanies() {
    elements.companiesBody.innerHTML = "";

    if (!filteredCompanies.length) {
        elements.tableWrapper.hidden = true;
        elements.paginationBar.hidden = true;

        if (companies.length === 0) {
            elements.emptyState.hidden = false;
            const emptyText = elements.emptyState.querySelector("p");
            if (emptyText) {
                emptyText.textContent = t("noCompaniesDescription");
            }
        } else {
            elements.emptyState.hidden = false;
            const title = elements.emptyState.querySelector("h3");
            const text = elements.emptyState.querySelector("p");
            const button = document.getElementById("emptyAddBtn");

            if (title) title.textContent = t("noCompanies");
            if (text) text.textContent = t("noResults");
            if (button) button.textContent = t("addFirstCompany");
        }

        return;
    }

    elements.emptyState.hidden = true;
    elements.tableWrapper.hidden = false;
    elements.paginationBar.hidden = false;

    filteredCompanies.forEach(company => {
        elements.companiesBody.appendChild(createCompanyRow(company));
    });

    const count = filteredCompanies.length;
    elements.resultsCount.textContent = `${count} ${t("results")}`;
}

function createCompanyRow(company) {
    const row = document.createElement("tr");

    const initials = getInitials(company.companyName);

    row.innerHTML = `
        <td>
            <div class="company-cell">
                <div class="company-logo">${escapeHtml(initials)}</div>
                <div>
                    <div class="company-name">${escapeHtml(company.companyName)}</div>
                    <span class="company-id">#${escapeHtml(String(company.id))}</span>
                </div>
            </div>
        </td>

        <td>
            <span class="contact-name">${escapeHtml(company.contactName)}</span>
        </td>

        <td>
            <span class="email-cell">${escapeHtml(company.email)}</span>
        </td>

        <td>
            ${escapeHtml(company.phone)}
        </td>

        <td>
            ${createStatusBadge(company.status)}
        </td>

        <td>
            ${escapeHtml(formatDate(company.date))}
        </td>

        <td>
            <div class="action-buttons">
                <button
                    type="button"
                    class="action-btn"
                    data-action="view"
                    data-id="${escapeAttribute(company.id)}"
                    aria-label="${escapeAttribute(t("companyDetails"))}"
                    title="${escapeAttribute(t("companyDetails"))}"
                >
                    ${viewIcon()}
                </button>

                <button
                    type="button"
                    class="action-btn edit"
                    data-action="edit"
                    data-id="${escapeAttribute(company.id)}"
                    aria-label="${escapeAttribute(t("editCompany"))}"
                    title="${escapeAttribute(t("editCompany"))}"
                >
                    ${editIcon()}
                </button>

                <button
                    type="button"
                    class="action-btn delete"
                    data-action="delete"
                    data-id="${escapeAttribute(company.id)}"
                    aria-label="${escapeAttribute(t("deleteCompany"))}"
                    title="${escapeAttribute(t("deleteCompany"))}"
                >
                    ${deleteIcon()}
                </button>
            </div>
        </td>
    `;

    return row;
}

function createStatusBadge(status) {
    const safeStatus = ["active", "inactive", "pending"].includes(status)
        ? status
        : "pending";

    return `
        <span class="status-badge status-${safeStatus}">
            ${escapeHtml(t(safeStatus))}
        </span>
    `;
}

function viewIcon() {
    return `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M2.8 12C5 7.8 8.1 5.5 12 5.5S19 7.8 21.2 12C19 16.2 15.9 18.5 12 18.5S5 16.2 2.8 12Z" stroke="currentColor" stroke-width="1.6"/>
            <circle cx="12" cy="12" r="2.7" stroke="currentColor" stroke-width="1.6"/>
        </svg>
    `;
}

function editIcon() {
    return `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 20L4.8 15.7L15.8 4.7C16.5 4 17.6 4 18.3 4.7L19.3 5.7C20 6.4 20 7.5 19.3 8.2L8.3 19.2L4 20Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
            <path d="M14 6.5L17.5 10" stroke="currentColor" stroke-width="1.6"/>
        </svg>
    `;
}

function deleteIcon() {
    return `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 7H19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M9 7V5H15V7M8 10V18M12 10V18M16 10V18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M7 7L8 20H16L17 7" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        </svg>
    `;
}

/* ---------------------------------------------------------
   Statistics
--------------------------------------------------------- */

function updateStatistics() {
    const total = companies.length;

    const active = companies.filter(
        company => company.status === "active"
    ).length;

    const newCompanies = companies.filter(
        company => isRecentlyAdded(company.date)
    ).length;

    const hiring = companies.filter(
        company => company.hiringProcess
    ).length;

    elements.totalCompanies.textContent = total;
    elements.activeCompanies.textContent = active;
    elements.newCompanies.textContent = newCompanies;
    elements.hiringCompanies.textContent = hiring;
}

function isRecentlyAdded(dateValue) {
    if (!dateValue) return false;

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return false;
    }

    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    return now - date.getTime() <= thirtyDays && date.getTime() <= now;
}

/* ---------------------------------------------------------
   Filtering
--------------------------------------------------------- */

function applyFilters() {
    const search = elements.companySearch.value.trim().toLowerCase();
    const status = elements.statusFilter.value;

    filteredCompanies = companies.filter(company => {
        const matchesSearch =
            !search ||
            [
                company.companyName,
                company.contactName,
                company.email,
                company.phone,
                company.address
            ].some(value =>
                String(value).toLowerCase().includes(search)
            );

        const matchesStatus =
            status === "all" ||
            company.status === status;

        return matchesSearch && matchesStatus;
    });

    renderCompanies();
    updateStatistics();
}

/* ---------------------------------------------------------
   Create / Edit modal
--------------------------------------------------------- */

function openCreateModal() {
    lastFocusedElement = document.activeElement;

    resetCompanyForm();

    elements.companyModalEyebrow.textContent = "COMPANY";
    elements.companyModalTitle.textContent = t("addCompany");
    elements.companyModalDescription.textContent = t("createCompanyDescription");
    elements.companySubmitText.textContent = t("saveCompany");

    showModal(elements.companyModal);

    setTimeout(() => {
        elements.companyName.focus();
    }, 50);
}

function openEditModal(id) {
    const company = findCompany(id);

    if (!company) {
        showNotification(t("companyNotFound"), "error");
        return;
    }

    lastFocusedElement = document.activeElement;

    clearCompanyErrors();

    elements.companyId.value = company.id;
    elements.companyName.value = company.companyName === "—" ? "" : company.companyName;
    elements.contactName.value = company.contactName === "—" ? "" : company.contactName;
    elements.companyEmail.value = company.email === "—" ? "" : company.email;
    elements.companyPhone.value = company.phone === "—" ? "" : company.phone;
    elements.companyAddress.value = company.address === "—" ? "" : company.address;
    elements.companyInfo.value = company.information || "";
    elements.companyStatus.value = company.status;

    elements.companyModalEyebrow.textContent = "COMPANY";
    elements.companyModalTitle.textContent = t("editCompany");
    elements.companyModalDescription.textContent = t("editCompanyDescription");
    elements.companySubmitText.textContent = t("editCompany");

    showModal(elements.companyModal);

    setTimeout(() => {
        elements.companyName.focus();
    }, 50);
}

function resetCompanyForm() {
    elements.companyForm.reset();
    elements.companyId.value = "";
    elements.companyStatus.value = "active";
    clearCompanyErrors();
}

function clearCompanyErrors() {
    document.querySelectorAll("#companyForm .field-error").forEach(
        element => {
            element.textContent = "";
        }
    );

    document.querySelectorAll("#companyForm .form-field").forEach(
        element => {
            element.classList.remove("invalid");
        }
    );
}

/* ---------------------------------------------------------
   POST /carts
--------------------------------------------------------- */

async function createCompany() {
    const validation = validateCompany();

    if (!validation.valid) {
        showNotification(t("invalidInformation"), "error");
        return;
    }

    setCompanySubmitLoading(true);

    try {
        const response = await createCompanyRequest(validation.data);

        const createdSource =
            response?.company ??
            response?.data ??
            response?.cart ??
            response;

        if (!createdSource || typeof createdSource !== "object") {
            throw new Error("INVALID_RESPONSE");
        }

        const createdCompany = normalizeCompany(createdSource);

        /*
         * The response from the server is the source of truth.
         * We only update the local UI after POST succeeds.
         */
        companies.push(createdCompany);

        applyFilters();
        closeModal(elements.companyModal);
        resetCompanyForm();

        showNotification(t("companyCreated"), "success");
    } catch (error) {
        showNotification(getFriendlyError(error, "create"), "error");
    } finally {
        setCompanySubmitLoading(false);
    }
}

/* ---------------------------------------------------------
   PUT /carts/{id}
--------------------------------------------------------- */

async function updateCompany() {
    const id = elements.companyId.value;

    if (!isValidId(id)) {
        showNotification(t("invalidCompanyId"), "error");
        return;
    }

    const existing = findCompany(id);

    if (!existing) {
        showNotification(t("companyNotFound"), "error");
        return;
    }

    const validation = validateCompany();

    if (!validation.valid) {
        showNotification(t("invalidInformation"), "error");
        return;
    }

    setCompanySubmitLoading(true);

    try {
        const response = await updateCompanyRequest(id, validation.data);

        const updatedSource =
            response?.company ??
            response?.data ??
            response?.cart ??
            response;

        if (!updatedSource || typeof updatedSource !== "object") {
            throw new Error("INVALID_RESPONSE");
        }

        const updatedCompany = normalizeCompany({
            ...existing.raw,
            ...updatedSource,
            id
        });

        const index = companies.findIndex(
            company => String(company.id) === String(id)
        );

        if (index === -1) {
            throw new Error("NOT_FOUND");
        }

        companies[index] = updatedCompany;

        applyFilters();
        closeModal(elements.companyModal);
        resetCompanyForm();

        showNotification(t("companyUpdated"), "success");
    } catch (error) {
        showNotification(getFriendlyError(error, "update"), "error");
    } finally {
        setCompanySubmitLoading(false);
    }
}

function buildCompanyPayload() {
    return {
        companyName: elements.companyName.value.trim(),
        contactName: elements.contactName.value.trim(),
        email: elements.companyEmail.value.trim(),
        phone: elements.companyPhone.value.trim(),
        address: elements.companyAddress.value.trim(),
        status: elements.companyStatus.value,
        additionalInformation: elements.companyInfo.value.trim()
    };
}

/* ---------------------------------------------------------
   DELETE /carts/{id}
--------------------------------------------------------- */

function requestDeleteCompany(id) {
    const company = findCompany(id);

    if (!company) {
        showNotification(t("companyNotFound"), "error");
        return;
    }

    if (!isValidId(company.id)) {
        showNotification(t("invalidCompanyId"), "error");
        return;
    }

    companyToDelete = company;

    elements.confirmMessage.textContent =
        `${t("confirmDeleteMessage")} "${company.companyName}"`;

    lastFocusedElement = document.activeElement;
    showModal(elements.confirmModal);

    setTimeout(() => {
        elements.confirmDelete.focus();
    }, 50);
}

async function deleteCompany(id) {
    if (!isValidId(id)) {
        showNotification(t("invalidCompanyId"), "error");
        return;
    }

    const existing = findCompany(id);

    if (!existing) {
        showNotification(t("companyNotFound"), "error");
        return;
    }

    setDeleteLoading(true);

    try {
        await deleteCompanyRequest(id);

        /*
         * Only mutate the UI after DELETE succeeds.
         */
        companies = companies.filter(
            company => String(company.id) !== String(id)
        );

        applyFilters();

        closeModal(elements.confirmModal);
        companyToDelete = null;

        showNotification(t("companyDeleted"), "success");
    } catch (error) {
        showNotification(getFriendlyError(error, "delete"), "error");
    } finally {
        setDeleteLoading(false);
    }
}

/* ---------------------------------------------------------
   View
--------------------------------------------------------- */

function viewCompany(id) {
    const company = findCompany(id);

    if (!company) {
        showNotification(t("companyNotFound"), "error");
        return;
    }

    lastFocusedElement = document.activeElement;

    elements.viewModalTitle.textContent = company.companyName;

    const details = [
        [t("companyId"), company.id],
        [t("companyNameDetail"), company.companyName],
        [t("contactDetail"), company.contactName],
        [t("emailDetail"), company.email],
        [t("phoneDetail"), company.phone],
        [t("addressDetail"), company.address],
        [t("statusDetail"), createStatusBadge(company.status), true],
        [t("dateDetail"), formatDate(company.date)],
        [
            t("additionalDetail"),
            company.information || t("unknown"),
            false,
            true
        ],
        [
            t("hiringProcess"),
            company.hiringProcess ? t("yes") : t("no"),
            false
        ]
    ];

    elements.companyDetails.innerHTML = details
        .map(([label, value, isHtml = false, full = false]) => `
            <div class="detail-item ${full ? "full" : ""}">
                <span class="detail-label">${escapeHtml(label)}</span>
                <div class="detail-value">
                    ${isHtml ? value : escapeHtml(String(value))}
                </div>
            </div>
        `)
        .join("");

    showModal(elements.viewModal);
}

/* ---------------------------------------------------------
   Validation
--------------------------------------------------------- */

function validateCompany() {
    clearCompanyErrors();

    const data = buildCompanyPayload();
    let valid = true;

    if (!data.companyName) {
        setFieldError("companyName", t("required"));
        valid = false;
    } else if (data.companyName.length < 2) {
        setFieldError("companyName", t("minimumLength"));
        valid = false;
    }

    if (!data.contactName) {
        setFieldError("contactName", t("required"));
        valid = false;
    } else if (data.contactName.length < 2) {
        setFieldError("contactName", t("minimumLength"));
        valid = false;
    }

    if (!data.email) {
        setFieldError("companyEmail", t("required"));
        valid = false;
    } else if (!isValidEmail(data.email)) {
        setFieldError("companyEmail", t("invalidEmail"));
        valid = false;
    }

    if (!data.phone) {
        setFieldError("companyPhone", t("required"));
        valid = false;
    } else if (!isValidPhone(data.phone)) {
        setFieldError("companyPhone", t("invalidPhone"));
        valid = false;
    }

    return {
        valid,
        data
    };
}

function setFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}Error`);

    if (input) {
        input.closest(".form-field")?.classList.add("invalid");
    }

    if (error) {
        error.textContent = message;
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

function isValidPhone(phone) {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
}

function isValidId(id) {
    if (id === null || id === undefined || String(id).trim() === "") {
        return false;
    }

    return /^[a-zA-Z0-9_-]+$/.test(String(id));
}

/* ---------------------------------------------------------
   Account
--------------------------------------------------------- */

function getUserProfile() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.userProfile);

        if (!stored) {
            return { ...DEFAULT_PROFILE };
        }

        const parsed = JSON.parse(stored);

        return {
            ...DEFAULT_PROFILE,
            ...parsed
        };
    } catch {
        return { ...DEFAULT_PROFILE };
    }
}

function loadUserAccount() {
    const profile = getUserProfile();

    elements.firstName.value = profile.firstName;
    elements.lastName.value = profile.lastName;
    elements.profileEmail.value = profile.email;
    elements.profilePhone.value = profile.phone || "";
    elements.profileRole.value = profile.role || "Recruiter";

    updateAccountVisuals(profile);
}

function updateAccountVisuals(profile) {
    const fullName = `${profile.firstName} ${profile.lastName}`.trim() || "Recruiter";
    const initials = getInitials(fullName);

    elements.headerAvatar.textContent = initials;
    elements.accountAvatar.textContent = initials;

    elements.headerUserName.textContent = fullName;
    elements.headerUserRole.textContent = profile.role || "Recruiter";

    elements.accountPreviewName.textContent = fullName;
    elements.accountPreviewEmail.textContent = profile.email;
}

function saveUserAccount() {
    clearProfileErrors();

    const profile = {
        firstName: elements.firstName.value.trim(),
        lastName: elements.lastName.value.trim(),
        email: elements.profileEmail.value.trim(),
        phone: elements.profilePhone.value.trim(),
        role: elements.profileRole.value.trim()
    };

    let valid = true;

    if (!profile.firstName) {
        setProfileError("firstName", t("required"));
        valid = false;
    }

    if (!profile.lastName) {
        setProfileError("lastName", t("required"));
        valid = false;
    }

    if (!profile.email || !isValidEmail(profile.email)) {
        setProfileError("profileEmail", t("invalidEmail"));
        valid = false;
    }

    if (profile.phone && !isValidPhone(profile.phone)) {
        setProfileError("profilePhone", t("invalidPhone"));
        valid = false;
    }

    if (!valid) {
        showNotification(t("invalidInformation"), "error");
        return;
    }

    localStorage.setItem(
        STORAGE_KEYS.userProfile,
        JSON.stringify(profile)
    );

    updateAccountVisuals(profile);
    showNotification(t("profileSaved"), "success");
}

function clearProfileErrors() {
    document.querySelectorAll("#profileForm .field-error").forEach(
        element => element.textContent = ""
    );

    document.querySelectorAll("#profileForm .form-field").forEach(
        element => element.classList.remove("invalid")
    );
}

function setProfileError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}Error`);

    input?.closest(".form-field")?.classList.add("invalid");

    if (error) {
        error.textContent = message;
    }
}

async function changePassword() {
    clearPasswordErrors();

    const current = elements.currentPassword.value;
    const next = elements.newPassword.value;
    const confirmation = elements.confirmPassword.value;

    let valid = true;

    const storedHash = localStorage.getItem(STORAGE_KEYS.passwordHash);

    if (storedHash) {
        if (!current) {
            setPasswordError("currentPassword", t("passwordRequired"));
            valid = false;
        } else {
            const currentHash = await hashPassword(current);

            if (currentHash !== storedHash) {
                setPasswordError("currentPassword", t("passwordIncorrect"));
                valid = false;
            }
        }
    }

    if (next.length < 8) {
        setPasswordError("newPassword", t("passwordMinimum"));
        valid = false;
    }

    if (next !== confirmation) {
        setPasswordError("confirmPassword", t("passwordMismatch"));
        valid = false;
    }

    if (!valid) {
        showNotification(t("invalidInformation"), "error");
        return;
    }

    const hash = await hashPassword(next);

    localStorage.setItem(STORAGE_KEYS.passwordHash, hash);

    elements.passwordForm.reset();

    showNotification(t("passwordUpdated"), "success");
}

function clearPasswordErrors() {
    document.querySelectorAll("#passwordForm .field-error").forEach(
        element => element.textContent = ""
    );

    document.querySelectorAll("#passwordForm .form-field").forEach(
        element => element.classList.remove("invalid")
    );
}

function setPasswordError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}Error`);

    input?.closest(".form-field")?.classList.add("invalid");

    if (error) {
        error.textContent = message;
    }
}

async function hashPassword(password) {
    if (window.crypto?.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const buffer = await crypto.subtle.digest("SHA-256", data);

        return [...new Uint8Array(buffer)]
            .map(byte => byte.toString(16).padStart(2, "0"))
            .join("");
    }

    /*
     * Fallback for environments without Web Crypto.
     * This is only used when SubtleCrypto is unavailable.
     */
    let hash = 0;

    for (let i = 0; i < password.length; i++) {
        hash = ((hash << 5) - hash) + password.charCodeAt(i);
        hash |= 0;
    }

    return String(hash);
}

/* ---------------------------------------------------------
   Preferences
--------------------------------------------------------- */

function loadPreferences() {
    applyLanguage(currentLanguage);
    applyTheme(currentTheme);
    applyColorblindMode(currentColorblindMode);
}

function setLanguage(language) {
    if (!["en", "es"].includes(language)) {
        return;
    }

    currentLanguage = language;

    localStorage.setItem(
        STORAGE_KEYS.language,
        language
    );

    applyLanguage(language);
    renderCompanies();
    updateStatistics();
}

function applyLanguage(language) {
    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.dataset.i18n;

        if (translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
        const key = element.dataset.i18nPlaceholder;

        if (translations[language][key]) {
            element.placeholder = translations[language][key];
        }
    });

    document.querySelectorAll(".language-btn").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.language === language
        );
    });

    updateModalLanguage();
}

function updateTranslations() {
    applyLanguage(currentLanguage);
}

function updateModalLanguage() {
    if (elements.companyId.value) {
        elements.companyModalTitle.textContent = t("editCompany");
        elements.companyModalDescription.textContent = t("editCompanyDescription");
        elements.companySubmitText.textContent = t("editCompany");
    }
}

function setTheme(theme) {
    if (!["light", "dark"].includes(theme)) {
        return;
    }

    currentTheme = theme;

    localStorage.setItem(
        STORAGE_KEYS.theme,
        theme
    );

    applyTheme(theme);
}

function applyTheme(theme) {
    const isLight = theme === "light";
    document.documentElement.classList.toggle("light-mode", isLight);
    document.body.classList.toggle("light-theme", isLight);

    document.querySelectorAll("[data-setting-theme]").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.settingTheme === theme
        );
    });
}

function setColorblindMode(mode) {
    const validModes = [
        "normal",
        "protanopia",
        "deuteranopia",
        "tritanopia"
    ];

    if (!validModes.includes(mode)) {
        mode = "normal";
    }

    currentColorblindMode = mode;

    localStorage.setItem(
        STORAGE_KEYS.colorblindMode,
        mode
    );

    applyColorblindMode(mode);
}

function applyColorblindMode(mode) {
    document.body.classList.remove(
        "colorblind-protanopia",
        "colorblind-deuteranopia",
        "colorblind-tritanopia"
    );

    if (mode !== "normal") {
        document.body.classList.add(`colorblind-${mode}`);
    }

    if (elements.colorblindSelect) {
        elements.colorblindSelect.value = mode;
    }
}

/* ---------------------------------------------------------
   Settings / account UI
--------------------------------------------------------- */

function openAccountModal(tab = "profile") {
    loadUserAccount();
    switchAccountTab(tab);
    showModal(elements.accountModal);
}

function switchAccountTab(tab) {
    activeAccountTab = tab;

    document.querySelectorAll("[data-account-tab]").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.accountTab === tab
        );
    });

    document.querySelectorAll(".account-tab-content").forEach(section => {
        section.classList.toggle(
            "active",
            section.id === `${tab}Tab`
        );
    });
}

function openSettingsModal() {
    applyTheme(currentTheme);
    applyColorblindMode(currentColorblindMode);

    document.querySelectorAll("[data-setting-language]").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.settingLanguage === currentLanguage
        );
    });

    showModal(elements.settingsModal);
}

function logoutLocalSession() {
    /*
     * Only local profile/preferences are cleared here.
     * If the existing authentication system uses another logout
     * contract, replace this section with its real endpoint.
     */
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("accessToken");

    showNotification(t("loggedOut"), "success");
}

/* ---------------------------------------------------------
   Modal management
--------------------------------------------------------- */

function showModal(modal) {
    if (!modal) return;

    lastFocusedElement = lastFocusedElement || document.activeElement;

    modal.hidden = false;
    document.body.style.overflow = "hidden";

    trapFocus(modal);
}

function closeModal(modal) {
    if (!modal) return;

    modal.hidden = true;

    const anotherOpenModal = document.querySelector(
        ".modal-overlay:not([hidden])"
    );

    if (!anotherOpenModal) {
        document.body.style.overflow = "";
    }

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        setTimeout(() => lastFocusedElement.focus(), 0);
    }

    lastFocusedElement = null;
}

function closeAllModals() {
    document.querySelectorAll(".modal-overlay:not([hidden])").forEach(
        modal => {
            modal.hidden = true;
        }
    );

    document.body.style.overflow = "";
    companyToDelete = null;
}

function trapFocus(modal) {
    const focusable = modal.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    modal.onkeydown = event => {
        if (event.key !== "Tab") return;

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    };
}

/* ---------------------------------------------------------
   UI states
--------------------------------------------------------- */

function setLoadingState(isLoading) {
    elements.loadingState.hidden = !isLoading;

    if (isLoading) {
        elements.tableWrapper.hidden = true;
        elements.emptyState.hidden = true;
        elements.paginationBar.hidden = true;
        elements.tableErrorState.hidden = true;
    }
}

function showTableError(message) {
    elements.tableErrorState.hidden = false;
    elements.tableErrorMessage.textContent = message;

    elements.tableWrapper.hidden = true;
    elements.emptyState.hidden = true;
    elements.paginationBar.hidden = true;
}

function hideTableError() {
    elements.tableErrorState.hidden = true;
    elements.tableErrorMessage.textContent = "";
}

function setCompanySubmitLoading(isLoading) {
    elements.companySubmitBtn.disabled = isLoading;
    elements.companySubmitText.hidden = isLoading;
    elements.companySubmitLoader.hidden = !isLoading;
}

function setDeleteLoading(isLoading) {
    elements.confirmDelete.disabled = isLoading;

    if (isLoading) {
        elements.confirmDelete.textContent = currentLanguage === "es"
            ? "Eliminando..."
            : "Deleting...";
    } else {
        elements.confirmDelete.textContent = t("deleteCompany");
    }
}

/* ---------------------------------------------------------
   Notifications
--------------------------------------------------------- */

function showNotification(message, type = "success") {
    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.innerHTML = `
        <div class="toast-icon">
            ${toastIcon(type)}
        </div>
        <div>
            <strong>${escapeHtml(
                type === "success"
                    ? "JobConnect"
                    : type === "error"
                        ? "JobConnect"
                        : "JobConnect"
            )}</strong>
            <p>${escapeHtml(message)}</p>
        </div>
    `;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("removing");

        setTimeout(() => {
            toast.remove();
        }, 180);
    }, 4000);
}

function toastIcon(type) {
    if (type === "error") {
        return `
            <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.7"/>
                <path d="M12 7V13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                <circle cx="12" cy="16.5" r="1" fill="currentColor"/>
            </svg>
        `;
    }

    if (type === "warning") {
        return `
            <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 3L21 20H3L12 3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
                <path d="M12 9V14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                <circle cx="12" cy="17" r="1" fill="currentColor"/>
            </svg>
        `;
    }

    return `
        <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.7"/>
            <path d="M8 12.2L10.7 14.8L16.3 9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
}

/* ---------------------------------------------------------
   Error handling
--------------------------------------------------------- */

function handleError(error, operation = "load") {
    const message = getFriendlyError(error, operation);
    showNotification(message, "error");
}

function getFriendlyError(error, operation) {
    if (!error) {
        return t(`unable${capitalize(operation)}Company`);
    }

    if (error.message === "NETWORK_ERROR") {
        return t("connectionError");
    }

    if (error.message === "INVALID_JSON") {
        return t("unexpectedResponse");
    }

    if (error.message === "INVALID_RESPONSE") {
        return t("unexpectedResponse");
    }

    if (error.message === "INVALID_ID") {
        return t("invalidCompanyId");
    }

    if (error.message === "NOT_FOUND") {
        return t("companyNotFound");
    }

    switch (error.status) {
        case 400:
            return t("invalidInformation");

        case 401:
            return t("unauthorized");

        case 403:
            return t("forbidden");

        case 404:
            return operation === "delete" ||
                operation === "update"
                ? t("companyNotFound")
                : t(`unable${capitalize(operation)}Company`);

        case 500:
        case 502:
        case 503:
            return t("serverError");

        default:
            if (operation === "load") {
                return t("unableLoadCompanies");
            }

            return t(`unable${capitalize(operation)}Company`);
    }
}

/* ---------------------------------------------------------
   Events
--------------------------------------------------------- */

function bindEvents() {
    document.querySelectorAll(".language-btn").forEach(button => {
        button.addEventListener("click", () => {
            setLanguage(button.dataset.language);
        });
    });

    document.getElementById("refreshBtn").addEventListener(
        "click",
        loadCompanies
    );

    document.getElementById("refreshCompaniesBtn").addEventListener(
        "click",
        loadCompanies
    );

    document.getElementById("retryBtn").addEventListener(
        "click",
        loadCompanies
    );

    document.getElementById("addCompanyBtn").addEventListener(
        "click",
        openCreateModal
    );

    document.getElementById("emptyAddBtn").addEventListener(
        "click",
        openCreateModal
    );

    elements.companyForm.addEventListener("submit", async event => {
        event.preventDefault();

        if (elements.companyId.value) {
            await updateCompany();
        } else {
            await createCompany();
        }
    });

    elements.companySearch.addEventListener(
        "input",
        applyFilters
    );

    elements.statusFilter.addEventListener(
        "change",
        applyFilters
    );

    elements.companiesBody.addEventListener("click", event => {
        const button = event.target.closest("[data-action]");

        if (!button) return;

        const action = button.dataset.action;
        const id = button.dataset.id;

        if (action === "view") {
            viewCompany(id);
        }

        if (action === "edit") {
            openEditModal(id);
        }

        if (action === "delete") {
            requestDeleteCompany(id);
        }
    });

    elements.accountTrigger.addEventListener("click", toggleAccountMenu);

    document.addEventListener("click", event => {
        if (!elements.accountTrigger.contains(event.target) &&
            !elements.accountMenu.contains(event.target)) {
            closeAccountMenu();
        }
    });

    document.querySelectorAll("[data-account-action]").forEach(button => {
        button.addEventListener("click", () => {
            closeAccountMenu();

            const action = button.dataset.accountAction;

            if (action === "profile") {
                openAccountModal("profile");
            }

            if (action === "settings") {
                openSettingsModal();
            }

            if (action === "logout") {
                logoutLocalSession();
            }
        });
    });

    document.querySelectorAll("[data-account-tab]").forEach(button => {
        button.addEventListener("click", () => {
            switchAccountTab(button.dataset.accountTab);
        });
    });

    elements.profileForm.addEventListener("submit", event => {
        event.preventDefault();
        saveUserAccount();
    });

    elements.passwordForm.addEventListener("submit", async event => {
        event.preventDefault();
        await changePassword();
    });

    document.querySelectorAll("[data-setting-language]").forEach(button => {
        button.addEventListener("click", () => {
            setLanguage(button.dataset.settingLanguage);
        });
    });

    document.querySelectorAll("[data-setting-theme]").forEach(button => {
        button.addEventListener("click", () => {
            setTheme(button.dataset.settingTheme);
        });
    });

    elements.colorblindSelect.addEventListener("change", event => {
        setColorblindMode(event.target.value);
    });

    document.getElementById("editProfileShortcut").addEventListener(
        "click",
        () => {
            closeModal(elements.settingsModal);
            openAccountModal("profile");
        }
    );

    document.getElementById("changePasswordShortcut").addEventListener(
        "click",
        () => {
            closeModal(elements.settingsModal);
            openAccountModal("password");
        }
    );

    document.querySelectorAll("[data-close-modal]").forEach(button => {
        button.addEventListener("click", () => {
            const modalId = button.dataset.closeModal;
            closeModal(document.getElementById(modalId));
        });
    });

    elements.confirmCancel.addEventListener("click", () => {
        closeModal(elements.confirmModal);
        companyToDelete = null;
    });

    elements.confirmDelete.addEventListener("click", async () => {
        if (!companyToDelete) return;

        await deleteCompany(companyToDelete.id);
    });

    document.querySelectorAll(".modal-overlay").forEach(overlay => {
        overlay.addEventListener("mousedown", event => {
            if (event.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeAccountMenu();

            const openModal = document.querySelector(
                ".modal-overlay:not([hidden])"
            );

            if (openModal) {
                closeModal(openModal);
            }
        }
    });
}

/* ---------------------------------------------------------
   Account menu
--------------------------------------------------------- */

function toggleAccountMenu() {
    const isHidden = elements.accountMenu.hidden;

    elements.accountMenu.hidden = !isHidden;
    elements.accountTrigger.setAttribute(
        "aria-expanded",
        String(isHidden)
    );
}

function closeAccountMenu() {
    elements.accountMenu.hidden = true;
    elements.accountTrigger.setAttribute(
        "aria-expanded",
        "false"
    );
}

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */

function findCompany(id) {
    return companies.find(
        company => String(company.id) === String(id)
    );
}

function getInitials(name) {
    const words = String(name)
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (!words.length) {
        return "CO";
    }

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function formatDate(value) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return new Intl.DateTimeFormat(
        currentLanguage === "es" ? "es-CR" : "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    ).format(date);
}

function t(key) {
    return translations[currentLanguage]?.[key] ||
        translations.en[key] ||
        key;
}

function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
    return escapeHtml(value);
}

/* ---------------------------------------------------------
   Exposed functions
   Useful if another JobConnect module needs to invoke them.
--------------------------------------------------------- */

window.JobConnectCompanies = {
    loadCompanies,
    renderCompanies,
    openCreateModal,
    openEditModal,
    viewCompany,
    createCompany,
    updateCompany,
    deleteCompany,
    validateCompany,
    showNotification,
    handleError,
    setLanguage,
    translateInterface: updateTranslations,
    loadUserAccount,
    saveUserAccount,
    changePassword,
    setTheme,
    setColorblindMode,
    loadPreferences,
    savePreferences: () => {
        localStorage.setItem(STORAGE_KEYS.language, currentLanguage);
        localStorage.setItem(STORAGE_KEYS.theme, currentTheme);
        localStorage.setItem(STORAGE_KEYS.colorblindMode, currentColorblindMode);
    }
};