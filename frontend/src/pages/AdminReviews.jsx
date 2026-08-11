import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../services/apiConfig';
import { 
  FiMessageSquare, FiTrash2, FiSearch, FiStar, FiAlertCircle
} from 'react-icons/fi';
import AdminLayout from '../layouts/AdminLayout';

const AdminReviews = () => {
  const { token, showToast } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch reviews
  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/reviews?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to load reviews', err);
      setError('Could not retrieve reviews. Verify backend service is running.');
      showToast('Error loading reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadReviews();
    }
  }, [token]);

  // Delete review
  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this customer review?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Review deleted successfully!', 'success');
      loadReviews();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete review', 'error');
    }
  };

  const getFilteredReviews = () => {
    let result = [...reviews];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        (r.comment && r.comment.toLowerCase().includes(q)) ||
        (r.user && r.user.username && r.user.username.toLowerCase().includes(q)) ||
        (r.product && r.product.name && r.product.name.toLowerCase().includes(q))
      );
    }
    return result;
  };

  const filteredReviews = getFilteredReviews();

  return (
    <AdminLayout activePage="reviews">
      <div className="admin-page-container">
        
        {/* Header */}
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Reviews & Moderation</h1>
            <p className="admin-page-subtitle">Inspect customer feedbacks, monitor satisfaction scores and moderate remarks.</p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="admin-filter-bar">
          <div className="admin-search-box">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by customer, product, or review text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input"
            />
          </div>
        </div>

        {/* Content list */}
        {loading ? (
          <div className="admin-loading-box">Loading customer reviews...</div>
        ) : error ? (
          <div className="admin-error-box">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="admin-empty-box">
            <FiMessageSquare className="empty-icon" />
            <h4>No customer reviews found</h4>
            <p>No reviews match your query or have been posted yet.</p>
          </div>
        ) : (
          <div className="admin-reviews-list-grid">
            {filteredReviews.map(r => (
              <div key={r.id} className="review-moderation-card">
                <div className="review-card-header">
                  <div className="review-user-info">
                    <div className="review-avatar">
                      {r.user?.username ? r.user.username[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h4 className="username-text">{r.user?.username || 'Verified Customer'}</h4>
                      <p className="user-email-text">{r.user?.email || 'customer@salesbasket.com'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteReview(r.id)} 
                    className="review-delete-btn"
                    title="Delete Review"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <div className="review-rating-row">
                  {[1, 2, 3, 4, 5].map(star => (
                    <FiStar 
                      key={star} 
                      style={{ 
                        color: star <= (r.rating || 5) ? '#F59E0B' : '#E5E7EB',
                        fill: star <= (r.rating || 5) ? '#F59E0B' : 'transparent',
                        fontSize: '14px'
                      }} 
                    />
                  ))}
                  <span className="review-date-text">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>

                <p className="review-comment-text">"{r.comment || 'Great quality television!'}"</p>

                <div className="review-product-tag">
                  <span className="tag-label">Item:</span>
                  <span className="product-name-link">{r.product?.name || 'Ultra HD Smart TV'}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
