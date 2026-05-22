const { Database } = require('@sqlitecloud/drivers');
const connectionString = "sqlitecloud://cce14z30dz.g5.sqlite.cloud:8860/auth.sqlitecloud?apikey=W3BA2V4AoSAnQGYEDCqeT9vcgpo2hzLr7X5ybw9QTh8";
const db = new Database(connectionString);

async function runTest() {
  try {
    console.log('📡 Testando requisição HTTP POST para registro...');
    const body = {
      name: 'Usuario Teste HTTP',
      email: 'http_test_' + Math.floor(Math.random() * 100000) + '@test.com',
      password: 'senha'
    };
    
    console.log('Dados do corpo:', body);
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    console.log('Status HTTP:', response.status);
    const data = await response.json();
    console.log('Resposta do servidor:', data);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro no teste HTTP:', error);
    process.exit(1);
  }
}

runTest();
