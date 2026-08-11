import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiTruck,
  FiShield,
  FiPhone,
  FiSearch, 
  FiBell, 
  FiHeart, 
  FiShoppingCart, 
  FiUser, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiChevronDown,
  FiShoppingBag
} from 'react-icons/fi';

const Navbar = ({ cartCount = 0, wishlistCount = 0, onSearch }) => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Welcome to SalesBasket!' },
    { id: 2, text: 'Check out the new Arrivals in Accessories!' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync search input with URL/state or reset on navigate
  useEffect(() => {
    if (location.pathname !== '/home') {
      setSearchQuery('');
    }
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      navigate('/home', { state: { search: searchQuery } });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCategoryClick = (category) => {
    setIsMobileMenuOpen(false);
    navigate('/home', { state: { category } });
  };

  const isCategoryActive = (category) => {
    if (location.pathname !== '/home') return false;
    const activeCategory = location.state?.category || 'All';
    return activeCategory === category;
  };

  return (
    <>
      {/* Top Utility Bar */}
      <div className="nav-top-bar">
        <div className="nav-top-container">
          <div className="nav-top-left">
            <div className="nav-top-item">
              <FiTruck style={{ color: 'var(--color-primary)' }} />
              <span>Free Delivery on orders above ₹50,000</span>
            </div>
            <div className="nav-top-item">
              <FiShield style={{ color: 'var(--color-primary)' }} />
              <span>30-Day Money Back Guarantee</span>
            </div>
            <div className="nav-top-item">
              <FiShield style={{ color: 'var(--color-primary)' }} />
              <span>2 Years Warranty on All Products</span>
            </div>
          </div>
          <div className="nav-top-right">
            <div className="nav-top-item">
              <FiPhone style={{ color: 'var(--color-primary)' }} />
              <span>Need Help? 1800-123-4567</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="navbar-sticky">
        <div className="navbar-container">
          
          {/* Left Side: Logo & Tagline */}
          <Link to="/home" className="logo-container-custom">
            <div className="logo-icon-wrapper" style={{ backgroundColor: 'var(--color-primary)', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'none', border: 'none' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
                <rect x="11" y="13" width="2" height="3" rx="0.5" fill="#ffffff"></rect>
              </svg>
            </div>
            <div className="logo-text-wrapper">
              <div className="logo-title-custom">
                <span className="text-sales">Sales</span>
                <span className="text-basket">Basket</span>
              </div>
              <span className="logo-tagline-custom">Shop More, Pay Less</span>
            </div>
          </Link>

          {/* Center: Nav links (Desktop) */}
          <div className="nav-desktop-links-custom">
            <button 
              onClick={() => handleCategoryClick('All')} 
              className={`nav-link-custom ${isCategoryActive('All') ? 'active' : ''}`}
            >
              <span>Home</span>
            </button>
            
            <button 
              onClick={() => handleCategoryClick('4K Ultra HD TVs')} 
              className={`nav-link-custom ${isCategoryActive('4K Ultra HD TVs') ? 'active' : ''}`}
            >
              <span>4K Ultra HD TVs</span>
            </button>
            
            <button 
              onClick={() => handleCategoryClick('Gaming TVs')} 
              className={`nav-link-custom ${isCategoryActive('Gaming TVs') ? 'active' : ''}`}
            >
              <span>Gaming TVs</span>
            </button>
            
            <button 
              onClick={() => handleCategoryClick('QLED TVs')} 
              className={`nav-link-custom ${isCategoryActive('QLED TVs') ? 'active' : ''}`}
            >
              <span>QLED TVs</span>
            </button>
            
            <button 
              onClick={() => handleCategoryClick('OLED TVs')} 
              className={`nav-link-custom ${isCategoryActive('OLED TVs') ? 'active' : ''}`}
            >
              <span>OLED TVs</span>
            </button>
            
          </div>

          {/* Right Side: Actions (Search, Badges, Avatar) */}
          <div className="nav-actions-wrapper-custom" ref={dropdownRef}>
            
            {/* Search bar */}
            <form onSubmit={handleSearchSubmit} className="nav-search-container-custom">
              <input
                type="text"
                placeholder="Search for products..."
                className="nav-search-input-custom"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="nav-search-btn-custom" aria-label="Submit search">
                <FiSearch />
              </button>
            </form>

            {/* Theme toggle */}
            <button onClick={toggleTheme} className="icon-btn-custom" aria-label="Toggle theme">
              {theme === 'light' ? (
                <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
              ) : (
                <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
              )}
            </button>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setIsDropdownOpen(false); }} 
                className="icon-btn-custom"
                aria-label="Notifications"
              >
                <FiBell />
                {notifications.length > 0 && <span className="badge-custom red-badge">{notifications.length}</span>}
              </button>
              
              {showNotifications && (
                <div className="dropdown-panel-custom show" style={{ width: '260px' }}>
                  <div className="dropdown-panel-header">
                    <div className="dropdown-panel-title">Notifications</div>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} className="dropdown-panel-item" style={{ fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {n.text}
                    </div>
                  ))}
                  <button 
                    onClick={() => setNotifications([])} 
                    className="dropdown-panel-item clear-btn"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="icon-btn-custom" aria-label="Wishlist">
              <FiHeart />
              {wishlistCount > 0 && <span className="badge-custom blue-badge">{wishlistCount}</span>}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="icon-btn-custom" aria-label="Cart">
              <FiShoppingCart />
              {cartCount > 0 && <span className="badge-custom blue-badge">{cartCount}</span>}
            </Link>

            {/* User Avatar with Dropdown */}
            {user && (
              <div className="user-avatar-wrapper-custom">
                <button 
                  onClick={() => { setIsDropdownOpen(!isDropdownOpen); setShowNotifications(false); }} 
                  className="avatar-btn-custom"
                  aria-label="User profile dropdown"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '50%', background: 'none', border: 'none' }}
                >
                  <div className="icon-btn-custom" style={{ padding: 0 }}>
                    <FiUser style={{ fontSize: '24px' }} />
                  </div>
                </button>
                
                <div className={`dropdown-panel-custom ${isDropdownOpen ? 'show' : ''}`}>
                  <div className="dropdown-panel-header">
                    <div className="dropdown-panel-title">{user.username || user.fullName}</div>
                    <div className="dropdown-panel-subtitle">{user.email}</div>
                  </div>
                  <Link to="/profile" className="dropdown-panel-item" onClick={() => setIsDropdownOpen(false)}>
                    <FiUser /> Profile
                  </Link>
                  <Link to="/orders" className="dropdown-panel-item" onClick={() => setIsDropdownOpen(false)}>
                    <FiShoppingBag /> Orders
                  </Link>
                  <Link to="/wishlist" className="dropdown-panel-item" onClick={() => setIsDropdownOpen(false)}>
                    <FiHeart /> Wishlist
                  </Link>
                  <div className="dropdown-panel-divider"></div>
                  <button onClick={handleLogout} className="dropdown-panel-item logout-btn">
                    <FiLogOut /> Logout
                  </button>
                </div>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="mobile-nav-toggle-custom"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'show' : ''}`}>
          <form onSubmit={handleSearchSubmit} className="mobile-search-form">
            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search products..."
              className="nav-search-input-custom"
              style={{ width: '100%', paddingLeft: '38px', display: 'block' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <button onClick={() => handleCategoryClick('All')} className="dropdown-item">Home</button>
          <button onClick={() => handleCategoryClick('4K Ultra HD TVs')} className="dropdown-item">4K Ultra HD TVs</button>
          <button onClick={() => handleCategoryClick('Gaming TVs')} className="dropdown-item">Gaming TVs</button>
          <button onClick={() => handleCategoryClick('QLED TVs')} className="dropdown-item">QLED TVs</button>
          <button onClick={() => handleCategoryClick('OLED TVs')} className="dropdown-item">OLED TVs</button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
