import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "../api/axios.js";
import "../style/Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://weatherweb-1s99.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        onLogin(data.access_token);
        navigate('/dashboard')
      } else {
        setMessage(data.message);
      }

    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    }
  };
  
  const handleGoogleLoginSuccess = (credentialResponse) => {
    const token = credentialResponse?.credential;
    if (token) {
      axios
        .post("https://weatherweb-1s99.onrender.com/google-login", { token })
        .then((response) => {
          const jwtToken = response.data.access_token;
          onLogin(jwtToken);  // Lưu JWT vào localStorage
          navigate('/dashboard');
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  return (
    <div className="login-container">
    <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <Link to="/register">Register</Link>

      <div>
       <p>{message}</p>
       </div>

      {/* <GoogleOAuthProvider clientId="826103606588-eqe5jffn43d1ge68f63bcnr1dld44lun.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </GoogleOAuthProvider> */}
    </div>
  );
}

export default Login;
