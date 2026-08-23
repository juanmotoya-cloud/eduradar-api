const express = require('express');
const cors = require('cors');

const { courses, categories, institutions, articles, ads } = require('./courses');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;


// ============================================
// DOCUMENTAÇÃO / ROOT
// ============================================
app.get('/', (req, res) => {
    res.json({
        success: true,
        name: 'EduRadar API',
        version: '1.0.0',
        stats: {
            courses: courses.length,
            categories: categories.length,
            institutions: institutions.length,
            articles: articles.length,
            ads: ads.length
        },
        endpoints: {
            courses: {
                list: 'GET /api/courses',
                filter: 'GET /api/courses?area=Tecnologia&status=Destaque&category=ead',
                search: 'GET /api/courses?search=excel',
                getOne: 'GET /api/courses/:id',
                create: 'POST /api/courses',
                update: 'PUT /api/courses/:id',
                delete: 'DELETE /api/courses/:id'
            },
            data: {
                categories: 'GET /api/categories',
                institutions: 'GET /api/institutions',
                articles: 'GET /api/articles',
                ads: 'GET /api/ads'
            }
        }
    });
});


// ============================================
// CURSOS — LISTAR (com filtros)
// ============================================
app.get('/api/courses', (req, res) => {
    const { area, category, status, institution, mode, search, limit } = req.query;

    let result = [...courses];

    if (area) {
        result = result.filter(c => c.area.toLowerCase() === area.toLowerCase());
    }
    if (category) {
        result = result.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }
    if (status) {
        result = result.filter(c => c.status.toLowerCase() === status.toLowerCase());
    }
    if (institution) {
        result = result.filter(c =>
            c.institution.toLowerCase().includes(institution.toLowerCase())
        );
    }
    if (mode) {
        result = result.filter(c => c.mode.toLowerCase() === mode.toLowerCase());
    }
    if (search) {
        const term = search.toLowerCase();
        result = result.filter(c =>
            c.title.toLowerCase().includes(term) ||
            c.description.toLowerCase().includes(term) ||
            c.institution.toLowerCase().includes(term)
        );
    }
    if (limit) {
        result = result.slice(0, parseInt(limit));
    }

    res.json({
        success: true,
        total: result.length,
        data: result
    });
});


// ============================================
// CURSOS — BUSCAR POR ID
// ============================================
app.get('/api/courses/:id', (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: 'ID do curso inválido'
        });
    }

    const course = courses.find(c => Number(c.id) === id);

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


// ============================================
// CURSOS — CADASTRAR
// ============================================
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


// ============================================
// CURSOS — EDITAR
// ============================================
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


// ============================================
// CURSOS — EXCLUIR
// ============================================
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

    const deleted = courses.splice(index, 1)[0];

    return res.json({
        success: true,
        message: 'Curso excluído com sucesso',
        data: deleted
    });
});


// ============================================
// CATEGORIAS
// ============================================
app.get('/api/categories', (req, res) => {
    res.json({
        success: true,
        total: categories.length,
        data: categories.map(c => ({
            icon: c[0],
            name: c[1],
            description: c[2]
        }))
    });
});


// ============================================
// INSTITUIÇÕES
// ============================================
app.get('/api/institutions', (req, res) => {
    res.json({
        success: true,
        total: institutions.length,
        data: institutions.map(i => ({
            code: i[0],
            name: i[1],
            opportunities: i[2]
        }))
    });
});


// ============================================
// ARTIGOS
// ============================================
app.get('/api/articles', (req, res) => {
    res.json({
        success: true,
        total: articles.length,
        data: articles.map(a => ({
            icon: a[0],
            title: a[1],
            description: a[2],
            readTime: a[3]
        }))
    });
});


// ============================================
// ANÚNCIOS / ADS
// ============================================
app.get('/api/ads', (req, res) => {
    res.json({
        success: true,
        total: ads.length,
        data: ads
    });
});


// ============================================
// INICIAR SERVIDOR
// ============================================
app.listen(PORT, () => {
    console.log(`================================`);
    console.log(`  EduRadar API rodando`);
    console.log(`  Porta: ${PORT}`);
    console.log(`  URL: http://localhost:${PORT}`);
    console.log(`================================`);
    console.log(`  Cursos: ${courses.length}`);
    console.log(`  Categorias: ${categories.length}`);
    console.log(`  Instituições: ${institutions.length}`);
    console.log(`  Artigos: ${articles.length}`);
    console.log(`  Ads: ${ads.length}`);
    console.log(`================================`);
});
