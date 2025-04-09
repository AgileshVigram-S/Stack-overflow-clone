import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './question_details.css';

const QuestionDetail = () => {
  const { id_no } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAnswer, setNewAnswer] = useState('');

  // Fetch question details from the backend
  useEffect(() => {
    if (!id_no) {
      setError(t('questionDetail.invalidId'));
      setLoading(false);
      return;
    }

    const fetchQuestion = async () => {
      try {
        const response = await fetch(`https://stack-overflow-clone-guxa.onrender.com/api/questions/${id_no}`);
        if (response.ok) {
          const data = await response.json();
          setQuestion(data);
        } else {
          setError(t('questionDetail.fetchError'));
        }
      } catch (err) {
        setError(t('questionDetail.fetchError'));
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id_no, t]);

  // Handle the answer submission
  const handleAnswerSubmit = async () => {
    if (newAnswer.trim()) {
      try {
        const response = await fetch(`https://stack-overflow-clone-guxa.onrender.com/api/questions/${id_no}/answers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: newAnswer, author: 'Anonymous' }),
        });

        if (response.ok) {
          const updatedQuestion = await response.json();
          setQuestion(updatedQuestion); // Update the question with the new answer
          setNewAnswer('');
          alert(t('questionDetail.answerSuccess'));
        } else {
          alert(t('questionDetail.answerError'));
        }
      } catch (err) {
        alert(t('questionDetail.submitError'));
      }
    } else {
      alert(t('questionDetail.emptyAnswer'));
    }
  };

  // Loading state
  if (loading) return <div className="loading">{t('common.loading')}</div>;

  // Error state
  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="back-button">
          {t('common.goBack')}
        </button>
      </div>
    );
  }

  // If the question is not found, show an error
  if (!question) {
    return (
      <div className="error">
        <p>{t('questionDetail.notFound')}</p>
        <button onClick={() => navigate(-1)} className="back-button">
          {t('common.goBack')}
        </button>
      </div>
    );
  }

  // Render the question details
  return (
    <div className="question-detail-container">
      <div className="question-header">
        <p className="question-id">{t('questionDetail.questionId')}: {id_no}</p>
        <h1 className="question-title">{question.title}</h1>
        <p className="question-description">{question.details}</p>
        <div className="question-tags">
          {question.tags && question.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="answers-section">
        <h2>{t('questionDetail.answersTitle')}</h2>
        {question.answers && question.answers.length > 0 ? (
          question.answers.map((answer, index) => (
            <div key={index} className="answer-card">
              <p className="answer-content">{answer.content}</p>
              <div className="answer-meta">
                <span className="author">{answer.author}</span>
                <span className="time">{new Date(answer.time).toLocaleString()}</span>
              </div>
            </div>
          ))
        ) : (
          <p>{t('questionDetail.noAnswers')}</p>
        )}
      </div>
      <div className="add-answer">
        <h3>{t('questionDetail.yourAnswer')}</h3>
        <textarea
          placeholder={t('questionDetail.answerPlaceholder')}
          className="answer-textbox"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
        ></textarea>
        <button className="submit-button" onClick={handleAnswerSubmit}>
          {t('questionDetail.submitButton')}
        </button>
      </div>
    </div>
  );
};

export default QuestionDetail;
