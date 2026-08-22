const express = require('express');
const cors = require('cors');

const { courses } = require('./courses');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Página inicial
app.get('/', (req, res) => {
    res.json({
        message: 'API EduRadar funcionando!',
        version: '1.0.0'
    });
});

// Listar todos os cursos
app.get('/api/courses', (req, res) => {
    res.json(courses);
});

// Buscar curso por ID
app.get('/api/courses/:id', (req, res) => {
    const id = Number(req.params.id);

    const course = courses.find(course => course.id === id);

    if (!course) {
        return res.status(404).json({
            error: 'Curso não encontrado'
        });
    }

    res.json(course);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduRadar API rodando na porta ${PORT}`);
});
