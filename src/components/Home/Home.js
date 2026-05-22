import React, { useState, useEffect } from 'react';
import './Home.css';
import HamburgerMenu from '../Menu/HamburgerMenu';
import CompanyModal from './CompanyModal';
import ProfileModal from '../Profile/ProfileModal';
import HistoryModal from '../History/HistoryModal';

const companies = [
  { id: 1, name: 'Empresa A', pix: '11945957447', category: 'Saúde', description: 'Apoie hospitais e tratamentos' },
  { id: 2, name: 'Empresa B', pix: '11945957448', category: 'Educação', description: 'Ajude escolas e alunos' },
  { id: 3, name: 'Empresa C', pix: '11945957449', category: 'Meio Ambiente', description: 'Preservação ambiental' },
  { id: 4, name: 'Empresa D', pix: '11945957450', category: 'Animais', description: 'Proteção animal' },
  { id: 5, name: 'Empresa E', pix: '11945957451', category: 'Crianças', description: 'Apoio à infância' },
  { id: 6, name: 'Empresa F', pix: '11945957452', category: 'Idosos', description: 'Assistência a idosos' },
  { id: 7, name: 'Empresa G', pix: '11945957453', category: 'Cultura', description: 'Incentivo à cultura' },
  { id: 8, name: 'Empresa H', pix: '11945957454', category: 'Esportes', description: 'Projetos esportivos' },
  { id: 9, name: 'fsjpii', pix: '11945957447', category: 'Saúde', description: 'Apoie hospitais e tratamentos' }
];

const Home = ({ setCurrentPage, user, setUser }) => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCompanyDonation, setShowCompanyDonation] = useState(false);
  const [donations, setDonations] = useState([]);
  const [totalDonated, setTotalDonated] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Todos'); // Adicionando estado para categoria selecionada

  useEffect(() => {
    if (user) {
      loadDonations();
    }
  }, [user]);

  const loadDonations = async () => {
    if (!user) return;
    try {
      const stored = localStorage.getItem(`donations_${user.id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setDonations(parsed);
        const total = parsed.reduce((sum, donation) => sum + donation.amount, 0);
        setTotalDonated(total);
      }
    } catch (e) {
      console.error('Erro ao carregar doações do localStorage:', e);
    }
  };

  const handleDonation = async (company, amount) => {
    const newDonation = {
      id: Date.now(), // id temporário único
      user_id: user.id,
      company_name: company.name,
      company_pix: company.pix,
      amount: amount,
      created_at: new Date().toISOString()
    };

    const updatedDonations = [newDonation, ...donations];
    setDonations(updatedDonations);
    setTotalDonated(prev => prev + amount);

    try {
      localStorage.setItem(`donations_${user.id}`, JSON.stringify(updatedDonations));
    } catch (e) {
      console.error('Erro ao salvar doação no localStorage:', e);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('homepage');
  };

  // Filtrando empresas baseado na categoria selecionada
  const filteredCompanies = selectedCategory === 'Todos' 
    ? companies 
    : companies.filter(company => company.category === selectedCategory);

  // Função para mudar a categoria
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="home-container">
      <HamburgerMenu 
        setShowProfile={setShowProfile}
        setShowHistory={setShowHistory}
        setShowCompanyDonation={setShowCompanyDonation}
        handleLogout={handleLogout}
        user={user}
      />
      
      <div className="home-header">
        <h1>Bem-vindo, {user?.nome || user?.name || 'Doador'}!</h1>
        <div className="stats-cards">
          <div className="stat-card">
            <i className="fa-solid fa-hand-holding-heart"></i>
            <div className="stat-info">
              <span className="stat-value">{donations.length}</span>
              <span className="stat-label">Doações realizadas</span>
            </div>
          </div>
          <div className="stat-card">
            <i className="fa-solid fa-brazilian-real-sign"></i>
            <div className="stat-info">
              <span className="stat-value">R$ {totalDonated.toFixed(2)}</span>
              <span className="stat-label">Total doado</span>
            </div>
          </div>
        </div>
      </div>

      <div className="featured-section">
        <h2>Causas em Destaque</h2>
        <div className="categories">
          <button 
            className={`category-tag ${selectedCategory === 'Todos' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('Todos')}
          >
            Todos
          </button>
          <button 
            className={`category-tag ${selectedCategory === 'Saúde' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('Saúde')}
          >
            Saúde
          </button>
          <button 
            className={`category-tag ${selectedCategory === 'Educação' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('Educação')}
          >
            Educação
          </button>
          <button 
            className={`category-tag ${selectedCategory === 'Meio Ambiente' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('Meio Ambiente')}
          >
            Meio Ambiente
          </button>
          <button 
            className={`category-tag ${selectedCategory === 'Animais' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('Animais')}
          >
            Animais
          </button>
          <button 
            className={`category-tag ${selectedCategory === 'Crianças' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('Crianças')}
          >
            Crianças
          </button>
          <button 
            className={`category-tag ${selectedCategory === 'Idosos' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('Idosos')}
          >
            Idosos
          </button>
          <button 
            className={`category-tag ${selectedCategory === 'Cultura' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('Cultura')}
          >
            Cultura
          </button>
          <button 
            className={`category-tag ${selectedCategory === 'Esportes' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('Esportes')}
          >
            Esportes
          </button>
        </div>
      </div>

      <div className="companies-grid">
        {filteredCompanies.map(company => (
          <div key={company.id} className="company-card">
            <div className="company-icon">
              <i className="fa-solid fa-building"></i>
            </div>
            <h3>{company.name}</h3>
            <span className="company-category">{company.category}</span>
            <p className="company-description">{company.description}</p>
            <button
              className="donate-button"
              onClick={() => setSelectedCompany(company)}
            >
              Doar Agora
            </button>
          </div>
        ))}
      </div>

      {selectedCompany && (
        <CompanyModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
          onDonate={handleDonation}
        />
      )}

      {showProfile && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfile(false)}
          setUser={setUser}
        />
      )}

      {showHistory && (
        <HistoryModal
          donations={donations}
          onClose={() => setShowHistory(false)}
        />
      )}

      {showCompanyDonation && (
        <CompanyModal
          company={{ name: 'Nossa Empresa', pix: '11945957447', description: 'Ajude-nos a continuar esse projeto' }}
          onClose={() => setShowCompanyDonation(false)}
          onDonate={handleDonation}
        />
      )}
    </div>
  );
};


export default Home;
