import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <GoogleOAuthProvider clientId="826103606588-eqe5jffn43d1ge68f63bcnr1dld44lun.apps.googleusercontent.com">
        <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
reportWebVitals();
