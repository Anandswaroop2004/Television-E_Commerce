import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../services/apiConfig';
import { 
  FiShoppingBag, FiUsers, FiDollarSign, FiClock, FiActivity, 
  FiPlus, FiLayers, FiList, FiAlertTriangle, FiArrowUpRight, FiCheckCircle
} from 'react-icons/fi';
import AdminLayout from '../layouts/AdminLayout';

const AdminDashboard = () => {
  const { token, showToast } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    console.log('AdminDashboard MOUNTED');
    return () => console.log('AdminDashboard UNMOUNTED');
  }, []);

  useEffect(() => {
    console.log('AdminDashboard fetchDashboardData dependency changed:', { token: !!token, refreshKey });
  }, [token, refreshKey]);

  // Modal/Popup for Add Category
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [catLoading, setCatLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (stats === null) {
        setLoading(true);
      }
      setError(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/dashboard/stats?t=${Date.now()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
        setError(err.response?.data?.message || 'Connection to database failed. Please verify MySQL is running.');
        showToast('API Connection Error', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token, refreshKey]);

  // Set up real-time auto-refresh polling (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCatLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/categories`, { name: newCatName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Category added successfully!', 'success');
      setNewCatName('');
      setShowCatModal(false);
      setRefreshKey(prev => prev + 1); // reload dashboard
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add category', 'error');
    } finally {
      setCatLoading(false);
    }
  };

  const generateReport = () => {
    if (!stats) return;
    const reportData = `
=========================================
      BRAINBYTES ADMIN REPORT
=========================================
Generated At: ${new Date().toLocaleString()}
-----------------------------------------
Total Products:   ${stats.totalProducts || 101}
Total Categories: ${stats.totalCategories || 0}
Total Users:      ${stats.totalUsers || 0}
Total Orders:     ${stats.totalOrders || 0}
Pending Orders:   ${stats.pendingOrders || 0}
Completed Orders: ${stats.completedOrders || 0}
-----------------------------------------
Today's Revenue:  ₹${(stats.todayRevenue || 0).toFixed(2)}
Monthly Revenue:  ₹${(stats.monthlyRevenue || 0).toFixed(2)}
Overall Revenue:  ₹${(stats.overallRevenue || 0).toFixed(2)}
=========================================
    `;
    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BrainBytes_Report_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    showToast('Report generated successfully!', 'success');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-skeleton-wrapper">
          <div className="skeleton-title"></div>
          <div className="skeleton-grid-4">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
          <div className="skeleton-grid-2">
            <div className="skeleton-card large"></div>
            <div className="skeleton-card large"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="admin-error-state">
          <FiAlertTriangle size={48} className="error-icon" />
          <h3>Failed to Load Dashboard</h3>
          <p>{error}</p>
          <button className="admin-btn-primary" onClick={() => setRefreshKey(prev => prev + 1)}>
            Retry Connection
          </button>
        </div>
      </AdminLayout>
    );
  }

  // Render Premium SVG Line Chart for Revenue (Past 6 Months)
  const renderRevenueChart = () => {
    const data = stats?.revenueChart || [];
    if (data.length === 0) return <div className="no-chart-data">No sales recorded yet.</div>;

    const width = 500;
    const height = 180;
    const padding = 30;

    const maxVal = Math.max(...data.map(d => d.value), 1000);
    const minVal = 0;

    const getX = (index) => padding + (index * (width - padding * 2) / (data.length - 1));
    const getY = (val) => height - padding - (val * (height - padding * 2) / maxVal);

    const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');
    
    // Gradient fill path
    const fillPath = `M ${getX(0)},${height - padding} ` + 
                     data.map((d, i) => `L ${getX(i)},${getY(d.value)}`).join(' ') + 
                     ` L ${getX(data.length - 1)},${height - padding} Z`;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="svg-chart-element">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2F80ED" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#2F80ED" stopOpacity="0.0"/>
          </linearGradient>
        </defs>

        {/* Horizontal Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
          <line 
            key={i}
            x1={padding} 
            y1={padding + r * (height - padding * 2)} 
            x2={width - padding} 
            y2={padding + r * (height - padding * 2)} 
            stroke="#F0F1F5" 
            strokeWidth="1"
          />
        ))}

        {/* Gradient fill */}
        <path d={fillPath} fill="url(#chartGrad)" />

        {/* Smooth line */}
        <polyline fill="none" stroke="#2F80ED" strokeWidth="2.5" points={points} strokeLinecap="round" strokeLinejoin="round" />

        {/* Circles */}
        {data.map((d, i) => (
          <g key={i} className="chart-dot-group">
            <circle cx={getX(i)} cy={getY(d.value)} r="4" fill="#FFFFFF" stroke="#2F80ED" strokeWidth="2" />
            <title>{`${d.label}: ₹${d.value.toLocaleString()}`}</title>
          </g>
        ))}

        {/* X Axis Labels */}
        {data.map((d, i) => (
          <text 
            key={i} 
            x={getX(i)} 
            y={height - 10} 
            textAnchor="middle" 
            fontSize="10" 
            fill="#9BA3AF"
            fontWeight="500"
          >
            {d.label}
          </text>
        ))}
      </svg>
    );
  };

  // Render Premium SVG Bar Chart for Sales Count (Past 6 Months)
  const renderSalesChart = () => {
    const data = stats?.salesChart || [];
    if (data.length === 0) return <div className="no-chart-data">No transactions recorded yet.</div>;

    const width = 500;
    const height = 180;
    const padding = 30;

    const maxVal = Math.max(...data.map(d => d.count), 5);
    const barWidth = 32;

    const getX = (index) => padding + (index * (width - padding * 2) / (data.length - 1)) - barWidth/2;
    const getY = (val) => height - padding - (val * (height - padding * 2) / maxVal);
    const getBarHeight = (val) => (val * (height - padding * 2) / maxVal);

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="svg-chart-element">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
          <line 
            key={i}
            x1={padding} 
            y1={padding + r * (height - padding * 2)} 
            x2={width - padding} 
            y2={padding + r * (height - padding * 2)} 
            stroke="#F0F1F5" 
            strokeWidth="1"
          />
        ))}

        {/* Bars */}
        {data.map((d, i) => (
          <g key={i} className="chart-bar-group">
            <rect 
              x={getX(i) + 4} 
              y={getY(d.count)} 
              width={barWidth} 
              height={getBarHeight(d.count)} 
              fill="#2F80ED" 
              opacity="0.85" 
              rx="4" 
            />
            <title>{`${d.label}: ${d.count} orders`}</title>
          </g>
        ))}

        {/* X Axis Labels */}
        {data.map((d, i) => (
          <text 
            key={i} 
            x={getX(i) + 4 + barWidth/2} 
            y={height - 10} 
            textAnchor="middle" 
            fontSize="10" 
            fill="#9BA3AF"
            fontWeight="500"
          >
            {d.label}
          </text>
        ))}
      </svg>
    );
  };

  // Render Horizontal Segmented Share Bar for Category Sales
  const renderCategoryShare = () => {
    const data = stats?.categoryShare || [];
    if (data.length === 0) return <div className="no-chart-data">No categories records.</div>;

    const totalRev = data.reduce((sum, d) => sum + d.value, 0);
    if (totalRev === 0) return <div className="no-chart-data">No revenue generated yet.</div>;

    // Standard list of color schemes
    const colors = ['#2F80ED', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];

    return (
      <div className="category-share-container">
        {/* Horizontal Stacked Bar */}
        <div className="category-stacked-bar">
          {data.map((d, i) => {
            const pct = (d.value / totalRev) * 100;
            return (
              <div 
                key={d.categoryName} 
                className="category-bar-slice" 
                style={{ 
                  width: `${pct}%`, 
                  backgroundColor: colors[i % colors.length] 
                }}
                title={`${d.categoryName}: ${pct.toFixed(1)}%`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="category-legend">
          {data.map((d, i) => {
            const pct = (d.value / totalRev) * 100;
            return (
              <div key={d.categoryName} className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: colors[i % colors.length] }}></span>
                <span className="legend-name">{d.categoryName}</span>
                <span className="legend-value">{pct.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard-wrapper animate-fade-in">
        {/* Page Title & Controls */}
        <div className="admin-page-header">
          <div>
            <h1 className="admin-main-heading">Overview Dashboard</h1>
            <p className="admin-sub-heading">Real-time metrics, store activities, and business reports.</p>
          </div>
          <div className="dashboard-header-actions">
            <button className="admin-btn-secondary" onClick={() => setRefreshKey(prev => prev + 1)}>
              Sync Live Data
            </button>
          </div>
        </div>

        {/* Statistics Widgets Grid */}
        <div className="admin-stats-grid">
          {/* Revenue */}
          <div className="admin-stats-card">
            <div className="stats-card-header">
              <span className="stats-card-title">Overall Revenue</span>
              <div className="stats-icon-bg success">
                <FiDollarSign size={18} />
              </div>
            </div>
            <h2 className="stats-card-number">₹{(stats?.overallRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
            <div className="stats-card-footer">
              <span className="stats-pill success">+12%</span>
              <span className="stats-comparison">since last month</span>
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="admin-stats-card">
            <div className="stats-card-header">
              <span className="stats-card-title">Monthly Revenue</span>
              <div className="stats-icon-bg primary">
                <FiClock size={18} />
              </div>
            </div>
            <h2 className="stats-card-number">₹{(stats?.monthlyRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
            <div className="stats-card-footer">
              <span className="stats-pill primary">Current</span>
              <span className="stats-comparison">active billing cycle</span>
            </div>
          </div>

          {/* Total Orders */}
          <div className="admin-stats-card">
            <div className="stats-card-header">
              <span className="stats-card-title">Completed Orders</span>
              <div className="stats-icon-bg info">
                <FiShoppingBag size={18} />
              </div>
            </div>
            <h2 className="stats-card-number">{stats.completedOrders} <span style={{ fontSize: '13px', color: 'var(--color-paragraph)', fontWeight: 400 }}>/ {stats.totalOrders} total</span></h2>
            <div className="stats-card-footer">
              <span className="stats-pill info">{stats.pendingOrders} Pending</span>
              <span className="stats-comparison">awaiting fulfillment</span>
            </div>
          </div>

          {/* Active Customers */}
          <div className="admin-stats-card">
            <div className="stats-card-header">
              <span className="stats-card-title">Registered Users</span>
              <div className="stats-icon-bg warning">
                <FiUsers size={18} />
              </div>
            </div>
            <h2 className="stats-card-number">{stats.totalUsers}</h2>
            <div className="stats-card-footer">
              <span className="stats-pill warning">+24h</span>
              <span className="stats-comparison">active accounts</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="dashboard-quick-actions">
          <h3 className="section-title">Quick Actions</h3>
          <div className="quick-actions-buttons">
            <button className="action-btn" onClick={() => navigate('/admin/products?action=add')}>
              <div className="action-icon-circle"><FiPlus /></div>
              <span>Add Product</span>
            </button>
            <button className="action-btn" onClick={() => setShowCatModal(true)}>
              <div className="action-icon-circle"><FiLayers /></div>
              <span>Add Category</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/admin/orders')}>
              <div className="action-icon-circle"><FiList /></div>
              <span>View Orders</span>
            </button>
            <button className="action-btn" onClick={generateReport}>
              <div className="action-icon-circle"><FiActivity /></div>
              <span>Generate Report</span>
            </button>
          </div>
        </div>

        {/* Charts & Splits Section */}
        <div className="dashboard-charts-row">
          {/* Revenue Chart */}
          <div className="chart-card">
            <h4 className="chart-card-title">Revenue (Last 6 Months)</h4>
            <div className="svg-chart-container">
              {renderRevenueChart()}
            </div>
          </div>

          {/* Sales Chart */}
          <div className="chart-card">
            <h4 className="chart-card-title">Order Counts (Last 6 Months)</h4>
            <div className="svg-chart-container">
              {renderSalesChart()}
            </div>
          </div>

          {/* Category Pie */}
          <div className="chart-card pie">
            <h4 className="chart-card-title">Category Revenue Split</h4>
            <div className="svg-chart-container flex-center">
              {renderCategoryShare()}
            </div>
          </div>
        </div>

        {/* Tables & Activity Lists */}
        <div className="dashboard-tables-row">
          {/* Recent Orders */}
          <div className="table-card flex-2">
            <div className="table-card-header">
              <h4 className="table-card-title">Recent Transactions</h4>
              <button className="table-header-link" onClick={() => navigate('/admin/orders')}>View All</button>
            </div>
            <div className="table-responsive-wrapper">
              <table className="admin-clean-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.recentOrders || []).length === 0 ? (
                    <tr>
                      <td colSpan="4" className="empty-row">No recent transactions</td>
                    </tr>
                  ) : (
                    (stats?.recentOrders || []).map(o => (
                      <tr key={o.orderId}>
                        <td className="item-bold">{o.orderId}</td>
                        <td>₹{(o.totalAmount || 0).toLocaleString()}</td>
                        <td>
                          <span className={`admin-status-badge ${o.status.toLowerCase()}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="time-col">{new Date(o.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="table-card flex-1">
            <div className="table-card-header">
              <h4 className="table-card-title">Recent Store Activity</h4>
            </div>
            <div className="activity-feed-list">
              {(stats?.recentActivity || []).length === 0 ? (
                <p className="empty-feed">No recent store updates.</p>
              ) : (
                (stats?.recentActivity || []).map((act, i) => (
                  <div key={i} className="activity-feed-item">
                    <div className={`activity-indicator ${(act.type || 'INFO').toLowerCase()}`}></div>
                    <div className="activity-details">
                      <p className="activity-msg">{act.message}</p>
                      <span className="activity-time">{new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Best Sellers & Low Stock Row */}
        <div className="dashboard-tables-row">
          {/* Best Selling Products */}
          <div className="table-card">
            <div className="table-card-header">
              <h4 className="table-card-title">Best Selling Products</h4>
            </div>
            <div className="simple-item-list">
              {(stats?.bestSellingProducts || []).length === 0 ? (
                <p className="empty-list">No sales records.</p>
              ) : (
                (stats?.bestSellingProducts || []).map(p => (
                  <div key={p.id} className="simple-list-item">
                    <img 
                      src={p.image || 'https://via.placeholder.com/48?text=TV'} 
                      alt={p.name} 
                      className="list-item-img"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=TV'; }}
                    />
                    <div className="list-item-details">
                      <p className="list-item-name">{p.name}</p>
                      <p className="list-item-sub">Price: ₹{(p.price || 0).toLocaleString()}</p>
                    </div>
                    <div className="list-item-action-badge">
                      <span>{p.salesCount} sold</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="table-card">
            <div className="table-card-header">
              <h4 className="table-card-title">Low Stock Alert</h4>
              <button className="table-header-link" onClick={() => navigate('/admin/products')}>Manage Inventory</button>
            </div>
            <div className="simple-item-list">
              {(stats?.lowStockProducts || []).length === 0 ? (
                <p className="empty-list success-alert">
                  <FiCheckCircle style={{ marginRight: '6px', color: 'var(--color-success)' }} /> All product inventory levels healthy!
                </p>
              ) : (
                (stats?.lowStockProducts || []).map(p => (
                  <div key={p.id} className="simple-list-item">
                    <div className="list-item-details">
                      <p className="list-item-name">{p.name}</p>
                      <p className="list-item-sub">Category: {p.category?.name || 'Other'}</p>
                    </div>
                    <div className="list-item-action-badge danger">
                      <span>{p.stock} units left</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Customers */}
          <div className="table-card">
            <div className="table-card-header">
              <h4 className="table-card-title">Newest Customers</h4>
            </div>
            <div className="simple-item-list">
              {(stats?.recentCustomers || []).length === 0 ? (
                <p className="empty-list">No customers found.</p>
              ) : (
                (stats?.recentCustomers || []).map(c => (
                  <div key={c.id} className="simple-list-item">
                    <div className="user-initial-avatar">
                      {(c.username || 'U').substring(0, 2).toUpperCase()}
                    </div>
                    <div className="list-item-details">
                      <p className="list-item-name">{c.username}</p>
                      <p className="list-item-sub">{c.email}</p>
                    </div>
                    <div className="list-item-time">
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {showCatModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="modal-header-row">
              <h3>Create New Category</h3>
              <button className="modal-close-btn" onClick={() => setShowCatModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddCategory} className="modal-form">
              <div className="modal-input-field">
                <label>Category Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Smart OLED TVs" 
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  required
                  disabled={catLoading}
                />
              </div>
              <button type="submit" className="modal-action-btn" disabled={catLoading}>
                {catLoading ? 'Creating...' : 'Save Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
