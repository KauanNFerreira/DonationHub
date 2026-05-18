import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import CookieConsent from './components/CookieConsent/CookieConsent';

function App() {
  const [currentPage, setCurrentPage] = useState('homepage');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Carrega o usuário salvo no localStorage se existir
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setCurrentPage('home');
      } catch (error) {
        console.error('Erro ao restaurar sessão:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const renderPage = () => {
    switch(currentPage) {
      case 'homepage':
        return (
          <div className="homepage">
            <h1>Bem-vindo ao Sistema de Doações</h1>
            <p className="homepage-subtitle">Faça a diferença na vida de alguém</p>
            <div className="homepage-buttons">
              <button onClick={() => setCurrentPage('login')}>Login</button>
              <button onClick={() => setCurrentPage('register')}>Cadastrar</button>
            </div>
            <div className="homepage-stats">
              <div className="stat-item">
                <h3>+1000</h3>
                <p>Doações realizadas</p>
              </div>
              <div className="stat-item">
                <h3>+500</h3>
                <p>Doadores ativos</p>
              </div>
              <div className="stat-item">
                <h3>+50</h3>
                <p>Empresas parceiras</p>
              </div>
            </div>
          </div>
        );
      case 'login':
        return <Login setCurrentPage={setCurrentPage} setUser={setUser} />;
      case 'register':
        return <Register setCurrentPage={setCurrentPage} />;
      case 'home':
        return <Home setCurrentPage={setCurrentPage} user={user} setUser={setUser} />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      {renderPage()}
      <CookieConsent />
    </div>
  );
}

export default App;