const express = require('express');
const cors = require('cors');

const { courses } = require('./courses');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;


// ================================
// HOME
// ================================

app.get('/', (req, res) => {
    res.json({
        success: true,
        name: 'EduRadar API',
        message: 'API funcionando corretamente'
    });
});


// ================================
// LISTAR CURSOS
// ================================

app.get('/api/courses', (req, res) => {
    res.json({
        success: true,
        total: courses.length,
        data: courses
    });
});


// ================================
// BUSCAR CURSO POR ID
// ================================

app.get('/api/courses/:id', (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: 'ID do curso inválido'
        });
    }

    const course = courses.find(
        course => Number(course.id) === id
    );

    if (!course) {
        return res.status(404).json({
            success: false,
            error: 'Curso não encontrado'
        });
    }

    res.json({
        success: true,
        data: course
    });
});


// ================================
// CADASTRAR CURSO
// ================================

app.post('/api/courses', (req, res) => {
    const {
        title,
        area,
        category,
        institution,
        hours,
        mode,
        certificate,
        deadline,
        status,
        code,
        description,
        linkInscricao
    } = req.body;

    if (!title || !area || !institution) {
        return res.status(400).json({
            success: false,
            error: 'Título, área e instituição são obrigatórios'
        });
    }

    const newId = courses.length > 0
        ? Math.max(...courses.map(course => Number(course.id))) + 1
        : 1;

    const newCourse = {
        id: newId,
        title,
        area,
        category: category || 'ead',
        institution,
        hours: hours || '',
        mode: mode || 'Online',
        certificate: certificate || 'Certificado',
        deadline: deadline || 'Sem prazo',
        status: status || 'Novo',
        code: code || '',
        description: description || '',
        views: 0,
        linkInscricao: linkInscricao || ''
    };

    courses.push(newCourse);

    res.status(201).json({
        success: true,
        message: 'Curso cadastrado com sucesso',
        data: newCourse
    });
});


// ================================
// EDITAR CURSO
// ================================

app.put('/api/courses/:id', (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: 'ID do curso inválido'
        });
    }

    const index = courses.findIndex(
        course => Number(course.id) === id
    );

    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: 'Curso não encontrado'
        });
    }

    const oldCourse = courses[index];

    const updatedCourse = {
        ...oldCourse,
        ...req.body,
        id: oldCourse.id,
        views: oldCourse.views || 0
    };

    courses[index] = updatedCourse;

    res.json({
        success: true,
        message: 'Curso atualizado com sucesso',
        data: updatedCourse
    });
});


// ================================
// EXCLUIR CURSO
// ================================

app.delete('/api/courses/:id', (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: 'ID do curso inválido'
        });
    }

    const index = courses.findIndex(
        course => Number(course.id) === id
    );

    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: 'Curso não encontrado'
        });
    }

    const deletedCourse = courses.splice(index, 1)[0];

    res.json({
        success: true,
        message: 'Curso excluído com sucesso',
        data: deletedCourse
    });
});


// ================================
// INICIAR SERVIDOR
// ================================

app.listen(PORT, () => {
    console.log(`EduRadar API rodando na porta ${PORT}`);
});
