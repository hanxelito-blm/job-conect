// server.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

const pagesDir = path.join(__dirname, 'public', 'pages');

// Ruta raíz → Landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(pagesDir, 'landing.html'));
});

// Rutas de páginas
app.get('/landing',    (req, res) => res.sendFile(path.join(pagesDir, 'landing.html')));
app.get('/login',      (req, res) => res.sendFile(path.join(pagesDir, 'login.html')));
app.get('/dashboard',  (req, res) => res.sendFile(path.join(pagesDir, 'dashboard.html')));
app.get('/candidates', (req, res) => res.sendFile(path.join(pagesDir, 'candidates.html')));
app.get('/vacancies',  (req, res) => res.sendFile(path.join(pagesDir, 'vacancies.html')));
app.get('/companies',  (req, res) => res.sendFile(path.join(pagesDir, 'companies.html')));
app.get('/applications',(req, res) => res.sendFile(path.join(pagesDir, 'applications.html')));
app.get('/interviews', (req, res) => res.sendFile(path.join(pagesDir, 'interviews.html')));
app.get('/tasks',      (req, res) => res.sendFile(path.join(pagesDir, 'tasks.html')));
app.get('/tracking',   (req, res) => res.sendFile(path.join(pagesDir, 'tracking.html')));
app.get('/profile',    (req, res) => res.sendFile(path.join(pagesDir, 'profile.html')));
app.get('/my-applications', (req, res) => res.sendFile(path.join(pagesDir, 'my-applications.html')));

// Fallback: landing page for unmatched routes
app.use((req, res) => {
    res.sendFile(path.join(pagesDir, 'landing.html'));
});

app.listen(PORT, () => {
    console.log(`✅ JobConnect corriendo en http://localhost:${PORT}`);
});
