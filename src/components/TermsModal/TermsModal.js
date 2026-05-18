import React from 'react';
import './TermsModal.css';

const TermsModal = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="terms-modal-overlay">
      <div className="terms-modal-content">
        <button className="terms-close-button" onClick={onClose}>×</button>
        <h2>Termos e Política de Privacidade</h2>
        
        <div className="terms-scroll-area">
          <h3>1. Aceitação dos Termos</h3>
          <p>Ao criar uma conta no DonationHub, você concorda com os termos aqui descritos. O aplicativo foi desenvolvido para facilitar o contato entre doadores e recebedores, não nos responsabilizamos por transações feitas fora da plataforma.</p>
          
          <h3>2. Uso de Dados</h3>
          <p>Os seus dados pessoais (nome, e-mail) serão utilizados apenas para fins de autenticação e comunicação dentro da plataforma. Não venderemos seus dados para terceiros.</p>
          
          <h3>3. Responsabilidade do Usuário</h3>
          <p>Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta. Informe imediatamente qualquer uso não autorizado da sua conta.</p>
          
          <h3>4. Política de Doações</h3>
          <p>Todas as doações cadastradas devem ser itens lícitos e em condições adequadas de uso. A plataforma reserva-se o direito de remover anúncios que violem nossas regras de convivência.</p>
          
          <h3>5. Direitos Autorais</h3>
          <p>Todo o conteúdo deste aplicativo, incluindo textos, gráficos, logotipos, ícones de botões, imagens e software, é de propriedade do DonationHub ou de seus fornecedores de conteúdo e é protegido por leis de direitos autorais.</p>

          <p className="terms-conclusion">Por favor, leia atentamente. Ao clicar em "Aceitar", você afirma ter lido e concordado com todos os termos.</p>
        </div>

        <div className="terms-actions">
          <button className="terms-btn-reject" onClick={onClose}>Cancelar</button>
          <button className="terms-btn-accept" onClick={() => {
            onAccept();
            onClose();
          }}>Li e Aceito os Termos</button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
