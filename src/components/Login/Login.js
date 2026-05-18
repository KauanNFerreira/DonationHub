import React, { useState, useRef, useEffect } from 'react';
import './Login.css';
import ForgotPasswordModal from './ForgotPasswordModal';
import TermsModal from '../TermsModal/TermsModal';
// Supabase removido para usar backend Node.js com SQLite

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
  
  // Novos estados para o OTP (SQLite / Node Backend)
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  
  // Estados para os Termos de Política
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
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
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      if (data.requireOtp) {
        setShowOtpInput(true);
        setSuccessMsg(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: otpCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Código inválido');
      }

      // Sucesso no login, salvar token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (setUser) setUser(data.user);
      setCurrentPage('home'); // Redireciona para o painel principal (dashboard)
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

    if (!acceptedTerms) {
      setRegisterError('Você deve aceitar os Termos de Política para se cadastrar.');
      setRegisterLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError('As senhas não coincidem');
      setRegisterLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cadastrar');
      }
      
      alert('Cadastro realizado com sucesso! Faça seu login.');
      setIsActive(false);
      setAcceptedTerms(false);
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
                type={showRegisterPassword ? "text" : "password"}
                placeholder="Senha"
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
              >
                <i className={`fa-regular ${showRegisterPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
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
            
            <div className="terms-checkbox-container" style={{display: 'flex', alignItems: 'center', marginTop: '10px', marginBottom: '15px', width: '100%', justifyContent: 'center'}}>
              <input 
                type="checkbox" 
                id="terms" 
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                style={{width: 'auto', marginRight: '8px', cursor: 'pointer'}}
              />
              <label htmlFor="terms" style={{fontSize: '12px', color: '#666', cursor: 'pointer'}}>
                Eu li e aceito os <a href="#" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} style={{color: '#512da8', textDecoration: 'underline'}}>Termos e Política</a>
              </label>
            </div>
            
            <button type="submit" className="sign-up-btn" disabled={registerLoading}>
              {registerLoading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
        </div>

        <div className="form-container sign-in">
          {!showOtpInput ? (
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
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <h1>Verificação de Segurança</h1>
              <span style={{textAlign: 'center', margin: '15px 0', fontSize: '14px'}}>
                Enviamos um código de 6 dígitos para <strong>{formData.email}</strong>.<br/>
                Para fins de teste, olhe o terminal/console do backend.
              </span>
              
              {error && <div className="error-message">{error}</div>}
              {successMsg && <div className="success-message" style={{color: '#28a745', marginBottom: '15px', textAlign: 'center', fontSize: '14px'}}>{successMsg}</div>}
              
              <input
                type="text"
                placeholder="Código de 6 dígitos"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength="6"
                required
                style={{textAlign: 'center', fontSize: '20px', letterSpacing: '5px'}}
              />
              
              <button type="submit" className={`sign-in-btn ${loading ? 'loading' : ''}`} disabled={loading || otpCode.length < 6}>
                <span className="btn-text">Verificar Código</span>
                <span className="spinner"></span>
              </button>

              <a href="#" onClick={(e) => { e.preventDefault(); setShowOtpInput(false); setSuccessMsg(''); setError(''); }} style={{marginTop: '15px'}}>
                Voltar para o login
              </a>
            </form>
          )}
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

        <div className="mobile-toggle">
          <button 
            type="button" 
            className={`mobile-toggle-btn ${!isActive ? 'active' : ''}`}
            onClick={() => setIsActive(false)}
          >
            Entrar
          </button>
          <button 
            type="button" 
            className={`mobile-toggle-btn ${isActive ? 'active' : ''}`}
            onClick={() => setIsActive(true)}
          >
            Cadastrar
          </button>
        </div>
      </div>

      <ForgotPasswordModal 
        isOpen={forgotModal} 
        onClose={() => setForgotModal(false)} 
      />

      <TermsModal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)} 
        onAccept={() => setAcceptedTerms(true)}
      />
    </div>
  );
};

export default Login;