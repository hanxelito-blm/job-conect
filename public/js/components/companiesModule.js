// public/js/components/companiesModule.js
import { api } from '../services/apiService.js';
import { Toast } from '../services/toastService.js';
import { companies as seedCompanies } from '../mockData.js';

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
        this.submitBtn = this.form ? this.form.querySelector('button[type="submit"]') : null;

        this.idInput = document.getElementById('companyId');
        this.userIdInput = document.getElementById('companyUserId');
        this.totalInput = document.getElementById('companyTotal');
        this.discountedInput = document.getElementById('companyDiscounted');
        this.modalTitle = document.getElementById('companyModalTitle');

        this.searchInput = document.getElementById('companiesSearch');
        this.sectorFilter = document.getElementById('companiesSectorFilter');
        this.clearFiltersBtn = document.getElementById('companiesClearFilters');
    },

    bindEvents() {
        if (this.btnNew) this.btnNew.addEventListener('click', () => this.openModal());
        if (this.cancelBtn) this.cancelBtn.addEventListener('click', () => this.closeModal());
        if (this.form) this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        if (this.searchInput) this.searchInput.addEventListener('input', () => this.render());
        if (this.sectorFilter) this.sectorFilter.addEventListener('change', () => this.render());
        if (this.clearFiltersBtn) this.clearFiltersBtn.addEventListener('click', () => this.clearFilters());
    },

    canEdit() {
        const role = localStorage.getItem('jobconnect_role') || 'candidato';
        return role === 'reclutador' || role === 'administrador';
    },

    clearFilters() {
        if (this.searchInput) this.searchInput.value = '';
        if (this.sectorFilter) this.sectorFilter.value = '';
        this.render();
    },

    getFilteredItems() {
        const searchText = (this.searchInput ? this.searchInput.value : '').toLowerCase().trim();
        const sectorValue = this.sectorFilter ? this.sectorFilter.value : '';

        return this.state.items.filter((item) => {
            const matchesSearch = !searchText || 
                (item.nombre || '').toLowerCase().includes(searchText) ||
                (item.id || '').toLowerCase().includes(searchText);
            const matchesSector = !sectorValue || item.sector === sectorValue;
            return matchesSearch && matchesSector;
        });
    },

    async loadData(force = false) {
        if (this.state.items.length > 0 && !force) return;
        if (this.loader) this.loader.classList.remove('hidden');

        try {
            this.state.items = seedCompanies.map((company) => ({
                ...company,
                userId: company.id,
                products: Array.from({ length: company.vacantesActivasCount }, (_, index) => ({ id: `${company.id}-vac-${index + 1}` })),
                total: company.vacantesActivasCount,
                discountedTotal: company.vacantesActivasCount
            }));
            this.render();
            this.updateStats();
        } catch (error) {
            Toast.show('Error al cargar empresas clientes: ' + error.message, 'error');
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
                    <p>Error al cargar empresas: ${msg}</p>
                </td>
            </tr>
        `;
    },

    render() {
        if (!this.tbody) return;
        this.tbody.innerHTML = '';

        const filteredItems = this.getFilteredItems();
        const editable = this.canEdit();

        if (this.btnNew) this.btnNew.classList.toggle('hidden', !editable);

        const searchText = this.searchInput ? this.searchInput.value.trim() : '';

        if (this.state.items.length === 0) {
            this.tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state-cell">
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21V7l9-4 9 4v14"/><path d="M9 21v-8h6v8"/><path d="M3 7h18"/></svg>
                        <p>No hay empresas registradas.</p>
                    </td>
                </tr>
            `;
            return;
        }

        if (searchText && filteredItems.length === 0) {
            this.tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state-cell">
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <p>No se encontraron empresas que coincidan con "${searchText}".</p>
                    </td>
                </tr>
            `;
            return;
        }

        filteredItems.forEach((item) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.id}</td>
                <td><strong>${item.nombre || 'Sin nombre'}</strong><br><small>${item.sector || 'General'}</small></td>
                <td>${item.ubicacion || 'N/A'}</td>
                <td>${item.vacantesActivasCount || 0} vacantes</td>
                <td>
                    ${editable ? `<button class="btn btn-small btn-primary edit-btn" data-id="${item.id}">Editar</button>` : ''}
                    ${editable ? `<button class="btn btn-small btn-secondary delete-btn" data-id="${item.id}">Eliminar</button>` : ''}
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
            this.totalInput.value = item.total ?? '';
            this.discountedInput.value = item.discountedTotal ?? '';
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

        if (Number.isNaN(userId) || userId < 1 || Number.isNaN(total) || total < 0 || Number.isNaN(discountedTotal) || discountedTotal < 0) {
            Toast.show('Por favor ingresa un ID de usuario válido (>= 1) y montos no negativos.', 'error');
            return;
        }

        const payload = { userId, total, discountedTotal };
        const id = this.idInput.value;

        if (this.submitBtn) {
            this.submitBtn.disabled = true;
            this.submitBtn.textContent = 'Guardando...';
        }

        try {
            if (id) {
                const res = await api.put(`/carts/${id}`, payload);
                const index = this.state.items.findIndex((item) => item.id == id);
                if (index !== -1) {
                    this.state.items[index] = { ...this.state.items[index], ...res };
                }
                Toast.show('Empresa actualizada con éxito', 'success');
            } else {
                const res = await api.post('/carts/add', payload);
                this.state.items.unshift(res);
                Toast.show('Empresa creada con éxito', 'success');
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
            text: 'Esta empresa será eliminada permanentemente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3ee6ab',
            cancelButtonColor: '#374151',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (!result.isConfirmed) return;

        try {
            await api.delete(`/carts/${id}`);
            this.state.items = this.state.items.filter((item) => item.id != id);
            this.render();
            this.updateStats();
            Toast.show('Empresa eliminada correctamente', 'success');
        } catch (error) {
            Toast.show('Error al eliminar: ' + error.message, 'error');
        }
    }
};
