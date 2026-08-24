/**
 * Sistema de Autenticación para JobConnect
 * Autor: Desarrollador Full-Stack Junior
 */

// 1 & 2. Conexión asíncrona a la API y guardado del token
async function loginJobConnect(username = 'emilys', password = 'emilyspass') {
    try {
        // Hacemos la petición POST al endpoint
        const response = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                // expiresInMins: 60 // opcional
            })
        });

        // Verificamos si la respuesta no es exitosa (ej. 400, 401, 404, 500)
        if (!response.ok) {
            // Esto lanzará el error al bloque catch
            throw new Error('Credenciales incorrectas o error de servidor.');
        }

        // Parseamos la respuesta JSON
        const data = await response.json();

        // Guardamos exitosamente el token devuelto en el localStorage
        localStorage.setItem('jobConnectToken', data.token);

        alert('¡Inicio de sesión exitoso! Bienvenido a JobConnect.');
        
        // Aquí puedes redirigir a la página principal
        // window.location.href = '/dashboard.html';

    } catch (error) {
        // 4. Manejo de errores para mostrar alertas limpias
        console.error('Ocurrió un error en el login:', error);
        alert(`Error al iniciar sesión: ${error.message}`);
    }
}

// 3. Función de protección de rutas / validación
function protectRoute() {
    // Intentamos obtener el token del localStorage
    const token = localStorage.getItem('jobConnectToken');

    // Verificamos si NO existe el token
    if (!token) {
        alert('Acceso denegado. Debes iniciar sesión para ver esta página.');
        
        // Impedimos el acceso y redirigimos al login
        // window.location.href = '/login.html';
        
        return false; // Retornamos false para detener la ejecución de otros scripts si es necesario
    }

    // Si el token existe, permitimos el acceso
    console.log('Token válido encontrado, acceso permitido a los módulos principales.');
    return true;
}

// Función extra para cerrar sesión fácilmente
function logout() {
    localStorage.removeItem('jobConnectToken');
    alert('Sesión cerrada correctamente.');
    // window.location.href = '/login.html';
}
