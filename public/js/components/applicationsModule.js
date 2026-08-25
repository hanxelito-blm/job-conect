// public/js/components/applicationsModule.js
import { api } from '../services/apiService.js';

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
        
        // Modal inputs
        this.idInput = document.getElementById('applicationId');
        this.titleInput = document.getElementById('appTitle');
        this.bodyInput = document.getElementById('appBody');
        this.userIdInput = document.getElementById('appUserId');
        this.modalTitle = document.getElementById('applicationModalTitle');
    },

    bindEvents() {
        this.btnNew.addEventListener('click', () => this.openModal());
        this.cancelBtn.addEventListener('click', () => this.closeModal());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    async loadData() {
        if (this.state.posts.length > 0) return; // Ya cargado

        this.loader.classList.remove('hidden');
        try {
            const data = await api.get('/posts?limit=10'); // Limitamos para pruebas
            this.state.posts = data.posts;
            this.render();
            if (this.statsElem) this.statsElem.textContent = `${this.state.posts.length} Activas`;
        } catch (error) {
            alert('Error al cargar postulaciones: ' + error.message);
        } finally {
            this.loader.classList.add('hidden');
        }
    },

    render() {
        if (!this.tbody) return;
        this.tbody.innerHTML = '';
        
        this.state.posts.forEach(post => {
            const tr = document.createElement('tr');
            // Simulamos "estado" con la propiedad de likes para que encaje
            const estado = post.reactions && post.reactions.likes > 10 ? 'Aceptada' : (post.reactions && post.reactions.likes > 5 ? 'En Revisión' : 'Pendiente');
            
            tr.innerHTML = `
                <td>${post.id}</td>
                <td><strong>${post.title}</strong><br><small>Ref: ID Usuario ${post.userId}</small></td>
                <td>${post.body.substring(0, 50)}...</td>
                <td><span style="color:var(--color-primary); font-weight:bold;">${estado}</span></td>
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
        if (post) {
            this.modalTitle.textContent = 'Editar Postulación';
            this.idInput.value = post.id;
            this.titleInput.value = post.title;
            this.bodyInput.value = post.body;
            this.userIdInput.value = post.userId;
        } else {
            this.modalTitle.textContent = 'Nueva Postulación';
            this.form.reset();
            this.idInput.value = '';
        }
        this.modal.classList.remove('hidden');
    },

    closeModal() {
        this.modal.classList.add('hidden');
        this.form.reset();
    },

    handleEdit(id) {
        const post = this.state.posts.find(p => p.id == id);
        if (post) this.openModal(post);
    },

    async handleSubmit(e) {
        e.preventDefault();
        
        // Guard clauses
        const title = this.titleInput.value.trim();
        const body = this.bodyInput.value.trim();
        const userId = parseInt(this.userIdInput.value);
        if (!title || !body || isNaN(userId)) return alert('Campos incompletos o ID inválido');

        const payload = { title, body, userId };
        const id = this.idInput.value;

        try {
            if (id) {
                // Editar (PATCH)
                const res = await api.patch(`/posts/${id}`, payload);
                const index = this.state.posts.findIndex(p => p.id == id);
                if (index !== -1) {
                    this.state.posts[index] = { ...this.state.posts[index], ...res };
                }
                alert('Postulación actualizada');
            } else {
                // Crear (POST)
                const res = await api.post('/posts/add', payload);
                this.state.posts.unshift(res); 
                alert('Postulación creada con éxito');
            }
            this.render();
            if (this.statsElem) this.statsElem.textContent = `${this.state.posts.length} Activas`;
            this.closeModal();
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        }
    },

    async handleDelete(id) {
        if (!confirm('¿Estás seguro de eliminar esta postulación?')) return;

        try {
            await api.delete(`/posts/${id}`);
            this.state.posts = this.state.posts.filter(p => p.id != id);
            this.render();
            if (this.statsElem) this.statsElem.textContent = `${this.state.posts.length} Activas`;
            alert('Postulación eliminada');
        } catch (error) {
            alert('Error al eliminar: ' + error.message);
        }
    }
};

const prueba = "Subida a github prueba 1"
