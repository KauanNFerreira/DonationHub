// server.js (coloque na RAIZ, fora da pasta src)
import express from 'express';
import cors from 'cors';
import { Database } from '@sqlitecloud/drivers';

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com SQLite Cloud (porta 8860 funciona no Node.js)
const db = new Database("sqlitecloud://cce14z30dz.g5.sqlite.cloud:8860/auth.sqlitecloud?apikey=W3BA2V4AoSAnQGYEDCqeT9vcgpo2hzLr7X5ybw9QTh8");

// Rota para buscar usuários
app.get('/api/usuarios', async (req, res) => {
    try {
        const usuarios = await db.sql`SELECT * FROM usuarios;`;
        res.json(usuarios);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ erro: error.message });
    }
});

// Rota para criar usuário
app.post('/api/usuarios', async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const resultado = await db.sql`
      INSERT INTO usuarios (nome, email, senha) 
      VALUES (${nome}, ${email}, ${senha});
    `;
        res.json({ success: true, id: resultado.lastInsertRowid });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

app.listen(3333, () => {
    console.log('✅ Backend rodando em http://localhost:3333');
});