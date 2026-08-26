/**
 * accessibilityModule.js
 * Módulo para gestionar el modo daltónico y preferencias de accesibilidad visual.
 * Persiste preferencias en localStorage.
 */

export const AccessibilityModule = (() => {
    const STORAGE_KEY = 'jobConnect_colorblind';
    let currentMode = 'normal'; // default

    const MODES = {
        normal: 'Normal',
        protanopia: 'Protanopía',
        deuteranopia: 'Deuteranopía',
        tritanopia: 'Tritanopía',
        monochrome: 'Alto Contraste / Acromático'
    };

    function apply(mode) {
        if (!Object.prototype.hasOwnProperty.call(MODES, mode)) mode = 'normal';
        currentMode = mode;
        
        // Remove existing colorblind attributes
        document.documentElement.removeAttribute('data-colorblind');
        
        if (mode !== 'normal') {
            document.documentElement.setAttribute('data-colorblind', mode);
        }
        
        localStorage.setItem(STORAGE_KEY, mode);
        
        // Update UI dropdown active states
        updateDropdownUI();
        const button = document.getElementById('a11yToggleBtn');
        if (button) {
            button.setAttribute('aria-label', `Ajuste daltónico: ${MODES[mode]}`);
            button.setAttribute('title', `Ajuste daltónico: ${MODES[mode]}`);
            button.dataset.mode = mode;
        }
    }

    function updateDropdownUI() {
        const options = document.querySelectorAll('.a11y-option');
        options.forEach(opt => {
            if (opt.dataset.mode === currentMode) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
    }

    function init() {
        // Load saved preference
        const saved = localStorage.getItem(STORAGE_KEY) || 'normal';
        apply(saved);

        // Bind events
        const a11yToggleBtn = document.getElementById('a11yToggleBtn');
        const a11yDropdown = document.getElementById('a11yDropdown');
        
        if (a11yToggleBtn && a11yDropdown) {
            // Toggle dropdown
            a11yToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                a11yDropdown.classList.toggle('hidden');
                a11yToggleBtn.setAttribute('aria-expanded', !a11yDropdown.classList.contains('hidden'));
            });

            a11yToggleBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    a11yToggleBtn.click();
                }
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!a11yDropdown.contains(e.target) && e.target !== a11yToggleBtn) {
                    a11yDropdown.classList.add('hidden');
                    a11yToggleBtn.setAttribute('aria-expanded', 'false');
                }
            });

            // Handle option selection
            const options = a11yDropdown.querySelectorAll('.a11y-option');
            options.forEach(opt => {
                opt.addEventListener('click', (e) => {
                    const mode = e.currentTarget.dataset.mode;
                    if (mode) {
                        apply(mode);
                        a11yDropdown.classList.add('hidden');
                        a11yToggleBtn.setAttribute('aria-expanded', 'false');
                    }
                });
                opt.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        opt.click();
                    }
                });
            });
        }
    }

    return { init, apply, getCurrentMode: () => currentMode };
})();
