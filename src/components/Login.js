import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Modal from "react-modal";
import ClipLoader from "react-spinners/ClipLoader";
import { jwtDecode } from 'jwt-decode';
import "../style/Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://weatherweb-1s99.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        onLogin(data.access_token);
        navigate("/dashboard");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleNavRegister = () => {
    navigate("/register");
  };

  const handleGoogleLoginSuccess = async(response) => {
    var obj = jwtDecode(response.credential);    
    var email = obj.email;
    
    if (email) {
      try {
        const response = await fetch(
          "https://weatherweb-1s99.onrender.com/google-login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, obj }),
          }
        );

        const data = await response.json();

        if (response.status === 200) {
          onLogin(data.access_token);
          navigate("/dashboard");
        } else {
          setMessage(data.message);
        }
      }
      catch (error) {
        console.error("Error:", error);
        setMessage("An error occurred. Please try again.");
      }
    } 
  };

  return (
    <div className="login-container">
      <div className="card">
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

        <p>{message}</p>

        <div className="divider">
          <span className="divider-text">No account?</span>
        </div>
        <button className="another-button" onClick={handleNavRegister}>
          Register
        </button>

        <GoogleOAuthProvider clientId="826103606588-eqe5jffn43d1ge68f63bcnr1dld44lun.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </GoogleOAuthProvider> 
      
      </div>
      
      {/* Must write inner! */}
      <Modal
        isOpen={loading}
        onRequestClose={() => setLoading(false)}
        contentLabel="Loading Modal"
        className="loading-modal"
        style={{
          position: "relative",
        }}
      >
        <div className="loader-container"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <ClipLoader
            color={"#5372F0"}
            loading={loading}
            cssOverride={{
              display: "block",
              margin: "0 auto",
            }}
            size={100}
            aria-label="Loading Spinner"
          />
        </div>
      </Modal>
    </div>
  );
}

export default Login;
