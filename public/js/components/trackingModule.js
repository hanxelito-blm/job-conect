import { candidates as seedCandidates, vacancies as seedVacancies, companies as seedCompanies, interviews as seedInterviews, applications as seedApplications } from '../mockData.js';

const STAGES = [
    { id: 'postulado', label: 'Postulado', color: '#3b82f6' },
    { id: 'en-revision', label: 'En Revisión', color: '#f59e0b' },
    { id: 'entrevista', label: 'Entrevista', color: '#8b5cf6' },
    { id: 'evaluacion', label: 'Evaluación', color: '#06b6d4' },
    { id: 'oferta', label: 'Oferta', color: '#10b981' },
    { id: 'contratado', label: 'Contratado', color: '#22c55e' }
];

const STATUS_MAP = {
    'Postulado': 'postulado',
    'En revisión': 'en-revision',
    'En seguimiento': 'en-revision',
    'Entrevista': 'entrevista',
    'Entrevistado': 'entrevista',
    'Aceptado': 'oferta',
    'Contratado': 'contratado',
    'Rechazado': 'rechazado'
};

export const TrackingModule = {
    state: {
        pipeline: [],
        candidates: [],
        stats: { total: 0, byStage: {} }
    },

    init() {
        this.cacheDOM();
        this.bindEvents();
    },

    cacheDOM() {
        this.pipelineContainer = document.getElementById('trackingPipeline');
        this.statsContainer = document.getElementById('trackingStats');
        this.tableBody = document.getElementById('trackingTbody');
        this.searchInput = document.getElementById('trackingSearch');
        this.stageFilter = document.getElementById('trackingStageFilter');
        this.companyFilter = document.getElementById('trackingCompanyFilter');
        this.clearBtn = document.getElementById('trackingClearFilters');
    },

    bindEvents() {
        if (this.searchInput) this.searchInput.addEventListener('input', () => this.render());
        if (this.stageFilter) this.stageFilter.addEventListener('change', () => this.render());
        if (this.companyFilter) this.companyFilter.addEventListener('change', () => this.render());
        if (this.clearBtn) this.clearBtn.addEventListener('click', () => this.clearFilters());
    },

    loadData() {
        this.state.candidates = seedCandidates.map(candidate => {
            const vacancy = seedVacancies.find(v => v.id === candidate.vacanteId);
            const company = seedCompanies.find(c => c.id === candidate.empresaId);
            const interview = seedInterviews.find(i => i.candidatoId === candidate.id);
            const application = seedApplications.find(a => a.candidatoId === candidate.id);
            const stage = STATUS_MAP[candidate.estado] || 'postulado';

            return {
                id: candidate.id,
                name: candidate.nombreCompleto,
                vacancy: vacancy?.titulo || 'Sin vacante',
                company: company?.nombre || 'Sin empresa',
                companyId: candidate.empresaId,
                stage,
                stageLabel: STAGES.find(s => s.id === stage)?.label || candidate.estado,
                appliedAt: candidate.fechaPostulacion,
                interviewDate: interview?.fecha || null,
                interviewModality: interview?.modalidad || null,
                status: candidate.estado
            };
        });

        this.calculateStats();
        this.populateCompanyFilter();
        this.renderPipeline();
        this.render();
    },

    calculateStats() {
        const stats = { total: this.state.candidates.length, byStage: {} };
        STAGES.forEach(stage => {
            stats.byStage[stage.id] = this.state.candidates.filter(c => c.stage === stage.id).length;
        });
        this.state.stats = stats;
    },

    populateCompanyFilter() {
        if (!this.companyFilter) return;
        const companies = [...new Set(this.state.candidates.map(c => c.company).filter(Boolean))];
        this.companyFilter.innerHTML = '<option value="">Todas las empresas</option>';
        companies.forEach(company => {
            const option = document.createElement('option');
            option.value = company;
            option.textContent = company;
            this.companyFilter.appendChild(option);
        });
    },

    renderPipeline() {
        if (!this.pipelineContainer) return;
        const { stats } = this.state;
        const maxCount = Math.max(...Object.values(stats.byStage), 1);

        this.pipelineContainer.innerHTML = STAGES.map(stage => {
            const count = stats.byStage[stage.id] || 0;
            const percentage = Math.round((count / maxCount) * 100);
            return `
                <div class="tracking-stage">
                    <div class="stage-header">
                        <span class="stage-dot" style="background:${stage.color}"></span>
                        <span class="stage-name">${stage.label}</span>
                        <span class="stage-count">${count}</span>
                    </div>
                    <div class="stage-bar">
                        <div class="stage-fill" style="width:${percentage}%; background:${stage.color}"></div>
                    </div>
                </div>
            `;
        }).join('');

        if (this.statsContainer) {
            this.statsContainer.innerHTML = `
                <div class="tracking-stat">
                    <span class="stat-number">${stats.total}</span>
                    <span class="stat-label">Total Candidatos</span>
                </div>
                <div class="tracking-stat">
                    <span class="stat-number">${stats.byStage['contratado'] || 0}</span>
                    <span class="stat-label">Contratados</span>
                </div>
                <div class="tracking-stat">
                    <span class="stat-number">${stats.total > 0 ? Math.round(((stats.byStage['contratado'] || 0) / stats.total) * 100) : 0}%</span>
                    <span class="stat-label">Tasa de Éxito</span>
                </div>
            `;
        }
    },

    getFilteredItems() {
        let items = [...this.state.candidates];
        const searchText = this.searchInput ? this.searchInput.value.trim().toLowerCase() : '';
        const stageValue = this.stageFilter ? this.stageFilter.value : '';
        const companyValue = this.companyFilter ? this.companyFilter.value : '';

        if (searchText) {
            items = items.filter(item =>
                (item.name || '').toLowerCase().includes(searchText) ||
                (item.vacancy || '').toLowerCase().includes(searchText)
            );
        }

        if (stageValue) items = items.filter(item => item.stage === stageValue);
        if (companyValue) items = items.filter(item => item.company === companyValue);

        return items;
    },

    render() {
        if (!this.tableBody) return;
        const items = this.getFilteredItems();

        if (items.length === 0) {
            this.tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state-cell">
                        <p>No hay candidatos en el pipeline con estos filtros.</p>
                    </td>
                </tr>
            `;
            return;
        }

        this.tableBody.innerHTML = items.map(item => {
            const stageInfo = STAGES.find(s => s.id === item.stage);
            const daysSinceApply = Math.floor((Date.now() - new Date(item.appliedAt).getTime()) / 86400000);
            return `
                <tr>
                    <td><strong>${item.name}</strong></td>
                    <td>${item.vacancy}<br><small class="table-muted">${item.company}</small></td>
                    <td><span class="status-badge" style="background:${stageInfo?.color || '#6b7280'}20; color:${stageInfo?.color || '#6b7280'}">${item.stageLabel}</span></td>
                    <td>${item.appliedAt}<br><small class="table-muted">${daysSinceApply} días</small></td>
                    <td>${item.interviewDate ? `${item.interviewDate}<br><small class="table-muted">${item.interviewModality || ''}</small>` : '<small class="table-muted">Pendiente</small>'}</td>
                    <td><button class="btn btn-small btn-secondary tracking-detail-btn" data-id="${item.id}">Ver detalle</button></td>
                </tr>
            `;
        }).join('');

        this.tableBody.querySelectorAll('.tracking-detail-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                window.location.href = '/candidates';
            });
        });
    },

    clearFilters() {
        if (this.searchInput) this.searchInput.value = '';
        if (this.stageFilter) this.stageFilter.value = '';
        if (this.companyFilter) this.companyFilter.value = '';
        this.render();
    }
};
