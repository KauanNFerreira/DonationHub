process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Ignora erro de certificado SSL expirado do SQLite Cloud em desenvolvimento

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dns = require('dns').promises; // Nativo do Node.js — sem instalação necessária
const { Database } = require('@sqlitecloud/drivers');
const { sendOTPEmail } = require('./emailService');

const SALT_ROUNDS = 12; // Quanto maior, mais seguro (e mais lento)

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com SQLite Cloud (porta 8860 funciona via TCP no Node.js)
const connectionString = "sqlitecloud://cce14z30dz.g5.sqlite.cloud:8860/auth.sqlitecloud?apikey=W3BA2V4AoSAnQGYEDCqeT9vcgpo2hzLr7X5ybw9QTh8";
const db = new Database(connectionString);

console.log("📡 Conectando ao SQLite Cloud...");

// Inicializar tabelas caso não existam
async function initDatabase() {
    try {
        // Criar tabela de usuários se não existir
        await db.sql`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                senha TEXT NOT NULL
            );
        `;
        
        // Criar tabela para códigos de verificação OTP
        await db.sql`
            CREATE TABLE IF NOT EXISTS codigos_verificacao (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL,
                codigo TEXT NOT NULL,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Tabela temporária para cadastros aguardando confirmação de e-mail
        await db.sql`
            CREATE TABLE IF NOT EXISTS cadastros_pendentes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                senha_hash TEXT NOT NULL,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log("✅ Banco de dados inicializado e tabelas verificadas/criadas!");
    } catch (err) {
        console.error("❌ Erro ao inicializar tabelas no SQLite Cloud:", err.message);
    }
}
initDatabase();

// Função auxiliar para validar formato de e-mail usando Expressão Regular
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Verifica se o domínio do e-mail tem servidores de e-mail (MX Records) via DNS
// Bloqueia domínios falsos como @lalala.com, @teste.xyz, etc. na hora, sem enviar nada
async function hasValidMxRecord(email) {
    try {
        const domain = email.split('@')[1];
        const mxRecords = await dns.resolveMx(domain);
        return mxRecords && mxRecords.length > 0;
    } catch (err) {
        // Se o DNS não encontrar registros MX, o domínio é inválido
        return false;
    }
}

// ========== ROTAS DA API DE AUTENTICAÇÃO ==========

// 1a. Rota de Cadastro — Etapa 1: Valida dados, verifica MX Record e envia OTP
app.post('/api/auth/register/send-otp', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Preencha todos os campos obrigatórios!' });
    }

    if (!isValidEmail(email.trim())) {
        return res.status(400).json({ error: 'Por favor, insira um e-mail com formato válido!' });
    }

    // 🔍 CAMADA 1: Verificação de MX Record — bloqueia domínios falsos na hora
    console.log(`🔍 Verificando MX Record do domínio: ${email.trim().split('@')[1]}`);
    const mxValido = await hasValidMxRecord(email.trim());
    if (!mxValido) {
        console.log(`❌ Domínio sem MX Record rejeitado: ${email.trim()}`);
        return res.status(400).json({ error: 'Este endereço de e-mail não parece ser válido. Por favor, use um e-mail real.' });
    }
    console.log(`✅ MX Record válido para: ${email.trim().split('@')[1]}`);

    // Validação de força da senha
    if (password.length < 8) {
        return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres!' });
    }
    if (!/[A-Z]/.test(password)) {
        return res.status(400).json({ error: 'A senha deve conter pelo menos uma letra maiúscula!' });
    }
    if (!/[0-9]/.test(password)) {
        return res.status(400).json({ error: 'A senha deve conter pelo menos um número!' });
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return res.status(400).json({ error: 'A senha deve conter pelo menos um caractere especial (ex: !@#$%)!' });
    }

    try {
        // Verificar se o e-mail já está cadastrado na tabela definitiva
        const existing = await db.sql`
            SELECT id FROM usuarios WHERE email = ${email.trim()};
        `;
        if (existing && existing.length > 0) {
            return res.status(400).json({ error: 'Este e-mail já está cadastrado!' });
        }

        // Criptografar a senha com bcrypt antes de salvar temporariamente
        const senhaHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Salvar dados pendentes (ou atualizar se já tinha tentado antes)
        await db.sql`
            DELETE FROM cadastros_pendentes WHERE email = ${email.trim()};
        `;
        await db.sql`
            INSERT INTO cadastros_pendentes (nome, email, senha_hash)
            VALUES (${name.trim()}, ${email.trim()}, ${senhaHash});
        `;

        // 🔑 CAMADA 2: Gerar e enviar código OTP para o e-mail
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        await db.sql`
            DELETE FROM codigos_verificacao WHERE email = ${email.trim()};
        `;
        await db.sql`
            INSERT INTO codigos_verificacao (email, codigo)
            VALUES (${email.trim()}, ${otpCode});
        `;
        await sendOTPEmail(email.trim(), otpCode);

        console.log(`📧 OTP de cadastro enviado para: ${email.trim()}`);
        res.json({
            requireOtp: true,
            message: `Código de verificação enviado para ${email.trim()}! Confirme seu e-mail para concluir o cadastro.`
        });
    } catch (error) {
        console.error('Erro ao iniciar cadastro:', error);
        res.status(500).json({ error: 'Erro interno ao iniciar cadastro: ' + error.message });
    }
});

// 1b. Rota de Cadastro — Etapa 2: Confirma o OTP e cria a conta definitivamente
app.post('/api/auth/register/confirm', async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ error: 'E-mail e código de verificação são obrigatórios!' });
    }

    try {
        // Verificar se o código OTP confere
        const results = await db.sql`
            SELECT * FROM codigos_verificacao WHERE email = ${email.trim()} AND codigo = ${code.trim()};
        `;
        if (!results || results.length === 0) {
            return res.status(401).json({ error: 'Código de verificação incorreto ou expirado!' });
        }

        // Buscar os dados pendentes do cadastro
        const pending = await db.sql`
            SELECT * FROM cadastros_pendentes WHERE email = ${email.trim()};
        `;
        if (!pending || pending.length === 0) {
            return res.status(400).json({ error: 'Nenhum cadastro pendente encontrado para este e-mail. Por favor, preencha o formulário novamente.' });
        }

        const { nome, senha_hash } = pending[0];

        // Criar o usuário definitivamente
        await db.sql`
            INSERT INTO usuarios (nome, email, senha)
            VALUES (${nome}, ${email.trim()}, ${senha_hash});
        `;

        // Limpar tabelas temporárias
        await db.sql`DELETE FROM codigos_verificacao WHERE email = ${email.trim()};`;
        await db.sql`DELETE FROM cadastros_pendentes WHERE email = ${email.trim()};`;

        console.log(`✅ Conta criada com e-mail verificado: ${nome} (${email.trim()})`);
        res.json({ success: true, message: 'Cadastro concluído! Faça seu login.' });
    } catch (error) {
        console.error('Erro ao confirmar cadastro:', error);
        res.status(500).json({ error: 'Erro interno ao confirmar cadastro: ' + error.message });
    }
});

// 2. Rota de Login (Gera o código de segurança OTP)
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios!' });
    }

    if (!isValidEmail(email.trim())) {
        return res.status(400).json({ error: 'Por favor, insira um e-mail com formato válido!' });
    }

    try {
        // Buscar usuário pelo e-mail (a senha será comparada via bcrypt)
        const users = await db.sql`
            SELECT * FROM usuarios WHERE email = ${email.trim()};
        `;

        if (!users || users.length === 0) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos!' });
        }

        // Comparar a senha digitada com o hash armazenado no banco
        const senhaCorreta = await bcrypt.compare(password, users[0].senha);
        if (!senhaCorreta) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos!' });
        }

        const user = users[0];

        // Gerar um código OTP aleatório de 6 dígitos
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Salvar código no banco (apaga códigos antigos desse email primeiro)
        await db.sql`
            DELETE FROM codigos_verificacao WHERE email = ${email.trim()};
        `;
        await db.sql`
            INSERT INTO codigos_verificacao (email, codigo) 
            VALUES (${email.trim()}, ${otpCode});
        `;

        // Enviar o código OTP por e-mail para o usuário (erro é propagado se o envio falhar)
        await sendOTPEmail(email.trim(), otpCode);

        res.json({ 
            requireOtp: true, 
            message: `Código de verificação enviado para ${email.trim()}! Verifique seu e-mail.` 
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno no login: ' + error.message });
    }
});

// 3. Rota de Verificação de Código OTP
app.post('/api/auth/verify', async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ error: 'E-mail e código de verificação são obrigatórios!' });
    }

    try {
        // Buscar se o código confere
        const results = await db.sql`
            SELECT * FROM codigos_verificacao WHERE email = ${email.trim()} AND codigo = ${code.trim()};
        `;

        if (!results || results.length === 0) {
            return res.status(401).json({ error: 'Código de verificação incorreto ou expirado!' });
        }

        // Apagar o código após validação bem-sucedida
        await db.sql`
            DELETE FROM codigos_verificacao WHERE email = ${email.trim()};
        `;

        // Obter os dados públicos do usuário logado
        const users = await db.sql`
            SELECT id, nome, email FROM usuarios WHERE email = ${email.trim()};
        `;

        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado!' });
        }

        const user = users[0];

        console.log(`🔓 Usuário autenticado com sucesso: ${user.nome} (${user.email})`);

        res.json({
            success: true,
            token: 'mock-jwt-token-donationhub-session',
            user: {
                id: user.id,
                nome: user.nome,
                name: user.nome, // Para compatibilidade com o front-end web antigo
                email: user.email
            }
        });

    } catch (error) {
        console.error('Erro na verificação do código:', error);
        res.status(500).json({ error: 'Erro interno na verificação: ' + error.message });
    }
});

// Porta padrão 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 SERVIDOR BACKEND DO DONATIONHUB ATIVO!`);
    console.log(`👉 Web Local: http://localhost:${PORT}`);
    console.log(`👉 Celular: http://SEU_IP_LOCAL:${PORT}\n`);
});