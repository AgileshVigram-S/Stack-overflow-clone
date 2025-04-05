// src/Pages/Component/Navbar/navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import bars from '../../assets/bars-solid.svg';
import logo from '../../assets/logo.png';
import search from '../../assets/search-solid.svg';
import './navbar.css';

function Navbar({ handleslidein }) {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <nav className="main-nav">
      <div className="navbar">
        <button className="slide-in-icon" onClick={handleslidein}>
          <img src={bars} alt="bars" width="15" />
        </button>
        <div className="navbar-1">
          <Link to="/" className="nav-item nav-logo">
            <img src={logo} alt="logo" />
          </Link>
          <Link to="/" className="nav-item nav-btn res-nav">{t('about')}</Link>
          <Link to="/" className="nav-item nav-btn res-nav">{t('products')}</Link>
          <Link to="/" className="nav-item nav-btn res-nav">{t('teams')}</Link>
          {/* <Link to="/account-settings">Profile</Link> */}


          <form>
            <input type="text" placeholder={t('search')} />
            <img src={search} alt="search" width="18" className="search-icon" />
          </form>
        </div>

        {/* Language Switcher */}
        <select value={language} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
          <option value="hi">हिंदी</option>
          <option value="pt">Português</option>
          <option value="zh">中文</option>
        </select>

        <div className="navbar-2">
          <Link to="/" className="nav-item nav-links">{t('loginn')}</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
