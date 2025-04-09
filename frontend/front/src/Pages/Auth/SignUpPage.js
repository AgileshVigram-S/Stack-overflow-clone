
import { Link } from "react-router-dom";
import "../Auth/Auth.css";
import React, { useState } from 'react';
import axios from 'axios';
function SignUpPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Use the correct endpoint for sign-up
            const response = await axios.post('https://stack-overflow-clone-guxa.onrender.com/api/auth/signup', formData);
            alert(response.data.message); // Success message from the backend
        } catch (err) {
            // Handle errors gracefully
            const errorMessage = err.response?.data?.message || 'An unexpected error occurred';
            alert(errorMessage);
            console.error(err); // Log the error for debugging
        }
    };
  return (
    <section className="auth-section">
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
            <h4>Username</h4>
            <input  type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required />
          </label>
          <label>
            <h4>Email</h4>
            <input  type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required />
          </label>
          <label>
            <h4>Password</h4>
            <input 
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required/>
          </label>
          <button type="submit" className="auth-btn">
            Sign up
          </button>
          <p>
            Already have an account?{" "}
            <Link to="/" className="handle-switch-btn">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default SignUpPage;
