const express = require('express');
const cors = require('cors');
const app = express();

const { courses } = require('./courses');

app.use(cors());
app.use(express.json());

// 1. Rota para listar todos os cursos
app.get('/api/courses', (req, res) => {
    const dataToSend = courses || [];

    return res.status(200).json({
        success: true,
        count: dataToSend.length,
        data: dataToSend
    });
});

// 2. Rota para buscar curso por ID (colocada ANTES do app.listen)
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

// 3. Inicialização do servidor (deve ficar SEMPRE no final do arquivo)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
