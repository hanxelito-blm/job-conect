// public/js/components/dashboardModule.js
import { api } from '../services/apiService.js';
import { companies as seedCompanies, vacancies as seedVacancies, candidates as seedCandidates, interviews as seedInterviews } from '../mockData.js';

export const DashboardModule = {
    state: {
        vacancies: [],
        interviews: [],
        companies: [],
        candidates: [],
        isLoaded: false,
        loading: false
    },

    init() {
        this.cacheDOM();
        this.bindEvents();
    },

    cacheDOM() {
        // KPI Elements
        this.kpiVacancies = document.getElementById('kpiVacanciesValue');
        this.kpiVacanciesSub = document.getElementById('kpiVacanciesSub');
        this.kpiInterviews = document.getElementById('kpiInterviewsValue');
        this.kpiInterviewsSub = document.getElementById('kpiInterviewsSub');
        this.kpiCompanies = document.getElementById('kpiCompaniesValue');
        this.kpiCompaniesSub = document.getElementById('kpiCompaniesSub');
        this.kpiCandidates = document.getElementById('kpiCandidatesValue');
        this.kpiCandidatesSub = document.getElementById('kpiCandidatesSub');

        // Quick Actions
        this.qaNewVacancy = document.getElementById('qaNewVacancy');
        this.qaNewInterview = document.getElementById('qaNewInterview');
        this.qaNewCompany = document.getElementById('qaNewCompany');
        this.qaNewCandidate = document.getElementById('qaNewCandidate');

        // Containers / Tables / Lists
        this.interviewsList = document.getElementById('dashInterviewsList');
        this.vacanciesTableBody = document.getElementById('dashVacanciesTbody');
        this.companiesGrid = document.getElementById('dashCompaniesGrid');

        // Refresh & Date
        this.refreshBtn = document.getElementById('dashRefreshBtn');
        this.dashDateDisplay = document.getElementById('dashDateDisplay');
    },

    bindEvents() {
        if (this.refreshBtn) {
            this.refreshBtn.addEventListener('click', () => this.loadData(true));
        }

        // Delegación de eventos para cambios de estado en widgets
        const dashboardSection = document.getElementById('dashboardSection');
        if (dashboardSection) {
            dashboardSection.addEventListener('click', (e) => {
                // Cambiar estado de entrevista rápido
                const interviewStatusBtn = e.target.closest('.interview-status-toggle');
                if (interviewStatusBtn) {
                    const interviewId = interviewStatusBtn.dataset.id;
                    this.toggleInterviewStatus(interviewId, interviewStatusBtn);
                }

                // Toggle estado vacante
                const vacancyStatusBtn = e.target.closest('.vacancy-status-toggle');
                if (vacancyStatusBtn) {
                    const vacancyId = vacancyStatusBtn.dataset.id;
                    this.toggleVacancyStatus(vacancyId, vacancyStatusBtn);
                }
            });
        }
    },

    async loadData(force = false) {
        if (this.state.isLoaded && !force) return;
        if (this.state.loading) return;

        this.state.loading = true;
        this.updateDateDisplay();

        const companyById = (id) => seedCompanies.find((company) => company.id === id);
        const vacancyById = (id) => seedVacancies.find((vacancy) => vacancy.id === id);
        this.state.vacancies = seedVacancies.map((vacancy) => ({
            id: vacancy.id,
            title: vacancy.titulo,
            company: companyById(vacancy.empresaId)?.nombre || 'Empresa',
            category: vacancy.departamento,
            applicants: vacancy.postulantesCount,
            status: vacancy.estado,
            salary: vacancy.rangoSalarial,
            createdAt: vacancy.fechaPublicacion
        }));
        this.state.interviews = seedInterviews.map((interview) => {
            const candidate = seedCandidates.find((item) => item.id === interview.candidatoId);
            const vacancy = vacancyById(interview.vacanteId);
            return {
                id: interview.id,
                candidate: candidate?.nombreCompleto || interview.candidatoId,
                role: vacancy?.titulo || interview.vacanteId,
                company: companyById(vacancy?.empresaId)?.nombre || 'Empresa',
                time: interview.hora,
                day: interview.fecha,
                status: interview.estado,
                note: interview.notas
            };
        });
        this.state.companies = seedCompanies.map((company) => ({
            id: company.id,
            name: company.nombre,
            sector: company.sector,
            logo: company.nombre.split(' ').map((word) => word[0]).join('').slice(0, 2),
            color: '#3ee6ab',
            activeVacancies: company.vacantesActivasCount,
            totalHires: seedCandidates.filter((candidate) => candidate.empresaId === company.id && candidate.estado === 'Contratado').length,
            status: 'Verificada'
        }));
        this.state.candidates = seedCandidates;
        this.state.isLoaded = true;
        this.renderAll();
        this.state.loading = false;
        return;

        if (this.refreshBtn) {
            this.refreshBtn.classList.add('loading-spin');
        }

        try {
            // Cargar datos en paralelo desde los endpoints de DummyJSON
            const [productsRes, commentsRes, cartsRes, usersRes] = await Promise.allSettled([
                api.get('/products?limit=12'),
                api.get('/comments?limit=10'),
                api.get('/carts?limit=8'),
                api.get('/users?limit=10')
            ]);

            // Vacantes (Mapeo desde Products)
            const rawProducts = productsRes.status === 'fulfilled' ? (productsRes.value.products || []) : [];
            this.state.vacancies = rawProducts.map((p, idx) => ({
                id: p.id,
                title: p.title,
                company: p.brand || this.generateCompanyName(idx),
                category: p.category || 'Tecnología',
                applicants: Math.floor((p.stock || 20) * 1.5) + (idx * 3),
                status: idx % 4 === 0 ? 'Pausada' : 'Activa',
                salary: `$${(p.price * 110).toLocaleString()} USD`,
                createdAt: 'Hace 2 días'
            }));

            // Entrevistas (Mapeo desde Comments + Horarios dinámicos)
            const rawComments = commentsRes.status === 'fulfilled' ? (commentsRes.value.comments || []) : [];
            const statuses = ['Confirmada', 'Pendiente', 'En curso', 'Confirmada', 'Pendiente'];
            const times = ['09:30 AM', '11:00 AM', '02:15 PM', '04:00 PM', '05:30 PM', '10:00 AM'];
            const days = ['Hoy', 'Hoy', 'Mañana', 'Mañana', 'Jueves', 'Viernes'];

            this.state.interviews = rawComments.slice(0, 6).map((c, idx) => ({
                id: c.id,
                candidate: c.user?.username ? (c.user.username.charAt(0).toUpperCase() + c.user.username.slice(1)) : `Candidato #${c.userId || idx + 1}`,
                role: this.state.vacancies[idx % this.state.vacancies.length]?.title || 'Ingeniero de Software',
                company: this.state.vacancies[idx % this.state.vacancies.length]?.company || 'TechCorp Global',
                time: times[idx % times.length],
                day: days[idx % days.length],
                status: statuses[idx % statuses.length],
                note: c.body ? (c.body.length > 55 ? c.body.substring(0, 52) + '...' : c.body) : 'Entrevista técnica de primera fase'
            }));

            // Empresas (Mapeo desde Carts + Empresas ficticias de alto nivel)
            const rawCarts = cartsRes.status === 'fulfilled' ? (cartsRes.value.carts || []) : [];
            const enterpriseNames = [
                { name: 'CyberSphere Inc.', sector: 'Inteligencia Artificial', logo: 'CS', color: '#3ee6ab' },
                { name: 'NovaTech Solutions', sector: 'Cloud & DevOps', logo: 'NT', color: '#27c998' },
                { name: 'Quantum Leap Labs', sector: 'Ciberseguridad', logo: 'QL', color: '#1fa57d' },
                { name: 'Aetheria Digital', sector: 'Fintech & Blockchain', logo: 'AD', color: '#68d391' },
                { name: 'Hyperion Data', sector: 'Big Data & Analytics', logo: 'HD', color: '#38b2ac' },
                { name: 'Starlight Media', sector: 'E-Commerce Global', logo: 'SM', color: '#4fd1c5' }
            ];

            this.state.companies = rawCarts.slice(0, 6).map((cart, idx) => {
                const info = enterpriseNames[idx % enterpriseNames.length];
                return {
                    id: cart.id,
                    name: info.name,
                    sector: info.sector,
                    logo: info.logo,
                    color: info.color,
                    activeVacancies: cart.products ? Math.min(cart.products.length, 6) : 3,
                    totalHires: Math.floor((cart.total || 500) / 100),
                    status: 'Verificada'
                };
            });

            // Candidatos
            const rawUsers = usersRes.status === 'fulfilled' ? (usersRes.value.users || []) : [];
            this.state.candidates = rawUsers;

            this.state.isLoaded = true;
            this.renderAll();
        } catch (error) {
            console.error('Error al cargar datos del Dashboard:', error);
        } finally {
            this.state.loading = false;
            if (this.refreshBtn) {
                this.refreshBtn.classList.remove('loading-spin');
            }
        }
    },

    renderAll() {
        this.renderKPIs();
        this.renderRecentVacancies();
        this.renderUpcomingInterviews();
        this.renderCompaniesActivity();
    },

    renderKPIs() {
        // 1. Vacantes Activas
        const totalVacancies = this.state.vacancies.length;
        const activeVacancies = this.state.vacancies.filter(v => v.status === 'Activa').length;
        const pausedVacancies = totalVacancies - activeVacancies;

        if (this.kpiVacancies) {
            this.kpiVacancies.textContent = `${activeVacancies}`;
        }
        if (this.kpiVacanciesSub) {
            this.kpiVacanciesSub.innerHTML = `<span class="kpi-tag-good">${activeVacancies} abiertas</span> · <span class="kpi-tag-neutral">${pausedVacancies} en pausa</span>`;
        }

        // 2. Entrevistas Programadas
        const totalInterviews = this.state.interviews.length;
        const todayInterviews = this.state.interviews.filter(i => i.day === 'Hoy').length;
        if (this.kpiInterviews) {
            this.kpiInterviews.textContent = `${totalInterviews}`;
        }
        if (this.kpiInterviewsSub) {
            this.kpiInterviewsSub.innerHTML = `<span class="kpi-tag-highlight">${todayInterviews} para hoy</span> · <span class="kpi-tag-neutral">${totalInterviews - todayInterviews} esta semana</span>`;
        }

        // 3. Empresas Registradas
        const totalCompanies = this.state.companies.length;
        if (this.kpiCompanies) {
            this.kpiCompanies.textContent = `${totalCompanies}`;
        }
        if (this.kpiCompaniesSub) {
            this.kpiCompaniesSub.innerHTML = `<span class="kpi-tag-good">+3 este mes</span> · <span class="kpi-tag-neutral">100% verificadas</span>`;
        }

        // 4. Candidatos / Postulaciones
        const totalCandidates = this.state.candidates.length || 10;
        if (this.kpiCandidates) {
            this.kpiCandidates.textContent = `${totalCandidates}`;
        }
        if (this.kpiCandidatesSub) {
            this.kpiCandidatesSub.innerHTML = `<span class="kpi-tag-good">18 nuevas postulaciones</span>`;
        }

        // Sincronizar también con contadores de la barra lateral si existen
        const statsVac = document.getElementById('statsVacancies');
        if (statsVac) statsVac.textContent = `${totalVacancies}`;
        const statsComp = document.getElementById('statsCompanies');
        if (statsComp) statsComp.textContent = `${totalCompanies}`;
        const statsInt = document.getElementById('statsInterviews');
        if (statsInt) statsInt.textContent = `${totalInterviews}`;
    },

    renderRecentVacancies() {
        if (!this.vacanciesTableBody) return;
        this.vacanciesTableBody.innerHTML = '';

        const recent = this.state.vacancies.slice(0, 5);

        if (recent.length === 0) {
            this.vacanciesTableBody.innerHTML = `
                <tr><td colspan="5" class="empty-table-state">No hay vacantes registradas</td></tr>
            `;
            return;
        }

        recent.forEach((item) => {
            const tr = document.createElement('tr');
            const isActiva = item.status === 'Activa';
            const badgeClass = isActiva ? 'badge-neon-green' : 'badge-neon-yellow';

            tr.innerHTML = `
                <td>
                    <div class="table-vacancy-item">
                        <div class="vacancy-bullet"></div>
                        <div>
                            <strong class="vacancy-name">${this.escapeHTML(item.title)}</strong>
                            <span class="vacancy-company">${this.escapeHTML(item.company)}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="category-chip">${this.escapeHTML(item.category)}</span>
                </td>
                <td>
                    <div class="applicants-progress-wrap">
                        <div class="applicants-count"><span class="neon-num">${item.applicants}</span> postulantes</div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: ${Math.min(item.applicants * 2, 100)}%;"></div>
                        </div>
                    </div>
                </td>
                <td>
                    <button class="vacancy-status-toggle ${badgeClass}" data-id="${item.id}" title="Click para cambiar estado">
                        <span class="status-dot"></span> ${item.status}
                    </button>
                </td>
                <td class="text-right">
                    <a href="vacancies.html" class="btn-dash-action" title="Gestionar vacante">
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                    </a>
                </td>
            `;
            this.vacanciesTableBody.appendChild(tr);
        });
    },

    renderUpcomingInterviews() {
        if (!this.interviewsList) return;
        this.interviewsList.innerHTML = '';

        const list = this.state.interviews.slice(0, 5);

        if (list.length === 0) {
            this.interviewsList.innerHTML = `
                <div class="empty-list-state">No hay entrevistas programadas para los próximos días.</div>
            `;
            return;
        }

        list.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'agenda-item-card';

            let statusClass = 'badge-neon-green';
            if (item.status === 'Pendiente') statusClass = 'badge-neon-yellow';
            if (item.status === 'En curso') statusClass = 'badge-neon-pulse';

            card.innerHTML = `
                <div class="agenda-time-badge">
                    <span class="agenda-day">${item.day}</span>
                    <span class="agenda-hour">${item.time}</span>
                </div>
                <div class="agenda-details">
                    <div class="agenda-candidate-name">${this.escapeHTML(item.candidate)}</div>
                    <div class="agenda-meta">
                        <span>${this.escapeHTML(item.role)}</span> · <span class="agenda-company-tag">${this.escapeHTML(item.company)}</span>
                    </div>
                    <div class="agenda-note">${this.escapeHTML(item.note)}</div>
                </div>
                <div class="agenda-actions">
                    <button class="interview-status-toggle ${statusClass}" data-id="${item.id}" title="Click para alternar estado">
                        ${item.status}
                    </button>
                </div>
            `;
            this.interviewsList.appendChild(card);
        });
    },

    renderCompaniesActivity() {
        if (!this.companiesGrid) return;
        this.companiesGrid.innerHTML = '';

        const companies = this.state.companies.slice(0, 4);

        if (companies.length === 0) {
            this.companiesGrid.innerHTML = `
                <div class="empty-list-state">No hay actividad reciente de empresas.</div>
            `;
            return;
        }

        companies.forEach((comp) => {
            const card = document.createElement('div');
            card.className = 'company-activity-card';

            card.innerHTML = `
                <div class="company-card-header">
                    <div class="company-avatar" style="border-color: ${comp.color}; color: ${comp.color}">
                        ${comp.logo}
                    </div>
                    <div class="company-card-info">
                        <h4 class="company-card-name">${this.escapeHTML(comp.name)}</h4>
                        <span class="company-card-sector">${this.escapeHTML(comp.sector)}</span>
                    </div>
                </div>
                <div class="company-card-stats">
                    <div class="comp-stat-pill">
                        <span class="comp-stat-num">${comp.activeVacancies}</span>
                        <span class="comp-stat-label">Vacantes</span>
                    </div>
                    <div class="comp-stat-pill">
                        <span class="comp-stat-num">${comp.totalHires}</span>
                        <span class="comp-stat-label">Contratados</span>
                    </div>
                </div>
                <div class="company-card-footer">
                    <span class="company-status-badge">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        ${comp.status}
                    </span>
                    <a href="companies.html" class="btn-company-view">
                        Ver perfil
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                    </a>
                </div>
            `;
            this.companiesGrid.appendChild(card);
        });
    },

    toggleInterviewStatus(interviewId, buttonElement) {
        const item = this.state.interviews.find(i => String(i.id) === String(interviewId));
        if (!item) return;

        const flow = {
            'Pendiente': 'Confirmada',
            'Confirmada': 'En curso',
            'En curso': 'Pendiente'
        };

        item.status = flow[item.status] || 'Confirmada';
        this.renderUpcomingInterviews();
        this.renderKPIs();
    },

    toggleVacancyStatus(vacancyId, buttonElement) {
        const item = this.state.vacancies.find(v => String(v.id) === String(vacancyId));
        if (!item) return;

        item.status = item.status === 'Activa' ? 'Pausada' : 'Activa';
        this.renderRecentVacancies();
        this.renderKPIs();
    },

    updateDateDisplay() {
        if (!this.dashDateDisplay) return;
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formatted = now.toLocaleDateString('es-ES', options);
        this.dashDateDisplay.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    },

    generateCompanyName(idx) {
        const names = ['Nexus Dynamics', 'Vortex AI', 'AeroSoft Tech', 'Prism Labs', 'Krypton Studio', 'Zenith Systems'];
        return names[idx % names.length];
    },

    escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
};
