const express = require('express');
const cors = require('cors');

const { courses } = require('./courses');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;


// TESTE DA API
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'EduRadar API funcionando',
        courses: courses.length
    });
});


// LISTAR
app.get('/api/courses', (req, res) => {
    res.json({
        success: true,
        total: courses.length,
        data: courses
    });
});


// CADASTRAR
app.post('/api/courses', (req, res) => {

    console.log('POST /api/courses');
    console.log('Dados recebidos:', req.body);

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

    const newId = courses.length
        ? Math.max(...courses.map(c => Number(c.id))) + 1
        : 1;

    const newCourse = {
        id: newId,
        title: title,
        area: area,
        category: category || 'ead',
        institution: institution,
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

    console.log('Curso criado:', newCourse);

    return res.status(201).json({
        success: true,
        message: 'Curso cadastrado com sucesso',
        data: newCourse
    });
});


// EDITAR
app.put('/api/courses/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = courses.findIndex(
        course => Number(course.id) === id
    );

    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: 'Curso não encontrado'
        });
    }

    courses[index] = {
        ...courses[index],
        ...req.body,
        id: courses[index].id,
        views: courses[index].views || 0
    };

    return res.json({
        success: true,
        message: 'Curso atualizado com sucesso',
        data: courses[index]
    });
});


// EXCLUIR
app.delete('/api/courses/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = courses.findIndex(
        course => Number(course.id) === id
    );

    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: 'Curso não encontrado'
        });
    }

    const deleted = courses.splice(index, 1)[0];

    return res.json({
        success: true,
        message: 'Curso excluído com sucesso',
        data: deleted
    });
});


app.listen(PORT, () => {
    console.log(`EduRadar API rodando na porta ${PORT}`);
});
