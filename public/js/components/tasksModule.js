// public/js/components/tasksModule.js
import { api } from '../services/apiService.js';
import { Toast } from '../services/toastService.js';
import { tasks as seedTasks } from '../mockData.js';

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
        this.submitBtn = this.form ? this.form.querySelector('button[type="submit"]') : null;

        this.idInput = document.getElementById('taskId');
        this.todoInput = document.getElementById('taskTodo');
        this.userIdInput = document.getElementById('taskUserId');
        this.completedInput = document.getElementById('taskCompleted');
        this.modalTitle = document.getElementById('taskModalTitle');

        this.searchInput = document.getElementById('tasksSearch');
        this.statusFilter = document.getElementById('tasksStatusFilter');
        this.priorityFilter = document.getElementById('tasksPriorityFilter');
        this.clearFiltersBtn = document.getElementById('tasksClearFilters');
    },

    bindEvents() {
        if (this.btnNew) this.btnNew.addEventListener('click', () => this.openModal());
        if (this.cancelBtn) this.cancelBtn.addEventListener('click', () => this.closeModal());
        if (this.form) this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        if (this.searchInput) this.searchInput.addEventListener('input', () => this.render());
        [this.statusFilter, this.priorityFilter].forEach(control => {
            if (control) control.addEventListener('change', () => this.render());
        });
        if (this.clearFiltersBtn) this.clearFiltersBtn.addEventListener('click', () => this.clearFilters());
    },

    clearFilters() {
        if (this.searchInput) this.searchInput.value = '';
        if (this.statusFilter) this.statusFilter.value = '';
        if (this.priorityFilter) this.priorityFilter.value = '';
        this.render();
    },

    getFilteredItems() {
        let items = [...this.state.items];
        const searchText = this.searchInput ? this.searchInput.value.trim().toLowerCase() : '';
        const statusValue = this.statusFilter ? this.statusFilter.value : '';
        const priorityValue = this.priorityFilter ? this.priorityFilter.value : '';

        if (searchText) {
            items = items.filter((item) => item.todo && item.todo.toLowerCase().includes(searchText));
        }

        if (statusValue) {
            const completed = statusValue === 'completed';
            items = items.filter((item) => item.completed === completed);
        }

        if (priorityValue) {
            items = items.filter((item) => item.prioridad === priorityValue);
        }

        return items;
    },

    async loadData(force = false) {
        if (this.state.items.length > 0 && !force) return;
        if (this.loader) this.loader.classList.remove('hidden');

        try {
            this.state.items = seedTasks.map((task) => ({
                ...task,
                todo: task.titulo,
                userId: task.responsable,
                completed: task.completada,
                prioridad: task.prioridad
            }));
            this.render();
            this.updateStats();
        } catch (error) {
            Toast.show('Error al cargar tareas: ' + error.message, 'error');
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
                    <p>Error al cargar tareas: ${msg}</p>
                </td>
            </tr>
        `;
    },

    render() {
        if (!this.tbody) return;
        this.tbody.innerHTML = '';

        const filteredItems = this.getFilteredItems();

        if (filteredItems.length === 0) {
            const hasFilters = (this.searchInput && this.searchInput.value.trim()) || (this.statusFilter && this.statusFilter.value);
            this.tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state-cell">
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 11l3 3L22 1"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                        <p>${hasFilters ? 'No se encontraron tareas con los filtros aplicados.' : 'No hay tareas registradas.'}</p>
                    </td>
                </tr>
            `;
            return;
        }

        filteredItems.forEach((item) => {
            const tr = document.createElement('tr');
            const estado = item.completed ? 'Completada' : 'Pendiente';
            const badgeClass = item.completed ? 'badge-green' : 'badge-yellow';
            const priorityClass = item.prioridad === 'Alta' ? 'badge-red' : item.prioridad === 'Media' ? 'badge-yellow' : 'badge-green';

            tr.innerHTML = `
                <td>${item.id}</td>
                <td>${item.todo}</td>
                <td><span class="${badgeClass}">${estado}</span></td>
                <td><span class="${priorityClass}">${item.prioridad || 'Normal'}</span></td>
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

        if (!todo || Number.isNaN(userId) || userId < 1) {
            Toast.show('Por favor ingresa la descripción de la tarea y un ID de usuario válido (>= 1).', 'error');
            return;
        }

        const payload = { todo, completed, userId };
        const id = this.idInput.value;

        if (this.submitBtn) {
            this.submitBtn.disabled = true;
            this.submitBtn.textContent = 'Guardando...';
        }

        try {
            if (id) {
                const res = await api.put(`/todos/${id}`, payload);
                const index = this.state.items.findIndex((item) => item.id == id);
                if (index !== -1) {
                    this.state.items[index] = { ...this.state.items[index], ...res };
                }
                Toast.show('Tarea actualizada con éxito', 'success');
            } else {
                const res = await api.post('/todos/add', payload);
                this.state.items.unshift(res);
                Toast.show('Tarea creada con éxito', 'success');
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
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta tarea será eliminada permanentemente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3ee6ab',
            cancelButtonColor: '#374151',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (!result.isConfirmed) return;

        try {
            await api.delete(`/todos/${id}`);
            this.state.items = this.state.items.filter((item) => item.id != id);
            this.render();
            this.updateStats();
            Toast.show('Tarea eliminada correctamente', 'success');
        } catch (error) {
            Toast.show('Error al eliminar: ' + error.message, 'error');
        }
    }
};
