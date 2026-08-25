// public/js/components/companiesModule.js
import { api } from '../services/apiService.js';

export const CompaniesModule = {
    state: {
        items: []
    },

    init() {
        this.cacheDOM();
        this.bindEvents();
    },

    cacheDOM() {
        this.tbody = document.getElementById('companiesTbody');
        this.loader = document.getElementById('companiesLoader');
        this.btnNew = document.getElementById('btnNewCompany');
        this.modal = document.getElementById('companyModal');
        this.form = document.getElementById('companyForm');
        this.cancelBtn = document.getElementById('cancelCompanyBtn');
        this.statsElem = document.getElementById('statsCompanies');

        this.idInput = document.getElementById('companyId');
        this.userIdInput = document.getElementById('companyUserId');
        this.totalInput = document.getElementById('companyTotal');
        this.discountedInput = document.getElementById('companyDiscounted');
        this.modalTitle = document.getElementById('companyModalTitle');
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
            const data = await api.get('/carts?limit=10');
            this.state.items = data.carts || [];
            this.render();
            if (this.statsElem) this.statsElem.textContent = `${this.state.items.length}`;
        } catch (error) {
            alert('Error al cargar empresas clientes: ' + error.message);
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
                <td>${item.userId}</td>
                <td>${item.products ? item.products.length : 0}</td>
                <td>$${Number(item.total || 0).toFixed(2)}</td>
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
            this.modalTitle.textContent = 'Editar Empresa';
            this.idInput.value = item.id;
            this.userIdInput.value = item.userId || '';
            this.totalInput.value = item.total || '';
            this.discountedInput.value = item.discountedTotal || '';
        } else {
            this.modalTitle.textContent = 'Nueva Empresa';
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

        const userId = Number(this.userIdInput.value);
        const total = Number(this.totalInput.value);
        const discountedTotal = Number(this.discountedInput.value);

        if (Number.isNaN(userId) || Number.isNaN(total) || Number.isNaN(discountedTotal)) {
            alert('Datos incompletos o inválidos');
            return;
        }

        const payload = { userId, total, discountedTotal };
        const id = this.idInput.value;

        try {
            if (id) {
                const res = await api.put(`/carts/${id}`, payload);
                const index = this.state.items.findIndex((item) => item.id == id);
                if (index !== -1) {
                    this.state.items[index] = { ...this.state.items[index], ...res };
                }
                alert('Empresa actualizada');
            } else {
                const res = await api.post('/carts/add', payload);
                this.state.items.unshift(res);
                alert('Empresa creada con éxito');
            }

            this.render();
            if (this.statsElem) this.statsElem.textContent = `${this.state.items.length}`;
            this.closeModal();
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        }
    },

    async handleDelete(id) {
        if (!confirm('¿Estás seguro de eliminar esta empresa?')) return;

        try {
            await api.delete(`/carts/${id}`);
            this.state.items = this.state.items.filter((item) => item.id != id);
            this.render();
            if (this.statsElem) this.statsElem.textContent = `${this.state.items.length}`;
            alert('Empresa eliminada');
        } catch (error) {
            alert('Error al eliminar: ' + error.message);
        }
    }
};
