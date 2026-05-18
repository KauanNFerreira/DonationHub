import React, { useState, useRef, useEffect } from 'react';
import './Login.css';
import ForgotPasswordModal from './ForgotPasswordModal';
import { supabase } from '../../supabaseClient';

const Login = ({ setCurrentPage, setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [error, setError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [forgotModal, setForgotModal] = useState(false);
  const [isActive, setIsActive] = useState(false);
  
  const containerRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setCurrentPage('homepage');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setCurrentPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      // Passo 1: Valida a senha (login normal)
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;
      
      // Passo 2: Desloga imediatamente (para forçar o 2FA via email)
      await supabase.auth.signOut();

      // Passo 3: Envia o Magic Link
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: formData.email,
      });

      if (otpError) throw otpError;

      // Mostra mensagem para o usuário ir para o e-mail
      setSuccessMsg('Senha correta! Enviamos um link de confirmação para o seu e-mail. Clique no link para entrar no aplicativo.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError('');

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError('As senhas não coincidem');
      setRegisterLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            name: registerData.name
          }
        }
      });

      if (error) throw error;
      
      alert('Cadastro realizado com sucesso! Faça seu login.');
      setIsActive(false);
      setRegisterData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      setRegisterError(error.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleKeyPress = (e, type) => {
    if (e.key === 'Enter') {
      if (type === 'login' && !loading) {
        handleSubmit(e);
      } else if (type === 'register' && !registerLoading) {
        handleRegister(e);
      }
    }
  };

  return (
    <div className="login-wrapper" ref={containerRef}>
      <div className={`container ${isActive ? 'active' : ''}`} id="container" ref={modalRef}>
        <button className="modal-close" onClick={() => setCurrentPage('homepage')}>×</button>
        
        <div className="form-container sign-up">
          <form onSubmit={handleRegister} onKeyPress={(e) => handleKeyPress(e, 'register')}>
            <h1>Criar Conta</h1>
            <div className="social-icons">
              <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
            <span>ou use seu email para cadastro</span>
            
            {registerError && <div className="error-message">{registerError}</div>}
            
            <input
              type="text"
              placeholder="Nome completo"
              value={registerData.name}
              onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
              required
            />
            
            <input
              type="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
              required
            />
            
            <div className="password-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Senha"
    value={formData.password}
    onChange={(e) => setFormData({...formData, password: e.target.value})}
    required
  />
  <button
    type="button"
    className="toggle-password"
    onClick={() => setShowPassword(!showPassword)}
  >
    <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
  </button>
</div>
            
            <div className="password-wrapper">
              <input
                type={showRegisterConfirmPassword ? "text" : "password"}
                placeholder="Confirmar senha"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
              >
                <i className={`fa-regular ${showRegisterConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            
            <button type="submit" className="sign-up-btn" disabled={registerLoading}>
              {registerLoading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
        </div>

        <div className="form-container sign-in">
          <form onSubmit={handleSubmit} onKeyPress={(e) => handleKeyPress(e, 'login')}>
            <h1>Entrar</h1>
            <div className="social-icons">
              <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
            <span>ou use seu email e senha</span>
            
            {error && <div className="error-message">{error}</div>}
            {successMsg && <div className="success-message" style={{color: '#28a745', marginBottom: '15px', textAlign: 'center', fontSize: '14px'}}>{successMsg}</div>}
            
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            
            <a href="#" onClick={(e) => { e.preventDefault(); setForgotModal(true); }}>Esqueceu sua senha?</a>
            
            <button type="submit" className={`sign-in-btn ${loading ? 'loading' : ''}`} disabled={loading}>
              <span className="btn-text">Entrar</span>
              <span className="spinner"></span>
            </button>
          </form>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Bem-vindo de volta!</h1>
              <p>Entre com seus dados para usar todas as funcionalidades</p>
              <button className="#" id="login" onClick={() => setIsActive(false)}>Entrar</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Olá, amigo!</h1>
              <p>Cadastre-se para começar a fazer doações</p>
              <button className="#" id="register" onClick={() => setIsActive(true)}>Cadastrar</button>
            </div>
          </div>
        </div>
      </div>

      <ForgotPasswordModal 
        isOpen={forgotModal} 
        onClose={() => setForgotModal(false)} 
      />
    </div>
  );
};

export default Login;