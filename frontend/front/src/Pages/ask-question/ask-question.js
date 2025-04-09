import React, { useState } from 'react';
import './ask-question.css';
import { useTranslation } from 'react-i18next';

const AskQuestion = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [attempts, setAttempts] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title,
      details,
      attempts,
      tags: tags.split(',').map((tag) => tag.trim()), // Split tags by comma
    };

    try {
      const response = await fetch('https://stack-overflow-clone-guxa.onrender.com/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        alert(t('success_message')); // Translated success message
        // Reset the form fields
        setTitle('');
        setDetails('');
        setAttempts('');
        setTags('');
      } else {
        alert(result.message || t('error_message'));
      }
    } catch (error) {
      console.error('Error submitting the question:', error);
      alert(t('error_message'));
    }
  };

  return (
    <div className="ask-question-container">
      <div className="header">
        <h1>{t('ask_question')}</h1>
      </div>
      <div className="guide">
        <h2>{t('writing_good_question')}</h2>
        <p>{t('question_guide_intro')}</p>
        <p>{t('non_programming_question')}</p>
        <div className="steps">
          <h3>{t('steps')}</h3>
          <ul>
            <li>{t('step_one')}</li>
            <li>{t('step_two')}</li>
            <li>{t('step_three')}</li>
            <li>{t('step_four')}</li>
            <li>{t('step_five')}</li>
          </ul>
        </div>
      </div>

      <form className="question-form" onSubmit={handleSubmit}>
        {/* Title Input */}
        <div className="form-group">
          <label htmlFor="title">{t('title')}</label>
          <p>{t('title_description')}</p>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('title_placeholder')}
            required
          />
        </div>

        {/* Details Input */}
        <div className="form-group">
          <label htmlFor="details">{t('details_label')}</label>
          <p>{t('details_description')}</p>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows="6"
            placeholder={t('details_placeholder')}
            required
            minLength={20}
          />
        </div>

        {/* Attempts Input */}
        <div className="form-group">
          <label htmlFor="attempts">{t('attempts_label')}</label>
          <p>{t('attempts_description')}</p>
          <textarea
            id="attempts"
            value={attempts}
            onChange={(e) => setAttempts(e.target.value)}
            rows="6"
            placeholder={t('attempts_placeholder')}
            required
            minLength={20}
          />
        </div>

        {/* Tags Input */}
        <div className="form-group">
          <label htmlFor="tags">{t('tags_label')}</label>
          <p>{t('tags_description')}</p>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder={t('tags_placeholder')}
            required
          />
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="btn primary">
            {t('submit_question')}
          </button>
          <button
            type="button"
            className="btn secondary"
            onClick={() => {
              setTitle('');
              setDetails('');
              setAttempts('');
              setTags('');
            }}
          >
            {t('discard_draft')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AskQuestion;
