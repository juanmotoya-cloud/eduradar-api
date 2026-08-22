// Listar todos os cursos
app.get('/api/courses', (req, res) => {
    res.status(200).json({
        success: true,
        courses: courses
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
