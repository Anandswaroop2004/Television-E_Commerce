import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  FiUser, 
  FiMail, 
  FiShield, 
  FiLock, 
  FiCheckCircle, 
  FiShoppingBag, 
  FiHeart, 
  FiShoppingCart, 
  FiLogOut,
  FiClock,
  FiMapPin
} from 'react-icons/fi';

const Profile = () => {
  const { user, cart, wishlist, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="portal-body">
      <Navbar 
        cartCount={totalCartItems} 
        wishlistCount={wishlist.length} 
      />

      <main className="page-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '30px 20px 60px 20px', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Profile Header Banner */}
        <div 
          style={{ 
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #1e40af 100%)',
            borderRadius: '16px',
            padding: '36px 30px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '32px',
            boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.25)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              color: '#ffffff',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '38px',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              flexShrink: 0
            }}>
              <FiUser />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '28px', fontWeight: '700', margin: 0 }}>
                  {user?.username || user?.fullName || 'Valued Customer'}
                </h1>
                <span 
                  style={{ 
                    fontSize: '11px', 
                    fontWeight: '700', 
                    backgroundColor: user?.role === 'ADMIN' ? '#fee2e2' : 'rgba(255, 255, 255, 0.25)',
                    color: user?.role === 'ADMIN' ? '#b91c1c' : '#ffffff',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {user?.role || 'CUSTOMER'}
                </span>
              </div>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '14px', margin: '6px 0 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiMail style={{ fontSize: '14px' }} /> {user?.email}
              </p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(5px)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
          >
            <FiLogOut /> Sign Out
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '20px', 
            marginBottom: '32px' 
          }}
        >
          <Link 
            to="/orders" 
            className="filter-panel-card" 
            style={{ 
              margin: 0, 
              padding: '20px', 
              textDecoration: 'none', 
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              <FiShoppingBag />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: '500' }}>My Orders</div>
              <div style={{ fontSize: '18px', fontWeight: '700', marginTop: '2px' }}>Track & History</div>
            </div>
          </Link>

          <Link 
            to="/cart" 
            className="filter-panel-card" 
            style={{ 
              margin: 0, 
              padding: '20px', 
              textDecoration: 'none', 
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              <FiShoppingCart />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: '500' }}>Cart Items</div>
              <div style={{ fontSize: '18px', fontWeight: '700', marginTop: '2px' }}>{totalCartItems} {totalCartItems === 1 ? 'Product' : 'Products'}</div>
            </div>
          </Link>

          <Link 
            to="/wishlist" 
            className="filter-panel-card" 
            style={{ 
              margin: 0, 
              padding: '20px', 
              textDecoration: 'none', 
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              <FiHeart />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: '500' }}>Wishlist</div>
              <div style={{ fontSize: '18px', fontWeight: '700', marginTop: '2px' }}>{wishlist.length} Saved</div>
            </div>
          </Link>
        </div>

        {/* Main Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          {/* Account Credentials Card */}
          <div className="filter-panel-card" style={{ margin: 0, padding: '24px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiUser style={{ color: 'var(--color-primary)' }} /> Profile Information
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <span style={{ fontWeight: '500', fontSize: '13.5px', color: 'var(--color-text-muted)' }}>Full Name</span>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{user?.username || user?.fullName || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <span style={{ fontWeight: '500', fontSize: '13.5px', color: 'var(--color-text-muted)' }}>Email Address</span>
                <span style={{ fontSize: '14px', fontWeight: '600', wordBreak: 'break-all', textAlign: 'right' }}>{user?.email || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <span style={{ fontWeight: '500', fontSize: '13.5px', color: 'var(--color-text-muted)' }}>Account Status</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <FiCheckCircle /> Verified Active
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                <span style={{ fontWeight: '500', fontSize: '13.5px', color: 'var(--color-text-muted)' }}>Default Address</span>
                <span style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <FiMapPin /> Set at checkout
                </span>
              </div>
            </div>
          </div>

          {/* Security & Account Protection Card */}
          <div className="filter-panel-card" style={{ margin: 0, padding: '24px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiShield style={{ color: 'var(--color-primary)' }} /> Security & Access
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <div>
                  <span style={{ display: 'block', fontWeight: '600', fontSize: '13.5px' }}>Password Protection</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Encrypted & secured with salt hash</span>
                </div>
                <Link 
                  to="/forgot-password" 
                  style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}
                >
                  Change
                </Link>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <div>
                  <span style={{ display: 'block', fontWeight: '600', fontSize: '13.5px' }}>Authentication Mode</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>JWT Secure Bearer Tokens</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-success)', background: 'rgba(16, 185, 129, 0.1)', padding: '3px 8px', borderRadius: '6px' }}>
                  Active
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                <div>
                  <span style={{ display: 'block', fontWeight: '600', fontSize: '13.5px' }}>Two-Factor OTP</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Email OTP Verification</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-primary)', background: 'var(--color-primary-light)', padding: '3px 8px', borderRadius: '6px' }}>
                  Enabled
                </span>
              </div>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Profile;
