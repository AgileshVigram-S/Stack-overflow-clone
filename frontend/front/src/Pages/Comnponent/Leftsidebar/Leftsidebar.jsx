import React from 'react';
import './Leftsidebar.css';
import { NavLink } from 'react-router-dom';
import Globe from "../../assets/Globe.svg";
import { useTranslation } from 'react-i18next';

const Leftsidebar = ({ slidein }) => {
  const { t } = useTranslation(); // Access translations

  const slideinstyle = {
    transform: "translateX(0%)",
  };
  const slideoutstyle = {
    transform: "translateX(-100%)",
  };

  // Helper function for active link styling (React Router v6+)
  const getActiveClass = ({ isActive }) =>
    isActive ? "side-nav-links active" : "side-nav-links";

  return (
    <div className="left-sidebar" style={slidein ? slideinstyle : slideoutstyle}>
      <nav className="side-nav">
        <button className="nav-btnn">
          <NavLink to="/dashboard/home" className={getActiveClass}>
            <p>{t('home')}</p>
          </NavLink>
        </button>

        <div className="side-nav-div">
          <button className="nav-btnn">
            <NavLink to="/dashboard/profile" className={getActiveClass} >
            <p>{t('Profile')}</p>
              {/* <p>Profile</p> */}
            </NavLink>
          </button>

          <button className="nav-btnn">
            <NavLink to="/dashboard/questions" className={getActiveClass}>
              <img src={Globe} alt="globe" />
              <p style={{ paddingLeft: '10px' }}>{t('questions')}</p>
            </NavLink>
          </button>

          <button className="nav-btnn">
            <NavLink to="/dashboard/tags" className={getActiveClass} style={{ paddingLeft: "40px" }}>
              <p>{t("tagss")}</p>
            </NavLink>
          </button>

          {/* <button className="nav-btnn">
            <NavLink to="/Users" className={getActiveClass} style={{ paddingLeft: "40px" }}>
              <p>{t('users')}</p>
            </NavLink>
          </button> */}

          <button className="nav-btnn">
            <NavLink to="/signup1" className={getActiveClass} style={{ paddingLeft: "40px" }}>
              <p>{t('Public')}</p>
            </NavLink>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Leftsidebar;
