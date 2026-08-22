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
        res.status(400);
        res.setHeader('Content-Type', 'application/json');

        return res.end(JSON.stringify({
            success: false,
            error: 'ID do curso inválido'
        }));
    }

    const course = courses.find(course => course.id === id);

    if (!course) {
        res.status(404);
        res.setHeader('Content-Type', 'application/json');

        return res.end(JSON.stringify({
            success: false,
            error: 'Curso não encontrado'
        }));
    }

    res.setHeader('Content-Type', 'application/json');

    return res.end(JSON.stringify({
        success: true,
        course: course
    }));
});
