import React, { useState, useEffect } from 'react';
import './CookieConsent.css';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice about cookies
    const cookieChoice = localStorage.getItem('cookieConsent');
    if (!cookieChoice) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
    // Aqui você pode adicionar scripts de tracking se o usuário aceitar
    console.log("Cookies aceitos pelo usuário.");
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowBanner(false);
    // Aqui garante que não tenha trackers
    console.log("Cookies rejeitados pelo usuário.");
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-consent-banner">
      <div className="cookie-consent-content">
        <div className="cookie-icon">🍪</div>
        <div className="cookie-text">
          <h3>Nós usamos cookies</h3>
          <p>
            Utilizamos cookies para melhorar sua experiência no nosso aplicativo, personalizar conteúdo e analisar nosso tráfego. 
            Você pode escolher aceitar todos os cookies ou rejeitar os cookies não essenciais.
          </p>
        </div>
      </div>
      <div className="cookie-consent-buttons">
        <button className="btn-reject" onClick={handleReject}>Rejeitar</button>
        <button className="btn-accept" onClick={handleAccept}>Aceitar Cookies</button>
      </div>
    </div>
  );
};

export default CookieConsent;
