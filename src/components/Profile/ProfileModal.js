import React, { useState, useRef, useEffect } from 'react';
import './ProfileModal.css';

const ProfileModal = ({ user, onClose, setUser }) => {
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Como migramos para o Express backend com SQLite, atualizamos os dados locais do usuário
      const updatedUser = { ...user, name };
      
      // Persiste no localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      if (setUser) setUser(updatedUser);
      alert('Perfil atualizado com sucesso!');
      onClose();
    } catch (error) {
      setError('Erro ao atualizar o perfil.');
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
    <div className="modal-overlay">
      <div className="modal-content profile-modal" ref={modalRef}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>Editar Perfil</h2>
        
        <form onSubmit={handleSubmit} onKeyPress={handleKeyPress}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={user?.email} 
              disabled 
              className="disabled-input"
            />
          </div>
          
          <div className="form-group">
            <label>Nome</label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
            />
          </div>
          
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;