import React, { useState, useRef, useEffect } from 'react';
import './ForgotPasswordModal.css';
import { supabase } from '../../supabaseClient';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Pequeno delay para garantir que o modal abriu completamente
      setTimeout(() => {
        setIsModalOpen(true);
        // Focar no input automaticamente
        const inputElement = document.getElementById('email-input');
        if (inputElement) {
          inputElement.focus();
        }
      }, 50);
    } else {
      setIsModalOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Só verifica clique fora se o modal estiver completamente aberto
      if (isModalOpen && modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Adiciona o evento apenas quando o modal estiver aberto
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen, onClose]);

  // Focar no input quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      const inputElement = document.getElementById('email-input');
      if (inputElement) {
        setTimeout(() => {
          inputElement.focus();
        }, 150);
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (error) throw error;
      
      setMessage('Email de recuperação enviado! Verifique sua caixa de entrada.');
      setTimeout(() => onClose(), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClick = (e) => {
    // Impede que o clique no modal feche ele
    e.stopPropagation();
  };
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleModalClick}>
      <div className="modal-content forgot-modal" ref={modalRef}>
        <button 
          type="button"
          className="modal-close" 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          ×
        </button>
        
        <h2>Recuperar Senha</h2>
        
        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          
          <p>Digite seu email para receber as instruções de recuperação de senha.</p>
          
          <input
            id="email-input"
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            required
            className="forgot-input"
            autoFocus
          />
          
          <button 
            type="submit" 
            className="forgot-button" 
            disabled={loading}
            onClick={(e) => e.stopPropagation()}
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;