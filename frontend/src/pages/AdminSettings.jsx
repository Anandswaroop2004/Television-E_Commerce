import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FiSettings, FiUser, FiLock, FiGlobe, FiMail, FiCreditCard, FiPercent
} from 'react-icons/fi';
import AdminLayout from '../layouts/AdminLayout';

const AdminSettings = () => {
  const { user, showToast } = useAuth();

  // Active section inside Settings
  const [activeSection, setActiveSection] = useState('profile');

  // Form states
  const [profileForm, setProfileForm] = useState({
    username: user?.username || 'adminstringstack',
    email: user?.email || 'admin@stringstack.com'
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [storeForm, setStoreForm] = useState({
    storeName: 'BrainBytes TV Store',
    supportEmail: 'support@brainbytes.com',
    currency: 'INR',
    address: '100 Silicon Boulevard, Tech Park, Bangalore, India'
  });

  const [emailForm, setEmailForm] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'anandswaroop5056@gmail.com',
    enableNotifications: true
  });

  const [paymentForm, setPaymentForm] = useState({
    razorpayKeyId: 'rzp_test_TK5SDHaYEtJcq3',
    razorpaySecret: '••••••••••••••••••••'
  });

  const [taxForm, setTaxForm] = useState({
    vatRate: '18',
    hsnCode: '85287217',
    taxInvoicePrefix: 'INV-2025-'
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    showToast('Admin profile details updated successfully!', 'success');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }
    showToast('Administrator password updated successfully!', 'success');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleSaveConfig = (sectionName) => {
    showToast(`${sectionName} configurations saved.`, 'success');
  };

  return (
    <AdminLayout>
      <div className="admin-settings-wrapper animate-fade-in">
        {/* Page Header */}
        <div className="admin-page-header">
          <div>
            <h1 className="admin-main-heading">System & Portal Settings</h1>
            <p className="admin-sub-heading">Edit administrator passwords, SMTP gateways, Razorpay keys, and tax details.</p>
          </div>
        </div>

        <div className="settings-module-container">
          {/* Left: Navigation Cards List */}
          <div className="settings-nav-sidebar">
            <button 
              className={`settings-nav-btn ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveSection('profile')}
            >
              <FiUser size={18} className="btn-icon" />
              <div>
                <span className="btn-title">Admin Profile</span>
                <span className="btn-desc">Change names and emails</span>
              </div>
            </button>

            <button 
              className={`settings-nav-btn ${activeSection === 'password' ? 'active' : ''}`}
              onClick={() => setActiveSection('password')}
            >
              <FiLock size={18} className="btn-icon" />
              <div>
                <span className="btn-title">Change Password</span>
                <span className="btn-desc">Update portal credentials</span>
              </div>
            </button>

            <button 
              className={`settings-nav-btn ${activeSection === 'store' ? 'active' : ''}`}
              onClick={() => setActiveSection('store')}
            >
              <FiGlobe size={18} className="btn-icon" />
              <div>
                <span className="btn-title">Store Settings</span>
                <span className="btn-desc">Define name, currencies, addresses</span>
              </div>
            </button>

            <button 
              className={`settings-nav-btn ${activeSection === 'email' ? 'active' : ''}`}
              onClick={() => setActiveSection('email')}
            >
              <FiMail size={18} className="btn-icon" />
              <div>
                <span className="btn-title">SMTP Mail Configuration</span>
                <span className="btn-desc">Verify email alert gateways</span>
              </div>
            </button>

            <button 
              className={`settings-nav-btn ${activeSection === 'payment' ? 'active' : ''}`}
              onClick={() => setActiveSection('payment')}
            >
              <FiCreditCard size={18} className="btn-icon" />
              <div>
                <span className="btn-title">Payment Gateways</span>
                <span className="btn-desc">Razorpay credentials updates</span>
              </div>
            </button>

            <button 
              className={`settings-nav-btn ${activeSection === 'tax' ? 'active' : ''}`}
              onClick={() => setActiveSection('tax')}
            >
              <FiPercent size={18} className="btn-icon" />
              <div>
                <span className="btn-title">Tax Settings</span>
                <span className="btn-desc">Configure VAT, GST & Invoice IDs</span>
              </div>
            </button>
          </div>

          {/* Right: Active Section Form */}
          <div className="settings-content-card table-card animate-fade-in" style={{ padding: '24px' }}>
            {activeSection === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="settings-form">
                <h3 className="section-title-small">Administrator Profile</h3>
                <p className="section-subtitle-small">Modify details for username identification and emails.</p>

                <div className="modal-input-field">
                  <label>Username</label>
                  <input 
                    type="text" 
                    value={profileForm.username}
                    onChange={e => setProfileForm({ ...profileForm, username: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-input-field">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={profileForm.email}
                    onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="admin-btn-primary" style={{ marginTop: '10px' }}>
                  Save Profile Info
                </button>
              </form>
            )}

            {activeSection === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="settings-form">
                <h3 className="section-title-small">Update Password</h3>
                <p className="section-subtitle-small">Maintain admin portal access security.</p>

                <div className="modal-input-field">
                  <label>Current Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-input-field">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter new strong password"
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-input-field">
                  <label>Confirm New Password</label>
                  <input 
                    type="password" 
                    placeholder="Re-type new password"
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="admin-btn-primary" style={{ marginTop: '10px' }}>
                  Change Credentials
                </button>
              </form>
            )}

            {activeSection === 'store' && (
              <div className="settings-form">
                <h3 className="section-title-small">Store Configurations</h3>
                <p className="section-subtitle-small">Define checkout brand appearance and currencies.</p>

                <div className="modal-input-field">
                  <label>Store Display Name</label>
                  <input 
                    type="text" 
                    value={storeForm.storeName}
                    onChange={e => setStoreForm({ ...storeForm, storeName: e.target.value })}
                  />
                </div>
                <div className="modal-input-field">
                  <label>Store Support Email Address</label>
                  <input 
                    type="email" 
                    value={storeForm.supportEmail}
                    onChange={e => setStoreForm({ ...storeForm, supportEmail: e.target.value })}
                  />
                </div>
                <div className="modal-form-row">
                  <div className="modal-input-field">
                    <label>Base Currency Code</label>
                    <input 
                      type="text" 
                      value={storeForm.currency}
                      onChange={e => setStoreForm({ ...storeForm, currency: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-input-field">
                  <label>Store Dispatch Address</label>
                  <textarea 
                    value={storeForm.address}
                    onChange={e => setStoreForm({ ...storeForm, address: e.target.value })}
                  />
                </div>
                <button className="admin-btn-primary" onClick={() => handleSaveConfig('Store')}>
                  Save Store Profile
                </button>
              </div>
            )}

            {activeSection === 'email' && (
              <div className="settings-form">
                <h3 className="section-title-small">SMTP Email Settings</h3>
                <p className="section-subtitle-small">Used by Spring Boot to trigger password reset and verify OTP alerts.</p>

                <div className="modal-form-row">
                  <div className="modal-input-field">
                    <label>SMTP Host</label>
                    <input 
                      type="text" 
                      value={emailForm.smtpHost}
                      onChange={e => setEmailForm({ ...emailForm, smtpHost: e.target.value })}
                    />
                  </div>
                  <div className="modal-input-field">
                    <label>SMTP Port</label>
                    <input 
                      type="text" 
                      value={emailForm.smtpPort}
                      onChange={e => setEmailForm({ ...emailForm, smtpPort: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-input-field">
                  <label>Sender Account Username</label>
                  <input 
                    type="email" 
                    value={emailForm.smtpUser}
                    onChange={e => setEmailForm({ ...emailForm, smtpUser: e.target.value })}
                  />
                </div>
                
                <div className="modal-checkbox-field" style={{ display: 'flex', alignItems: 'center', marginTop: '10px', marginBottom: '20px' }}>
                  <input 
                    type="checkbox" 
                    id="smtp-active-chk"
                    checked={emailForm.enableNotifications}
                    onChange={e => setEmailForm({ ...emailForm, enableNotifications: e.target.checked })}
                    style={{ marginRight: '8px', width: '16px', height: '16px' }}
                  />
                  <label htmlFor="smtp-active-chk" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-heading)', cursor: 'pointer' }}>
                    Enable mail alert trigger rules
                  </label>
                </div>

                <button className="admin-btn-primary" onClick={() => handleSaveConfig('SMTP Mail Gateway')}>
                  Save Email Rules
                </button>
              </div>
            )}

            {activeSection === 'payment' && (
              <div className="settings-form">
                <h3 className="section-title-small">Payment Integrations</h3>
                <p className="section-subtitle-small">Razorpay credentials details driving checkout forms.</p>

                <div className="modal-input-field">
                  <label>Razorpay Key ID</label>
                  <input 
                    type="text" 
                    value={paymentForm.razorpayKeyId}
                    onChange={e => setPaymentForm({ ...paymentForm, razorpayKeyId: e.target.value })}
                  />
                </div>
                <div className="modal-input-field">
                  <label>Razorpay Key Secret</label>
                  <input 
                    type="text" 
                    value={paymentForm.razorpaySecret}
                    onChange={e => setPaymentForm({ ...paymentForm, razorpaySecret: e.target.value })}
                  />
                </div>
                <button className="admin-btn-primary" onClick={() => handleSaveConfig('Razorpay Integration')}>
                  Save Credentials
                </button>
              </div>
            )}

            {activeSection === 'tax' && (
              <div className="settings-form">
                <h3 className="section-title-small">Tax Rates & Legal Invoicing</h3>
                <p className="section-subtitle-small">Set default GST rates and legal invoicing sequences.</p>

                <div className="modal-form-row">
                  <div className="modal-input-field">
                    <label>Default GST/VAT Rate (%)</label>
                    <input 
                      type="number" 
                      value={taxForm.vatRate}
                      onChange={e => setTaxForm({ ...taxForm, vatRate: e.target.value })}
                    />
                  </div>
                  <div className="modal-input-field">
                    <label>HSN Classification Code</label>
                    <input 
                      type="text" 
                      value={taxForm.hsnCode}
                      onChange={e => setTaxForm({ ...taxForm, hsnCode: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-input-field">
                  <label>Tax Invoice Series Prefix</label>
                  <input 
                    type="text" 
                    value={taxForm.taxInvoicePrefix}
                    onChange={e => setTaxForm({ ...taxForm, taxInvoicePrefix: e.target.value })}
                  />
                </div>
                <button className="admin-btn-primary" onClick={() => handleSaveConfig('Tax and Invoicing')}>
                  Save Configurations
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
