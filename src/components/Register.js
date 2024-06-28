import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import ClipLoader from "react-spinners/ClipLoader";
import "../style/Register.css";

function Register() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true); // State để kiểm tra mật khẩu khớp nhau

  const [message, setMessage] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [OTPSent, setOTPSent] = useState("");
  const [OTPInput, setOTPInput] = useState("");

  const navigate = useNavigate();

  const handleConfirmPasswordChange = (e) => {
    const confirmPwd = e.target.value;
    setConfirmPassword(confirmPwd);
    setPasswordMatch(password === confirmPwd);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setOTPInput("");
    setMessage("");
    setShowOTPInput(false);
    setLoading(true);

    if (!passwordMatch) {
      return;
    }

    try {
      const response = await fetch(
        "https://weatherweb-1s99.onrender.com/checkEmail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      // setMessage(data.message);
      setOTPSent(data.otp);
      if (response.status === 200) {
        setShowOTPInput(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://weatherweb-1s99.onrender.com/verifyOTP",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, OTPSent, OTPInput }),
        }
      );

      const data = await response.json();
      setMessage(data.message);
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNavLogin = () => {
    navigate("/");
  };

  return (
    <div className="register-container">
      <div className="card">
        <form onSubmit={handleRegister} className="register-form">
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
            style={{ borderColor: passwordMatch ? "" : "red" }}
          />
          <button type="submit">Register</button>

          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords do not match.</p>
          )}

          {message && <p>{message}</p>}

          {showOTPInput && (
            <div className="otp-container">
              <p>OTP sent to your email!</p>
              <input
                className="otp-input"
                type="text"
                placeholder="Enter OTP"
                value={OTPInput}
                onChange={(e) => setOTPInput(e.target.value)}
                required
              />
              <button onClick={handleVerifyOTP} className="otp-button">
                Verify OTP
              </button>
            </div>
          )}
        </form>

        <div className="divider">
          <span className="divider-text">No account?</span>
        </div>
        <button className="another-button" onClick={handleNavLogin}>
          Back to Login
        </button>
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
        <div
          className="loader-container"
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

export default Register;
