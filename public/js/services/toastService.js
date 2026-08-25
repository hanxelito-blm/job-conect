/**
 * public/js/services/toastService.js
 * Servicio para notificaciones visuales flotantes (Toast)
 */

export const Toast = (() => {
    let container = null;

    function getContainer() {
        if (!container) {
            container = document.getElementById('toastContainer');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toastContainer';
                container.className = 'toast-container';
                document.body.appendChild(container);
            }
        }
        return container;
    }

    /**
     * Muestra un toast
     * @param {string} message - Mensaje a mostrar
     * @param {'success'|'error'|'info'} type - Tipo de notificación
     * @param {number} duration - Duración en milisegundos
     */
    function show(message, type = 'success', duration = 3500) {
        const cont = getContainer();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type} fade-in`;

        const iconSvg = type === 'success'
            ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
            : type === 'error'
            ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
            : `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

        toast.innerHTML = `
            <span class="toast-icon">${iconSvg}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" aria-label="Cerrar">&times;</button>
        `;

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => removeToast(toast));

        cont.appendChild(toast);

        setTimeout(() => {
            removeToast(toast);
        }, duration);
    }

    function removeToast(toast) {
        if (!toast || !toast.parentNode) return;
        toast.classList.add('toast-fade-out');
        toast.addEventListener('animationend', () => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        });
    }

    return { show };
})();
