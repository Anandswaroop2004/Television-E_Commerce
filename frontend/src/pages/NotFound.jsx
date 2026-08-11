import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  const { cart, wishlist } = useAuth();

  return (
    <div className="portal-body">
      <Navbar 
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)} 
        wishlistCount={wishlist.length} 
      />

      <main className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="empty-state" style={{ maxWidth: '480px' }}>
          <FiAlertTriangle className="empty-icon" style={{ color: 'var(--color-error)' }} />
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '56px', fontWeight: '800', color: 'var(--color-dark)', margin: '10px 0' }}>
            404
          </h1>
          <h3 className="empty-title">Page Not Found</h3>
          <p className="empty-desc">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link to="/home" className="btn-primary" style={{ marginTop: '20px' }}>
            Back to Home Page
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
