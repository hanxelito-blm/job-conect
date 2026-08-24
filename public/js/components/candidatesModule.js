// public/js/components/candidatesModule.js
import { api } from '../services/apiService.js';

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
        
        // Modal inputs
        this.idInput = document.getElementById('candidateId');
        this.firstNameInput = document.getElementById('candidateFirstName');
        this.lastNameInput = document.getElementById('candidateLastName');
        this.emailInput = document.getElementById('candidateEmail');
        this.modalTitle = document.getElementById('candidateModalTitle');
    },

    bindEvents() {
        this.btnNew.addEventListener('click', () => this.openModal());
        this.cancelBtn.addEventListener('click', () => this.closeModal());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    async loadData() {
        if (this.state.users.length > 0) return; // Ya cargado

        this.loader.classList.remove('hidden');
        try {
            const data = await api.get('/users?limit=10'); // Limitamos para pruebas
            this.state.users = data.users;
            this.render();
            if (this.statsElem) this.statsElem.textContent = `${this.state.users.length} Activos`;
        } catch (error) {
            alert('Error al cargar candidatos: ' + error.message);
        } finally {
            this.loader.classList.add('hidden');
        }
    },

    render() {
        if (!this.tbody) return;
        this.tbody.innerHTML = '';
        
        this.state.users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.id}</td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.phone || 'N/A'}</td>
                <td>
                    <button class="btn btn-small btn-primary edit-btn" data-id="${user.id}">Editar</button>
                    <button class="btn btn-small btn-secondary delete-btn" data-id="${user.id}">Eliminar</button>
                </td>
            `;
            this.tbody.appendChild(tr);
        });

        // Bind dynamic buttons
        this.tbody.querySelectorAll('.edit-btn').forEach(btn => 
            btn.addEventListener('click', (e) => this.handleEdit(e.target.dataset.id))
        );
        this.tbody.querySelectorAll('.delete-btn').forEach(btn => 
            btn.addEventListener('click', (e) => this.handleDelete(e.target.dataset.id))
        );
    },

    openModal(user = null) {
        if (user) {
            this.modalTitle.textContent = 'Editar Candidato';
            this.idInput.value = user.id;
            this.firstNameInput.value = user.firstName;
            this.lastNameInput.value = user.lastName;
            this.emailInput.value = user.email;
        } else {
            this.modalTitle.textContent = 'Nuevo Candidato';
            this.form.reset();
            this.idInput.value = '';
        }
        this.modal.classList.remove('hidden');
    },

    closeModal() {
        this.modal.classList.add('hidden');
        this.form.reset();
    },

    async handleSubmit(e) {
        e.preventDefault();
        
        // Guard clauses
        const firstName = this.firstNameInput.value.trim();
        const lastName = this.lastNameInput.value.trim();
        const email = this.emailInput.value.trim();
        if (!firstName || !lastName || !email) return alert('Campos incompletos');

        const payload = { firstName, lastName, email };
        const id = this.idInput.value;

        try {
            if (id) {
                // Editar (PUT/PATCH)
                const res = await api.put(`/users/${id}`, payload);
                // Actualizar estado local
                const index = this.state.users.findIndex(u => u.id == id);
                if (index !== -1) {
                    this.state.users[index] = { ...this.state.users[index], ...res };
                }
                alert('Candidato actualizado con éxito');
            } else {
                // Crear (POST)
                const res = await api.post('/users/add', payload);
                // DummyJSON devuelve un ID nuevo para POST
                this.state.users.unshift(res); 
                alert('Candidato creado con éxito');
            }
            this.render();
            if (this.statsElem) this.statsElem.textContent = `${this.state.users.length} Activos`;
            this.closeModal();
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        }
    },

    async handleDelete(id) {
        if (!confirm('¿Estás seguro de eliminar este candidato?')) return;

        try {
            await api.delete(`/users/${id}`);
            // Eliminar del estado local
            this.state.users = this.state.users.filter(u => u.id != id);
            this.render();
            if (this.statsElem) this.statsElem.textContent = `${this.state.users.length} Activos`;
            alert('Candidato eliminado');
        } catch (error) {
            alert('Error al eliminar: ' + error.message);
        }
    }
};
