// public/js/components/userManagementModule.js
import { Toast } from '../services/toastService.js';
import { AuthService } from '../services/authService.js';
import { users as mockUsers, userActivityLogs as mockActivityLogs } from '../mockData.js';

const STORAGE_KEY = 'jc_managed_users';
const ACTIVITY_KEY = 'jc_user_activity';
const escapeHtml = (v = '') => String(v).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));

const ROLE_COLORS = {
    administrador: { bg: 'rgba(62, 230, 171, 0.15)', color: 'var(--primary)', border: 'rgba(62, 230, 171, 0.3)' },
    reclutador:    { bg: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', border: 'rgba(139, 92, 246, 0.3)' },
    candidato:     { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' },
    empresa:       { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' }
};

const ACTIVITY_ICONS = {
    login:  `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`,
    modulo: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>`,
    accion: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
    perfil: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
};

export const UserManagementModule = {
    state: {
        users: [],
        activityLogs: [],
        searchTerm: '',
        roleFilter: '',
        editingUserId: null
    },

    init() {
        this.cacheDOM();
        this.bindEvents();
    },

    cacheDOM() {
        this.tbody = document.getElementById('userMgmtTbody');
        this.searchInput = document.getElementById('userMgmtSearch');
        this.roleFilter = document.getElementById('userMgmtRoleFilter');
        this.clearBtn = document.getElementById('userMgmtClearFilters');
        this.newUserBtn = document.getElementById('btnNewUser');
        this.userCountEl = document.getElementById('userMgmtCount');

        // Modal
        this.modal = document.getElementById('userModal');
        this.modalTitle = document.getElementById('userModalTitle');
        this.modalForm = document.getElementById('userForm');
        this.modalIdInput = document.getElementById('userId');
        this.modalNameInput = document.getElementById('userFullName');
        this.modalUsernameInput = document.getElementById('userUsername');
        this.modalEmailInput = document.getElementById('userEmail');
        this.modalPhoneInput = document.getElementById('userPhone');
        this.modalRoleSelect = document.getElementById('userRole');
        this.modalDeptInput = document.getElementById('userDepartment');
        this.modalStatusSelect = document.getElementById('userStatus');
        this.cancelModalBtn = document.getElementById('cancelUserBtn');

        // Activity Drawer
        this.activityDrawer = document.getElementById('userActivityDrawer');
        this.activityBackdrop = document.getElementById('userActivityBackdrop');
        this.activityCloseBtn = document.getElementById('userActivityClose');
        this.activityUserName = document.getElementById('activityUserName');
        this.activityUserRole = document.getElementById('activityUserRole');
        this.activityUserAvatar = document.getElementById('activityUserAvatar');
        this.activityUserEmail = document.getElementById('activityUserEmail');
        this.activityUserStatus = document.getElementById('activityUserStatus');
        this.activityStatSessions = document.getElementById('activityStatSessions');
        this.activityStatModules = document.getElementById('activityStatModules');
        this.activityStatLastIP = document.getElementById('activityStatLastIP');
        this.activityStatLastDate = document.getElementById('activityStatLastDate');
        this.activityTimeline = document.getElementById('activityTimeline');
    },

    bindEvents() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => {
                this.state.searchTerm = this.searchInput.value.trim().toLowerCase();
                this.renderTable();
            });
        }
        if (this.roleFilter) {
            this.roleFilter.addEventListener('change', () => {
                this.state.roleFilter = this.roleFilter.value;
                this.renderTable();
            });
        }
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => {
                this.state.searchTerm = '';
                this.state.roleFilter = '';
                if (this.searchInput) this.searchInput.value = '';
                if (this.roleFilter) this.roleFilter.value = '';
                this.renderTable();
            });
        }
        if (this.newUserBtn) {
            this.newUserBtn.addEventListener('click', () => this.openModal());
        }
        if (this.modalForm) {
            this.modalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveUser();
            });
        }
        if (this.cancelModalBtn) {
            this.cancelModalBtn.addEventListener('click', () => this.closeModal());
        }
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.closeModal();
            });
        }
        if (this.activityCloseBtn) {
            this.activityCloseBtn.addEventListener('click', () => this.closeActivityDrawer());
        }
        if (this.activityBackdrop) {
            this.activityBackdrop.addEventListener('click', () => this.closeActivityDrawer());
        }
    },

    loadData() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            this.state.users = JSON.parse(stored);
        } else {
            this.state.users = JSON.parse(JSON.stringify(mockUsers));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.users));
        }

        const storedActivity = localStorage.getItem(ACTIVITY_KEY);
        if (storedActivity) {
            this.state.activityLogs = JSON.parse(storedActivity);
        } else {
            this.state.activityLogs = JSON.parse(JSON.stringify(mockActivityLogs));
            localStorage.setItem(ACTIVITY_KEY, JSON.stringify(this.state.activityLogs));
        }

        this.renderTable();
    },

    getFilteredUsers() {
        return this.state.users.filter(u => {
            const matchSearch = !this.state.searchTerm ||
                u.nombre.toLowerCase().includes(this.state.searchTerm) ||
                u.email.toLowerCase().includes(this.state.searchTerm) ||
                u.username.toLowerCase().includes(this.state.searchTerm);
            const matchRole = !this.state.roleFilter || u.rol === this.state.roleFilter;
            return matchSearch && matchRole;
        });
    },

    renderTable() {
        if (!this.tbody) return;
        const filtered = this.getFilteredUsers();
        if (this.userCountEl) this.userCountEl.textContent = filtered.length;

        const canEdit = AuthService.canPerformAction('userManagementSection', 'write') ||
                        AuthService.getRole() === 'administrador';

        if (filtered.length === 0) {
            this.tbody.innerHTML = `<tr><td colspan="7" class="empty-table-msg">No se encontraron usuarios con estos filtros.</td></tr>`;
            return;
        }

        this.tbody.innerHTML = filtered.map(u => {
            const initials = u.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            const roleStyle = ROLE_COLORS[u.rol] || ROLE_COLORS.candidato;
            const statusClass = u.estado === 'activo' ? 'status-activo' : 'status-inactivo';
            const statusLabel = u.estado === 'activo' ? 'Activo' : 'Inactivo';
            const userLogs = this.state.activityLogs.filter(l => l.userId === u.id);
            const sessionCount = userLogs.filter(l => l.tipo === 'login').length;

            return `<tr class="user-row" data-user-id="${escapeHtml(u.id)}">
                <td>
                    <div class="user-cell-info">
                        <div class="user-avatar-sm">${initials}</div>
                        <div>
                            <strong class="user-cell-name">${escapeHtml(u.nombre)}</strong>
                            <small class="user-cell-username">@${escapeHtml(u.username)}</small>
                        </div>
                    </div>
                </td>
                <td>${escapeHtml(u.email)}</td>
                <td>
                    <span class="user-role-pill" style="background:${roleStyle.bg};color:${roleStyle.color};border:1px solid ${roleStyle.border}">
                        ${escapeHtml(u.rol.charAt(0).toUpperCase() + u.rol.slice(1))}
                    </span>
                </td>
                <td>${escapeHtml(u.departamento || '—')}</td>
                <td><span class="user-status-dot ${statusClass}"></span>${statusLabel}</td>
                <td>
                    <div class="user-last-access">
                        <span>${escapeHtml(u.ultimoAcceso || '—')}</span>
                        <small>${sessionCount} sesión${sessionCount !== 1 ? 'es' : ''}</small>
                    </div>
                </td>
                <td>
                    <div class="user-actions-cell">
                        <button class="btn-icon user-action-btn" data-action="activity" data-uid="${escapeHtml(u.id)}" title="Ver actividad" aria-label="Ver actividad de ${escapeHtml(u.nombre)}">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                        </button>
                        ${canEdit ? `<button class="btn-icon user-action-btn" data-action="edit" data-uid="${escapeHtml(u.id)}" title="Editar usuario" aria-label="Editar ${escapeHtml(u.nombre)}">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button class="btn-icon user-action-btn user-action-toggle" data-action="toggle" data-uid="${escapeHtml(u.id)}" title="${u.estado === 'activo' ? 'Desactivar' : 'Activar'}" aria-label="${u.estado === 'activo' ? 'Desactivar' : 'Activar'} ${escapeHtml(u.nombre)}">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${u.estado === 'activo' ? '<path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>' : '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>'}</svg>
                        </button>` : ''}
                    </div>
                </td>
            </tr>`;
        }).join('');

        // Bind row actions
        this.tbody.querySelectorAll('.user-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                const uid = btn.dataset.uid;
                if (action === 'activity') this.openActivityDrawer(uid);
                if (action === 'edit') this.openModal(uid);
                if (action === 'toggle') this.toggleUserStatus(uid);
            });
        });
    },

    // ========== MODAL (Create / Edit) ==========
    openModal(userId = null) {
        this.state.editingUserId = userId;
        if (userId) {
            const user = this.state.users.find(u => u.id === userId);
            if (!user) return;
            this.modalTitle.textContent = 'Editar Usuario';
            this.modalIdInput.value = user.id;
            this.modalNameInput.value = user.nombre;
            this.modalUsernameInput.value = user.username;
            this.modalEmailInput.value = user.email;
            this.modalPhoneInput.value = user.telefono;
            this.modalRoleSelect.value = user.rol;
            this.modalDeptInput.value = user.departamento;
            this.modalStatusSelect.value = user.estado;
        } else {
            this.modalTitle.textContent = 'Nuevo Usuario';
            this.modalForm.reset();
            this.modalIdInput.value = '';
            this.modalStatusSelect.value = 'activo';
        }
        this.modal.classList.remove('hidden');
    },

    closeModal() {
        this.modal.classList.add('hidden');
        this.modalForm.reset();
        this.state.editingUserId = null;
    },

    saveUser() {
        const name = this.modalNameInput.value.trim();
        const username = this.modalUsernameInput.value.trim();
        const email = this.modalEmailInput.value.trim();

        if (!name || !username || !email) {
            Toast.show('Nombre, usuario y correo son obligatorios.', 'error');
            return;
        }

        if (this.state.editingUserId) {
            // Edit existing
            const idx = this.state.users.findIndex(u => u.id === this.state.editingUserId);
            if (idx === -1) return;
            this.state.users[idx] = {
                ...this.state.users[idx],
                nombre: name,
                username,
                email,
                telefono: this.modalPhoneInput.value.trim(),
                rol: this.modalRoleSelect.value,
                departamento: this.modalDeptInput.value.trim(),
                estado: this.modalStatusSelect.value
            };
            Toast.show(`Usuario "${name}" actualizado correctamente.`, 'success');
        } else {
            // Create new
            const newId = 'usr-' + String(Date.now()).slice(-6);
            this.state.users.push({
                id: newId,
                nombre: name,
                username,
                email,
                telefono: this.modalPhoneInput.value.trim(),
                rol: this.modalRoleSelect.value,
                departamento: this.modalDeptInput.value.trim(),
                estado: this.modalStatusSelect.value || 'activo',
                fechaCreacion: new Date().toISOString().slice(0, 10),
                ultimoAcceso: '—',
                ip: '—',
                avatarUrl: ''
            });
            Toast.show(`Usuario "${name}" creado exitosamente.`, 'success');
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.users));
        this.closeModal();
        this.renderTable();
    },

    toggleUserStatus(userId) {
        const user = this.state.users.find(u => u.id === userId);
        if (!user) return;
        user.estado = user.estado === 'activo' ? 'inactivo' : 'activo';
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.users));
        Toast.show(`${user.nombre} ahora está ${user.estado}.`, 'info');
        this.renderTable();
    },

    // ========== ACTIVITY DRAWER ==========
    openActivityDrawer(userId) {
        const user = this.state.users.find(u => u.id === userId);
        if (!user) return;

        const logs = this.state.activityLogs.filter(l => l.userId === userId);
        const sessions = logs.filter(l => l.tipo === 'login');
        const modulesVisited = new Set(logs.filter(l => l.tipo === 'modulo').map(l => l.modulo));

        // Fill header
        const initials = user.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        if (this.activityUserAvatar) this.activityUserAvatar.textContent = initials;
        if (this.activityUserName) this.activityUserName.textContent = user.nombre;
        if (this.activityUserRole) {
            const roleStyle = ROLE_COLORS[user.rol] || ROLE_COLORS.candidato;
            this.activityUserRole.textContent = user.rol.charAt(0).toUpperCase() + user.rol.slice(1);
            this.activityUserRole.style.background = roleStyle.bg;
            this.activityUserRole.style.color = roleStyle.color;
            this.activityUserRole.style.border = `1px solid ${roleStyle.border}`;
        }
        if (this.activityUserEmail) this.activityUserEmail.textContent = user.email;
        if (this.activityUserStatus) {
            this.activityUserStatus.textContent = user.estado === 'activo' ? '● Activo' : '○ Inactivo';
            this.activityUserStatus.className = `activity-status-label ${user.estado === 'activo' ? 'active' : 'inactive'}`;
        }

        // Stats
        if (this.activityStatSessions) this.activityStatSessions.textContent = sessions.length;
        if (this.activityStatModules) this.activityStatModules.textContent = modulesVisited.size;
        if (this.activityStatLastIP) this.activityStatLastIP.textContent = user.ip || '—';
        if (this.activityStatLastDate) this.activityStatLastDate.textContent = user.ultimoAcceso || '—';

        // Timeline
        if (this.activityTimeline) {
            if (logs.length === 0) {
                this.activityTimeline.innerHTML = `<div class="activity-empty">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.3;margin-bottom:8px"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <p>No hay actividad registrada para este usuario.</p>
                </div>`;
            } else {
                // Group by date
                const grouped = {};
                logs.forEach(l => {
                    if (!grouped[l.fecha]) grouped[l.fecha] = [];
                    grouped[l.fecha].push(l);
                });

                let html = '';
                Object.keys(grouped).sort((a, b) => b.localeCompare(a)).forEach(date => {
                    const items = grouped[date].sort((a, b) => b.hora.localeCompare(a.hora));
                    html += `<div class="activity-date-group">
                        <div class="activity-date-label">${this.formatDate(date)}</div>
                        ${items.map(item => `
                            <div class="activity-item activity-type-${escapeHtml(item.tipo)}">
                                <div class="activity-icon">${ACTIVITY_ICONS[item.tipo] || ACTIVITY_ICONS.accion}</div>
                                <div class="activity-content">
                                    <span class="activity-desc">${escapeHtml(item.descripcion)}</span>
                                    <div class="activity-meta">
                                        <span class="activity-time">${escapeHtml(item.hora)}</span>
                                        ${item.ip ? `<span class="activity-ip">IP: ${escapeHtml(item.ip)}</span>` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>`;
                });
                this.activityTimeline.innerHTML = html;
            }
        }

        // Show drawer
        if (this.activityDrawer) this.activityDrawer.classList.add('open');
        if (this.activityBackdrop) this.activityBackdrop.classList.remove('hidden');
    },

    closeActivityDrawer() {
        if (this.activityDrawer) this.activityDrawer.classList.remove('open');
        if (this.activityBackdrop) this.activityBackdrop.classList.add('hidden');
    },

    formatDate(dateStr) {
        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        if (dateStr === today) return 'Hoy';
        if (dateStr === yesterday) return 'Ayer';
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
    }
};
