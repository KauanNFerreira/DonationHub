/*require('dotenv').config();
const nodemailer = require('nodemailer');

(async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false, // use STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"DonationHub Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: 'Teste de conexão SMTP',
      text: 'Se você recebeu isso, a configuração está correta!',
    });

    console.log('✅ EMAIL ENVIADO! MessageID:', info.messageId);
  } catch (err) {
    console.error('❌ ERRO AO ENVIAR EMAIL:', err.message);
  }
})();*/
