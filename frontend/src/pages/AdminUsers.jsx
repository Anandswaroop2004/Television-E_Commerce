import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../services/apiConfig';
import { 
  FiUsers, FiUserCheck, FiSlash, FiTrash2, FiSearch, 
  FiFilter, FiAlertCircle, FiEye, FiCheck, FiX, FiShield
} from 'react-icons/fi';
import AdminLayout from '../layouts/AdminLayout';

const AdminUsers = () => {
  const { token, showToast } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All'); // 'All', 'ADMIN', 'CUSTOMER'
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Verified', 'Unverified', 'Blocked'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected User Modal (View Details)
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Load Users from Database
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/users?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
      setError('Could not retrieve user directory. Please verify MySQL and backend server.');
      showToast('Error loading user directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  // Sync Search Query Debouncer
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 on search
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Toggle User Role (ADMIN <=> CUSTOMER)
  const handleToggleRole = async (u) => {
    const newRole = u.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    if (!window.confirm(`Are you sure you want to change role of "${u.username}" to ${newRole}?`)) return;
    
    try {
      await axios.put(`${API_BASE_URL}/api/admin/users/${u.id}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast(`User role updated to ${newRole}`, 'success');
      fetchUsers(); // reload list
      if (selectedUser && selectedUser.id === u.id) {
        setSelectedUser(prev => ({ ...prev, role: newRole }));
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update user role', 'error');
    }
  };

  // Toggle User Block Status
  const handleToggleBlock = async (u) => {
    const actionText = u.blocked ? 'unblock' : 'block';
    if (!window.confirm(`Are you sure you want to ${actionText} "${u.username}"?`)) return;
    
    try {
      await axios.patch(`${API_BASE_URL}/api/admin/users/${u.id}/block`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast(`User ${u.username} has been ${u.blocked ? 'unblocked' : 'blocked'}.`, 'success');
      fetchUsers(); // reload list
      if (selectedUser && selectedUser.id === u.id) {
        setSelectedUser(prev => ({ ...prev, blocked: !prev.blocked }));
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update user status', 'error');
    }
  };

  // Delete User
  const handleDeleteUser = async (u) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${u.username}"? This action CANNOT be undone.`)) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/users/${u.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('User account successfully removed', 'success');
      fetchUsers();
      setShowDetailModal(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  // Verify User Directly
  const handleVerifyUser = async (u) => {
    try {
      await axios.put(`${API_BASE_URL}/api/admin/users/${u.id}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('User verified successfully!', 'success');
      fetchUsers();
      if (selectedUser && selectedUser.id === u.id) {
        setSelectedUser(prev => ({ ...prev, verified: true }));
      }
    } catch (err) {
      showToast('Failed to verify user', 'error');
    }
  };

  // Filter & Search Logic
  const getFilteredUsers = () => {
    let result = [...users];

    // Search Query
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(u => 
        u.username.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q)
      );
    }

    // Role Filter
    if (roleFilter !== 'All') {
      result = result.filter(u => u.role === roleFilter);
    }

    // Status Filter
    if (statusFilter !== 'All') {
      if (statusFilter === 'Verified') {
        result = result.filter(u => u.verified && !u.blocked);
      } else if (statusFilter === 'Unverified') {
        result = result.filter(u => !u.verified);
      } else if (statusFilter === 'Blocked') {
        result = result.filter(u => u.blocked);
      }
    }

    return result;
  };

  const filteredUsers = getFilteredUsers();

  // Pagination slice
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsersList = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="admin-users-wrapper animate-fade-in">
        {/* Page Header */}
        <div className="admin-page-header">
          <div>
            <h1 className="admin-main-heading">User & Permissions Directory</h1>
            <p className="admin-sub-heading">Moderate customer accounts, change administrator privileges, and toggle block listings.</p>
          </div>
        </div>

        {error && (
          <div className="admin-alert-banner danger">
            <FiAlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="admin-table-filters-row">
          <div className="filter-search-box">
            <FiSearch size={16} className="search-box-icon" />
            <input 
              type="text" 
              placeholder="Search by username or email address..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filters-group-controls">
            {/* Role Filter */}
            <div className="filter-select-wrapper">
              <FiFilter size={14} className="select-icon" />
              <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }}>
                <option value="All">All Roles</option>
                <option value="ADMIN">Administrator</option>
                <option value="CUSTOMER">Customer</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="filter-select-wrapper">
              <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                <option value="All">All Statuses</option>
                <option value="Verified">Verified Active</option>
                <option value="Unverified">Unverified</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Directory Table Card */}
        <div className="table-card animate-fade-in">
          <div className="table-responsive-wrapper">
            <table className="admin-clean-table">
              <thead>
                <tr>
                  <th>Initials</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Verified</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="empty-row">Retrieving active user directories...</td>
                  </tr>
                ) : currentUsersList.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-row">No registered users match the search criteria.</td>
                  </tr>
                ) : (
                  currentUsersList.map(u => {
                    const isUserBlocked = u.blocked === true;
                    
                    return (
                      <tr key={u.id} className={isUserBlocked ? 'row-muted' : ''}>
                        <td>
                          <div className="user-initial-avatar size-small">
                            {u.username.substring(0, 2).toUpperCase()}
                          </div>
                        </td>
                        <td className="item-bold">{u.username}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`admin-role-badge ${u.role.toLowerCase()}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          {u.verified ? (
                            <span style={{ color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', fontWeight: '600', fontSize: '13px' }}>
                              <FiCheck style={{ marginRight: '4px' }} /> Verified
                            </span>
                          ) : (
                            <button className="text-action-link" onClick={() => handleVerifyUser(u)}>
                              Verify Direct
                            </button>
                          )}
                        </td>
                        <td>
                          <span className={`admin-status-badge ${isUserBlocked ? 'danger' : 'success'}`}>
                            {isUserBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="table-actions-cell">
                            <button className="act-icon-btn view" onClick={() => { setSelectedUser(u); setShowDetailModal(true); }} title="Quick Profile Card">
                              <FiEye size={14} />
                            </button>
                            <button 
                              className={`act-icon-btn edit ${u.role === 'ADMIN' ? 'admin' : ''}`} 
                              onClick={() => handleToggleRole(u)} 
                              title="Toggle Administrator Privileges"
                            >
                              <FiShield size={14} />
                            </button>
                            <button 
                              className={`act-icon-btn warning ${isUserBlocked ? 'blocked' : ''}`} 
                              onClick={() => handleToggleBlock(u)} 
                              title={isUserBlocked ? 'Unblock User' : 'Block User'}
                            >
                              <FiSlash size={14} />
                            </button>
                            <button className="act-icon-btn delete" onClick={() => handleDeleteUser(u)} title="Remove Account">
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

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="admin-table-pagination">
              <span className="pagination-info">
                Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} entries
              </span>
              <div className="pagination-buttons">
                <button 
                  className="pagination-btn" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button 
                    key={idx} 
                    className={`pagination-btn num ${currentPage === idx + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button 
                  className="pagination-btn" 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal Card */}
      {showDetailModal && selectedUser && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="modal-header-row">
              <h3>Detailed Profile Card</h3>
              <button className="modal-close-btn" onClick={() => setShowDetailModal(false)}>✕</button>
            </div>
            <div className="view-product-detail-modal">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div className="user-initial-avatar size-large" style={{ width: '80px', height: '80px', borderRadius: '50%', fontSize: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F5FD', color: '#2F80ED', fontWeight: 'bold' }}>
                  {selectedUser.username.substring(0, 2).toUpperCase()}
                </div>
              </div>
              
              <div className="detail-row">
                <span className="label">User Database ID:</span>
                <span className="val">{selectedUser.id}</span>
              </div>
              <div className="detail-row">
                <span className="label">Username:</span>
                <span className="val font-semibold">{selectedUser.username}</span>
              </div>
              <div className="detail-row">
                <span className="label">Registered Email:</span>
                <span className="val">{selectedUser.email}</span>
              </div>
              <div className="detail-row">
                <span className="label">User Permissions:</span>
                <span className="val-badge">{selectedUser.role}</span>
              </div>
              <div className="detail-row">
                <span className="label">Verification State:</span>
                <span className="val" style={{ color: selectedUser.verified ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: 600 }}>
                  {selectedUser.verified ? 'Verified Active' : 'Pending Verification'}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">System Block Status:</span>
                <span className="val" style={{ color: selectedUser.blocked ? 'var(--color-error)' : 'var(--color-success)', fontWeight: 600 }}>
                  {selectedUser.blocked ? 'Account Locked' : 'Normal Active'}
                </span>
              </div>

              {/* Action buttons inside Profile Card */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button 
                  className="admin-btn-secondary" 
                  style={{ flex: 1 }}
                  onClick={() => handleToggleRole(selectedUser)}
                >
                  Toggle Admin
                </button>
                <button 
                  className={`admin-btn-secondary ${selectedUser.blocked ? 'success' : 'danger'}`}
                  style={{ flex: 1, color: selectedUser.blocked ? 'var(--color-success)' : 'var(--color-error)' }}
                  onClick={() => handleToggleBlock(selectedUser)}
                >
                  {selectedUser.blocked ? 'Unblock User' : 'Block User'}
                </button>
              </div>

              <div style={{ marginTop: '10px' }}>
                <button 
                  className="admin-btn-primary" 
                  style={{ width: '100%', backgroundColor: 'var(--color-error)', border: 'none' }}
                  onClick={() => handleDeleteUser(selectedUser)}
                >
                  Remove Account Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
