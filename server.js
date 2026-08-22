const express = require('express');
const cors = require('cors');
const app = express();

const { courses, categories, institutions, articles, ads } = require('./courses');

app.use(cors());
app.use(express.json());

// Listar todos os cursos
app.get('/api/courses', (req, res) => res.json({ success: true, data: courses || [] }));

// Buscar curso por ID
app.get('/api/courses/:id', (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: 'ID do curso inválido'
        });
    }

    const courseList = courses || [];
    const course = courseList.find(c => c.id === id);

    if (!course) {
        return res.status(404).json({
            success: false,
            error: 'Curso não encontrado'
        });
    }

    return res.status(200).json({
        success: true,
        data: course
    });
});

// Outros endpoints
app.get('/api/categories', (req, res) => res.json({ success: true, data: categories || [] }));
app.get('/api/institutions', (req, res) => res.json({ success: true, data: institutions || [] }));
app.get('/api/articles', (req, res) => res.json({ success: true, data: articles || [] }));
app.get('/api/ads', (req, res) => res.json({ success: true, data: ads || [] }));

// Inicialização do servidor (apenas uma vez, ao final)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
