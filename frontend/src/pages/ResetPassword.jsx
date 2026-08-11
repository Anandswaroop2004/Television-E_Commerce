import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { CgSpinner } from 'react-icons/cg';

const ResetPassword = () => {
  const { resetPassword, token, toggleTheme, theme, showToast } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [strength, setStrength] = useState({ percent: 0, label: 'Password Strength', color: 'var(--text-muted)' });

  // Retrieve email from state
  useEffect(() => {
    if (token) {
      navigate('/home');
      return;
    }

    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      showToast('Enter your email and reset OTP to reset password', 'info');
    }
  }, [location.state, token, navigate]);

  // Update password strength
  useEffect(() => {
    setStrength(getPasswordStrength(newPassword));
  }, [newPassword]);

  const getPasswordStrength = (pwd) => {
    if (!pwd) {
      return { percent: 0, label: 'Password Strength', color: 'var(--text-muted)' };
    }

    let score = 0;
    const hasMinLength = pwd.length >= 8;
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasDigit = /[0-9]/.test(pwd);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(pwd);

    if (hasMinLength) score += 1;
    if (hasUpperCase && hasLowerCase) score += 1;
    if (hasDigit) score += 1;
    if (hasSpecialChar) score += 1;

    if (pwd.length < 8) {
      return { percent: 25, label: 'Too Weak (Min. 8 chars)', color: 'var(--error)' };
    }

    switch (score) {
      case 1:
      case 2:
        return { percent: 50, label: 'Weak', color: 'var(--error)' };
      case 3:
        return { percent: 75, label: 'Medium', color: '#f59e0b' }; // Orange
      case 4:
        return { percent: 100, label: 'Strong', color: 'var(--success)' };
      default:
        return { percent: 0, label: 'Password Strength', color: 'var(--text-muted)' };
    }
  };

  const handleInputChange = (field, value) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
    switch (field) {
      case 'otp':
        if (/^\d*$/.test(value) && value.length <= 6) {
          setOtp(value);
        }
        break;
      case 'newPassword':
        setNewPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrors = {
      otp: '',
      newPassword: '',
      confirmPassword: '',
    };

    if (!otp || !/^[0-9]{6}$/.test(otp)) {
      newErrors.otp = 'Please enter the 6-digit OTP code';
      hasErrors = true;
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
      hasErrors = true;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
      hasErrors = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm the password';
      hasErrors = true;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setFormSubmitLoading(true);
    const result = await resetPassword(email, otp, newPassword, confirmPassword);
    setFormSubmitLoading(false);

    if (result.success) {
      navigate('/login');
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

      <div className="auth-card" style={{ marginTop: '20px', marginBottom: '20px' }}>
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

        {/* Reset View */}
        <div className="view">
          <h3>Reset Password</h3>
          <p className="subtitle">Create a strong new password for your account</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label htmlFor="reset-email">Email Address</label>
              <div className="input-wrapper">
                <FiMail className="input-icon" size={18} />
                <input 
                  type="email" 
                  id="reset-email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="reset-otp">6-Digit Reset OTP</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" size={18} />
                <input 
                  type="text" 
                  id="reset-otp" 
                  placeholder="Enter OTP code" 
                  value={otp}
                  onChange={(e) => handleInputChange('otp', e.target.value)}
                  maxLength={6} 
                  required 
                />
              </div>
              <span className="error-msg">{errors.otp}</span>
            </div>

            <div className="input-group">
              <label htmlFor="reset-new-password">New Password</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  id="reset-new-password" 
                  placeholder="Min. 8 characters" 
                  value={newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="pwd-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              
              {/* Strength meter for reset */}
              <div className="strength-meter">
                <div className="meter-bar">
                  <div 
                    className="fill" 
                    style={{ 
                      width: `${strength.percent}%`,
                      backgroundColor: strength.color 
                    }}
                  ></div>
                </div>
                <span 
                  className="strength-label" 
                  style={{ color: strength.color }}
                >
                  {strength.label}
                </span>
              </div>
              <span className="error-msg">{errors.newPassword}</span>
            </div>

            <div className="input-group">
              <label htmlFor="reset-confirm">Confirm New Password</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" size={18} />
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  id="reset-confirm" 
                  placeholder="Match new password" 
                  value={confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="pwd-toggle" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              <span className="error-msg">{errors.confirmPassword}</span>
            </div>

            <button type="submit" className="submit-btn" disabled={formSubmitLoading}>
              {formSubmitLoading ? (
                <CgSpinner className="spinner animate-spin" size={20} />
              ) : (
                <span className="btn-text">Reset Password</span>
              )}
            </button>
          </form>

          <p className="switch-view-text">
            Go back to <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
