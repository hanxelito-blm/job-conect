// public/js/components/interviewsModule.js
import { api } from '../services/apiService.js';

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

    async loadData() {
        if (this.state.items.length > 0) return;
        if (this.loader) this.loader.classList.remove('hidden');

        try {
            const data = await api.get('/comments?limit=10');
            this.state.items = data.comments || [];
            this.render();
            if (this.statsElem) this.statsElem.textContent = `${this.state.items.length}`;
        } catch (error) {
            alert('Error al cargar entrevistas: ' + error.message);
        } finally {
            if (this.loader) this.loader.classList.add('hidden');
        }
    },

    render() {
        if (!this.tbody) return;
        this.tbody.innerHTML = '';

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

        if (!body || Number.isNaN(userId) || Number.isNaN(postId)) {
            alert('Campos incompletos o IDs inválidos');
            return;
        }

        const payload = { body, userId, postId };
        const id = this.idInput.value;

        try {
            if (id) {
                const res = await api.put(`/comments/${id}`, payload);
                const index = this.state.items.findIndex((item) => item.id == id);
                if (index !== -1) {
                    this.state.items[index] = { ...this.state.items[index], ...res };
                }
                alert('Entrevista actualizada');
            } else {
                const res = await api.post('/comments/add', payload);
                this.state.items.unshift(res);
                alert('Entrevista creada con éxito');
            }

            this.render();
            if (this.statsElem) this.statsElem.textContent = `${this.state.items.length}`;
            this.closeModal();
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        }
    },

    async handleDelete(id) {
        if (!confirm('¿Estás seguro de eliminar esta entrevista?')) return;

        try {
            await api.delete(`/comments/${id}`);
            this.state.items = this.state.items.filter((item) => item.id != id);
            this.render();
            if (this.statsElem) this.statsElem.textContent = `${this.state.items.length}`;
            alert('Entrevista eliminada');
        } catch (error) {
            alert('Error al eliminar: ' + error.message);
        }
    }
};
