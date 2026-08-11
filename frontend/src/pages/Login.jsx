import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import { CgSpinner } from 'react-icons/cg';

const Login = () => {
  const { login, token, toggleTheme, theme } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  // Auto-redirect to home or admin dashboard if token already exists
  useEffect(() => {
    if (token) {
      const savedUser = localStorage.getItem('user_details');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed.role === 'ADMIN') {
            navigate('/admin-dashboard');
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      navigate('/home');
    }
  }, [token, navigate]);

  // Pre-fill email if remembered
  useEffect(() => {
    const remembered = localStorage.getItem('remember_email');
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  const validateEmail = (emailVal) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(emailVal);
  };

  const handleInputChange = (field, value) => {
    if (field === 'email') {
      setEmail(value);
      setErrors(prev => ({ ...prev, email: '' }));
    } else if (field === 'password') {
      setPassword(value);
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let hasErrors = false;
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Email is required';
      hasErrors = true;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email format';
      hasErrors = true;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setFormSubmitLoading(true);
    const result = await login(email, password, rememberMe);
    setFormSubmitLoading(false);

    if (result.success) {
      if (result.user.role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/home');
      }
    } else if (result.isUnverified) {
      // If the account is not verified, redirect to /verify
      setTimeout(() => {
        navigate('/verify', { state: { email } });
      }, 1500);
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

      <div className="login-content-wrapper spec-split-card">
        {/* Left Graphics Panel */}
        <div className="login-card-left">
          <div className="brand-section-left">
            <div className="logo-box-mini">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="brand-logo-mini">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <path d="M3 6h18"></path>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <div className="brand-text-block">
              <h2>Brain Bytes</h2>
              <p>Secure Authentication Portal</p>
            </div>
          </div>
          
          <div className="illustration-container">
            <img src="/shopping_3d_tv.jpg" alt="BrainBytes 3D Store Illustration" className="illustration-img" />
            
            {/* Floating badges */}
            <div className="floating-badge badge-secure">
              <div className="badge-icon-box blue"><FiShield size={14} /></div>
              <span>Secure</span>
            </div>
            <div className="floating-badge badge-fast">
              <div className="badge-icon-box purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                </svg>
              </div>
              <span>Fast</span>
            </div>
            <div className="floating-badge badge-reliable">
              <div className="badge-icon-box indigo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
              </div>
              <span>Reliable</span>
            </div>
          </div>

          <div className="tagline-section">
            <h3>Secure. <span className="highlight-text">Fast.</span> Reliable.</h3>
            <p>Your one-stop platform for premium shopping experience with complete security.</p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="login-card-right">
          <div className="brand-section">
            <div className="logo-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="brand-logo">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <path d="M3 6h18"></path>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <h2>Brain Bytes</h2>
            <p id="brand-tagline">Secure Authentication Portal</p>
          </div>

          <div className="view">
            <h3>Welcome Back</h3>
            <p className="subtitle">Please enter your details to sign in</p>
            
            <form onSubmit={handleSubmit} noValidate>
              <div className="input-group">
                <label htmlFor="login-email">Email Address</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" size={18} />
                  <input 
                    type="email" 
                    id="login-email" 
                    placeholder="name@domain.com" 
                    value={email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required 
                  />
                </div>
                <span className="error-msg">{errors.email}</span>
              </div>

              <div className="input-group">
                <div className="label-row">
                  <label htmlFor="login-password">Password</label>
                  <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
                </div>
                <div className="input-wrapper">
                  <FiLock className="input-icon" size={18} />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    id="login-password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
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
                <span className="error-msg">{errors.password}</span>
              </div>

              <div className="form-actions">
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    id="login-remember" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Remember Me
                </label>
              </div>

              <button type="submit" className="submit-btn" disabled={formSubmitLoading}>
                {formSubmitLoading ? (
                  <CgSpinner className="spinner animate-spin" size={20} />
                ) : (
                  <span className="btn-text">Sign In</span>
                )}
              </button>
            </form>

            <div className="divider-row">
              <span className="divider-line"></span>
              <span className="divider-text">or</span>
              <span className="divider-line"></span>
            </div>

            <p className="switch-view-text">
              New to BrainBytes? <Link to="/register">Create an account</Link>
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Link to="/admin" className="switch-admin-btn-new">
                <FiShield style={{ marginRight: '8px' }} size={16} /> Switch to Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
