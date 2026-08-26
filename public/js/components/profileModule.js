import { Toast } from '../services/toastService.js';
import { AuthService } from '../services/authService.js';

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

export const ProfileModule = {
    state: { profile: null },

    init() {
        this.cacheDOM();
        this.bindEvents();
    },

    loadData() {
        this.loadProfile();
    },

    cacheDOM() {
        this.form = document.getElementById('profileForm');
        this.avatarEl = document.getElementById('profileAvatar');
        this.displayNameEl = document.getElementById('profileDisplayName');
        this.displayRoleEl = document.getElementById('profileDisplayRole');
        this.firstNameInput = document.getElementById('profileFirstName');
        this.lastNameInput = document.getElementById('profileLastName');
        this.emailInput = document.getElementById('profileEmail');
        this.phoneInput = document.getElementById('profilePhone');
        this.titleInput = document.getElementById('profileTitle');
        this.locationInput = document.getElementById('profileLocation');
        this.summaryInput = document.getElementById('profileSummary');
        this.linkedinInput = document.getElementById('profileLinkedin');
        this.githubInput = document.getElementById('profileGithub');
        this.portfolioInput = document.getElementById('profilePortfolio');
        this.cvUrlInput = document.getElementById('profileCvUrl');
        this.skillsContainer = document.getElementById('profileSkills');
        this.skillInput = document.getElementById('profileSkillInput');
        this.addSkillBtn = document.getElementById('profileAddSkillBtn');
    },

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile();
        });
        this.addSkillBtn.addEventListener('click', () => this.addSkill());
        this.skillInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); this.addSkill(); }
        });
    },

    getProfileKey() {
        const role = AuthService.getRole();
        const username = AuthService.getUsername();
        return `jc_profile_${role}_${username}`;
    },

    loadProfile() {
        const key = this.getProfileKey();
        const stored = localStorage.getItem(key);
        if (stored) {
            this.state.profile = JSON.parse(stored);
        } else {
            this.state.profile = this.buildDefaultProfile();
        }
        this.render();
    },

    buildDefaultProfile() {
        const role = AuthService.getRole();
        if (role !== 'candidato') {
            const username = AuthService.getUsername();
            return {
                firstName: username || '',
                lastName: '',
                email: '',
                phone: '',
                title: AuthService.getRoleLabel(),
                location: '',
                summary: '',
                linkedin: '',
                github: '',
                portfolio: '',
                cvUrl: '',
                skills: []
            };
        }
        const candidateId = localStorage.getItem('jc_currentCandidateId') || 'can-001';
        const candidates = JSON.parse(localStorage.getItem('jc_candidates') || '[]');
        const candidate = candidates.find(c => c.id === candidateId) || candidates[0];
        if (!candidate) {
            return {
                firstName: '', lastName: '', email: '', phone: '',
                title: '', location: '', summary: '', linkedin: '',
                github: '', portfolio: '', cvUrl: '', skills: []
            };
        }
        const nameParts = (candidate.nombreCompleto || '').split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        return {
            firstName,
            lastName,
            email: candidate.email || '',
            phone: candidate.telefono || '',
            title: candidate.tituloProfesional || '',
            location: candidate.ubicacion || '',
            summary: candidate.resumenPerfil || '',
            linkedin: candidate.enlaces?.linkedin || '',
            github: candidate.enlaces?.github || '',
            portfolio: candidate.enlaces?.portfolio || '',
            cvUrl: candidate.urlCV || '',
            skills: [...(candidate.habilidades || [])]
        };
    },

    render() {
        const p = this.state.profile;
        const fullName = `${p.firstName} ${p.lastName}`.trim() || 'Candidato';
        const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

        this.avatarEl.textContent = initials;
        this.displayNameEl.textContent = fullName;
        this.displayRoleEl.textContent = p.title || 'Candidato';
        this.firstNameInput.value = p.firstName;
        this.lastNameInput.value = p.lastName;
        this.emailInput.value = p.email;
        this.phoneInput.value = p.phone;
        this.titleInput.value = p.title;
        this.locationInput.value = p.location;
        this.summaryInput.value = p.summary;
        this.linkedinInput.value = p.linkedin;
        this.githubInput.value = p.github;
        this.portfolioInput.value = p.portfolio;
        this.cvUrlInput.value = p.cvUrl;
        this.renderSkills();
    },

    renderSkills() {
        this.skillsContainer.innerHTML = this.state.profile.skills
            .map(s => `<span class="profile-skill-tag">${escapeHtml(s)}<button type="button" class="profile-skill-remove" data-skill="${escapeHtml(s)}" aria-label="Quitar ${escapeHtml(s)}">&times;</button></span>`)
            .join('');

        this.skillsContainer.querySelectorAll('.profile-skill-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const skill = btn.dataset.skill;
                this.state.profile.skills = this.state.profile.skills.filter(s => s !== skill);
                this.renderSkills();
            });
        });
    },

    addSkill() {
        const val = this.skillInput.value.trim();
        if (!val) return;
        if (this.state.profile.skills.includes(val)) {
            Toast.show('Habilidad duplicada', 'error');
            return;
        }
        this.state.profile.skills.push(val);
        this.skillInput.value = '';
        this.renderSkills();
    },

    saveProfile() {
        this.state.profile = {
            firstName: this.firstNameInput.value.trim(),
            lastName: this.lastNameInput.value.trim(),
            email: this.emailInput.value.trim(),
            phone: this.phoneInput.value.trim(),
            title: this.titleInput.value.trim(),
            location: this.locationInput.value.trim(),
            summary: this.summaryInput.value.trim(),
            linkedin: this.linkedinInput.value.trim(),
            github: this.githubInput.value.trim(),
            portfolio: this.portfolioInput.value.trim(),
            cvUrl: this.cvUrlInput.value.trim(),
            skills: [...this.state.profile.skills]
        };
        localStorage.setItem(this.getProfileKey(), JSON.stringify(this.state.profile));
        this.render();
        Toast.show('Perfil guardado correctamente', 'success');
    }
};
