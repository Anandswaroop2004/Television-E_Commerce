import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail } from 'react-icons/fi';
import { CgSpinner } from 'react-icons/cg';

const ForgotPassword = () => {
  const { forgotPassword, token, toggleTheme, theme } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState('');
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  useEffect(() => {
    if (token) {
      navigate('/home');
    }
  }, [token, navigate]);

  const validateEmail = (emailVal) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(emailVal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors('');

    if (!email) {
      setErrors('Email is required');
      return;
    } else if (!validateEmail(email)) {
      setErrors('Please enter a valid email format');
      return;
    }

    setFormSubmitLoading(true);
    const result = await forgotPassword(email);
    setFormSubmitLoading(false);

    if (result.success) {
      // Navigate to reset password page, passing email
      navigate('/reset-password', { state: { email } });
    }
  };

  return (
    <div className="app-container">
      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme} 
        className="theme-btn" 
        aria-label="Toggle dark/light mode"
      >
        {theme === 'light' ? (
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
        ) : (
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
        )}
      </button>

      <div className="auth-card">
        {/* Logo Section */}
        <div className="brand-section">
          <div className="logo-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="brand-logo">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <path d="M3 6h18"></path>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h2>SalesBasket</h2>
          <p id="brand-tagline">Secure Authentication Portal</p>
        </div>

        {/* Forgot View */}
        <div className="view">
          <h3>Forgot Password</h3>
          <p className="subtitle">Receive a 6-digit OTP code to reset your account password</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label htmlFor="forgot-email">Registered Email</label>
              <div className="input-wrapper">
                <FiMail className="input-icon" size={18} />
                <input 
                  type="email" 
                  id="forgot-email" 
                  placeholder="name@domain.com" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors('');
                  }}
                  required 
                />
              </div>
              <span className="error-msg">{errors}</span>
            </div>

            <button type="submit" className="submit-btn" disabled={formSubmitLoading}>
              {formSubmitLoading ? (
                <CgSpinner className="spinner animate-spin" size={20} />
              ) : (
                <span className="btn-text">Send Reset OTP</span>
              )}
            </button>
          </form>

          <p className="switch-view-text">
            Remember password? <Link to="/login">Go back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
