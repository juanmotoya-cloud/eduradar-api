// Listar todos os cursos (com suporte a filtros por query params)
app.get('/api/courses', (req, res) => {
    let result = [...courses];
    const { q, area, institution, mode } = req.query;

    if (q) {
        const query = q.toLowerCase();
        result = result.filter(c => 
            c.title.toLowerCase().includes(query) || 
            c.description.toLowerCase().includes(query)
        );
    }

    if (area) {
        result = result.filter(c => c.area.toLowerCase() === area.toLowerCase());
    }

    if (institution) {
        result = result.filter(c => c.institution.toLowerCase().includes(institution.toLowerCase()));
    }

    if (mode) {
        result = result.filter(c => c.mode.toLowerCase() === mode.toLowerCase());
    }

    return res.status(200).json({
        success: true,
        count: result.length,
        data: result
    });
});

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
