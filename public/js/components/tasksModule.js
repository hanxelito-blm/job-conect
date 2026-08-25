// public/js/components/tasksModule.js
import { api } from '../services/apiService.js';

export const TasksModule = {
    state: {
        items: []
    },

    init() {
        this.cacheDOM();
        this.bindEvents();
    },

    cacheDOM() {
        this.tbody = document.getElementById('tasksTbody');
        this.loader = document.getElementById('tasksLoader');
        this.btnNew = document.getElementById('btnNewTask');
        this.modal = document.getElementById('taskModal');
        this.form = document.getElementById('taskForm');
        this.cancelBtn = document.getElementById('cancelTaskBtn');
        this.statsElem = document.getElementById('statsTasks');

        this.idInput = document.getElementById('taskId');
        this.todoInput = document.getElementById('taskTodo');
        this.userIdInput = document.getElementById('taskUserId');
        this.completedInput = document.getElementById('taskCompleted');
        this.modalTitle = document.getElementById('taskModalTitle');
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
            const data = await api.get('/todos?limit=10');
            this.state.items = data.todos || [];
            this.render();
            if (this.statsElem) this.statsElem.textContent = `${this.state.items.length}`;
        } catch (error) {
            alert('Error al cargar tareas: ' + error.message);
        } finally {
            if (this.loader) this.loader.classList.add('hidden');
        }
    },

    render() {
        if (!this.tbody) return;
        this.tbody.innerHTML = '';

        this.state.items.forEach((item) => {
            const tr = document.createElement('tr');
            const estado = item.completed ? 'Completada' : 'Pendiente';
            const badgeClass = item.completed ? 'badge-green' : 'badge-yellow';

            tr.innerHTML = `
                <td>${item.id}</td>
                <td>${item.todo}</td>
                <td><span class="${badgeClass}">${estado}</span></td>
                <td>${item.userId}</td>
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
            this.modalTitle.textContent = 'Editar Tarea';
            this.idInput.value = item.id;
            this.todoInput.value = item.todo || '';
            this.userIdInput.value = item.userId || '';
            this.completedInput.checked = !!item.completed;
        } else {
            this.modalTitle.textContent = 'Nueva Tarea';
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

        const todo = this.todoInput.value.trim();
        const userId = Number(this.userIdInput.value);
        const completed = this.completedInput.checked;

        if (!todo || Number.isNaN(userId)) {
            alert('Tarea o usuario inválido');
            return;
        }

        const payload = { todo, completed, userId };
        const id = this.idInput.value;

        try {
            if (id) {
                const res = await api.put(`/todos/${id}`, payload);
                const index = this.state.items.findIndex((item) => item.id == id);
                if (index !== -1) {
                    this.state.items[index] = { ...this.state.items[index], ...res };
                }
                alert('Tarea actualizada');
            } else {
                const res = await api.post('/todos/add', payload);
                this.state.items.unshift(res);
                alert('Tarea creada con éxito');
            }

            this.render();
            if (this.statsElem) this.statsElem.textContent = `${this.state.items.length}`;
            this.closeModal();
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        }
    },

    async handleDelete(id) {
        if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;

        try {
            await api.delete(`/todos/${id}`);
            this.state.items = this.state.items.filter((item) => item.id != id);
            this.render();
            if (this.statsElem) this.statsElem.textContent = `${this.state.items.length}`;
            alert('Tarea eliminada');
        } catch (error) {
            alert('Error al eliminar: ' + error.message);
        }
    }
};
