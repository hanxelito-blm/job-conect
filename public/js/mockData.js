export const companies = [
    {
        id: "emp-001",
        nombre: "Nexa Labs",
        sector: "Tecnologia",
        logoUrl: "https://dummyimage.com/160x160/123d35/3ee6ab&text=NL",
        ubicacion: "Ciudad de Mexico, Mexico",
        contactoEmail: "talento@nexalabs.mx",
        vacantesActivasCount: 2,
        sitioweb: "https://nexalabs.example.com"
    },
    {
        id: "emp-002",
        nombre: "Prisma Studio",
        sector: "E-commerce",
        logoUrl: "https://dummyimage.com/160x160/273b52/78d7ff&text=PS",
        ubicacion: "Bogota, Colombia",
        contactoEmail: "people@prismastudio.co",
        vacantesActivasCount: 2,
        sitioweb: "https://prismastudio.example.com"
    },
    {
        id: "emp-003",
        nombre: "Orbit Analytics",
        sector: "Finanzas",
        logoUrl: "https://dummyimage.com/160x160/473b27/f4c76d&text=OA",
        ubicacion: "Buenos Aires, Argentina",
        contactoEmail: "reclutamiento@orbitanalytics.ar",
        vacantesActivasCount: 1,
        sitioweb: "https://orbitanalytics.example.com"
    }
];

export const vacancies = [
    {
        id: "vac-001",
        titulo: "Frontend Developer Senior",
        empresaId: "emp-001",
        departamento: "Producto e Ingenieria",
        ubicacion: "Hibrido",
        tipoJornada: "Full-time",
        rangoSalarial: "USD 3,200 - 4,200 mensuales",
        estado: "Activa",
        postulantesCount: 3,
        fechaPublicacion: "2026-08-04"
    },
    {
        id: "vac-002",
        titulo: "Backend Engineer Node.js",
        empresaId: "emp-001",
        departamento: "Ingenieria",
        ubicacion: "Remoto",
        tipoJornada: "Full-time",
        rangoSalarial: "USD 3,600 - 4,800 mensuales",
        estado: "Activa",
        postulantesCount: 2,
        fechaPublicacion: "2026-08-08"
    },
    {
        id: "vac-003",
        titulo: "UX Designer",
        empresaId: "emp-002",
        departamento: "Diseno de Producto",
        ubicacion: "Hibrido",
        tipoJornada: "Full-time",
        rangoSalarial: "USD 2,400 - 3,300 mensuales",
        estado: "Activa",
        postulantesCount: 2,
        fechaPublicacion: "2026-08-01"
    },
    {
        id: "vac-004",
        titulo: "QA Lead",
        empresaId: "emp-002",
        departamento: "Calidad",
        ubicacion: "Presencial",
        tipoJornada: "Full-time",
        rangoSalarial: "USD 2,800 - 3,700 mensuales",
        estado: "Pausada",
        postulantesCount: 1,
        fechaPublicacion: "2026-07-22"
    },
    {
        id: "vac-005",
        titulo: "Data Analyst de Riesgo",
        empresaId: "emp-003",
        departamento: "Analitica y Riesgo",
        ubicacion: "Remoto",
        tipoJornada: "Part-time",
        rangoSalarial: "USD 1,800 - 2,500 mensuales",
        estado: "Activa",
        postulantesCount: 2,
        fechaPublicacion: "2026-08-10"
    }
];

export const candidates = [
    {
        id: "can-001",
        nombreCompleto: "Valentina Rojas Mendoza",
        email: "valentina.rojas@example.com",
        telefono: "+52 55 2148 9031",
        tituloProfesional: "Frontend Developer Senior",
        vacanteId: "vac-001",
        empresaId: "emp-001",
        fechaPostulacion: "2026-08-18",
        estado: "En revisión",
        habilidades: ["React", "TypeScript", "Design Systems", "Testing"],
        resumenPerfil: "Desarrolladora frontend con seis anos de experiencia creando productos SaaS accesibles y escalables.",
        enlaces: {
            github: "https://github.com/valentinarojas",
            linkedin: "https://www.linkedin.com/in/valentinarojas",
            portfolio: "https://valentinarojas.dev"
        },
        urlCV: "https://example.com/cv/valentina-rojas.pdf"
    },
    {
        id: "can-002",
        nombreCompleto: "Mateo Fernandez Silva",
        email: "mateo.fernandez@example.com",
        telefono: "+57 301 448 7620",
        tituloProfesional: "Backend Engineer Node.js",
        vacanteId: "vac-002",
        empresaId: "emp-001",
        fechaPostulacion: "2026-08-17",
        estado: "En revisión",
        habilidades: ["Node.js", "PostgreSQL", "AWS", "Docker"],
        resumenPerfil: "Ingeniero backend enfocado en APIs robustas, observabilidad y arquitecturas orientadas a eventos.",
        enlaces: {
            github: "https://github.com/mateofsilva",
            linkedin: "https://www.linkedin.com/in/mateofernandez",
            portfolio: "https://mateofernandez.dev"
        },
        urlCV: "https://example.com/cv/mateo-fernandez.pdf"
    },
    {
        id: "can-003",
        nombreCompleto: "Sofia Navarro Castillo",
        email: "sofia.navarro@example.com",
        telefono: "+57 315 773 1942",
        tituloProfesional: "UX Designer",
        vacanteId: "vac-003",
        empresaId: "emp-002",
        fechaPostulacion: "2026-08-15",
        estado: "Entrevista",
        habilidades: ["Figma", "Investigacion UX", "Prototipado", "Design Thinking"],
        resumenPerfil: "Disenadora de producto que transforma hallazgos de usuarios en experiencias simples y medibles.",
        enlaces: {
            github: "https://github.com/sofianavarro",
            linkedin: "https://www.linkedin.com/in/sofianavarro",
            portfolio: "https://sofianavarro.design"
        },
        urlCV: "https://example.com/cv/sofia-navarro.pdf"
    },
    {
        id: "can-004",
        nombreCompleto: "Diego Morales Paredes",
        email: "diego.morales@example.com",
        telefono: "+54 11 5274 6308",
        tituloProfesional: "Data Analyst de Riesgo",
        vacanteId: "vac-005",
        empresaId: "emp-003",
        fechaPostulacion: "2026-08-14",
        estado: "Entrevista",
        habilidades: ["SQL", "Python", "Tableau", "Modelos de riesgo"],
        resumenPerfil: "Analista de datos con experiencia en indicadores financieros, automatizacion de reportes y riesgo crediticio.",
        enlaces: {
            github: "https://github.com/diegomorales",
            linkedin: "https://www.linkedin.com/in/diegomorales",
            portfolio: "https://diegomorales.data"
        },
        urlCV: "https://example.com/cv/diego-morales.pdf"
    },
    {
        id: "can-005",
        nombreCompleto: "Camila Torres Vega",
        email: "camila.torres@example.com",
        telefono: "+52 81 3001 4725",
        tituloProfesional: "Frontend Developer",
        vacanteId: "vac-001",
        empresaId: "emp-001",
        fechaPostulacion: "2026-08-12",
        estado: "Contratado",
        habilidades: ["Vue", "JavaScript", "CSS", "Accesibilidad web"],
        resumenPerfil: "Desarrolladora frontend con especialidad en interfaces inclusivas y rendimiento web.",
        enlaces: {
            github: "https://github.com/camilatorres",
            linkedin: "https://www.linkedin.com/in/camilatorres",
            portfolio: "https://camilatorres.dev"
        },
        urlCV: "https://example.com/cv/camila-torres.pdf"
    },
    {
        id: "can-006",
        nombreCompleto: "Andres Ibanez Leal",
        email: "andres.ibanez@example.com",
        telefono: "+57 320 661 2084",
        tituloProfesional: "QA Lead",
        vacanteId: "vac-004",
        empresaId: "emp-002",
        fechaPostulacion: "2026-08-09",
        estado: "Contratado",
        habilidades: ["Playwright", "Cypress", "CI/CD", "Estrategia QA"],
        resumenPerfil: "Lider de calidad con trayectoria construyendo estrategias de pruebas automatizadas para equipos agiles.",
        enlaces: {
            github: "https://github.com/andresibanez",
            linkedin: "https://www.linkedin.com/in/andresibanez",
            portfolio: "https://andresibanez.qa"
        },
        urlCV: "https://example.com/cv/andres-ibanez.pdf"
    },
    {
        id: "can-007",
        nombreCompleto: "Lucia Herrera Campos",
        email: "lucia.herrera@example.com",
        telefono: "+54 9 11 4840 2916",
        tituloProfesional: "Product Designer",
        vacanteId: "vac-003",
        empresaId: "emp-002",
        fechaPostulacion: "2026-08-20",
        estado: "Postulado",
        habilidades: ["Figma", "Sistemas de diseno", "Research", "UX Writing"],
        resumenPerfil: "Disenadora de producto con enfoque en sistemas consistentes, lenguaje claro y validacion con usuarios.",
        enlaces: {
            github: "https://github.com/luciaherrera",
            linkedin: "https://www.linkedin.com/in/luciaherrera",
            portfolio: "https://luciaherrera.design"
        },
        urlCV: "https://example.com/cv/lucia-herrera.pdf"
    },
    {
        id: "can-008",
        nombreCompleto: "Jorge Salgado Ruiz",
        email: "jorge.salgado@example.com",
        telefono: "+52 33 1920 7441",
        tituloProfesional: "Backend Developer",
        vacanteId: "vac-002",
        empresaId: "emp-001",
        fechaPostulacion: "2026-08-19",
        estado: "En seguimiento",
        habilidades: ["Python", "FastAPI", "Redis", "Kubernetes"],
        resumenPerfil: "Desarrollador backend orientado a servicios de alto trafico, automatizacion y documentacion tecnica.",
        enlaces: {
            github: "https://github.com/jorgesalgado",
            linkedin: "https://www.linkedin.com/in/jorgesalgado",
            portfolio: "https://jorgesalgado.dev"
        },
        urlCV: "https://example.com/cv/jorge-salgado.pdf"
    }
];

export const interviews = [
    {
        id: "int-001",
        candidatoId: "can-003",
        vacanteId: "vac-003",
        entrevistador: "Mariana Solis, Head of Product",
        fecha: "2026-08-27",
        hora: "10:30",
        modalidad: "Google Meet",
        estado: "Programada",
        linkReunion: "https://meet.google.com/jobconnect-int-001",
        notas: "Revisar el caso de estudio de onboarding y su experiencia colaborando con producto."
    },
    {
        id: "int-002",
        candidatoId: "can-004",
        vacanteId: "vac-005",
        entrevistador: "Rafael Mendez, Director de Riesgo",
        fecha: "2026-08-28",
        hora: "16:00",
        modalidad: "Zoom",
        estado: "Programada",
        linkReunion: "https://zoom.us/j/jobconnect-int-002",
        notas: "Profundizar en modelos de scoring, calidad de datos y comunicacion de hallazgos."
    }
];

export const applications = candidates.map((candidate, index) => ({
    id: `post-${String(index + 1).padStart(3, '0')}`,
    candidatoId: candidate.id,
    vacanteId: candidate.vacanteId,
    empresaId: candidate.empresaId,
    fecha: candidate.fechaPostulacion,
    estado: candidate.estado,
    cartaPresentacion: `Postulacion de ${candidate.nombreCompleto} para ${candidate.tituloProfesional}.`
}));

export const tasks = [
    { id: "task-001", titulo: "Revisar portafolio de Valentina Rojas", responsable: "Equipo de talento", fechaLimite: "2026-08-26", prioridad: "Alta", completada: false },
    { id: "task-002", titulo: "Preparar entrevista tecnica de Mateo Fernandez", responsable: "Carlos Mendoza", fechaLimite: "2026-08-27", prioridad: "Alta", completada: false },
    { id: "task-003", titulo: "Enviar caso de estudio a Sofia Navarro", responsable: "Mariana Solis", fechaLimite: "2026-08-26", prioridad: "Media", completada: true },
    { id: "task-004", titulo: "Confirmar sala para onboarding de Camila Torres", responsable: "People Operations", fechaLimite: "2026-08-29", prioridad: "Media", completada: false },
    { id: "task-005", titulo: "Actualizar scorecard de QA Lead", responsable: "Andres Ibanez", fechaLimite: "2026-08-30", prioridad: "Baja", completada: true },
    { id: "task-006", titulo: "Consolidar feedback de candidatos", responsable: "Equipo de talento", fechaLimite: "2026-08-31", prioridad: "Media", completada: false }
];

export const users = [
    {
        id: "usr-001",
        nombre: "Emily Johnson",
        username: "emilys",
        email: "emily.johnson@jobconnect.com",
        telefono: "+1 (555) 234-5678",
        rol: "administrador",
        departamento: "Recursos Humanos",
        estado: "activo",
        fechaCreacion: "2026-01-15",
        ultimoAcceso: "2026-08-26 09:12",
        ip: "192.168.1.45",
        avatarUrl: ""
    },
    {
        id: "usr-002",
        nombre: "Carlos Mendoza",
        username: "carlosm",
        email: "carlos.mendoza@jobconnect.com",
        telefono: "+52 55 4120 8830",
        rol: "reclutador",
        departamento: "Talento IT",
        estado: "activo",
        fechaCreacion: "2026-02-20",
        ultimoAcceso: "2026-08-25 17:45",
        ip: "192.168.2.110",
        avatarUrl: ""
    },
    {
        id: "usr-003",
        nombre: "Valentina Rojas Mendoza",
        username: "valentinar",
        email: "valentina.rojas@example.com",
        telefono: "+52 55 2148 9031",
        rol: "candidato",
        departamento: "",
        estado: "activo",
        fechaCreacion: "2026-06-10",
        ultimoAcceso: "2026-08-24 14:20",
        ip: "10.0.0.88",
        avatarUrl: ""
    },
    {
        id: "usr-004",
        nombre: "Mariana Solis",
        username: "marianas",
        email: "mariana.solis@prismastudio.co",
        telefono: "+57 301 998 2213",
        rol: "empresa",
        departamento: "Prisma Studio",
        estado: "activo",
        fechaCreacion: "2026-03-05",
        ultimoAcceso: "2026-08-23 11:30",
        ip: "192.168.5.22",
        avatarUrl: ""
    },
    {
        id: "usr-005",
        nombre: "Rafael Mendez",
        username: "rafaelm",
        email: "rafael.mendez@orbitanalytics.ar",
        telefono: "+54 11 6080 4412",
        rol: "reclutador",
        departamento: "Orbit Analytics",
        estado: "inactivo",
        fechaCreacion: "2026-04-18",
        ultimoAcceso: "2026-07-15 08:50",
        ip: "172.16.0.14",
        avatarUrl: ""
    },
    {
        id: "usr-006",
        nombre: "Diego Morales Paredes",
        username: "diegom",
        email: "diego.morales@example.com",
        telefono: "+54 11 5274 6308",
        rol: "candidato",
        departamento: "",
        estado: "activo",
        fechaCreacion: "2026-05-22",
        ultimoAcceso: "2026-08-26 08:05",
        ip: "10.0.1.77",
        avatarUrl: ""
    }
];

export const userActivityLogs = [
    // Emily Johnson (admin)
    { userId: "usr-001", tipo: "login", descripcion: "Inicio de sesión exitoso", fecha: "2026-08-26", hora: "09:12", ip: "192.168.1.45", modulo: "" },
    { userId: "usr-001", tipo: "modulo", descripcion: "Visitó módulo Dashboard", fecha: "2026-08-26", hora: "09:13", ip: "192.168.1.45", modulo: "dashboardSection" },
    { userId: "usr-001", tipo: "modulo", descripcion: "Visitó módulo Candidatos", fecha: "2026-08-26", hora: "09:18", ip: "192.168.1.45", modulo: "candidatesSection" },
    { userId: "usr-001", tipo: "accion", descripcion: "Editó estado de candidato Valentina Rojas a 'En revisión'", fecha: "2026-08-26", hora: "09:22", ip: "192.168.1.45", modulo: "candidatesSection" },
    { userId: "usr-001", tipo: "login", descripcion: "Inicio de sesión exitoso", fecha: "2026-08-25", hora: "14:30", ip: "192.168.1.45", modulo: "" },
    { userId: "usr-001", tipo: "modulo", descripcion: "Visitó módulo Vacantes", fecha: "2026-08-25", hora: "14:35", ip: "192.168.1.45", modulo: "vacanciesSection" },
    { userId: "usr-001", tipo: "accion", descripcion: "Publicó nueva vacante 'Backend Engineer Node.js'", fecha: "2026-08-25", hora: "15:01", ip: "192.168.1.45", modulo: "vacanciesSection" },
    { userId: "usr-001", tipo: "perfil", descripcion: "Actualizó su número de teléfono", fecha: "2026-08-24", hora: "10:45", ip: "192.168.1.45", modulo: "profileSection" },
    // Carlos Mendoza (reclutador)
    { userId: "usr-002", tipo: "login", descripcion: "Inicio de sesión exitoso", fecha: "2026-08-25", hora: "17:45", ip: "192.168.2.110", modulo: "" },
    { userId: "usr-002", tipo: "modulo", descripcion: "Visitó módulo Entrevistas", fecha: "2026-08-25", hora: "17:48", ip: "192.168.2.110", modulo: "interviewsSection" },
    { userId: "usr-002", tipo: "accion", descripcion: "Agendó entrevista con Sofia Navarro", fecha: "2026-08-25", hora: "17:55", ip: "192.168.2.110", modulo: "interviewsSection" },
    { userId: "usr-002", tipo: "modulo", descripcion: "Visitó módulo Seguimiento", fecha: "2026-08-25", hora: "18:10", ip: "192.168.2.110", modulo: "trackingSection" },
    { userId: "usr-002", tipo: "login", descripcion: "Inicio de sesión exitoso", fecha: "2026-08-24", hora: "09:00", ip: "192.168.2.110", modulo: "" },
    { userId: "usr-002", tipo: "accion", descripcion: "Revisó CV de Mateo Fernandez", fecha: "2026-08-24", hora: "09:20", ip: "192.168.2.110", modulo: "candidatesSection" },
    // Valentina Rojas (candidato)
    { userId: "usr-003", tipo: "login", descripcion: "Inicio de sesión exitoso", fecha: "2026-08-24", hora: "14:20", ip: "10.0.0.88", modulo: "" },
    { userId: "usr-003", tipo: "modulo", descripcion: "Visitó Mi Perfil", fecha: "2026-08-24", hora: "14:22", ip: "10.0.0.88", modulo: "profileSection" },
    { userId: "usr-003", tipo: "perfil", descripcion: "Actualizó habilidades del perfil", fecha: "2026-08-24", hora: "14:30", ip: "10.0.0.88", modulo: "profileSection" },
    { userId: "usr-003", tipo: "modulo", descripcion: "Visitó Mis Postulaciones", fecha: "2026-08-24", hora: "14:35", ip: "10.0.0.88", modulo: "myApplicationsSection" },
    // Mariana Solis (empresa)
    { userId: "usr-004", tipo: "login", descripcion: "Inicio de sesión exitoso", fecha: "2026-08-23", hora: "11:30", ip: "192.168.5.22", modulo: "" },
    { userId: "usr-004", tipo: "modulo", descripcion: "Visitó módulo Empresas", fecha: "2026-08-23", hora: "11:32", ip: "192.168.5.22", modulo: "companiesSection" },
    { userId: "usr-004", tipo: "accion", descripcion: "Actualizó información de Prisma Studio", fecha: "2026-08-23", hora: "11:40", ip: "192.168.5.22", modulo: "companiesSection" },
    // Rafael Mendez (inactivo)
    { userId: "usr-005", tipo: "login", descripcion: "Inicio de sesión exitoso", fecha: "2026-07-15", hora: "08:50", ip: "172.16.0.14", modulo: "" },
    { userId: "usr-005", tipo: "modulo", descripcion: "Visitó módulo Dashboard", fecha: "2026-07-15", hora: "08:52", ip: "172.16.0.14", modulo: "dashboardSection" },
    // Diego Morales (candidato)
    { userId: "usr-006", tipo: "login", descripcion: "Inicio de sesión exitoso", fecha: "2026-08-26", hora: "08:05", ip: "10.0.1.77", modulo: "" },
    { userId: "usr-006", tipo: "modulo", descripcion: "Visitó Mis Postulaciones", fecha: "2026-08-26", hora: "08:08", ip: "10.0.1.77", modulo: "myApplicationsSection" },
    { userId: "usr-006", tipo: "perfil", descripcion: "Actualizó su resumen profesional", fecha: "2026-08-25", hora: "16:30", ip: "10.0.1.77", modulo: "profileSection" },
    { userId: "usr-006", tipo: "login", descripcion: "Inicio de sesión exitoso", fecha: "2026-08-25", hora: "16:25", ip: "10.0.1.77", modulo: "" }
];

export const mockData = { companies, vacancies, candidates, applications, interviews, tasks, users, userActivityLogs };

export default mockData;
