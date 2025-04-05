import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Questions.css';

const QuestionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [answerText, setAnswerText] = useState('');


console.log("Received ID from params:", id);


    useEffect(() => {
        
        fetch(`http://localhost:5000/questions1`)
            .then(res => res.json())
            .then(data => {
                console.log('Fetched data:', data); // ✅ Optional: log all questions
            const foundQuestion = data.find(q => q._id === id);
            console.log('Found Question:', foundQuestion); // ✅ Log the found question
            setQuestion(foundQuestion);
            });
    }, [id]);

    const answerQuestion = () => {
        fetch('http://localhost:5000/answer-question1', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questionId: id, text: answerText })
        }).then(() => window.location.reload());
    };

    if (!question) {
        return <p>Loading...</p>;
    }

    return (
        <div className="question-detail-container">
            <button className="back-button" onClick={() => navigate('/')}>← Back</button>
            <h2 className="question-title">{question.text}</h2>

            {/* ✅ Display YouTube videos using <iframe> */}
            {question.videoUrl && (
                question.videoUrl.includes("youtube.com") ? (
                    <iframe 
                        width="300" 
                        height="200" 
                        src={question.videoUrl} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                ) : (
                    <video src={question.videoUrl} controls width="300" className="video-player" />
                )
            )}

            <h4 className="question-meta">Answers:</h4>
            {question.answers.map((a, index) => (
                <p key={index} className="answer-content">{a.text}</p>
            ))}

            <div className="add-answer">
                <input
                    type="text"
                    placeholder="Write an answer"
                    className="answer-textbox"
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                />
                <button className="submit-button" onClick={answerQuestion}>Answer</button>
            </div>
        </div>
    );
};

export default QuestionDetail;
