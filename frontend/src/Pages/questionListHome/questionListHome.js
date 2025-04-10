import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionList from '../Questions/QuestionList';
import { useTranslation } from 'react-i18next';
import './questionListHome.css'; // CSS file for layout

function QuestionListHome() {
  const { t } = useTranslation();
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle button click
  const handleAskQuestionClick = () => {
    navigate('/dashboard/ask-question'); // Use an absolute path
  };

  return (
    <div className="app-container">
      <div className="container">
        <h1 className="heading">{t('newest_questions')}</h1>
        <button className="ask-button" onClick={handleAskQuestionClick}>
          {t('ask_question')}
        </button>
      </div>

      <div className="content-container">
        <main className="main-content">
          {/* Main content area */}
          <QuestionList />
        </main>
      </div>
    </div>
  );
}

export default QuestionListHome;
