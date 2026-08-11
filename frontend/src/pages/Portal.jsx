import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiUser, FiShield, FiArrowRight } from 'react-icons/fi';

const Portal = () => {
  const navigate = useNavigate();

  return (
    <div className="portal-container">
      {/* Background patterns */}
      <div className="portal-dot-pattern"></div>
      <div className="portal-glow-left"></div>
      <div className="portal-glow-right"></div>

      <div className="portal-card">
        {/* Top Shield Icon */}
        <div className="portal-top-shield">
          <div className="shield-glow-circle">
            <FiShield size={38} className="shield-border-icon" />
            <FiLock size={16} className="shield-lock-icon" />
          </div>
        </div>

        {/* Headings */}
        <h1 className="portal-title">Welcome to Portal</h1>
        <p className="portal-subtitle">Choose your login option to continue</p>

        {/* Divider with shield */}
        <div className="portal-divider-with-shield">
          <div className="line"></div>
          <div className="shield-mini">
            <FiShield size={12} />
          </div>
          <div className="line"></div>
        </div>

        {/* Main Selection Area */}
        <p className="portal-selection-text">Please select the portal you want to access</p>

        <div className="portal-options-grid">
          {/* User Card */}
          <div className="portal-option-card user-card" onClick={() => navigate('/login')}>
            <div className="option-icon-wrapper user-wrapper">
              <FiUser size={28} className="option-icon" />
            </div>
            <h2>User Login</h2>
            <p>Access your account and manage your profile</p>
            <button className="portal-btn user-btn">
              <span>Login as User</span>
              <FiArrowRight size={16} />
            </button>
          </div>

          {/* Admin Card */}
          <div className="portal-option-card admin-card" onClick={() => navigate('/admin')}>
            <div className="option-icon-wrapper admin-wrapper">
              <FiShield size={28} className="option-icon" />
            </div>
            <h2>Admin Login</h2>
            <p>Secure access to admin dashboard and system management</p>
            <button className="portal-btn admin-btn">
              <span>Login as Admin</span>
              <FiArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* OR Divider */}
        <div className="portal-or-divider">
          <div className="line"></div>
          <span>OR</span>
          <div className="line"></div>
        </div>

        {/* Security Banner */}
        <div className="portal-security-banner">
          <div className="security-icon-wrapper">
            <FiLock size={16} />
          </div>
          <p>Your security is our priority. All activities are monitored and protected.</p>
        </div>

        {/* Footer */}
        <div className="portal-footer">
          <span className="footer-item"><FiShield size={12} style={{ marginRight: '4px' }} /> Secure Access</span>
          <span className="footer-bullet">•</span>
          <span className="footer-item">Your safety is our priority</span>
        </div>
      </div>
    </div>
  );
};

export default Portal;
