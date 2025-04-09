import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuestionList.css';
import { useTranslation } from 'react-i18next';

const QuestionList = () => {
  const { t } = useTranslation(); // Import translation hook
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('https://stack-overflow-clone-kpa7.vercel.app/api/questions');
        if (response.ok) {
          const data = await response.json();
          setQuestions(data);
        } else {
          console.error(t('error.fetchFail'));
        }
      } catch (error) {
        console.error(t('error.fetchError'), error);
      }
    };

    fetchQuestions();
  }, [t]);

  const handleQuestionClick = (id_no) => {
    navigate(`/dashboard/questions/${id_no}`);
  };

  return (
    <div className="question-list-container">

      <div className="questions">
        {questions.map((question) => (
          <div
            key={question.id_no}
            className="question-card"
            onClick={() => handleQuestionClick(question.id_no)}
          >
            <div className="question-stats">
              <div className="stat">{`${question.votes || 0} ${t('votes')}`}</div>
              <div
                className={`stat ${
                  question.answers && question.answers.length > 0 ? 'highlight' : ''
                }`}
              >
                {`${question.answers?.length || 0} ${t('answers')}`}
              </div>
              <div className="stat">{`${question.views || 0} ${t('views')}`}</div>
            </div>

            <div className="question-details">
              <h3 className="question-title">{question.title}</h3>
              <p className="question-description">{question.details}</p>

              <div className="question-tags">
                {question.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="question-meta">
                <span className="author">{question.author || t('questions.anonymous')}</span>
                <span className="time">{question.time || t('questions.unknownTime')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
