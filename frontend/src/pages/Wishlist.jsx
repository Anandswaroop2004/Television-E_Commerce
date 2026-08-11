import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart, cart } = useAuth();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="portal-body">
      <Navbar 
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)} 
        wishlistCount={wishlist.length} 
      />

      <main className="page-container">
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '32px', fontWeight: '700', marginBottom: '30px' }}>
          My Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div className="empty-state">
            <FiHeart className="empty-icon" />
            <h3 className="empty-title">Your Wishlist is empty</h3>
            <p className="empty-desc">Explore products in the SalesBasket catalogue and click the heart icon to save products here!</p>
            <Link to="/home" className="btn-primary">
              Discover Products
            </Link>
          </div>
        ) : (
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '30px' 
            }}
          >
            {wishlist.map(product => (
              <div 
                key={product.id} 
                className="filter-panel-card" 
                style={{ 
                  margin: 0, 
                  padding: 0, 
                  overflow: 'hidden', 
                  display: 'flex', 
                  flexDirection: 'column',
                  height: '100%' 
                }}
              >
                {/* Image block */}
                <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <button 
                    onClick={() => toggleWishlist(product)} 
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'var(--color-white)',
                      border: 'none',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                      color: 'var(--color-error)'
                    }}
                    title="Remove from wishlist"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                {/* Details block */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                    {product.category}
                  </span>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-dark)', height: '44px', overflow: 'hidden' }}>
                    {product.name}
                  </h4>
                  
                  <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-primary)', marginTop: 'auto' }}>
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>

                  <button 
                    onClick={() => addToCart(product, 1)} 
                    className="btn-primary" 
                    style={{ width: '100%', padding: '10px', marginTop: '16px', justifyContent: 'center' }}
                    disabled={product.stock <= 0}
                  >
                    <FiShoppingCart /> Add to Cart
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
