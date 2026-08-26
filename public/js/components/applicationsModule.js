// public/js/components/applicationsModule.js
import { api } from '../services/apiService.js';
import { Toast } from '../services/toastService.js';
import { Confirmation } from '../services/confirmationService.js';
import { applications as seedApplications, candidates as seedCandidates, vacancies as seedVacancies } from '../mockData.js';

export const ApplicationsModule = {
    state: {
        posts: []
    },
    
    init() {
        this.cacheDOM();
        this.bindEvents();
    },

    cacheDOM() {
        this.tbody = document.getElementById('applicationsTbody');
        this.loader = document.getElementById('applicationsLoader');
        this.btnNew = document.getElementById('btnNewApplication');
        this.modal = document.getElementById('applicationModal');
        this.form = document.getElementById('applicationForm');
        this.cancelBtn = document.getElementById('cancelApplicationBtn');
        this.statsElem = document.getElementById('statsApplications');
        this.submitBtn = this.form ? this.form.querySelector('button[type="submit"]') : null;
        
        // Modal inputs
        this.idInput = document.getElementById('applicationId');
        this.titleInput = document.getElementById('appTitle');
        this.bodyInput = document.getElementById('appBody');
        this.userIdInput = document.getElementById('appUserId');
        this.modalTitle = document.getElementById('applicationModalTitle');
    },

    bindEvents() {
        if (this.btnNew) this.btnNew.addEventListener('click', () => this.openModal());
        if (this.cancelBtn) this.cancelBtn.addEventListener('click', () => this.closeModal());
        if (this.form) this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    async loadData(force = false) {
        if (this.state.posts.length > 0 && !force) return;

        if (this.loader) this.loader.classList.remove('hidden');
        try {
            this.state.posts = seedApplications.map((application) => ({
                ...application,
                title: seedVacancies.find((vacancy) => vacancy.id === application.vacanteId)?.titulo || application.vacanteId,
                body: application.cartaPresentacion,
                userId: application.candidatoId,
                candidateName: seedCandidates.find((candidate) => candidate.id === application.candidatoId)?.nombreCompleto || application.candidatoId
            }));
            this.render();
            this.updateStats();
        } catch (error) {
            Toast.show('Error al cargar postulaciones: ' + error.message, 'error');
            this.renderError(error.message);
        } finally {
            if (this.loader) this.loader.classList.add('hidden');
        }
    },

    updateStats() {
        if (this.statsElem) {
            this.statsElem.textContent = `${this.state.posts.length}`;
        }
    },

    renderError(msg) {
        if (!this.tbody) return;
        this.tbody.innerHTML = `
            <tr>
                <td colspan="5" class="error-state-cell">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <p>Error al cargar postulaciones: ${msg}</p>
                </td>
            </tr>
        `;
    },

    render() {
        if (!this.tbody) return;
        this.tbody.innerHTML = '';

        if (this.state.posts.length === 0) {
            this.tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state-cell">
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <p>No hay postulaciones registradas.</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        this.state.posts.forEach(post => {
            const tr = document.createElement('tr');
            const estado = post.estado || 'Postulado';
            
            tr.innerHTML = `
                <td>${post.id}</td>
                <td><strong>${post.title}</strong><br><small>${post.candidateName || `Ref: ${post.userId}`}</small></td>
                <td>${(post.body || '').substring(0, 50)}${(post.body || '').length > 50 ? '...' : ''}</td>
                <td><span style="color:var(--primary); font-weight:bold;">${estado}</span></td>
                <td>
                    <button class="btn btn-small btn-primary edit-btn" data-id="${post.id}">Editar</button>
                    <button class="btn btn-small btn-secondary delete-btn" data-id="${post.id}">Eliminar</button>
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

    openModal(post = null) {
        if (!this.modal || !this.form) return;

        if (post) {
            this.modalTitle.textContent = 'Editar Postulación';
            this.idInput.value = post.id;
            this.titleInput.value = post.title || '';
            this.bodyInput.value = post.body || '';
            this.userIdInput.value = post.userId || '';
        } else {
            this.modalTitle.textContent = 'Nueva Postulación';
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
        const post = this.state.posts.find(p => p.id == id);
        if (post) this.openModal(post);
    },

    async handleSubmit(e) {
        e.preventDefault();
        
        const title = this.titleInput.value.trim();
        const body = this.bodyInput.value.trim();
        const userId = parseInt(this.userIdInput.value, 10);

        if (!title || !body || isNaN(userId) || userId < 1) {
            Toast.show('Completa el título, descripción e ID de usuario válido (>= 1).', 'error');
            return;
        }

        const payload = { title, body, userId };
        const id = this.idInput.value;

        if (this.submitBtn) {
            this.submitBtn.disabled = true;
            this.submitBtn.textContent = 'Guardando...';
        }

        try {
            if (id) {
                const res = await api.patch(`/posts/${id}`, payload);
                const index = this.state.posts.findIndex(p => p.id == id);
                if (index !== -1) {
                    this.state.posts[index] = { ...this.state.posts[index], ...res };
                }
                Toast.show('Postulación actualizada con éxito', 'success');
            } else {
                const res = await api.post('/posts/add', payload);
                this.state.posts.unshift(res); 
                Toast.show('Postulación creada con éxito', 'success');
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
        const post = this.state.posts.find((application) => application.id == id);
        if (!await Confirmation.confirm({ type: 'postulación', name: post?.candidateName || post?.title || 'Postulación', id })) return;

        try {
            await api.delete(`/posts/${id}`);
            this.state.posts = this.state.posts.filter(p => p.id != id);
            this.render();
            this.updateStats();
            Toast.show('Postulación eliminada correctamente', 'success');
        } catch (error) {
            Toast.show('Error al eliminar: ' + error.message, 'error');
        }
    }
};
