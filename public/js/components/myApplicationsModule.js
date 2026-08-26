import { candidates as seedCandidates, vacancies as seedVacancies, companies as seedCompanies, interviews as seedInterviews } from '../mockData.js';

const STAGES = ['Postulado', 'En revisión', 'Entrevista', 'Evaluación', 'Oferta', 'Contratado'];

function getStageIndex(status) {
    const map = {
        'Postulado': 0, 'En revisión': 1, 'Entrevista': 2,
        'Aceptado': 4, 'Contratado': 5, 'Rechazado': -1
    };
    return map[status] ?? 1;
}

function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
}

export const MyApplicationsModule = {
    state: { applications: [], filtered: [] },

    init() {
        this.cacheDOM();
        this.bindEvents();
    },

    cacheDOM() {
        this.timeline = document.getElementById('myAppsTimeline');
        this.searchInput = document.getElementById('myAppsSearch');
        this.statusFilter = document.getElementById('myAppsStatusFilter');
        this.clearBtn = document.getElementById('myAppsClearFilters');
    },

    bindEvents() {
        this.searchInput.addEventListener('input', () => this.applyFilters());
        this.statusFilter.addEventListener('change', () => this.applyFilters());
        this.clearBtn.addEventListener('click', () => this.clearFilters());
    },

    loadData(candidateId) {
        const stored = localStorage.getItem('jc_candidates');
        const candidates = stored ? JSON.parse(stored) : seedCandidates;
        const candidate = candidates.find(c => c.id === candidateId) || candidates[0];
        if (!candidate) { this.state.applications = []; this.render(); return; }

        const apps = candidates.filter(c => c.id === candidate.id).map(c => {
            const vacancy = seedVacancies.find(v => v.id === c.vacanteId);
            const company = seedCompanies.find(co => co.id === c.empresaId);
            const interview = seedInterviews.find(i => i.candidatoId === c.id);
            return {
                ...c,
                vacancyTitle: vacancy?.titulo || 'Vacante',
                companyName: company?.nombre || 'Empresa',
                companySector: company?.sector || '',
                interviewDate: interview?.fecha || null,
                interviewTime: interview?.hora || null,
                interviewModality: interview?.modalidad || null,
                interviewStatus: interview?.estado || null,
                notes: c.notes || ''
            };
        });
        this.state.applications = apps;
        this.state.filtered = [...apps];
        this.render();
    },

    applyFilters() {
        const q = this.searchInput.value.toLowerCase().trim();
        const status = this.statusFilter.value;
        this.state.filtered = this.state.applications.filter(app => {
            const matchSearch = !q || app.vacancyTitle.toLowerCase().includes(q) || app.companyName.toLowerCase().includes(q);
            const matchStatus = !status || app.estado === status;
            return matchSearch && matchStatus;
        });
        this.render();
    },

    clearFilters() {
        this.searchInput.value = '';
        this.statusFilter.value = '';
        this.state.filtered = [...this.state.applications];
        this.render();
    },

    render() {
        if (!this.state.filtered.length) {
            this.timeline.innerHTML = `
                <div class="my-app-empty">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <p>No se encontraron postulaciones</p>
                </div>`;
            return;
        }

        this.timeline.innerHTML = this.state.filtered.map(app => {
            const stageIdx = getStageIndex(app.estado);
            const isRejected = app.estado === 'Rechazado';
            const stageLabels = STAGES.map((label, i) =>
                `<span class="my-app-stage-label${i <= stageIdx ? ' active' : ''}">${label}</span>`
            ).join('');
            const stagePipes = STAGES.map((_, i) => {
                let cls = 'my-app-stage';
                if (isRejected && i >= stageIdx) cls += ' rejected';
                else if (i < stageIdx) cls += ' completed';
                else if (i === stageIdx) cls += ' current';
                return `<div class="${cls}"></div>`;
            }).join('');

            let interviewHtml = '';
            if (app.interviewDate) {
                interviewHtml = `
                    <div class="my-app-interview">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <span>Entrevista: ${escapeHtml(app.interviewDate)} ${app.interviewTime || ''} · ${escapeHtml(app.interviewModality || 'N/D')} · ${escapeHtml(app.interviewStatus || 'N/D')}</span>
                    </div>`;
            }

            let notesHtml = '';
            if (app.notes) {
                notesHtml = `<div class="my-app-notes">${escapeHtml(app.notes)}</div>`;
            }

            const statusCls = isRejected ? 'status-cerrada' : `status-${app.estado?.toLowerCase().replace(/\s+/g, '-')}`;
            const dateStr = app.fechaPostulacion || 'Sin fecha';

            return `
                <div class="my-app-card">
                    <div class="my-app-header">
                        <div>
                            <p class="my-app-vacancy">${escapeHtml(app.vacancyTitle)}</p>
                            <p class="my-app-company">${escapeHtml(app.companyName)} · ${escapeHtml(app.companySector)}</p>
                        </div>
                        <div class="my-app-date">
                            <span class="status-badge ${statusCls}">${escapeHtml(app.estado)}</span>
                            <div style="margin-top:4px;">${escapeHtml(dateStr)}</div>
                        </div>
                    </div>
                    <div class="my-app-stage-labels">${stageLabels}</div>
                    <div class="my-app-pipeline">${stagePipes}</div>
                    ${interviewHtml}
                    ${notesHtml}
                </div>`;
        }).join('');
    }
};
