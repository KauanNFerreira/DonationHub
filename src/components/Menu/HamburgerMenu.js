import React, { useState, useRef, useEffect } from 'react';
import './HamburgerMenu.css';

const HamburgerMenu = ({ setShowProfile, setShowHistory, setShowCompanyDonation, handleLogout, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && 
          buttonRef.current && !buttonRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userName = user?.nome || user?.name || 'Usuário';

  return (
    <>
      <button 
        ref={buttonRef}
        className={`hamburger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div ref={menuRef} className={`menu-content ${isOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <div className="menu-user-info">
            <i className="fa-regular fa-circle-user"></i>
            <div className="user-info-text">
              <span className="welcome-text">Seja bem-vindo,</span>
              <span className="user-name">{userName}!</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
        </div>
        
        <button className="menu-item" onClick={() => { 
          setShowProfile(true); 
          setIsOpen(false);
        }}>
          <i className="fa-regular fa-pen-to-square"></i>
          <span>Editar Perfil</span>
        </button>
        
        <button className="menu-item" onClick={() => { setShowHistory(true); setIsOpen(false); }}>
          <i className="fa-regular fa-clock"></i>
          <span>Histórico de Doações</span>
        </button>
        
        <button className="menu-item" onClick={() => { setShowCompanyDonation(true); setIsOpen(false); }}>
          <i className="fa-regular fa-heart"></i>
          <span>Doar para Nossa Empresa</span>
        </button>

        <button className="menu-item">
          <i className="fa-regular fa-building"></i>  
          <span><a href="https://pmv-tech.github.io/Website-about-us/">Nossa empresa</a></span>
        </button>
        
        <button className="menu-item logout" onClick={handleLogout}>
          <i className="fa-regular fa-door-open"></i>
          <span>Sair</span>
        </button>
      </div>
    </>
  );
};

export default HamburgerMenu;