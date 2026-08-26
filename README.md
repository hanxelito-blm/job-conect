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
├── server.js                  # Servidor Express con rutas MPA y archivos estáticos
├── README.md                  # Documentación del proyecto
└── public/
    ├── pages/
    │   ├── landing.html       # Página de inicio / aterrizaje
    │   ├── login.html         # Inicio de sesión con roles
    │   ├── dashboard.html     # Panel de control principal
    │   ├── companies.html     # Módulo Empresas Clientes
    │   ├── vacancies.html     # Módulo Vacantes
    │   ├── candidates.html    # Módulo Candidatos
    │   ├── applications.html  # Módulo Postulaciones
    │   ├── interviews.html    # Módulo Entrevistas y Notas
    │   ├── tasks.html         # Módulo Tareas
    │   ├── tracking.html      # Módulo Seguimiento / Pipeline
    │   ├── profile.html       # Mi Perfil
    │   └── my-applications.html # Mis Postulaciones
    ├── style/
    │   ├── style.css              # Estilos globales, temas, componentes y responsive
    │   ├── empresas.css           # Estilos específicos del módulo empresas
    │   ├── login.css              # Estilos del login
    │   └── driver-overrides.css   # Overrides del tour guiado (Driver.js)
    ├── js/
    │   ├── app-page.js            # Entry point MPA: auth, sidebar, módulos dinámicos
    │   ├── index.js               # Orquestador SPA legacy
    │   ├── landing.js             # Lógica de la landing page
    │   ├── login-page.js          # Lógica del login
    │   ├── mockData.js            # Datos semilla (empresas, vacantes, candidatos, etc.)
    │   ├── services/
    │   │   ├── apiService.js      # Cliente HTTP asíncrono (GET, POST, PUT, PATCH, DELETE)
    │   │   ├── authService.js     # Autenticación, roles y control de acceso
    │   │   └── toastService.js    # Notificaciones visuales flotantes (Toast)
    │   └── components/
    │       ├── dashboardModule.js      # Panel de control y KPIs
    │       ├── companiesModule.js      # Módulo Empresas Clientes (/carts)
    │       ├── vacanciesModule.js      # Módulo Vacantes (/products)
    │       ├── candidatesModule.js     # Módulo Candidatos (/users)
    │       ├── applicationsModule.js   # Módulo Postulaciones (/posts)
    │       ├── interviewsModule.js     # Módulo Entrevistas y Notas (/comments)
    │       ├── tasksModule.js          # Módulo Tareas (/todos)
    │       ├── trackingModule.js       # Seguimiento de pipeline
    │       ├── profileModule.js        # Perfil de usuario
    │       ├── myApplicationsModule.js # Mis postulaciones (candidato)
    │       ├── userManagementModule.js # Gestión de usuarios
    │       ├── themeLanguage.js        # Modo Oscuro/Claro e Idioma (ES/EN)
    │       ├── accessibilityModule.js  # Modo daltónico / accesibilidad visual
    │       ├── tourModule.js           # Tour guiado con Driver.js
    │       └── loginAnimation.js       # Animación Canvas de fondo para Login
    └── vendor/
        ├── sweetalert2/        # Librería de alertas (SweetAlert2)
        └── driver.js/          # Librería de tour guiado (Driver.js)
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
