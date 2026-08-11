import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiUserPlus } from 'react-icons/fi';
import { CgSpinner } from 'react-icons/cg';

const Register = () => {
  const { register, token, toggleTheme, theme } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [strength, setStrength] = useState({ percent: 0, label: 'Password Strength', color: 'var(--text-muted)' });

  // Auto-redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate('/home');
    }
  }, [token, navigate]);

  // Update password strength meter as password changes
  useEffect(() => {
    setStrength(getPasswordStrength(password));
  }, [password]);

  const validateEmail = (emailVal) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(emailVal);
  };

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
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
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
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!username.trim()) {
      newErrors.username = 'Username is required';
      hasErrors = true;
    }

    if (!email.trim()) {
      newErrors.email = 'Email Address is required';
      hasErrors = true;
    } else if (!validateEmail(email.trim())) {
      newErrors.email = 'Please provide a valid email format';
      hasErrors = true;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      hasErrors = true;
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
      hasErrors = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      hasErrors = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setFormSubmitLoading(true);
    const result = await register(username, email, password, confirmPassword);
    setFormSubmitLoading(false);

    if (result.success) {
      navigate('/verify', { state: { email } });
    } else if (result.errors) {
      // Map API errors back to validation fields
      const apiErrors = {};
      Object.keys(result.errors).forEach(field => {
        apiErrors[field] = result.errors[field];
      });
      setErrors(prev => ({ ...prev, ...apiErrors }));
    }
  };

  return (
    <div className="app-container user-login-split-page">
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

      <div className="login-content-wrapper spec-split-card register-card-new">
        {/* Left Graphics Panel */}
        <div className="login-card-left-new">
          <div className="brand-section-left">
            <div className="logo-box-mini">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="brand-logo-mini">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </div>
            <div className="brand-text-block">
              <h2>Brain Bytes</h2>
              <p>Secure Authentication Portal</p>
            </div>
          </div>

          <div className="left-main-content-new">
            <div className="left-text-column-new">
              <h1 className="slogan-title-new">
                Smart Shopping.<br />
                <span className="dark-text-new">Secure Experience.</span>
              </h1>
              <p className="slogan-desc-new">
                Create your account and enjoy a personalized shopping experience with complete security.
              </p>

              <div className="features-list-new">
                <div className="feature-item-new">
                  <div className="feature-icon-wrapper-new blue-bg-item">
                    <FiShield size={20} />
                  </div>
                  <div className="feature-text-new">
                    <h4>Secure & Protected</h4>
                    <p>Your data is encrypted and safe.</p>
                  </div>
                </div>

                <div className="feature-item-new">
                  <div className="feature-icon-wrapper-new purple-bg-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                    </svg>
                  </div>
                  <div className="feature-text-new">
                    <h4>Fast & Easy</h4>
                    <p>Quick registration in just a few steps.</p>
                  </div>
                </div>

                <div className="feature-item-new">
                  <div className="feature-icon-wrapper-new indigo-bg-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                  </div>
                  <div className="feature-text-new">
                    <h4>Reliable Platform</h4>
                    <p>Trusted by thousands of happy customers.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="left-image-column-new">
              <div className="blob-background-new"></div>
              <div className="dotted-grid-new dots-top-right-new"></div>
              <div className="dotted-grid-new dots-bottom-left-new"></div>
              <img src="/shopping_3d_tv.jpg" alt="BrainBytes 3D Store Illustration" className="illustration-img-new" />
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="login-card-right-new">
          <h3 className="right-title-new">Create Account</h3>
          <p className="right-subtitle-new">Join us and experience modern shopping</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group-new">
              <label htmlFor="register-username">Username</label>
              <div className="input-wrapper-new">
                <FiUser className="input-icon-new" size={18} />
                <input 
                  type="text" 
                  id="register-username" 
                  placeholder="Enter your username" 
                  value={username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required 
                />
              </div>
              {errors.username && <span className="error-msg-new">{errors.username}</span>}
            </div>

            <div className="input-group-new">
              <label htmlFor="register-email">Email Address</label>
              <div className="input-wrapper-new">
                <FiMail className="input-icon-new" size={18} />
                <input 
                  type="email" 
                  id="register-email" 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required 
                />
              </div>
              {errors.email && <span className="error-msg-new">{errors.email}</span>}
            </div>

            <div className="input-group-new">
              <label htmlFor="register-password">Password</label>
              <div className="input-wrapper-new">
                <FiLock className="input-icon-new" size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  id="register-password" 
                  placeholder="Create a password" 
                  value={password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="pwd-toggle-new" 
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              <div className="strength-meter-container-new">
                <div className="meter-segments-new">
                  <div className="segment-bar-new">
                    <div className="segment-fill-new" style={{ width: strength.percent >= 25 ? '100%' : '0%', backgroundColor: strength.color }}></div>
                  </div>
                  <div className="segment-bar-new">
                    <div className="segment-fill-new" style={{ width: strength.percent >= 50 ? '100%' : '0%', backgroundColor: strength.color }}></div>
                  </div>
                  <div className="segment-bar-new">
                    <div className="segment-fill-new" style={{ width: strength.percent >= 75 ? '100%' : '0%', backgroundColor: strength.color }}></div>
                  </div>
                  <div className="segment-bar-new">
                    <div className="segment-fill-new" style={{ width: strength.percent >= 100 ? '100%' : '0%', backgroundColor: strength.color }}></div>
                  </div>
                </div>
                <span className="strength-text-right-new">Password strength</span>
              </div>
              {errors.password && <span className="error-msg-new">{errors.password}</span>}
            </div>

            <div className="input-group-new">
              <label htmlFor="register-confirm">Confirm Password</label>
              <div className="input-wrapper-new">
                <FiLock className="input-icon-new" size={18} />
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  id="register-confirm" 
                  placeholder="Confirm your password" 
                  value={confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="pwd-toggle-new" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-msg-new">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="submit-btn-new" disabled={formSubmitLoading}>
              {formSubmitLoading ? (
                <CgSpinner className="spinner animate-spin" size={20} />
              ) : (
                <>
                  <FiUserPlus size={18} />
                  <span>Register Account</span>
                </>
              )}
            </button>
          </form>

          <div className="divider-row-new">
            <span className="divider-line-new"></span>
            <span className="divider-text-new">or</span>
            <span className="divider-line-new"></span>
          </div>

          <p className="switch-view-text-new">
            Already registered? <Link to="/login">Log in here</Link>
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Link to="/admin" className="switch-admin-btn-new">
              <FiShield style={{ marginRight: '8px' }} size={16} /> Switch to Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
