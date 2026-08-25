const express = require('express');
const path = require('path');

const app = express();

// Middleware para parsear JSON en las peticiones
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Almacenamiento en memoria para empresas ───────────────────────────────
let companies = [];
let nextId = 1;

// GET /carts — listar todas las empresas
app.get('/carts', (req, res) => {
    res.json(companies);
});

// POST /carts — crear empresa
app.post('/carts', (req, res) => {
    const body = req.body || {};

    if (!body.companyName || String(body.companyName).trim() === '') {
        return res.status(400).json({ error: 'companyName is required' });
    }

    const company = {
        id: nextId++,
        companyName: String(body.companyName).trim(),
        contactName: String(body.contactName || '').trim(),
        email: String(body.email || '').trim(),
        phone: String(body.phone || '').trim(),
        address: String(body.address || '').trim(),
        status: ['active', 'inactive', 'pending'].includes(body.status)
            ? body.status
            : 'active',
        additionalInformation: String(body.additionalInformation || '').trim(),
        createdAt: new Date().toISOString()
    };

    companies.push(company);
    res.status(201).json(company);
});

// PUT /carts/:id — actualizar empresa
app.put('/carts/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = companies.findIndex(c => c.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Company not found' });
    }

    const body = req.body || {};

    companies[index] = {
        ...companies[index],
        companyName: String(body.companyName || companies[index].companyName).trim(),
        contactName: String(body.contactName || companies[index].contactName).trim(),
        email: String(body.email || companies[index].email).trim(),
        phone: String(body.phone || companies[index].phone).trim(),
        address: String(body.address || companies[index].address).trim(),
        status: ['active', 'inactive', 'pending'].includes(body.status)
            ? body.status
            : companies[index].status,
        additionalInformation: String(
            body.additionalInformation !== undefined
                ? body.additionalInformation
                : companies[index].additionalInformation
        ).trim(),
        updatedAt: new Date().toISOString()
    };

    res.json(companies[index]);
});

// DELETE /carts/:id — eliminar empresa
app.delete('/carts/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = companies.findIndex(c => c.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Company not found' });
    }

    companies.splice(index, 1);
    res.status(204).send();
});

// ─── Rutas de páginas HTML ────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages/login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages/index.html'));
});

app.get('/empresas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages/empresas.html'));
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});