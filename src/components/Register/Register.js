import React, { useState, useRef, useEffect } from 'react';
import './Register.css';
import TermsModal from '../TermsModal/TermsModal';
// Supabase removido para usar backend Node.js com SQLite

const Register = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados para os Termos de Política
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
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

    if (!acceptedTerms) {
      setError('Você deve aceitar os Termos de Política para se cadastrar.');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cadastrar');
      }
      
      alert('Cadastro realizado com sucesso! Faça seu login.');
      setCurrentPage('login');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit(e);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card" ref={modalRef}>
        <button className="modal-close" onClick={() => setCurrentPage('homepage')}>×</button>
        
        <h1>Criar Conta</h1>
        
        <form onSubmit={handleSubmit} onKeyPress={handleKeyPress}>
          {error && <div className="error-message">{error}</div>}
          
          <input
            type="text"
            placeholder="Nome completo"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          
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
          
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar senha"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <i className={`fa-regular ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
            </div>
            
            <div className="terms-checkbox-container" style={{display: 'flex', alignItems: 'center', marginTop: '10px', marginBottom: '15px', width: '100%', justifyContent: 'center'}}>
              <input 
                type="checkbox" 
                id="terms-register" 
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                style={{width: 'auto', marginRight: '8px', cursor: 'pointer'}}
              />
              <label htmlFor="terms-register" style={{fontSize: '12px', color: '#666', cursor: 'pointer'}}>
                Eu li e aceito os <a href="#" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} style={{color: '#512da8', textDecoration: 'underline'}}>Termos e Política</a>
              </label>
            </div>
            
            <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        
        <p className="login-link">
          Já tem uma conta? <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('login'); }}>Faça login</a>
        </p>
      </div>
      
      <TermsModal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)} 
        onAccept={() => setAcceptedTerms(true)}
      />
    </div>
  );
};

export default Register;