import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";    
import { io } from "socket.io-client";
import LoginPage from "./Pages/Auth/LoginPage";
import SignUpPage from "./Pages/Auth/SignUpPage";
import Home from "./Pages/home/home";
import QuestionListHome from "./Pages/questionListHome/questionListHome";
import Layout from "./Layout/Layout";
import TagsPage from "./Pages/Tag/Tag";
import AskQuestion from "./Pages/ask-question/ask-question";
import QuestionDetail from "./Pages/question-details/question_details"; // Import your question detail component
import Profile from "./Profile";
import AccountSettings from "./AccountSettings"; 
import AuthPage from "./space/AuthPage.js"
import Dashboard from "./space/Dashboard.js";
import QuestionsList from "./space/QuestionsList.js";
import SpaceQuestionDetail from "./space/QuestionDetail.js";


const showNotification = (title, message) => {
  if (Notification.permission === "granted") {
    new Notification(title, { body: message, icon: "/favicon.ico" });
  }
};

function App() {
  
  useEffect(() => {
    // Request permission for notifications
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    // Connect to the Socket.IO server
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("User connected:", socket.id);
    });

    // Listen for test event
    socket.on("test-notification", (data) => {
      if (Notification.permission === "granted") {
        new Notification("Test Notification", { body: data.message });
      }
    });
    const userId = "user123"; // Replace with real user ID from auth
    socket.emit("register", userId);

    // Listen for answer notification
    socket.on("new-answer", (data) => {
      showNotification("New Answer!", data.message);
    });

    // Listen for upvote notification
    socket.on("new-upvote", (data) => {
      showNotification("New Upvote!", data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  

  return (
    <Router>
      <Routes>
        {/* Authentication Pages */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Main Layout Pages */}
        <Route path="/dashboard/*" element={<Layout />}>
          <Route path="questions" element={<QuestionListHome />} />
          <Route path="home" element={<Home />} />
          <Route path="tags" element={<TagsPage />} />
          <Route path="ask-question" element={<AskQuestion />} />
          <Route path="questions/:id_no" element={<QuestionDetail />} />
          <Route path="profile" element={<Profile />} /> // ✅ Fixed

        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        <Route path="/signup1" element={<AuthPage isLogin={false} />} />
        <Route path="/login" element={<AuthPage isLogin={true} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/person_question" element={<QuestionsList />} />
         <Route path="/question/:id" element={<SpaceQuestionDetail/>} />
      </Routes>
    </Router>
  );
}

export default App;