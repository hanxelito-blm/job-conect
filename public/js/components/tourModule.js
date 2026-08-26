/**
 * tourModule.js
 * Módulo de tours interactivos con Driver.js para JobConnect.
 * Muestra un recorrido guiado por la interfaz.
 */

export const TourModule = (() => {
    let driverInstance = null;

    function getSteps(lang) {
        const steps = {
            es: [
                {
                    element: '#tourGuideBtn',
                    popover: {
                        title: 'Bienvenido a JobConnect',
                        description: 'Haz clic aquí en cualquier momento para volver a ver esta guía interactiva.',
                        side: 'bottom',
                        align: 'start'
                    }
                },
                {
                    element: '#a11yToggleBtn',
                    popover: {
                        title: 'Accesibilidad Visual',
                        description: 'Ajusta los esquemas de color para daltonismo (deuteranopía, tritanopía, alto contraste).',
                        side: 'bottom'
                    }
                },
                {
                    element: '#themeToggleBtn',
                    popover: {
                        title: 'Tema Claro / Oscuro',
                        description: 'Cambia entre el modo oscuro (por defecto) y el modo claro para mayor comodidad visual.',
                        side: 'bottom'
                    }
                },
                {
                    element: '#langToggleBtn',
                    popover: {
                        title: 'Idioma',
                        description: 'Alterna la interfaz entre español e inglés con un solo clic.',
                        side: 'bottom'
                    }
                },
                {
                    element: '.sidebar-nav',
                    popover: {
                        title: 'Navegación',
                        description: 'Accede a cada módulo del sistema desde el menú lateral: Dashboard, Empresas, Vacantes, Entrevistas, Candidatos, Postulaciones y Tareas.',
                        side: 'right'
                    }
                },
                {
                    element: '#dashRefreshBtn',
                    popover: {
                        title: 'Panel de Control',
                        description: 'Visualiza métricas en tiempo real: vacantes activas, entrevistas programadas, empresas registradas y candidatos totales.',
                        side: 'left'
                    }
                },
                {
                    element: '.candidate-toolbar',
                    popover: {
                        title: 'Filtros y Búsqueda',
                        description: 'Cada módulo incluye una barra de herramientas con búsqueda en tiempo real, filtros específicos y un botón "Limpiar" para restablecer.',
                        side: 'bottom'
                    }
                }
            ],
            en: [
                {
                    element: '#tourGuideBtn',
                    popover: {
                        title: 'Welcome to JobConnect',
                        description: 'Click here anytime to restart this interactive guide.',
                        side: 'bottom',
                        align: 'start'
                    }
                },
                {
                    element: '#a11yToggleBtn',
                    popover: {
                        title: 'Visual Accessibility',
                        description: 'Adjust color schemes for color blindness (deuteranopia, tritanopia, high contrast).',
                        side: 'bottom'
                    }
                },
                {
                    element: '#themeToggleBtn',
                    popover: {
                        title: 'Light / Dark Theme',
                        description: 'Switch between dark mode (default) and light mode for visual comfort.',
                        side: 'bottom'
                    }
                },
                {
                    element: '#langToggleBtn',
                    popover: {
                        title: 'Language',
                        description: 'Toggle the interface between Spanish and English with a single click.',
                        side: 'bottom'
                    }
                },
                {
                    element: '.sidebar-nav',
                    popover: {
                        title: 'Navigation',
                        description: 'Access each module from the sidebar: Dashboard, Companies, Vacancies, Interviews, Candidates, Applications, and Tasks.',
                        side: 'right'
                    }
                },
                {
                    element: '#dashRefreshBtn',
                    popover: {
                        title: 'Dashboard',
                        description: 'View real-time metrics: active vacancies, scheduled interviews, registered companies, and total candidates.',
                        side: 'left'
                    }
                },
                {
                    element: '.candidate-toolbar',
                    popover: {
                        title: 'Filters & Search',
                        description: 'Each module includes a toolbar with real-time search, specific filters, and a "Clear" button to reset.',
                        side: 'bottom'
                    }
                }
            ]
        };
        return steps[lang] || steps.es;
    }

    function getDriverFactory() {
        if (typeof driver === 'function') return driver;
        if (typeof driver === 'object' && driver !== null) {
            if (typeof driver.js?.driver === 'function') return driver.js.driver;
            if (typeof driver.driver === 'function') return driver.driver;
        }
        return null;
    }

    function init() {
        const factory = getDriverFactory();
        if (!factory) return;

        driverInstance = factory({
            showProgress: true,
            allowClose: true,
            overlayColor: 'rgba(0, 0, 0, 0.55)',
            stagePadding: 8,
            stageRadius: 12,
            animate: true,
            smoothScroll: true,
            nextBtnText: 'Siguiente',
            prevBtnText: 'Anterior',
            progressText: '{{current}} de {{total}}',
            doneBtnText: 'Finalizar',
            allowKeyboardControl: true
        });

        const btn = document.getElementById('tourGuideBtn');
        if (btn) {
            btn.addEventListener('click', start);
        }

        if (!localStorage.getItem('jobConnect_tourDone')) {
            setTimeout(start, 1500);
        }
    }

    function start() {
        if (!driverInstance) return;

        const lang = (document.documentElement.lang || 'es').toLowerCase();
        const steps = getSteps(lang);

        driverInstance.setSteps(steps);

        const isEn = lang === 'en';
        driverInstance.setConfig({
            nextBtnText: isEn ? 'Next' : 'Siguiente',
            prevBtnText: isEn ? 'Previous' : 'Anterior',
            doneBtnText: isEn ? 'Finish' : 'Finalizar',
            progressText: isEn ? '{{current}} of {{total}}' : '{{current}} de {{total}}'
        });

        driverInstance.drive();
        localStorage.setItem('jobConnect_tourDone', '1');
    }

    function reset() {
        localStorage.removeItem('jobConnect_tourDone');
    }

    return { init, start, reset };
})();
