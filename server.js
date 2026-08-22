const express = require('express');
const cors = require('cors');
const app = express();

// IMPORTANTE: Certifique-se de desestruturar { courses } corretamente!
const { courses } = require('./courses'); // Ou o caminho correto do seu arquivo de dados

app.use(cors());
app.use(express.json());

// Rota corrigida
app.get('/api/courses', (req, res) => {
    // Se 'courses' for undefined por erro de importação, enviamos array vazio para não quebrar
    const dataToSend = courses || [];

    return res.status(200).json({
        success: true,
        count: dataToSend.length,
        data: dataToSend
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
// Buscar curso por ID
app.get('/api/courses/:id', (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: 'ID do curso inválido'
        });
    }

    const course = courses.find(course => course.id === id);

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
