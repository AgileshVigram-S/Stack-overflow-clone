import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Questions.css';

const QuestionsList = () => {
    const [questions, setQuestions] = useState([]);
    const [text, setText] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://stack-overflow-clone-guxa.onrender.com/questions1')
            .then(res => res.json())
            .then(data => setQuestions(data));
    }, []);

    const askQuestion = () => {
        fetch('https://stack-overflow-clone-guxa.onrender.com/ask-question1', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, videoUrl })
        }).then(() => window.location.reload());
    };

    return (
        <div className="question-detail-container">
            <div className="question-header">
                <h2 className="question-title">Ask a Question</h2>
                <input
                    type="text"
                    placeholder="Enter your question"
                    className="question-textbox"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Video URL (optional)"
                    className="question-textbox"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                />
                <button className="submit-button" onClick={askQuestion}>Ask</button>
            </div>

            <div className="answers-section">
                <h2>Questions</h2>
                {questions.map(q => (
                    <div key={q._id} className="answer-card" onClick={() => {
                        console.log("Navigating to question with ID:", q._id); // ✅
                        navigate(`/question/${q._id}`);
                    }}>
                        <h3 className="question-description">{q.text}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionsList;
