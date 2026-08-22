const express = require('express');
const cors = require('cors');

const { courses } = require('./courses');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Página inicial
app.get('/', (req, res) => {
    res.status(200).json({
        name: 'EduRadar API',
        message: 'API EduRadar funcionando!',
        version: '1.0.0',
        status: 'online',
        endpoints: {
            courses: '/api/courses',
            courseById: '/api/courses/:id'
        }
    });
});

// Status da API
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'EduRadar API'
    });
});

// Listar todos os cursos
app.get('/api/courses', (req, res) => {
    res.status(200).json(courses);
});

// Buscar curso por ID
app.get('/api/courses/:id', (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            error: 'ID do curso inválido'
        });
    }

    const course = courses.find(course => course.id === id);

    if (!course) {
        return res.status(404).json({
            error: 'Curso não encontrado'
        });
    }

    res.status(200).json(course);
});

// Rota não encontrada
app.use((req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        path: req.originalUrl
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduRadar API rodando na porta ${PORT}`);
});
