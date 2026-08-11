import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiShield } from 'react-icons/fi';
import { CgSpinner } from 'react-icons/cg';

const VerifyOtp = () => {
  const { verifyOtp, resendOtp, token, toggleTheme, theme, showToast } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState('');
  
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Retrieve email from routing state if available
  useEffect(() => {
    if (token) {
      navigate('/home');
      return;
    }

    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      // Fallback: If no state, we can prompt for email or redirect to register
      showToast('Enter your email to verify your account', 'info');
    }
  }, [location.state, token, navigate]);

  // Handle countdown interval
  useEffect(() => {
    if (cooldown <= 0) return;
    
    const interval = setInterval(() => {
      setCooldown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors('');

    if (!email) {
      showToast('Email address is required', 'error');
      return;
    }

    if (!otp || !/^[0-9]{6}$/.test(otp)) {
      setErrors('Please enter a valid 6-digit OTP code');
      return;
    }

    setFormSubmitLoading(true);
    const result = await verifyOtp(email, otp);
    setFormSubmitLoading(false);

    if (result.success) {
      navigate('/login');
    }
  };

  const handleResend = async () => {
    if (!email) {
      showToast('Please enter an email address first', 'error');
      return;
    }

    const result = await resendOtp(email);
    if (result.success) {
      setCooldown(60);
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
              <h2>SalesBasket</h2>
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
              <img src="/shopping_3d_tv.jpg" alt="SalesBasket 3D Store Illustration" className="illustration-img-new" />
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="login-card-right-new">
          <h3 className="right-title-new">Verify Email</h3>
          <p className="right-subtitle-new">Enter the 6-digit OTP sent to your email to complete registration</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group-new">
              <label htmlFor="verify-email">Email Address</label>
              <div className="input-wrapper-new">
                <FiMail className="input-icon-new" size={18} />
                <input 
                  type="email" 
                  id="verify-email" 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="input-group-new">
              <label htmlFor="verify-code">Verification Code</label>
              <div className="input-wrapper-new">
                <FiLock className="input-icon-new" size={18} />
                <input 
                  type="text" 
                  id="verify-code" 
                  placeholder="6-digit OTP" 
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val) && val.length <= 6) {
                      setOtp(val);
                      setErrors('');
                    }
                  }}
                  maxLength={6} 
                  required 
                />
              </div>
              {errors && <span className="error-msg-new">{errors}</span>}
            </div>

            <button type="submit" className="submit-btn-new" disabled={formSubmitLoading}>
              {formSubmitLoading ? (
                <CgSpinner className="spinner animate-spin" size={20} />
              ) : (
                <>
                  <FiShield size={18} />
                  <span>Verify & Activate</span>
                </>
              )}
            </button>
          </form>

          <div className="divider-row-new">
            <span className="divider-line-new"></span>
            <span className="divider-text-new">or</span>
            <span className="divider-line-new"></span>
          </div>

          <div className="resend-container" style={{ textAlign: 'center', marginBottom: '16px', fontSize: '13.5px', color: '#64748b' }}>
            <span>Didn't get the email? </span>
            {cooldown > 0 ? (
              <span id="verify-timer" style={{ fontWeight: '700', color: '#4f46e5' }}>
                Resend in <span id="verify-countdown">{cooldown}</span>s
              </span>
            ) : (
              <button 
                type="button" 
                onClick={handleResend} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#4f46e5', 
                  fontWeight: '700', 
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '13.5px',
                  fontFamily: 'inherit'
                }}
              >
                Resend OTP
              </button>
            )}
          </div>

          <p className="switch-view-text-new" style={{ marginTop: '0' }}>
            Want to register a different email? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
