import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "../api/axios.js";

const clientID =
  "198859900939-5p29gi0fanquhrl4pmd23vh6v7b56fbt.apps.googleusercontent.com";
const clientSecret = "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";

function Login({ onLogin }) {
  const navigate = useNavigate();

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
