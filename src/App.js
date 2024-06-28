import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import PrivateRoute from './route/PrivateRoute';
import PublicRoute from './route/PublicRoute';
import './App.css';

function App() {
  const navigate = useNavigate();
  const [userID, setUserID] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
          setUserID(decodedToken.sub); // Lấy user ID từ JWT
          navigate('/dashboard');
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Token decoding error:', error);
        localStorage.removeItem('token');
      }
    }
  }, [navigate]);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login onLogin={handleLogin} />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard userID={userID} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
