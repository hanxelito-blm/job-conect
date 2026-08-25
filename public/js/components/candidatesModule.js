import { api } from '../services/apiService.js';
import { Toast } from '../services/toastService.js';
import { candidates as seedCandidates, vacancies as seedVacancies, companies as seedCompanies } from '../mockData.js';

const statuses = ['Pendiente', 'En revisión', 'Entrevistado', 'Aceptado', 'Rechazado'];
const vacancies = ['Senior Frontend Engineer', 'Product Designer', 'Data Analyst', 'Backend Developer'];
const companies = ['Nexa Labs', 'Prisma Studio', 'Orbit Analytics', 'Vertex Systems'];
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

function createProfile(user, index) {
    return {
        ...user,
        name: `${user.firstName || 'Candidato'} ${user.lastName || ''}`.trim(),
        role: ['Frontend Developer', 'Product Designer', 'Data Analyst', 'Backend Engineer'][index % 4],
        vacancy: vacancies[index % vacancies.length], company: companies[index % companies.length],
        appliedAt: new Date(Date.now() - (index + 2) * 86400000).toISOString().slice(0, 10),
        status: statuses[index % statuses.length],
        location: ['Ciudad de México', 'Bogotá, Colombia', 'Buenos Aires, Argentina', 'Santiago, Chile'][index % 4],
        skills: [['React', 'TypeScript', 'Design Systems'], ['Figma', 'Research', 'Prototyping'], ['SQL', 'Python', 'Tableau'], ['Node.js', 'AWS', 'PostgreSQL']][index % 4],
        summary: 'Profesional orientado a resultados, con criterio para resolver problemas complejos y colaborar con equipos multidisciplinarios.',
        experience: 'Experiencia previa en equipos de producto y entornos de trabajo ágiles. Ha liderado entregas de alto impacto con foco en calidad.',
        linkedin: 'https://www.linkedin.com', github: 'https://github.com', portfolio: 'https://www.behance.net', notes: ''
    };
}

export const CandidatesModule = {
    state: { users: [], selected: null },
    init() { this.cacheDOM(); this.bindEvents(); },
    cacheDOM() {
        this.tbody = document.getElementById('candidatesTbody'); this.loader = document.getElementById('candidatesLoader');
        this.btnNew = document.getElementById('btnNewCandidate'); this.modal = document.getElementById('candidateModal'); this.form = document.getElementById('candidateForm');
        this.cancelBtn = document.getElementById('cancelCandidateBtn'); this.statsElem = document.getElementById('statsCandidates'); this.submitBtn = this.form?.querySelector('button[type="submit"]');
        this.search = document.getElementById('candidateSearch'); this.vacancyFilter = document.getElementById('candidateVacancyFilter'); this.statusFilter = document.getElementById('candidateStatusFilter'); this.dateFilter = document.getElementById('candidateDateFilter'); this.clearFilters = document.getElementById('candidateClearFilters');
        this.drawer = document.getElementById('candidateDrawer'); this.drawerBackdrop = document.getElementById('candidateDrawerBackdrop'); this.drawerClose = document.getElementById('candidateDrawerClose'); this.drawerStatus = document.getElementById('candidateDrawerStatus'); this.drawerStatusSelect = document.getElementById('candidateDrawerStatusSelect'); this.drawerNotes = document.getElementById('candidateDrawerNotes');
        this.idInput = document.getElementById('candidateId'); this.firstNameInput = document.getElementById('candidateFirstName'); this.lastNameInput = document.getElementById('candidateLastName'); this.emailInput = document.getElementById('candidateEmail'); this.modalTitle = document.getElementById('candidateModalTitle');
    },
    bindEvents() {
        this.btnNew?.addEventListener('click', () => this.openModal()); this.cancelBtn?.addEventListener('click', () => this.closeModal()); this.form?.addEventListener('submit', (event) => this.handleSubmit(event));
        [this.search, this.vacancyFilter, this.statusFilter, this.dateFilter].forEach((control) => control?.addEventListener('input', () => this.render()));
        this.clearFilters?.addEventListener('click', () => { this.search.value = ''; this.vacancyFilter.value = ''; this.statusFilter.value = ''; this.dateFilter.value = ''; this.render(); });
        this.drawerClose?.addEventListener('click', () => this.closeDrawer()); this.drawerBackdrop?.addEventListener('click', () => this.closeDrawer());
        this.drawerStatusSelect?.addEventListener('change', (event) => this.updateStatus(event.target.value));
        document.getElementById('candidateSaveNotes')?.addEventListener('click', () => { if (this.state.selected) { this.state.selected.notes = this.drawerNotes.value.trim(); Toast.show('Nota interna guardada.', 'success'); } });
        document.getElementById('candidateScheduleInterview')?.addEventListener('click', () => { Toast.show('Candidato listo para agendar una entrevista.', 'success'); document.querySelector('[data-target="interviewsSection"]')?.click(); });
        document.addEventListener('keydown', (event) => { if (event.key === 'Escape') this.closeDrawer(); });
    },
    async loadData(force = false) {
        if (this.state.users.length && !force) return; this.loader?.classList.remove('hidden');
        try {
            this.state.users = seedCandidates.map((candidate, index) => {
                const names = candidate.nombreCompleto.split(' ');
                const firstName = names.shift();
                const lastName = names.join(' ');
                const vacancy = seedVacancies.find((item) => item.id === candidate.vacanteId);
                const company = seedCompanies.find((item) => item.id === candidate.empresaId);
                const profile = createProfile({ id: candidate.id, firstName, lastName, email: candidate.email, phone: candidate.telefono }, index);
                const status = candidate.estado === 'En revisión' ? 'En revisión' : candidate.estado === 'Entrevista' ? 'Entrevistado' : candidate.estado === 'Contratado' ? 'Aceptado' : 'Pendiente';
                return { ...profile, role: candidate.tituloProfesional, vacancy: vacancy?.titulo || profile.vacancy, company: company?.nombre || profile.company, appliedAt: candidate.fechaPostulacion, status, location: company?.ubicacion || profile.location, skills: candidate.habilidades, summary: candidate.resumenPerfil, linkedin: candidate.enlaces.linkedin, github: candidate.enlaces.github, portfolio: candidate.enlaces.portfolio, cvUrl: candidate.urlCV };
            });
            this.populateVacancies(); this.render(); this.updateStats();
        }
        catch (error) { Toast.show(`Error al cargar candidatos: ${error.message}`, 'error'); this.renderError(error.message); }
        finally { this.loader?.classList.add('hidden'); }
    },
    populateVacancies() { if (!this.vacancyFilter) return; this.vacancyFilter.innerHTML = '<option value="">Todas las vacantes</option>'; [...new Set(this.state.users.map((user) => user.vacancy))].forEach((vacancy) => this.vacancyFilter.insertAdjacentHTML('beforeend', `<option value="${escapeHtml(vacancy)}">${escapeHtml(vacancy)}</option>`)); },
    getFilteredUsers() {
        const query = (this.search?.value || '').trim().toLowerCase();
        return this.state.users.filter((user) => (!query || `${user.name} ${user.role} ${user.skills.join(' ')}`.toLowerCase().includes(query)) && (!this.vacancyFilter?.value || user.vacancy === this.vacancyFilter.value) && (!this.statusFilter?.value || user.status === this.statusFilter.value) && (!this.dateFilter?.value || user.appliedAt >= this.dateFilter.value));
    },
    updateStats() {
        const count = (status) => this.state.users.filter((user) => user.status === status).length; if (this.statsElem) this.statsElem.textContent = this.state.users.length;
        document.getElementById('candidateActiveCount').textContent = count('Rechazado') ? this.state.users.length - count('Rechazado') : this.state.users.length; document.getElementById('candidateReviewCount').textContent = count('En revisión'); document.getElementById('candidateInterviewCount').textContent = count('Entrevistado'); document.getElementById('candidateAcceptedCount').textContent = count('Aceptado');
    },
    renderError(message) { if (this.tbody) this.tbody.innerHTML = `<tr><td colspan="5" class="error-state-cell"><p>Error al cargar candidatos: ${escapeHtml(message)}</p><button class="btn btn-small btn-primary" onclick="window.location.reload()">Reintentar</button></td></tr>`; },
    render() {
        if (!this.tbody) return; const users = this.getFilteredUsers(); if (!users.length) { this.tbody.innerHTML = '<tr><td colspan="5" class="empty-state-cell"><p>No hay postulaciones con estos filtros.</p></td></tr>'; return; }
        this.tbody.innerHTML = users.map((user) => { const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase(); const statusClass = user.status.toLowerCase().replaceAll(' ', '-'); return `<tr><td><button class="candidate-person" data-id="${user.id}" type="button"><span class="table-avatar">${escapeHtml(initials)}</span><span><strong>${escapeHtml(user.name)}</strong><small>${escapeHtml(user.role)}</small></span></button></td><td><strong>${escapeHtml(user.vacancy)}</strong><small class="table-muted">${escapeHtml(user.company)}</small></td><td><strong>${new Date(`${user.appliedAt}T12:00:00`).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}</strong><small class="table-muted">${escapeHtml(user.location)}</small></td><td><span class="status-badge status-${statusClass}">${escapeHtml(user.status)}</span></td><td><button class="btn btn-small btn-secondary" data-id="${user.id}" type="button">Ver expediente</button></td></tr>`; }).join('');
        this.tbody.querySelectorAll('[data-id]').forEach((button) => button.addEventListener('click', () => this.openDrawer(button.dataset.id)));
    },
    openDrawer(id) {
        const user = this.state.users.find((candidate) => String(candidate.id) === String(id)); if (!user || !this.drawer) return; this.state.selected = user;
        const setText = (id, value) => { const element = document.getElementById(id); if (element) element.textContent = value; }; const statusClass = user.status.toLowerCase().replaceAll(' ', '-');
        setText('candidateDrawerAvatar', `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()); setText('candidateDrawerName', user.name); setText('candidateDrawerRole', user.role); setText('candidateDrawerStatus', user.status); setText('candidateDrawerVacancy', user.vacancy); setText('candidateDrawerCompany', user.company); setText('candidateDrawerDate', `Postuló el ${new Date(`${user.appliedAt}T12:00:00`).toLocaleDateString('es-MX')}`); setText('candidateDrawerLocation', user.location); setText('candidateDrawerSummary', user.summary); setText('candidateDrawerExperience', user.experience);
        const email = document.getElementById('candidateDrawerEmail'); email.textContent = user.email; email.href = `mailto:${user.email}`; const phone = document.getElementById('candidateDrawerPhone'); phone.textContent = user.phone || '+52 55 0000 0000'; phone.href = `tel:${user.phone || ''}`;
        [['candidateDrawerLinkedin', user.linkedin], ['candidateDrawerGithub', user.github], ['candidateDrawerPortfolio', user.portfolio]].forEach(([elementId, href]) => { document.getElementById(elementId).href = href; }); document.getElementById('candidateDrawerSkills').innerHTML = user.skills.map((skill) => `<span>${escapeHtml(skill)}</span>`).join(''); this.drawerStatus.className = `status-badge status-${statusClass}`; this.drawerStatusSelect.value = user.status; this.drawerNotes.value = user.notes || ''; document.getElementById('candidateCvLink').href = user.cvUrl;
        this.drawer.classList.add('is-open'); this.drawerBackdrop.classList.remove('hidden'); this.drawer.setAttribute('aria-hidden', 'false'); this.drawerClose.focus();
    },
    closeDrawer() { this.drawer?.classList.remove('is-open'); this.drawerBackdrop?.classList.add('hidden'); this.drawer?.setAttribute('aria-hidden', 'true'); },
    updateStatus(status) { if (!this.state.selected || !statuses.includes(status)) return; this.state.selected.status = status; this.render(); this.updateStats(); this.openDrawer(this.state.selected.id); Toast.show(`Estado actualizado a ${status}.`, 'success'); },
    openModal(user = null) { if (!this.modal || !this.form) return; this.modalTitle.textContent = user ? 'Editar Candidato' : 'Nuevo Candidato'; this.form.reset(); this.idInput.value = user?.id || ''; this.firstNameInput.value = user?.firstName || ''; this.lastNameInput.value = user?.lastName || ''; this.emailInput.value = user?.email || ''; this.modal.classList.remove('hidden'); },
    closeModal() { this.modal?.classList.add('hidden'); this.form?.reset(); },
    handleEdit(id) { const user = this.state.users.find((candidate) => candidate.id == id); if (user) this.openModal(user); },
    async handleSubmit(event) {
        event.preventDefault(); const firstName = this.firstNameInput.value.trim(); const lastName = this.lastNameInput.value.trim(); const email = this.emailInput.value.trim(); if (!firstName || !lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { Toast.show('Completa nombre, apellido y un correo válido.', 'error'); return; }
        const payload = { firstName, lastName, email }; const id = this.idInput.value; if (this.submitBtn) { this.submitBtn.disabled = true; this.submitBtn.textContent = 'Guardando...'; }
        try { if (id) { const result = await api.put(`/users/${id}`, payload); const index = this.state.users.findIndex((user) => user.id == id); if (index !== -1) this.state.users[index] = { ...this.state.users[index], ...result, name: `${firstName} ${lastName}` }; } else { const result = await api.post('/users/add', payload); this.state.users.unshift(createProfile(result, this.state.users.length)); } this.render(); this.updateStats(); this.closeModal(); Toast.show('Candidato guardado correctamente.', 'success'); }
        catch (error) { Toast.show(`Error al guardar: ${error.message}`, 'error'); } finally { if (this.submitBtn) { this.submitBtn.disabled = false; this.submitBtn.textContent = 'Guardar'; } }
    }
};