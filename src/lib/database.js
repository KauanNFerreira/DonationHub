import { useEffect } from 'react';
import { Database } from '@sqlitecloud/drivers';

const db = new Database("sqlitecloud://cce14z30dz.g5.sqlite.cloud:4000/auth.sqlitecloud?apikey=W3BA2V4AoSAnQGYEDCqeT9vcgpo2hzLr7X5ybw9QTh8");

export default function App() {
    useEffect(() => {
        async function teste() {
            try {
                console.log("1️⃣ Testando conexão...");
                const result = await db.sql`SELECT 'Conexão OK!' as mensagem;`;
                console.log("2️⃣ Resultado:", result);
            } catch (error) {
                console.error("3️⃣ Erro completo:", error);
            }
        }
        teste();
    }, []);

    return <div>Abra o console do navegador (F12)</div>;
}