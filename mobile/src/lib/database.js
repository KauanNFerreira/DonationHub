// mobile/src/lib/database.js
import { Database } from '@sqlitecloud/drivers';

// ⚠️ Use PORTA 8860 para React Native (conexão direta)
const connectionString = "sqlitecloud://cce14z30dz.g5.sqlite.cloud:8860/auth.sqlitecloud?apikey=W3BA2V4AoSAnQGYEDCqeT9vcgpo2hzLr7X5ybw9QTh8";

let dbInstance = null;

function getDb() {
    if (!dbInstance) {
        console.log("📡 Conectando ao SQLite Cloud...");
        dbInstance = new Database(connectionString);
    }
    return dbInstance;
}

// ========== FUNÇÕES PARA O APP ==========

// Buscar usuário por email (login)
export async function loginUsuario(email, senha) {
    try {
        const db = getDb();
        const usuarios = await db.sql`
            SELECT * FROM usuarios WHERE email = ${email} AND senha = ${senha};
        `;

        if (usuarios.length === 0) {
            return { success: false, error: 'Email ou senha inválidos' };
        }

        const user = usuarios[0];
        return {
            success: true,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email
            }
        };
    } catch (error) {
        console.error('Erro no login:', error);
        return { success: false, error: error.message };
    }
}

// Criar novo usuário (cadastro)
export async function criarUsuario(nome, email, senha) {
    try {
        const db = getDb();

        // Verificar se email já existe
        const existing = await db.sql`
            SELECT * FROM usuarios WHERE email = ${email};
        `;

        if (existing.length > 0) {
            return { success: false, error: 'Este e-mail já está cadastrado' };
        }

        // Inserir novo usuário
        const resultado = await db.sql`
            INSERT INTO usuarios (nome, email, senha) 
            VALUES (${nome}, ${email}, ${senha});
        `;

        return { success: true, id: resultado.lastInsertRowid };
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        return { success: false, error: error.message };
    }
}

// Buscar todos os usuários (opcional)
export async function getUsuarios() {
    try {
        const db = getDb();
        const usuarios = await db.sql`SELECT * FROM usuarios;`;
        return usuarios;
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        return [];
    }
}