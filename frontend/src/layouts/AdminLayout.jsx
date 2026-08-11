import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiMenu, FiX, FiGrid, FiShoppingBag, FiUsers, FiDollarSign, 
  FiBarChart2, FiMessageSquare, FiTag, FiSettings, FiLogOut, 
  FiSearch, FiBell, FiChevronRight, FiCalendar, FiUser
} from 'react-icons/fi';

const AdminLayout = ({ children, activePage = '' }) => {
  const { user, logout, token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'LG OLED C3 stock is below 10 units!', type: 'warning', time: '5m ago' },
    { id: 2, text: 'New customer "Bob Raj" registered', type: 'info', time: '1h ago' },
    { id: 3, text: 'Order ORD202505200001 completed successfully', type: 'success', time: '2h ago' }
  ]);

  const activePath = location.pathname;

  // Automatically close mobile sidebar on navigation
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  // Protect admin layout from unauthorized users
  useEffect(() => {
    const savedUser = localStorage.getItem('user_details');
    if (!token || !savedUser) {
      navigate('/admin');
      return;
    }
    try {
      const parsed = JSON.parse(savedUser);
      if (parsed.role !== 'ADMIN') {
        navigate('/login');
      }
    } catch (e) {
      navigate('/admin');
    }
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiGrid size={18} /> },
    { name: 'Products', path: '/admin/products', icon: <FiShoppingBag size={18} /> },
    { name: 'Users', path: '/admin/users', icon: <FiUsers size={18} /> },
    { name: 'Orders', path: '/admin/orders', icon: <FiDollarSign size={18} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <FiBarChart2 size={18} /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <FiMessageSquare size={18} /> },
    { name: 'Coupons', path: '/admin/coupons', icon: <FiTag size={18} /> },
    { name: 'Settings', path: '/admin/settings', icon: <FiSettings size={18} /> }
  ];

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="admin-layout-container">
      {/* Mobile Dimmed Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="admin-mobile-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop Collapsible & Mobile Slide-in Drawer) */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">
            <div className="admin-logo-mark">B</div>
            {(!sidebarCollapsed || mobileSidebarOpen) && <span className="admin-logo-text">BrainBytes</span>}
          </div>
          
          {/* Desktop collapse button */}
          <button 
            className="sidebar-collapse-toggle-desktop" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle sidebar collapse"
          >
            <FiMenu size={18} />
          </button>

          {/* Mobile close button */}
          <button 
            className="sidebar-close-mobile" 
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close sidebar menu"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          <div className="admin-nav-section-label">
            {(!sidebarCollapsed || mobileSidebarOpen) && 'Core Modules'}
          </div>
          {navItems.map((item) => {
            const isItemActive = activePath === item.path || (activePage && item.name.toLowerCase() === activePage.toLowerCase());
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`admin-nav-item ${isItemActive ? 'active' : ''}`}
                title={sidebarCollapsed && !mobileSidebarOpen ? item.name : ''}
                onClick={() => setMobileSidebarOpen(false)}
              >
                <div className="admin-nav-item-icon">{item.icon}</div>
                {(!sidebarCollapsed || mobileSidebarOpen) && <span className="admin-nav-item-text">{item.name}</span>}
                {(!sidebarCollapsed || mobileSidebarOpen) && isItemActive && (
                  <FiChevronRight className="admin-nav-active-indicator" size={14} />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <button 
            className="admin-nav-item logout-btn" 
            onClick={handleLogout}
            title={sidebarCollapsed && !mobileSidebarOpen ? 'Logout' : ''}
          >
            <div className="admin-nav-item-icon"><FiLogOut size={18} /></div>
            {(!sidebarCollapsed || mobileSidebarOpen) && <span className="admin-nav-item-text">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className="admin-main-panel">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button 
              className="sidebar-collapse-toggle-mobile" 
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open sidebar navigation"
            >
              <FiMenu size={22} />
            </button>
            <div className="admin-search-wrapper">
              <FiSearch className="search-icon" size={16} />
              <input type="text" placeholder="Search orders, products, users..." className="admin-search-input" />
            </div>
          </div>

          <div className="admin-topbar-right">
            {/* Calendar (Hidden on mobile) */}
            <div className="admin-topbar-date">
              <FiCalendar size={15} style={{ marginRight: '6px' }} />
              <span>{currentDate}</span>
            </div>

            {/* Notifications */}
            <div className="admin-notification-container">
              <button 
                className="admin-icon-btn" 
                onClick={() => setShowNotifications(!showNotifications)}
                title="Notifications"
                aria-label="View notifications"
              >
                <FiBell size={18} />
                {notifications.length > 0 && <span className="notification-badge-dot"></span>}
              </button>

              {showNotifications && (
                <div className="admin-notifications-dropdown">
                  <div className="dropdown-header">
                    <h4>Notifications</h4>
                    <button className="clear-all-btn" onClick={() => setNotifications([])}>Clear All</button>
                  </div>
                  <div className="dropdown-list">
                    {notifications.length === 0 ? (
                      <p className="no-notifications">No new notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`notification-item ${n.type}`}>
                          <p>{n.text}</p>
                          <span>{n.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile */}
            <div className="admin-profile-badge">
              <div className="admin-avatar-circle">
                <FiUser size={16} />
              </div>
              <div className="admin-profile-info">
                <span className="profile-name">{user?.username || 'Admin'}</span>
                <span className="profile-role">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="admin-page-content-wrapper">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
