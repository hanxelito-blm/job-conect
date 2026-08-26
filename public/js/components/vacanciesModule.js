// public/js/components/vacanciesModule.js
import { api } from '../services/apiService.js';
import { Toast } from '../services/toastService.js';
import { Confirmation } from '../services/confirmationService.js';
import { vacancies as seedVacancies, companies as seedCompanies } from '../mockData.js';

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

export const VacanciesModule = {
    state: {
        items: []
    },

    init() {
        this.cacheDOM();
        this.populateDeptFilter();
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
        this.submitBtn = this.form ? this.form.querySelector('button[type="submit"]') : null;

        this.search = document.getElementById('vacancySearch');
        this.deptFilter = document.getElementById('vacancyDeptFilter');
        this.statusFilter = document.getElementById('vacancyStatusFilter');
        this.locationFilter = document.getElementById('vacancyLocationFilter');
        this.clearFilters = document.getElementById('vacancyClearFilters');

        this.idInput = document.getElementById('vacancyId');
        this.titleInput = document.getElementById('vacancyTitle');
        this.brandInput = document.getElementById('vacancyBrand');
        this.priceInput = document.getElementById('vacancyPrice');
        this.modalTitle = document.getElementById('vacancyModalTitle');
    },

    populateDeptFilter() {
        if (!this.deptFilter) return;
        const departments = [...new Set(seedVacancies.map((vacancy) => vacancy.departamento).filter(Boolean))];
        this.deptFilter.innerHTML = '<option value="">Todos los departamentos</option>';
        departments.forEach((department) => this.deptFilter.insertAdjacentHTML('beforeend', `<option value="${escapeHtml(department)}">${escapeHtml(department)}</option>`));
    },

    bindEvents() {
        if (this.btnNew) this.btnNew.addEventListener('click', () => this.openModal());
        if (this.cancelBtn) this.cancelBtn.addEventListener('click', () => this.closeModal());
        if (this.form) this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        this.search?.addEventListener('input', () => this.render());
        [this.deptFilter, this.statusFilter, this.locationFilter].forEach((control) => {
            if (!control) return;
            control.addEventListener('change', () => this.render());
        });
        if (this.clearFilters) this.clearFilters.addEventListener('click', () => {
            if (this.search) this.search.value = '';
            if (this.deptFilter) this.deptFilter.value = '';
            if (this.statusFilter) this.statusFilter.value = '';
            if (this.locationFilter) this.locationFilter.value = '';
            this.render();
        });
    },

    getDeletedIds() {
        try { return JSON.parse(localStorage.getItem('jc_deleted_vacancies')) || []; } catch { return []; }
    },

    saveDeletedIds(ids) {
        localStorage.setItem('jc_deleted_vacancies', JSON.stringify(ids));
    },

    async loadData(force = false) {
        if (this.state.items.length > 0 && !force) return;
        if (this.loader) this.loader.classList.remove('hidden');

        try {
            const deletedIds = this.getDeletedIds();
            this.state.items = seedVacancies.filter(v => !deletedIds.includes(v.id)).map((vacancy) => ({
                ...vacancy,
                title: vacancy.titulo,
                brand: seedCompanies.find((company) => company.id === vacancy.empresaId)?.nombre || 'Empresa',
                category: vacancy.departamento,
                price: Number(vacancy.rangoSalarial.match(/[\d,]+/)?.[0].replace(',', '') || 0),
                applicants: vacancy.postulantesCount,
                estado: vacancy.estado,
                ubicacion: vacancy.ubicacion
            }));
            this.render();
            this.updateStats();
        } catch (error) {
            Toast.show('Error al cargar vacantes: ' + error.message, 'error');
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
                    <p>Error al cargar vacantes: ${msg}</p>
                </td>
            </tr>
        `;
    },

    getFilteredItems() {
        const query = (this.search ? this.search.value : '').trim().toLowerCase();
        const department = this.deptFilter ? this.deptFilter.value : '';
        const status = this.statusFilter ? this.statusFilter.value : '';
        const location = this.locationFilter ? this.locationFilter.value : '';
        return this.state.items.filter((item) =>
            (!query || `${item.title || ''} ${item.brand || ''}`.toLowerCase().includes(query)) &&
            (!department || item.category === department) &&
            (!status || item.estado === status) &&
            (!location || item.ubicacion === location)
        );
    },

    render() {
        if (!this.tbody) return;
        this.tbody.innerHTML = '';

        if (this.state.items.length === 0) {
            this.tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state-cell">
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 12l9 4 9-4"/><path d="M3 17l9 4 9-4"/></svg>
                        <p>No hay vacantes registradas.</p>
                    </td>
                </tr>
            `;
            return;
        }

        const items = this.getFilteredItems();
        if (items.length === 0) {
            this.tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state-cell">
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
                        <p>No hay vacantes con estos filtros.</p>
                    </td>
                </tr>
            `;
            return;
        }

        items.forEach((item) => {
            const tr = document.createElement('tr');
            const statusClass = (item.estado || 'Activa').toLowerCase().replaceAll(' ', '-');
            tr.innerHTML = `
                <td>${item.id}</td>
                <td><strong>${item.title}</strong><br><small>${item.category || 'General'}</small><br><small class="table-muted">${item.ubicacion || ''}</small></td>
                <td>${item.brand || 'N/A'}</td>
                <td><span class="status-badge status-${statusClass}">${item.estado || 'Activa'}</span><br><small>$${Number(item.price || 0).toFixed(2)}</small></td>
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
            this.titleInput.value = item.title || '';
            this.brandInput.value = item.brand || '';
            this.priceInput.value = item.price ?? '';
        } else {
            this.modalTitle.textContent = 'Nueva Vacante';
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

        const title = this.titleInput.value.trim();
        const brand = this.brandInput.value.trim();
        const price = Number(this.priceInput.value);

        if (!title || !brand || Number.isNaN(price) || price < 0) {
            Toast.show('Por favor completa todos los campos con un precio válido.', 'error');
            return;
        }

        const payload = { title, brand, price };
        const id = this.idInput.value;

        if (this.submitBtn) {
            this.submitBtn.disabled = true;
            this.submitBtn.textContent = 'Guardando...';
        }

        try {
            if (id) {
                const res = await api.put(`/products/${id}`, payload);
                const index = this.state.items.findIndex((item) => item.id == id);
                if (index !== -1) {
                    this.state.items[index] = { ...this.state.items[index], ...res };
                }
                Toast.show('Vacante actualizada con éxito', 'success');
            } else {
                const res = await api.post('/products/add', payload);
                this.state.items.unshift(res);
                Toast.show('Vacante creada con éxito', 'success');
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
        const item = this.state.items.find((vacancy) => vacancy.id == id);
        if (!await Confirmation.confirm({ type: 'vacante', name: item?.title || 'Vacante', id })) return;

        this.state.items = this.state.items.filter((item) => item.id != id);
        const deletedIds = this.getDeletedIds();
        if (!deletedIds.includes(id)) deletedIds.push(id);
        this.saveDeletedIds(deletedIds);
        this.render();
        this.updateStats();
        Toast.show('Vacante eliminada correctamente', 'success');

        try {
            await api.delete(`/products/${id}`);
        } catch (_) { /* API no disponible para datos locales */ }
    }
};
