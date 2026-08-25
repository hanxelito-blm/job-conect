// public/js/services/apiService.js

/**
 * Servicio Genérico para consumos asíncronos (Fetch)
 * Implementa try/catch y funciones puras.
 */

const BASE_URL = 'https://dummyjson.com';

/**
 * Helper para manejar las peticiones y sus errores
 */
async function fetchHandler(url, options = {}) {
    try {
        const response = await fetch(`${BASE_URL}${url}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error en la petición: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error en API (Fetch a ${url}):`, error);
        throw error; // Propagamos el error para manejarlo en la UI
    }
}

// ==========================================
// FUNCIONES PURAS EXPORTADAS (Módulos JS)
// ==========================================

export const api = {
    get: (endpoint) => fetchHandler(endpoint),
    
    post: (endpoint, data) => fetchHandler(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    put: (endpoint, data) => fetchHandler(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    
    patch: (endpoint, data) => fetchHandler(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(data)
    }),
    
    delete: (endpoint) => fetchHandler(endpoint, {
        method: 'DELETE'
    })
};
