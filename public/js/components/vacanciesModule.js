// public/js/components/vacanciesModule.js
import { api } from '../services/apiService.js';

export const VacanciesModule = {
    state: {
        items: []
    },

    init() {
        this.cacheDOM();
        this.bindEvents();
    },

    cacheDOM() {
        this.tbody = document.getElementById('vacanciesTbody');
        this.loader = document.getElementById('vacanciesLoader');
        this.btnNew = document.getElementById('btnNewVacancy');
        this.modal = document.getElementById('vacancyModal');
        this.form = document.getElementById('vacancyForm');
        this.cancelBtn = document.getElementById('cancelVacancyBtn');
        this.statsElem = document.getElementById('statsVacancies');

        this.idInput = document.getElementById('vacancyId');
        this.titleInput = document.getElementById('vacancyTitle');
        this.brandInput = document.getElementById('vacancyBrand');
        this.priceInput = document.getElementById('vacancyPrice');
        this.modalTitle = document.getElementById('vacancyModalTitle');
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
            const data = await api.get('/products?limit=10');
            this.state.items = data.products || [];
            this.render();
            if (this.statsElem) this.statsElem.textContent = `${this.state.items.length}`;
        } catch (error) {
            alert('Error al cargar vacantes: ' + error.message);
        } finally {
            if (this.loader) this.loader.classList.add('hidden');
        }
    },

    render() {
        if (!this.tbody) return;
        this.tbody.innerHTML = '';

        this.state.items.forEach((item) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.id}</td>
                <td><strong>${item.title}</strong><br><small>${item.category || 'General'}</small></td>
                <td>${item.brand || 'N/A'}</td>
                <td>$${Number(item.price || 0).toFixed(2)}</td>
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
            this.modalTitle.textContent = 'Editar Vacante';
            this.idInput.value = item.id;
            this.titleInput.value = item.title;
            this.brandInput.value = item.brand || '';
            this.priceInput.value = item.price || '';
        } else {
            this.modalTitle.textContent = 'Nueva Vacante';
            this.form.reset();
            this.idInput.value = '';
        }

        this.modal.classList.remove('hidden');
    },

    closeModal() {
        if (this.modal) {
            this.modal.classList.add('hidden');
        }
        if (this.form) this.form.reset();
    },

    handleEdit(id) {
        const item = this.state.items.find((p) => p.id == id);
        if (item) this.openModal(item);
    },

    async handleSubmit(e) {
        e.preventDefault();

        const title = this.titleInput.value.trim();
        const brand = this.brandInput.value.trim();
        const price = Number(this.priceInput.value);

        if (!title || !brand || Number.isNaN(price)) {
            alert('Campos incompletos o precio inválido');
            return;
        }

        const payload = { title, brand, price };
        const id = this.idInput.value;

        try {
            if (id) {
                const res = await api.put(`/products/${id}`, payload);
                const index = this.state.items.findIndex((item) => item.id == id);
                if (index !== -1) {
                    this.state.items[index] = { ...this.state.items[index], ...res };
                }
                alert('Vacante actualizada');
            } else {
                const res = await api.post('/products/add', payload);
                this.state.items.unshift(res);
                alert('Vacante creada con éxito');
            }

            this.render();
            if (this.statsElem) this.statsElem.textContent = `${this.state.items.length}`;
            this.closeModal();
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        }
    },

    async handleDelete(id) {
        if (!confirm('¿Estás seguro de eliminar esta vacante?')) return;

        try {
            await api.delete(`/products/${id}`);
            this.state.items = this.state.items.filter((item) => item.id != id);
            this.render();
            if (this.statsElem) this.statsElem.textContent = `${this.state.items.length}`;
            alert('Vacante eliminada');
        } catch (error) {
            alert('Error al eliminar: ' + error.message);
        }
    }
};
