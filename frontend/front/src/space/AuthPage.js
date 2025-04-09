import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from 'react-router-dom';

import "./AuthPage.css";

const AuthPage = ({ isLogin }) => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleGoToProfile = () => {
    navigate("/login");
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password || (!isLogin && !formData.username)) {
      setError("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      const url = isLogin ? "https://stack-overflow-clone-guxa.onrender.com/api/auth/login" : "https://stack-overflow-clone-guxa.onrender.com/api/auth1/signup";
      
      const response = await axios.post(url, formData);

      if (isLogin) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        setSuccess("✅ Signup successful! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
          )}
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <br></br>
      <div  style={{
    display:"flex",
    justifyContent:"center",
  }}>
<p className="text-gray-400 text-sm mt-4 text-center">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link to={isLogin ? "/signup1" : "/login"} className="text-blue-400 hover:underline">
            {isLogin ? "Sign Up" : "Login"}
          </Link>
        </p>
      </div>
      </div>
     
    </div>
  );
};

export default AuthPage;
