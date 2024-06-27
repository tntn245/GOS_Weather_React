import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "../api/axios.js";

const clientID =
  "198859900939-5p29gi0fanquhrl4pmd23vh6v7b56fbt.apps.googleusercontent.com";
const clientSecret = "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";

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setMessage(data.message); // Thông báo đăng nhập thành công
        navigate('/dashboard')
        // Thực hiện hành động sau khi đăng nhập thành công (ví dụ: chuyển hướng trang)
      } else {
        setMessage(data.message); // Thông báo lỗi đăng nhập
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
        .post("http://localhost:5000/google-login")
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  return (
    <div>
    <form onSubmit={handleLogin}>
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
      {message && <p>{message}</p>}

      <GoogleOAuthProvider clientId="826103606588-eqe5jffn43d1ge68f63bcnr1dld44lun.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </GoogleOAuthProvider>
    </div>
  );
}

export default Login;
