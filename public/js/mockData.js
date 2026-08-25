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

export const mockData = { companies, vacancies, candidates, applications, interviews, tasks };

export default mockData;
