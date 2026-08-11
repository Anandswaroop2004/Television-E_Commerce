import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../services/apiConfig';
import { 
  FiTag, FiPlus, FiEdit2, FiTrash2, FiSearch, FiAlertCircle, FiCheck, FiX
} from 'react-icons/fi';
import AdminLayout from '../layouts/AdminLayout';

const AdminCoupons = () => {
  const { token, showToast } = useAuth();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minPurchaseAmount: '0',
    expiryDate: '',
    active: true
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all coupons
  const loadCoupons = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/coupons?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCoupons(res.data);
    } catch (err) {
      console.error('Failed to load coupons', err);
      setError('Could not retrieve coupons list. Verify Spring Boot is running.');
      showToast('Error loading coupons', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadCoupons();
    }
  }, [token]);

  // Open modal
  const handleOpenModal = (type, coup = null) => {
    setModalType(type);
    setSelectedCoupon(coup);
    if (type === 'add') {
      setCouponForm({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        minPurchaseAmount: '0',
        expiryDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0], // default 30 days expiry
        active: true
      });
    } else if (coup) {
      setCouponForm({
        code: coup.code,
        discountType: coup.discountType,
        discountValue: String(coup.discountValue),
        minPurchaseAmount: String(coup.minPurchaseAmount),
        expiryDate: coup.expiryDate ? coup.expiryDate.split('T')[0] : '',
        active: coup.active
      });
    }
    setShowModal(true);
  };

  // Create or Update Coupon Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.discountValue) {
      showToast('Please fill all mandatory fields', 'error');
      return;
    }
    setFormSubmitting(true);
    try {
      // Append time portion to expiry date if selected
      let expiryTime = null;
      if (couponForm.expiryDate) {
        expiryTime = `${couponForm.expiryDate}T23:59:59`;
      }

      const payload = {
        code: couponForm.code.toUpperCase().trim(),
        discountType: couponForm.discountType,
        discountValue: parseFloat(couponForm.discountValue),
        minPurchaseAmount: parseFloat(couponForm.minPurchaseAmount || 0),
        expiryDate: expiryTime,
        active: couponForm.active
      };

      if (modalType === 'add') {
        await axios.post(`${API_BASE_URL}/api/admin/coupons`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('Coupon added successfully!', 'success');
      } else if (modalType === 'edit' && selectedCoupon) {
        await axios.put(`${API_BASE_URL}/api/admin/coupons/${selectedCoupon.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('Coupon details updated!', 'success');
      }
      setShowModal(false);
      loadCoupons();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save coupon', 'error');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Coupon deleted successfully', 'success');
      loadCoupons();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete coupon', 'error');
    }
  };

  // Toggle active status inline
  const handleToggleActive = async (coup) => {
    try {
      const payload = {
        ...coup,
        active: !coup.active
      };
      await axios.put(`${API_BASE_URL}/api/admin/coupons/${coup.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast(`Coupon ${coup.code} is now ${!coup.active ? 'Active' : 'Inactive'}`, 'success');
      loadCoupons();
    } catch (err) {
      showToast('Failed to update coupon state', 'error');
    }
  };

  const getFilteredCoupons = () => {
    let result = [...coupons];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => c.code.toLowerCase().includes(q));
    }
    return result;
  };

  const filteredCoupons = getFilteredCoupons();

  return (
    <AdminLayout>
      <div className="admin-coupons-wrapper animate-fade-in">
        {/* Page Header */}
        <div className="admin-page-header">
          <div>
            <h1 className="admin-main-heading">Discount Coupon Management</h1>
            <p className="admin-sub-heading">Create promotional campaigns, set percentage/flat discounts, and enforce purchase thresholds.</p>
          </div>
          <div className="dashboard-header-actions">
            <button className="admin-btn-primary" onClick={() => handleOpenModal('add')}>
              <FiPlus style={{ marginRight: '6px' }} /> Create Coupon
            </button>
          </div>
        </div>

        {error && (
          <div className="admin-alert-banner danger">
            <FiAlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Filters */}
        <div className="admin-table-filters-row">
          <div className="filter-search-box" style={{ maxWidth: '350px' }}>
            <FiSearch size={16} className="search-box-icon" />
            <input 
              type="text" 
              placeholder="Search coupons by code..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Coupons Table Card */}
        <div className="table-card animate-fade-in">
          <div className="table-responsive-wrapper">
            <table className="admin-clean-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Discount</th>
                  <th>Min Order Value</th>
                  <th>Expiry Date</th>
                  <th>Active</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="empty-row">Retrieving active coupons...</td>
                  </tr>
                ) : filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-row">No discount coupons match filters.</td>
                  </tr>
                ) : (
                  filteredCoupons.map(c => {
                    const expired = c.expiryDate && new Date(c.expiryDate) < new Date();
                    return (
                      <tr key={c.id}>
                        <td className="item-bold text-blue">{c.code}</td>
                        <td>{c.discountType}</td>
                        <td>{c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `₹${(c.discountValue || 0).toLocaleString()}`}</td>
                        <td>₹{(c.minPurchaseAmount || 0).toLocaleString()}</td>
                        <td className={expired ? 'text-red' : ''}>
                          {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : 'Never'}
                          {expired && <span style={{ fontSize: '10px', marginLeft: '5px', padding: '1px 4px', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#ef4444', fontWeight: 600 }}>Expired</span>}
                        </td>
                        <td>
                          <button 
                            onClick={() => handleToggleActive(c)} 
                            className={`admin-status-badge ${c.active && !expired ? 'success' : 'danger'}`}
                            style={{ border: 'none', cursor: 'pointer' }}
                            title="Toggle Active State"
                          >
                            {c.active && !expired ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="table-actions-cell">
                            <button className="act-icon-btn edit" onClick={() => handleOpenModal('edit', c)} title="Edit Coupon">
                              <FiEdit2 size={14} />
                            </button>
                            <button className="act-icon-btn delete" onClick={() => handleDeleteCoupon(c.id)} title="Delete Coupon">
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Coupon Form Modal */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="modal-header-row">
              <h3>
                {modalType === 'add' ? 'Create Promotional Coupon' : 'Modify Coupon Rules'}
              </h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="modal-input-field">
                <label>Coupon Code * (Alphanumeric, uppercase)</label>
                <input 
                  type="text" 
                  placeholder="e.g. MONSOON20" 
                  value={couponForm.code}
                  onChange={e => setCouponForm(prev => ({ ...prev, code: e.target.value }))}
                  required
                  disabled={formSubmitting}
                />
              </div>

              <div className="modal-form-row">
                <div className="modal-input-field">
                  <label>Discount Type *</label>
                  <select 
                    value={couponForm.discountType}
                    onChange={e => setCouponForm(prev => ({ ...prev, discountType: e.target.value }))}
                    required
                    disabled={formSubmitting}
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Flat Cash (INR)</option>
                  </select>
                </div>
                <div className="modal-input-field">
                  <label>Discount Value *</label>
                  <input 
                    type="number" 
                    placeholder={couponForm.discountType === 'PERCENTAGE' ? 'e.g. 15' : 'e.g. 2000'}
                    value={couponForm.discountValue}
                    onChange={e => setCouponForm(prev => ({ ...prev, discountValue: e.target.value }))}
                    required
                    disabled={formSubmitting}
                  />
                </div>
              </div>

              <div className="modal-form-row">
                <div className="modal-input-field">
                  <label>Min Purchase Order Limit (INR)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 5000" 
                    value={couponForm.minPurchaseAmount}
                    onChange={e => setCouponForm(prev => ({ ...prev, minPurchaseAmount: e.target.value }))}
                    disabled={formSubmitting}
                  />
                </div>
                <div className="modal-input-field">
                  <label>Expiry Date</label>
                  <input 
                    type="date" 
                    value={couponForm.expiryDate}
                    onChange={e => setCouponForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                    disabled={formSubmitting}
                  />
                </div>
              </div>

              <div className="modal-checkbox-field" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                <input 
                  type="checkbox" 
                  id="coupon-active-chk"
                  checked={couponForm.active}
                  onChange={e => setCouponForm(prev => ({ ...prev, active: e.target.checked }))}
                  disabled={formSubmitting}
                  style={{ marginRight: '8px', width: '16px', height: '16px' }}
                />
                <label htmlFor="coupon-active-chk" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-heading)', cursor: 'pointer' }}>
                  Enable this coupon immediately (Active status)
                </label>
              </div>

              <button type="submit" className="modal-action-btn" style={{ marginTop: '20px' }} disabled={formSubmitting}>
                {formSubmitting ? 'Saving...' : modalType === 'add' ? 'Save Coupon' : 'Update Rules'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCoupons;
