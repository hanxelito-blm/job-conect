// server.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta raíz → SPA principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

// SPA fallback: todas las rutas no-estáticas redirigen al index
/* app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
}); */

app.listen(PORT, () => {
    console.log(`✅ JobConnect corriendo en http://localhost:${PORT}`);
});
