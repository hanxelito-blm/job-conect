// public/js/components/vacanciesModule.js
import { api } from '../services/apiService.js';
import { Toast } from '../services/toastService.js';
import { vacancies as seedVacancies, companies as seedCompanies } from '../mockData.js';

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
        this.submitBtn = this.form ? this.form.querySelector('button[type="submit"]') : null;

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

    async loadData(force = false) {
        if (this.state.items.length > 0 && !force) return;
        if (this.loader) this.loader.classList.remove('hidden');

        try {
            this.state.items = seedVacancies.map((vacancy) => ({
                ...vacancy,
                title: vacancy.titulo,
                brand: seedCompanies.find((company) => company.id === vacancy.empresaId)?.nombre || 'Empresa',
                category: vacancy.departamento,
                price: Number(vacancy.rangoSalarial.match(/[\d,]+/)?.[0].replace(',', '') || 0),
                applicants: vacancy.postulantesCount
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
        if (!confirm('¿Estás seguro de eliminar esta vacante?')) return;

        try {
            await api.delete(`/products/${id}`);
            this.state.items = this.state.items.filter((item) => item.id != id);
            this.render();
            this.updateStats();
            Toast.show('Vacante eliminada correctamente', 'success');
        } catch (error) {
            Toast.show('Error al eliminar: ' + error.message, 'error');
        }
    }
};
