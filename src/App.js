import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [token, setToken] = React.useState(null);

  const handleLogin = (token) => {
    setToken(token);
    setIsLoggedIn(true);
  };

  return (
      <div className="App">
        <GoogleLogin
        onSuccess={credentialResponse => {
            const decoded = jwtDecode(credentialResponse.credential);
            console.log(decoded);
        }}
        onError={() => {
            console.log('Login Failed');
        }}
        />
      </div>
    );
  }

export default App;