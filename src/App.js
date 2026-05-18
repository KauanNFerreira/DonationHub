import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';

function App() {
  const [currentPage, setCurrentPage] = useState('homepage');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Escuta mudanças de estado na autenticação, útil para retornos de Magic Links
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        setCurrentPage('home');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setCurrentPage('homepage');
      }
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
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
    </div>
  );
}

export default App;