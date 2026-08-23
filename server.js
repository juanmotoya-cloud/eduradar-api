const express = require('express');
const cors = require('cors');

const {
    courses,
    categories,
    institutions,
    articles,
    ads
} = require('./courses');

const app = express();

const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARES
// ============================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

// ============================================
// LOG DE INICIALIZAÇÃO
// ============================================

console.log('================================');
console.log('EduRadar API');
console.log('================================');
console.log(`Cursos: ${courses.length}`);
console.log(`Categorias: ${categories.length}`);
console.log(`Instituições: ${institutions.length}`);
console.log(`Artigos: ${articles.length}`);
console.log(`Anúncios: ${ads.length}`);
console.log('================================');


// ============================================
// ROOT / DOCUMENTAÇÃO
// ============================================

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        name: 'EduRadar API',
        version: '1.0.0',
        status: 'online',

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
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'ok',
        service: 'EduRadar API'
    });
});


// ============================================
// CURSOS — LISTAR
// ============================================

app.get('/api/courses', (req, res) => {

    try {

        const {
            area,
            category,
            status,
            institution,
            mode,
            search,
            limit
        } = req.query;

        let result = [...courses];

        // ----------------------------
        // FILTRO POR ÁREA
        // ----------------------------

        if (area) {
            const value = String(area).trim().toLowerCase();

            result = result.filter(course =>
                String(course.area || '')
                    .toLowerCase()
                    .includes(value)
            );
        }

        // ----------------------------
        // FILTRO POR CATEGORIA
        // ----------------------------

        if (category) {
            const value = String(category).trim().toLowerCase();

            result = result.filter(course =>
                String(course.category || '')
                    .toLowerCase() === value
            );
        }

        // ----------------------------
        // FILTRO POR STATUS
        // ----------------------------

        if (status) {
            const value = String(status).trim().toLowerCase();

            result = result.filter(course =>
                String(course.status || '')
                    .toLowerCase() === value
            );
        }

        // ----------------------------
        // FILTRO POR INSTITUIÇÃO
        // ----------------------------

        if (institution) {
            const value = String(institution).trim().toLowerCase();

            result = result.filter(course =>
                String(course.institution || '')
                    .toLowerCase()
                    .includes(value)
            );
        }

        // ----------------------------
        // FILTRO POR MODALIDADE
        // ----------------------------

        if (mode) {
            const value = String(mode).trim().toLowerCase();

            result = result.filter(course =>
                String(course.mode || '')
                    .toLowerCase() === value
            );
        }

        // ----------------------------
        // BUSCA
        // ----------------------------

        if (search) {

            const term = String(search)
                .trim()
                .toLowerCase();

            result = result.filter(course => {

                const title =
                    String(course.title || '').toLowerCase();

                const description =
                    String(course.description || '').toLowerCase();

                const institutionName =
                    String(course.institution || '').toLowerCase();

                const areaName =
                    String(course.area || '').toLowerCase();

                return (
                    title.includes(term) ||
                    description.includes(term) ||
                    institutionName.includes(term) ||
                    areaName.includes(term)
                );
            });
        }

        // ----------------------------
        // LIMITE
        // ----------------------------

        if (limit !== undefined) {

            const parsedLimit = Number.parseInt(limit, 10);

            if (
                Number.isNaN(parsedLimit) ||
                parsedLimit < 1
            ) {
                return res.status(400).json({
                    success: false,
                    error: 'O parâmetro limit deve ser um número maior que zero.'
                });
            }

            result = result.slice(0, parsedLimit);
        }

        return res.status(200).json({
            success: true,
            total: result.length,
            data: result
        });

    } catch (error) {

        console.error('Erro ao listar cursos:', error);

        return res.status(500).json({
            success: false,
            error: 'Erro interno ao listar cursos.'
        });
    }
});


// ============================================
// CURSO — BUSCAR POR ID
// ============================================

app.get('/api/courses/:id', (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {

        return res.status(400).json({
            success: false,
            error: 'ID do curso inválido.'
        });
    }

    const course = courses.find(
        item => Number(item.id) === id
    );

    if (!course) {

        return res.status(404).json({
            success: false,
            error: 'Curso não encontrado.'
        });
    }

    return res.status(200).json({
        success: true,
        data: course
    });
});


// ============================================
// CURSOS — CADASTRAR
// ============================================

app.post('/api/courses', (req, res) => {

    try {

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
            views,
            linkInscricao
        } = req.body;

        // ----------------------------
        // VALIDAÇÃO
        // ----------------------------

        if (
            !title ||
            !String(title).trim() ||
            !area ||
            !String(area).trim() ||
            !institution ||
            !String(institution).trim()
        ) {

            return res.status(400).json({
                success: false,
                error: 'Título, área e instituição são obrigatórios.'
            });
        }

        // ----------------------------
        // NOVO ID
        // ----------------------------

        const newId = courses.length > 0
            ? Math.max(
                ...courses.map(course =>
                    Number(course.id) || 0
                )
            ) + 1
            : 1;

        // ----------------------------
        // NOVO CURSO
        // ----------------------------

        const newCourse = {

            id: newId,

            title: String(title).trim(),

            area: String(area).trim(),

            category:
                category
                    ? String(category).trim()
                    : 'ead',

            institution:
                String(institution).trim(),

            hours:
                hours
                    ? String(hours).trim()
                    : '',

            mode:
                mode
                    ? String(mode).trim()
                    : 'Online',

            certificate:
                certificate
                    ? String(certificate).trim()
                    : 'Certificado',

            deadline:
                deadline
                    ? String(deadline).trim()
                    : 'Sem prazo',

            status:
                status
                    ? String(status).trim()
                    : 'Novo',

            code:
                code
                    ? String(code).trim()
                    : '',

            description:
                description
                    ? String(description).trim()
                    : '',

            views:
                Number.isFinite(Number(views))
                    ? Number(views)
                    : 0,

            linkInscricao:
                linkInscricao
                    ? String(linkInscricao).trim()
                    : ''
        };

        courses.push(newCourse);

        console.log(
            `Curso ${newId} criado com sucesso.`
        );

        return res.status(201).json({
            success: true,
            message: 'Curso cadastrado com sucesso.',
            data: newCourse
        });

    } catch (error) {

        console.error(
            'Erro ao cadastrar curso:',
            error
        );

        return res.status(500).json({
            success: false,
            error: 'Erro interno ao cadastrar curso.'
        });
    }
});


// ============================================
// CURSOS — EDITAR
// ============================================

app.put('/api/courses/:id', (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {

            return res.status(400).json({
                success: false,
                error: 'ID do curso inválido.'
            });
        }

        const index = courses.findIndex(
            course => Number(course.id) === id
        );

        if (index === -1) {

            return res.status(404).json({
                success: false,
                error: 'Curso não encontrado.'
            });
        }

        const current = courses[index];

        const allowedFields = [
            'title',
            'area',
            'category',
            'institution',
            'hours',
            'mode',
            'certificate',
            'deadline',
            'status',
            'code',
            'description',
            'linkInscricao'
        ];

        const updatedCourse = {
            ...current
        };

        allowedFields.forEach(field => {

            if (
                Object.prototype.hasOwnProperty.call(
                    req.body,
                    field
                )
            ) {

                updatedCourse[field] =
                    req.body[field];
            }
        });

        updatedCourse.id = current.id;

        updatedCourse.views =
            Number(current.views) || 0;

        courses[index] = updatedCourse;

        return res.status(200).json({
            success: true,
            message: 'Curso atualizado com sucesso.',
            data: updatedCourse
        });

    } catch (error) {

        console.error(
            'Erro ao atualizar curso:',
            error
        );

        return res.status(500).json({
            success: false,
            error: 'Erro interno ao atualizar curso.'
        });
    }
});


// ============================================
// CURSOS — EXCLUIR
// ============================================

app.delete('/api/courses/:id', (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {

            return res.status(400).json({
                success: false,
                error: 'ID do curso inválido.'
            });
        }

        const index = courses.findIndex(
            course => Number(course.id) === id
        );

        if (index === -1) {

            return res.status(404).json({
                success: false,
                error: 'Curso não encontrado.'
            });
        }

        const deleted =
            courses.splice(index, 1)[0];

        return res.status(200).json({
            success: true,
            message: 'Curso excluído com sucesso.',
            data: deleted
        });

    } catch (error) {

        console.error(
            'Erro ao excluir curso:',
            error
        );

        return res.status(500).json({
            success: false,
            error: 'Erro interno ao excluir curso.'
        });
    }
});


// ============================================
// CATEGORIAS
// ============================================

app.get('/api/categories', (req, res) => {

    return res.status(200).json({
        success: true,
        total: categories.length,

        data: categories.map(category => ({
            icon: category[0],
            name: category[1],
            description: category[2]
        }))
    });
});


// ============================================
// INSTITUIÇÕES
// ============================================

app.get('/api/institutions', (req, res) => {

    return res.status(200).json({
        success: true,
        total: institutions.length,

        data: institutions.map(institution => ({
            code: institution[0],
            name: institution[1],
            opportunities: institution[2]
        }))
    });
});


// ============================================
// ARTIGOS
// ============================================

app.get('/api/articles', (req, res) => {

    return res.status(200).json({
        success: true,
        total: articles.length,

        data: articles.map(article => ({
            icon: article[0],
            title: article[1],
            description: article[2],
            readTime: article[3]
        }))
    });
});


// ============================================
// ANÚNCIOS
// ============================================

app.get('/api/ads', (req, res) => {

    return res.status(200).json({
        success: true,
        total: ads.length,
        data: ads
    });
});


// ============================================
// ROTA 404
// ============================================

app.use((req, res) => {

    return res.status(404).json({
        success: false,
        error: 'Endpoint não encontrado.',
        path: req.originalUrl
    });
});


// ============================================
// TRATAMENTO DE ERROS
// ============================================

app.use((err, req, res, next) => {

    console.error('Erro interno:', err);

    return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor.'
    });
});


// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, '0.0.0.0', () => {

    console.log('');
    console.log('========================================');
    console.log('       EduRadar API ONLINE');
    console.log('========================================');
    console.log(`Porta: ${PORT}`);
    console.log(`Cursos: ${courses.length}`);
    console.log(`Categorias: ${categories.length}`);
    console.log(`Instituições: ${institutions.length}`);
    console.log(`Artigos: ${articles.length}`);
    console.log(`Anúncios: ${ads.length}`);
    console.log('========================================');
});
