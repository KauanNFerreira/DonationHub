const nodemailer = require('nodemailer');
require('dotenv').config();

const smtpConfigured = 
    process.env.SMTP_HOST && 
    process.env.SMTP_USER && 
    process.env.SMTP_USER !== 'seu-email@gmail.com' && 
    process.env.SMTP_PASS && 
    process.env.SMTP_PASS !== 'sua-senha-de-app-ou-token';

async function sendOTPEmail(toEmail, otpCode) {
    if (!smtpConfigured) {
        console.warn("\n=============================================");
        console.warn("⚠️ AVISO: SMTP não configurado ou usando placeholders no arquivo .env.");
        console.warn("O e-mail real não pôde ser enviado.");
        console.warn(`\n🔑 CÓDIGO DE VERIFICAÇÃO OTP PARA: ${toEmail.trim()}`);
        console.warn(`👉   ${otpCode}   👈`);
        console.warn("\nUse este código no aplicativo para completar o login!");
        console.warn("Para receber no e-mail de verdade, configure as credenciais SMTP no arquivo .env e reinicie o servidor.");
        console.warn("=============================================\n");
        return false;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_PORT === '465', // true para porta 465, false para outras
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"DonationHub" <${process.env.SMTP_USER}>`,
            to: toEmail,
            subject: 'Código de Verificação OTP - DonationHub',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #512da8; text-align: center;">Código de Segurança DonationHub</h2>
                    <p>Olá,</p>
                    <p>Você solicitou um código de verificação para acessar sua conta no DonationHub.</p>
                    <div style="background-color: #f7fafc; border: 1px dashed #cbd5e0; padding: 15px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">${otpCode}</span>
                    </div>
                    <p>Este código expira em breve. Se você não solicitou este código, por favor ignore este e-mail.</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                    <p style="font-size: 11px; color: #718096; text-align: center;">DonationHub &copy; ${new Date().getFullYear()}</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✉️ E-mail OTP enviado com sucesso para ${toEmail}. MessageID: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(`❌ Erro ao enviar e-mail OTP para ${toEmail}:`, error.message);
        // Fallback para o console para que o desenvolvedor/estudante não fique travado
        console.log(`\n=============================================`);
        console.log(`🔑 FALLBACK - CÓDIGO OTP PARA ${toEmail.trim()}:`);
        console.log(`👉   ${otpCode}   👈`);
        console.log(`=============================================\n`);
        return false;
    }
}

module.exports = { sendOTPEmail };
