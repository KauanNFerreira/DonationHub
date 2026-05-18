// server.js (adicione esta rota)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = await db.sql`
            SELECT * FROM usuarios WHERE email = ${email} AND senha = ${password};
        `;

        if (users.length === 0) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }

        res.json({ success: true, userId: users[0].id, name: users[0].nome });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});