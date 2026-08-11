import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import { CgSpinner } from 'react-icons/cg';

const AdminLogin = () => {
  const { login, token, logout, showToast } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('adminstringstack');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in as Admin
  useEffect(() => {
    if (token) {
      const savedUser = localStorage.getItem('user_details');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed.role === 'ADMIN') {
            navigate('/admin/dashboard');
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username) {
      setError('Username is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setFormSubmitLoading(true);
    const result = await login(username, password, false);
    
    if (result.success) {
      if (result.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        logout();
        setError('Access Denied: You do not have administrator privileges.');
        showToast('Access Denied: You do not have administrator privileges.', 'error');
      }
    } else {
      setError(result.message || 'Invalid credentials');
    }
    setFormSubmitLoading(false);
  };

  return (
    <div className="prof-admin-login-page">
      <div className="prof-admin-login-card">
        <div className="prof-admin-header">
          <div className="prof-admin-icon-circle">
            <FiShield size={28} />
          </div>
          <h2>BrainBytes</h2>
          <p>Admin Portal Access</p>
        </div>

        <form onSubmit={handleSubmit} className="prof-admin-form" noValidate>
          {error && <div className="prof-admin-error-msg">{error}</div>}

          <div className="prof-admin-input-field">
            <label htmlFor="admin-username">Username or Email</label>
            <div className="prof-admin-input-box">
              <FiUser className="input-icon" size={18} />
              <input 
                type="text" 
                id="admin-username" 
                placeholder="Enter your username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="prof-admin-input-field">
            <label htmlFor="admin-password">Password</label>
            <div className="prof-admin-input-box">
              <FiLock className="input-icon" size={18} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="admin-password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button 
                type="button" 
                className="pwd-reveal-btn" 
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="prof-admin-submit-btn" disabled={formSubmitLoading}>
            {formSubmitLoading ? (
              <span className="spinner-wrapper"><CgSpinner className="animate-spin" size={18} /> Authenticating...</span>
            ) : (
              <span>Sign In As Admin</span>
            )}
          </button>
        </form>

        <div className="prof-admin-switch">
          <span>Are you a customer? <Link to="/login">Switch to User Login</Link></span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
