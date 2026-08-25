// public/js/components/interviewsModule.js
import { api } from '../services/apiService.js';
import { Toast } from '../services/toastService.js';

export const InterviewsModule = {
    state: {
        items: []
    },

    init() {
        this.cacheDOM();
        this.bindEvents();
    },

    cacheDOM() {
        this.tbody = document.getElementById('interviewsTbody');
        this.loader = document.getElementById('interviewsLoader');
        this.btnNew = document.getElementById('btnNewInterview');
        this.modal = document.getElementById('interviewModal');
        this.form = document.getElementById('interviewForm');
        this.cancelBtn = document.getElementById('cancelInterviewBtn');
        this.statsElem = document.getElementById('statsInterviews');
        this.submitBtn = this.form ? this.form.querySelector('button[type="submit"]') : null;

        this.idInput = document.getElementById('interviewId');
        this.userIdInput = document.getElementById('interviewUserId');
        this.postIdInput = document.getElementById('interviewPostId');
        this.bodyInput = document.getElementById('interviewBody');
        this.modalTitle = document.getElementById('interviewModalTitle');
    },

    bindEvents() {
        if (this.btnNew) this.btnNew.addEventListener('click', () => this.openModal());
        if (this.cancelBtn) this.cancelBtn.addEventListener('click', () => this.closeModal());
        if (this.form) this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    async loadData(force = false) {
        if (this.state.items.length > 0 && !force) return;
        if (this.loader) this.loader.classList.remove('hidden');

        try {
            const data = await api.get('/comments?limit=10');
            this.state.items = data.comments || [];
            this.render();
            this.updateStats();
        } catch (error) {
            Toast.show('Error al cargar entrevistas: ' + error.message, 'error');
            this.renderError(error.message);
        } finally {
            if (this.loader) this.loader.classList.add('hidden');
        }
    },

    updateStats() {
        if (this.statsElem) {
            this.statsElem.textContent = `${this.state.items.length}`;
        }
    },

    renderError(msg) {
        if (!this.tbody) return;
        this.tbody.innerHTML = `
            <tr>
                <td colspan="5" class="error-state-cell">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <p>Error al cargar entrevistas: ${msg}</p>
                </td>
            </tr>
        `;
    },

    render() {
        if (!this.tbody) return;
        this.tbody.innerHTML = '';

        if (this.state.items.length === 0) {
            this.tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state-cell">
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        <p>No hay entrevistas o notas registradas.</p>
                    </td>
                </tr>
            `;
            return;
        }

        this.state.items.forEach((item) => {
            const tr = document.createElement('tr');
            const userName = item.user?.username || `Usuario ${item.userId || 'N/A'}`;
            tr.innerHTML = `
                <td>${item.id}</td>
                <td>${(item.body || '').substring(0, 60)}${(item.body || '').length > 60 ? '...' : ''}</td>
                <td>${userName}</td>
                <td>${item.postId || 'N/A'}</td>
                <td>
                    <button class="btn btn-small btn-primary edit-btn" data-id="${item.id}">Editar</button>
                    <button class="btn btn-small btn-secondary delete-btn" data-id="${item.id}">Eliminar</button>
                </td>
            `;
            this.tbody.appendChild(tr);
        });

        this.tbody.querySelectorAll('.edit-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => this.handleEdit(e.target.dataset.id));
        });

        this.tbody.querySelectorAll('.delete-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => this.handleDelete(e.target.dataset.id));
        });
    },

    openModal(item = null) {
        if (!this.modal || !this.form) return;

        if (item) {
            this.modalTitle.textContent = 'Editar Entrevista';
            this.idInput.value = item.id;
            this.userIdInput.value = item.userId || '';
            this.postIdInput.value = item.postId || '';
            this.bodyInput.value = item.body || '';
        } else {
            this.modalTitle.textContent = 'Nueva Entrevista';
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
        const item = this.state.items.find((p) => p.id == id);
        if (item) this.openModal(item);
    },

    async handleSubmit(e) {
        e.preventDefault();

        const body = this.bodyInput.value.trim();
        const userId = Number(this.userIdInput.value);
        const postId = Number(this.postIdInput.value);

        if (!body || Number.isNaN(userId) || userId < 1 || Number.isNaN(postId) || postId < 1) {
            Toast.show('Por favor ingresa la nota e IDs válidos (>= 1).', 'error');
            return;
        }

        const payload = { body, userId, postId };
        const id = this.idInput.value;

        if (this.submitBtn) {
            this.submitBtn.disabled = true;
            this.submitBtn.textContent = 'Guardando...';
        }

        try {
            if (id) {
                const res = await api.patch(`/comments/${id}`, payload);
                const index = this.state.items.findIndex((item) => item.id == id);
                if (index !== -1) {
                    this.state.items[index] = { ...this.state.items[index], ...res };
                }
                Toast.show('Entrevista/Nota actualizada con éxito (PATCH)', 'success');
            } else {
                const res = await api.post('/comments/add', payload);
                this.state.items.unshift(res);
                Toast.show('Entrevista/Nota creada con éxito', 'success');
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
        if (!confirm('¿Estás seguro de eliminar esta entrevista/nota?')) return;

        try {
            await api.delete(`/comments/${id}`);
            this.state.items = this.state.items.filter((item) => item.id != id);
            this.render();
            this.updateStats();
            Toast.show('Entrevista eliminada correctamente', 'success');
        } catch (error) {
            Toast.show('Error al eliminar: ' + error.message, 'error');
        }
    }
};
