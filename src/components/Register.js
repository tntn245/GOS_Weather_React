import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true); // State để kiểm tra mật khẩu khớp nhau

  const [message, setMessage] = useState('');
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [OTPSent, setOTPSent] = useState('');
  const [OTPInput, setOTPInput] = useState('');

  const navigate = useNavigate();

  const handleConfirmPasswordChange = (e) => {
    const confirmPwd = e.target.value;
    setConfirmPassword(confirmPwd);
    setPasswordMatch(password === confirmPwd);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setOTPInput('');
    setMessage('');
    setShowOTPInput(false); 

    if (!passwordMatch) {
        return;
      }
  
    try {
      const response = await fetch('https://weatherweb-1s99.onrender.com/checkEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message);
      setOTPSent(data.otp);
      if (response.status === 200) {
        setShowOTPInput(true); 
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await fetch('https://weatherweb-1s99.onrender.com/verifyOTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, OTPSent, OTPInput }),
      });

      const data = await response.json();
      setMessage(data.message);
      navigate('/')
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleRegister}>
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
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
          style={{ borderColor: passwordMatch ? 'black' : 'red' }} 
        />
        <button type="submit">Register</button>
      </form>
      {!passwordMatch && <p style={{ color: 'red' }}>Passwords do not match.</p>}
      {message && <p>{message}</p>}
      
      {/* Hiển thị OTP input nếu gửi OTP thành công */}
      {showOTPInput && (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={OTPInput}
            onChange={(e) => setOTPInput(e.target.value)}
            required
          />
          <button onClick={handleVerifyOTP}>Verify OTP</button>
        </div>
      )}
    </div>
  );
}

export default Register;
