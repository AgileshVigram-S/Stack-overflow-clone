import { Link, useNavigate } from "react-router-dom";
import "../Auth/Auth.css";
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from "../Comnponent/Navbar/navbar";
import { GoogleLogin } from '@react-oauth/google';
import { useTranslation } from "react-i18next";


function LoginPage() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await axios.post('https://stack-overflow-clone-jade.vercel.app/api/auth/login', formData);
            alert(response.data.message);
            navigate('/dashboard/home');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An unexpected error occurred';
            setError(errorMessage);
            console.error(err);
        }
    };

    // const handleGoogleLoginSuccess = async (response) => {
    //     try {
    //         console.log("Google login response:", response);
            
    //         const { data } = await axios.post('http://localhost:5000/api/auth/google', {
    //             token: response.credential,
    //         });
    
    //         console.log("Server response:", data);
    //         navigate('/dashboard');
    //     } catch (error) {
    //         console.error("Google login error: ", error);
    //     }
    // };
    

    return (
        <section className="auth-section">
            <Navbar />
            <div className="auth-container-1">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/02/Stack_Overflow_logo.svg"
                    alt="Stack Overflow Logo"
                    className="login-logo"
                />
            </div>
            <div className="auth-container-2">
                <form onSubmit={handleSubmit}>
                    <label>
                    <h4>{t("login.email")}</h4>
                        <input
                            type="email"
                            name="email"
                            placeholder={t("login.email")}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                    <h4>{t("login.password")}</h4>
                        <input
                            type="password"
                            name="password"
                            placeholder={t("login.password")}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="auth-btn">
                    {t("login.title")}
                    </button>
                    <br></br>

                    {/* Google Login Button */}
                    {/* <button type="button" className="google-btn" onClick={handleGoogleLoginSuccess}>
                        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" width="20" />
                        Login with Google
                    </button> */}
                    <GoogleLogin
  onSuccess={async (response) => {
    console.log("Google login successful", response);

    // Ensure you pass the ID token
    const token = response.credential;
    if (!token) {
      console.error("Google token missing");
      return;
    }

    try {
      const { data } = await axios.post("https://stack-overflow-clone-jade.vercel.app/api/auth/google", {
        token: token, // Send the correct token
      });

      console.log("Server response:", data);
      alert(t("login.googleSuccess"));
      navigate("/dashboard/home");
    } catch (error) {
      console.error("Google login error: ", error.response?.data || error);
    }
  }}
  onError={() => {
    alert(t("login.googleError"));
    console.error("Google login failed");
  }}
/>
                </form>
                


                <p>
                {t("login.noAccount")}{" "}
                    <Link to="/signup" className="handle-switch-btn">
                    {t("login.signup")}
                    </Link>
                </p>
            </div>
        </section>
    );
}

export default LoginPage;
