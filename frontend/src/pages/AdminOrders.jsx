import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../services/apiConfig';
import { 
  FiDollarSign, FiSearch, FiFilter, FiAlertCircle, 
  FiEye, FiTrendingUp, FiCreditCard, FiFrown
} from 'react-icons/fi';
import AdminLayout from '../layouts/AdminLayout';

const AdminOrders = () => {
  const { token, showToast } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'PENDING', 'SUCCESS', 'FAILED'

  // Selected Order Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Load orders
  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/orders?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders', err);
      setError('Connection to server failed. Please verify MySQL and the backend service.');
      showToast('Error loading transactions directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadOrders();
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

  // Update order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    setStatusUpdating(true);
    try {
      await axios.put(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast(`Order status updated to ${newStatus}`, 'success');
      loadOrders(); // reload
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update order status', 'error');
    } finally {
      setStatusUpdating(false);
    }
  };

  // Search & Filter orders
  const getFilteredOrders = () => {
    let result = [...orders];

    // Search Query (matches OrderId or RazorpayOrderId)
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(o => 
        o.orderId.toLowerCase().includes(q) || 
        (o.razorpayOrderId && o.razorpayOrderId.toLowerCase().includes(q))
      );
    }

    // Status Filter
    if (statusFilter !== 'All') {
      result = result.filter(o => o.status === statusFilter);
    }

    // Sort by Date Descending
    result.sort((a, b) => {
      const d1 = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const d2 = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return d2 - d1;
    });

    return result;
  };

  const filteredOrders = getFilteredOrders();

  // Pagination slice
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrdersList = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="admin-orders-wrapper animate-fade-in">
        {/* Page Header */}
        <div className="admin-page-header">
          <div>
            <h1 className="admin-main-heading">Fulfillment & Orders Ledger</h1>
            <p className="admin-sub-heading">Track user payment verifications, update fulfillment status, and download invoices.</p>
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
              placeholder="Search by transaction ID or Razorpay order ID..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filters-group-controls">
            {/* Status Filter */}
            <div className="filter-select-wrapper">
              <FiFilter size={14} className="select-icon" />
              <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                <option value="All">All Transactions</option>
                <option value="PENDING">Pending Orders</option>
                <option value="SUCCESS">Completed Orders</option>
                <option value="FAILED">Failed Orders</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="table-card animate-fade-in">
          <div className="table-responsive-wrapper">
            <table className="admin-clean-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th>Gateway Ref</th>
                  <th>Status</th>
                  <th>Fulfillment Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="empty-row">Retrieving e-commerce transaction logs...</td>
                  </tr>
                ) : currentOrdersList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-row">No orders found matching the filter criteria.</td>
                  </tr>
                ) : (
                  currentOrdersList.map(o => (
                    <tr key={o.orderId}>
                      <td className="item-bold">{o.orderId}</td>
                      <td>₹{(o.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="gateway-ref">{o.razorpayOrderId || 'DIRECT_STORE_CHECKOUT'}</td>
                      <td>
                        <span className={`admin-status-badge ${o.status.toLowerCase()}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="time-col">{o.createdAt ? new Date(o.createdAt).toLocaleString() : 'N/A'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-actions-cell">
                          <button className="act-icon-btn view" onClick={() => { setSelectedOrder(o); setShowOrderModal(true); }} title="Fulfillment Details Card">
                            <FiEye size={14} />
                          </button>
                          <button 
                            className="act-icon-btn success-action" 
                            onClick={() => handleUpdateStatus(o.orderId, 'SUCCESS')}
                            disabled={o.status === 'SUCCESS'}
                            title="Complete Order Fulfillment"
                            style={{ color: o.status === 'SUCCESS' ? '#cbd5e1' : 'var(--color-success)' }}
                          >
                            ✓
                          </button>
                          <button 
                            className="act-icon-btn danger" 
                            onClick={() => handleUpdateStatus(o.orderId, 'FAILED')}
                            disabled={o.status === 'FAILED'}
                            title="Cancel Order Transaction"
                            style={{ color: o.status === 'FAILED' ? '#cbd5e1' : 'var(--color-error)' }}
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="admin-table-pagination">
              <span className="pagination-info">
                Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} entries
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

      {/* Order Details Modal Card */}
      {showOrderModal && selectedOrder && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box modal-wide">
            <div className="modal-header-row">
              <h3>Fulfillment Card: {selectedOrder.orderId}</h3>
              <button className="modal-close-btn" onClick={() => setShowOrderModal(false)}>✕</button>
            </div>
            
            <div className="order-details-modal-grid">
              <div className="order-meta-info-card">
                <h4 className="card-sub-heading">Transaction Summary</h4>
                <div className="detail-row">
                  <span className="label">Order Ledger ID:</span>
                  <span className="val">{selectedOrder.orderId}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Payment Gateway Code:</span>
                  <span className="val">{selectedOrder.razorpayOrderId || 'DIRECT_STORE_CHECKOUT'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Creation Date:</span>
                  <span className="val">{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Fulfillment Status:</span>
                  <span className={`admin-status-badge ${selectedOrder.status.toLowerCase()}`}>{selectedOrder.status}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Total Invoiced Amount:</span>
                  <span className="val font-semibold text-lg" style={{ color: '#2F80ED' }}>₹{(selectedOrder.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="status-update-actions-box">
                  <h5>Fulfillment Actions</h5>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button 
                      className="admin-btn-secondary success-btn" 
                      onClick={() => handleUpdateStatus(selectedOrder.orderId, 'SUCCESS')}
                      disabled={statusUpdating || selectedOrder.status === 'SUCCESS'}
                      style={{ flex: 1, color: 'var(--color-success)', borderColor: 'var(--color-success)' }}
                    >
                      Complete
                    </button>
                    <button 
                      className="admin-btn-secondary danger-btn" 
                      onClick={() => handleUpdateStatus(selectedOrder.orderId, 'FAILED')}
                      disabled={statusUpdating || selectedOrder.status === 'FAILED'}
                      style={{ flex: 1, color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                    >
                      Cancel
                    </button>
                    <button 
                      className="admin-btn-secondary" 
                      onClick={() => handleUpdateStatus(selectedOrder.orderId, 'PENDING')}
                      disabled={statusUpdating || selectedOrder.status === 'PENDING'}
                      style={{ flex: 1 }}
                    >
                      Reset Pending
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="order-items-ledger-card">
                <h4 className="card-sub-heading">Purchased Items</h4>
                <div className="table-responsive-wrapper" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  <table className="admin-clean-table compact">
                    <thead>
                      <tr>
                        <th>Product Details</th>
                        <th>Price/Unit</th>
                        <th>Qty</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!selectedOrder.orderItems || selectedOrder.orderItems.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="empty-row">No item listings linked to this order</td>
                        </tr>
                      ) : (
                        selectedOrder.orderItems.map(item => (
                          <tr key={item.id}>
                            <td className="item-bold">{item.product ? item.product.name : 'Unknown Product'}</td>
                            <td>₹{(item.pricePerUnit || 0).toLocaleString()}</td>
                            <td>{item.quantity} units</td>
                            <td>₹{(item.totalPrice || (item.pricePerUnit * item.quantity) || 0).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
