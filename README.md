# JobConnect — Portal Corporativo de Gestión de Talento y Reclutamiento

**JobConnect** es una aplicación web frontend moderna y profesional diseñada para centralizar la gestión de reclutamiento, candidatos, vacantes, empresas clientes, postulaciones, entrevistas y tareas operativas.

---

## 🚀 Tecnologías Utilizadas

- **Frontend Core**: HTML5 semántico y JavaScript ES6 (Módulos nativos `type="module"`).
- **Estilos**: Vanilla CSS con variables CSS personalizadas, modo claro/oscuro (Dark/Light mode) y animaciones fluidas.
- **Servidor Web**: Node.js con Express (`express.static`) para servir la aplicación estática en puerto `3001`.
- **API Backend (Mock)**: Integración asíncrona mediante Fetch API con [DummyJSON API](https://dummyjson.com).
- **UI / UX**: Sistema de notificaciones flotantes (Toasts), animación Canvas interactiva para login, diseño responsive para móvil/tablet/desktop e i18n (español/inglés).

---

## 🛠️ Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm

### Pasos

1. Clona o ubícate en el directorio del proyecto:
   ```bash
   cd job-conect
   ```

2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```

4. Abre tu navegador e ingresa a:
   ```
   http://localhost:3001
   ```

### Credenciales de Prueba
Para iniciar sesión en el portal utiliza las credenciales por defecto de DummyJSON:
- **Usuario**: `emilys`
- **Contraseña**: `emilyspass`

---

## 📁 Estructura del Proyecto

```
job-conect/
├── package.json               # Configuración de dependencias y scripts de Node
├── server.js                  # Servidor Express para servir archivos estáticos
├── README.md                  # Documentación del proyecto
└── public/
    ├── pages/
    │   └── index.html         # Documento HTML principal (Landing, Login, Dashboard y Modales)
    ├── style/
    │   └── style.css          # Estilos globales, temas, componentes y responsive layout
    └── js/
        ├── index.js           # Orquestador principal, autenticación, rutas y Dashboard
        ├── services/
        │   ├── apiService.js  # Cliente HTTP asíncrono (GET, POST, PUT, PATCH, DELETE)
        │   └── toastService.js# Notificaciones visuales flotantes (Toast)
        └── components/
            ├── candidatesModule.js   # Módulo Candidatos (/users)
            ├── vacanciesModule.js    # Módulo Vacantes (/products)
            ├── companiesModule.js    # Módulo Empresas Clientes (/carts)
            ├── applicationsModule.js # Módulo Postulaciones (/posts)
            ├── interviewsModule.js   # Módulo Entrevistas y Notas (/comments - PATCH)
            ├── tasksModule.js        # Módulo Tareas (/todos)
            ├── themeLanguage.js      # Control de Modo Oscuro/Claro e Idioma (ES/EN)
            └── loginAnimation.js     # Animación Canvas de fondo para pantalla de Login
```

---

## 🌐 Módulos Principales y API Utilizada

La aplicación consume los recursos de **DummyJSON API** (`https://dummyjson.com`):

1. **Panel de Control (Dashboard)**: Sincronización en tiempo real de estadísticas de todos los módulos y bitácora de accesos guardada localmente (`localStorage`).
2. **Candidatos** (`/users`): Gestión completa CRUD de perfiles de talento.
3. **Vacantes** (`/products`): Creación, edición, listado y eliminación de ofertas laborales.
4. **Empresas Clientes** (`/carts`): Administración de carteras de clientes y contrataciones.
5. **Postulaciones** (`/posts`): Seguimiento de solicitudes activas y estados del proceso.
6. **Entrevistas y Notas** (`/comments`): Registro e historial de entrevistas ajustado a actualización parcial mediante métodos **`PATCH /comments/:id`**.
7. **Tareas** (`/todos`): Organización operativa de pendientes y estado de ejecución.

---

## ✨ Características Destacadas

- **Notificaciones Toast**: Mensajes de confirmación y error elegantes sin popups bloqueantes.
- **Validaciones en Formularios**: Control estricto de campos vacíos, números positivos, emails válidos y bloqueo de botones durante peticiones asíncronas.
- **Manejo de Estados**: Retroalimentación visual clara para estados de Carga (`Loader`), Registros Vacíos (`Empty State`) y Errores de Conexión (`Error State`).
- **Adaptabilidad Responsive**: Interfaz adaptada a dispositivos móviles con menú lateral desplegable y tablas deslizables sin desbordamiento horizontal.
