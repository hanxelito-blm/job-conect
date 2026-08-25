// public/js/components/candidatesModule.js
import { api } from '../services/apiService.js';
import { Toast } from '../services/toastService.js';

export const CandidatesModule = {
    state: {
        users: []
    },
    
    init() {
        this.cacheDOM();
        this.bindEvents();
    },

    cacheDOM() {
        this.tbody = document.getElementById('candidatesTbody');
        this.loader = document.getElementById('candidatesLoader');
        this.btnNew = document.getElementById('btnNewCandidate');
        this.modal = document.getElementById('candidateModal');
        this.form = document.getElementById('candidateForm');
        this.cancelBtn = document.getElementById('cancelCandidateBtn');
        this.statsElem = document.getElementById('statsCandidates');
        this.submitBtn = this.form ? this.form.querySelector('button[type="submit"]') : null;
        
        // Modal inputs
        this.idInput = document.getElementById('candidateId');
        this.firstNameInput = document.getElementById('candidateFirstName');
        this.lastNameInput = document.getElementById('candidateLastName');
        this.emailInput = document.getElementById('candidateEmail');
        this.modalTitle = document.getElementById('candidateModalTitle');
    },

    bindEvents() {
        if (this.btnNew) this.btnNew.addEventListener('click', () => this.openModal());
        if (this.cancelBtn) this.cancelBtn.addEventListener('click', () => this.closeModal());
        if (this.form) this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    async loadData(force = false) {
        if (this.state.users.length > 0 && !force) return;

        if (this.loader) this.loader.classList.remove('hidden');
        try {
            const data = await api.get('/users?limit=10');
            this.state.users = data.users || [];
            this.render();
            this.updateStats();
        } catch (error) {
            Toast.show('Error al cargar candidatos: ' + error.message, 'error');
            this.renderError(error.message);
        } finally {
            if (this.loader) this.loader.classList.add('hidden');
        }
    },

    updateStats() {
        if (this.statsElem) {
            this.statsElem.textContent = `${this.state.users.length}`;
        }
    },

    renderError(msg) {
        if (!this.tbody) return;
        this.tbody.innerHTML = `
            <tr>
                <td colspan="5" class="error-state-cell">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <p>Error al cargar candidatos: ${msg}</p>
                    <button class="btn btn-small btn-primary" onclick="window.location.reload()">Reintentar</button>
                </td>
            </tr>
        `;
    },

    render() {
        if (!this.tbody) return;
        this.tbody.innerHTML = '';

        if (this.state.users.length === 0) {
            this.tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state-cell">
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                        <p>No hay candidatos registrados.</p>
                    </td>
                </tr>
            `;
            return;
        }

        this.state.users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.id}</td>
                <td><strong>${user.firstName} ${user.lastName}</strong></td>
                <td>${user.email}</td>
                <td>${user.phone || 'N/A'}</td>
                <td>
                    <button class="btn btn-small btn-primary edit-btn" data-id="${user.id}">Editar</button>
                    <button class="btn btn-small btn-secondary delete-btn" data-id="${user.id}">Eliminar</button>
                </td>
            `;
            this.tbody.appendChild(tr);
        });

        this.tbody.querySelectorAll('.edit-btn').forEach(btn => 
            btn.addEventListener('click', (e) => this.handleEdit(e.target.dataset.id))
        );
        this.tbody.querySelectorAll('.delete-btn').forEach(btn => 
            btn.addEventListener('click', (e) => this.handleDelete(e.target.dataset.id))
        );
    },

    openModal(user = null) {
        if (!this.modal || !this.form) return;

        if (user) {
            this.modalTitle.textContent = 'Editar Candidato';
            this.idInput.value = user.id;
            this.firstNameInput.value = user.firstName || '';
            this.lastNameInput.value = user.lastName || '';
            this.emailInput.value = user.email || '';
        } else {
            this.modalTitle.textContent = 'Nuevo Candidato';
            this.form.reset();
            this.idInput.value = '';
        }
        this.modal.classList.remove('hidden');
    },

    closeModal() {
        if (this.modal) this.modal.classList.add('hidden');
        if (this.form) this.form.reset();
    },

    handleEdit(id) {
        const user = this.state.users.find(u => u.id == id);
        if (user) this.openModal(user);
    },

    async handleSubmit(e) {
        e.preventDefault();
        
        const firstName = this.firstNameInput.value.trim();
        const lastName = this.lastNameInput.value.trim();
        const email = this.emailInput.value.trim();

        if (!firstName || !lastName || !email) {
            Toast.show('Por favor completa todos los campos requeridos.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Toast.show('Ingresa un correo electrónico válido.', 'error');
            return;
        }

        const payload = { firstName, lastName, email };
        const id = this.idInput.value;

        if (this.submitBtn) {
            this.submitBtn.disabled = true;
            this.submitBtn.textContent = 'Guardando...';
        }

        try {
            if (id) {
                const res = await api.put(`/users/${id}`, payload);
                const index = this.state.users.findIndex(u => u.id == id);
                if (index !== -1) {
                    this.state.users[index] = { ...this.state.users[index], ...res };
                }
                Toast.show('Candidato actualizado con éxito', 'success');
            } else {
                const res = await api.post('/users/add', payload);
                this.state.users.unshift(res); 
                Toast.show('Candidato creado con éxito', 'success');
            }
            this.render();
            this.updateStats();
            this.closeModal();
        } catch (error) {
            Toast.show('Error al guardar: ' + error.message, 'error');
        } finally {
            if (this.submitBtn) {
                this.submitBtn.disabled = false;
                this.submitBtn.textContent = 'Guardar';
            }
        }
    },

    async handleDelete(id) {
        if (!confirm('¿Estás seguro de eliminar este candidato?')) return;

        try {
            await api.delete(`/users/${id}`);
            this.state.users = this.state.users.filter(u => u.id != id);
            this.render();
            this.updateStats();
            Toast.show('Candidato eliminado correctamente', 'success');
        } catch (error) {
            Toast.show('Error al eliminar: ' + error.message, 'error');
        }
    }
};
