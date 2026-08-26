const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

export const Confirmation = {
    initialized: false,
    elements: {},
    pending: null,
    init() {
        if (this.initialized) return;
        this.elements = {
            modal: document.getElementById('deleteConfirmation'),
            title: document.getElementById('deleteConfirmationTitle'),
            message: document.getElementById('deleteConfirmationMessage'),
            item: document.getElementById('deleteConfirmationItem'),
            cancel: document.getElementById('deleteConfirmationCancel'),
            submit: document.getElementById('deleteConfirmationSubmit')
        };
        this.elements.cancel?.addEventListener('click', () => this.close(false));
        this.elements.submit?.addEventListener('click', () => this.close(true));
        this.elements.modal?.addEventListener('click', (event) => { if (event.target === this.elements.modal) this.close(false); });
        document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && this.pending) this.close(false); });
        this.initialized = true;
    },
    confirm({ type = 'elemento', name = '', id = '' } = {}) {
        this.init();
        if (!this.elements.modal) return Promise.resolve(false);
        if (this.pending) this.close(false);
        this.elements.title.textContent = `¿Eliminar ${type}?`;
        this.elements.message.textContent = `Esta acción no se puede deshacer. Todos los datos asociados a este ${type} se perderán permanentemente.`;
        this.elements.item.innerHTML = `<span class="delete-confirmation-item-avatar">${escapeHtml(name.charAt(0).toUpperCase() || '#')}</span><span><strong>${escapeHtml(name || `Registro ${id}`)}</strong><small>${escapeHtml(id ? `ID: ${id}` : 'Registro seleccionado')}</small></span>`;
        this.elements.modal.classList.remove('hidden');
        this.elements.submit.focus();
        return new Promise((resolve) => { this.pending = resolve; });
    },
    close(confirmed) {
        if (!this.pending) return;
        const resolve = this.pending;
        this.pending = null;
        this.elements.modal.classList.add('hidden');
        resolve(confirmed);
    }
};