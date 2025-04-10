import React from 'react';
import Leftsidebar from '../Comnponent/Leftsidebar/Leftsidebar';
import Navbar from '../Comnponent/Navbar/navbar';
import Rightsidebar from '../Comnponent/Rightsidebar/Rightsidebar';
import QuestionList from '../Questions/QuestionList';
import './home.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Home() {
  const navigate = useNavigate(); // Initialize useNavigate
  const { t } = useTranslation(); // Initialize translation hook

  // Handle button click
  const handleAskQuestionClick = () => {
    navigate('/dashboard/ask-question'); // Redirect to /ask-question
  };

  return (
    <div className="app-container">
      {/* Welcome Section */}
      <div className="welcome-container">
        <div className="welcome-text">
          <div>
            <h1 className="welcome-heading">{t('Welcome_back', { name: 'Agilesh Vigram' })}</h1>
            <p className="welcome-subtext">
              {t('Find_answers')}
            </p>
          </div>
        </div>
        <button className="ask-button" onClick={handleAskQuestionClick}>
          {t('ask_question')}
        </button>
      </div>

      {/* Content Section */}
      <QuestionList />
    </div>
  );
}

export default Home;
