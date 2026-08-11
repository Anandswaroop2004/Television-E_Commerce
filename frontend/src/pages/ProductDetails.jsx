import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { SkeletonCardLoader } from '../components/Loader';
import { FiHeart, FiShoppingCart, FiChevronRight, FiChevronLeft, FiPlus, FiMinus, FiShield, FiTruck, FiRotateCcw } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, wishlist, addToCart, toggleWishlist, isInWishlist } = useAuth();

  // Page loading & item states
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      // Simulate API call delay for premium skeletons
      setTimeout(async () => {
        const item = await productService.getProductById(id);
        if (item) {
          setProduct(item);
          setActiveImage(item.image);
          setQuantity(1);

          // Get similar products
          const allProducts = await productService.getProducts();
          const filtered = allProducts.filter(p => p.category === item.category && p.id !== item.id);
          setSimilarProducts(filtered.slice(0, 4));

          // Manage recently viewed items list
          updateRecentlyViewed(item);
        } else {
          // If product not found, navigate to 404
          navigate('/404', { replace: true });
        }
        setLoading(false);
      }, 500);
    };

    fetchProduct();
    // Scroll page to top on routing changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, navigate]);

  // Load recently viewed from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recently_viewed');
    if (saved) {
      setRecentlyViewed(JSON.parse(saved).filter(item => item.id !== id).slice(0, 4));
    }
  }, [id]);

  const updateRecentlyViewed = (item) => {
    const saved = localStorage.getItem('recently_viewed');
    let list = saved ? JSON.parse(saved) : [];
    
    // Remove if already exists to push it to the beginning
    list = list.filter(p => p.id !== item.id);
    
    // Insert at front
    list.unshift(item);
    
    // Limit to 6 items
    list = list.slice(0, 6);
    
    localStorage.setItem('recently_viewed', JSON.stringify(list));
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="portal-body">
        <Navbar cartCount={cart.reduce((t, i) => t + i.quantity, 0)} wishlistCount={wishlist.length} />
        <main className="page-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', marginTop: '40px' }}>
            <div className="skeleton-card" style={{ height: '400px' }}>
              <div className="skeleton-image" style={{ height: '100%' }}></div>
            </div>
            <div className="skeleton-card" style={{ height: '400px' }}>
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text" style={{ width: '80%' }}></div>
              <div className="skeleton-price" style={{ marginTop: '40px' }}></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) return null;

  const isWish = isInWishlist(product.id);

  return (
    <div className="portal-body">
      <Navbar 
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)} 
        wishlistCount={wishlist.length} 
      />

      <main className="page-container">
        
        {/* Breadcrumb Navigation */}
        <nav 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '14px', 
            color: 'var(--color-text-muted)',
            marginBottom: '30px'
          }}
        >
          <Link to="/home" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Home</Link>
          <FiChevronRight size={14} />
          <Link to="/home" state={{ category: product.category }} style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
            {product.category}
          </Link>
          <FiChevronRight size={14} />
          <span style={{ color: 'var(--color-dark)', fontWeight: '600' }}>{product.name}</span>
        </nav>

        {/* Core Product Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px' }}>
          
          {/* Left Column: Image Gallery and Zoom */}
          <div>
            {/* Main Image container with zoom overflow hidden */}
            <div 
              style={{ 
                height: '420px', 
                backgroundColor: '#f1f5f9', 
                borderRadius: 'var(--radius-md)', 
                overflow: 'hidden',
                position: 'relative',
                cursor: 'zoom-in'
              }}
              className="gallery-main-img-container"
            >
              <img 
                src={activeImage} 
                alt={product.name} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
                className="gallery-zoom-img"
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.5)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                onMouseMove={(e) => {
                  const { left, top, width, height } = e.target.getBoundingClientRect();
                  const x = ((e.clientX - left) / width) * 100;
                  const y = ((e.clientY - top) / height) * 100;
                  e.target.style.transformOrigin = `${x}% ${y}%`;
                }}
              />
              
              {product.discount > 0 && (
                <span 
                  className="product-badge discount" 
                  style={{ top: '20px', left: '20px', fontSize: '12px', padding: '6px 12px' }}
                >
                  -{product.discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: activeImage === img ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      padding: 0,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <img src={img} alt={`${product.name} thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: details and selectors */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Title / Brand */}
            <div>
              <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                {product.brand}
              </span>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '32px', fontWeight: '700', marginTop: '8px', color: 'var(--color-dark)' }}>
                {product.name}
              </h1>
            </div>

            {/* Rating & Reviews Count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--color-warning)' }}>
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} style={{ color: i < Math.floor(product.rating) ? 'var(--color-warning)' : '#cbd5e1' }} />
              ))}
              <span style={{ color: 'var(--color-text-muted)', marginLeft: '6px' }}>
                <strong>{product.rating}</strong> ({product.reviewCount} verified reviews)
              </span>
            </div>

            {/* Prices */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '20px' }}>
              <span style={{ fontSize: '32px', fontWeight: '800', color: 'var(--color-primary)' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span style={{ fontSize: '18px', textDecoration: 'line-through', color: 'var(--color-text-muted)' }}>
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-error)' }}>
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} ({product.discount}%)
                  </span>
                </>
              )}
            </div>

            {/* Product description */}
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--color-text-main)' }}>
              {product.description}
            </p>

            {/* Actions: Quantity Selector, Wishlist and buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '25px', paddingTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontSize: '14px', fontWeight: '700' }}>Quantity:</span>
                
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{ padding: '6px 14px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                    disabled={product.stock <= 0}
                  >
                    <FiMinus />
                  </button>
                  <span style={{ padding: '6px 20px', fontSize: '15px', borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)' }}>
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    style={{ padding: '6px 14px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                    disabled={product.stock <= 0}
                  >
                    <FiPlus />
                  </button>
                </div>
                
                <span style={{ fontSize: '13px', fontWeight: '600', color: product.stock > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                  {product.stock > 0 ? `In Stock (${product.stock} items left)` : 'Currently Out of Stock'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '10px' }}>
                <button 
                  onClick={handleAddToCart}
                  className="btn-primary" 
                  style={{ flexGrow: 1, padding: '14px 28px', justifyContent: 'center', gap: '10px' }}
                  disabled={product.stock <= 0}
                >
                  <FiShoppingCart size={18} /> Add to Cart
                </button>
                
                <button 
                  onClick={handleBuyNow}
                  className="btn-secondary" 
                  style={{ padding: '14px 28px', flexGrow: 1, justifyContent: 'center', backgroundColor: 'var(--color-dark)', color: 'var(--color-white)', border: 'none' }}
                  disabled={product.stock <= 0}
                >
                  Buy Now
                </button>

                <button 
                  onClick={() => toggleWishlist(product)}
                  className="btn-secondary" 
                  style={{ padding: '14px' }}
                >
                  <FiHeart style={{ fill: isWish ? 'var(--color-error)' : 'none', color: isWish ? 'var(--color-error)' : 'currentColor' }} size={20} />
                </button>
              </div>
            </div>

            {/* Product Specifications table */}
            {product.specifications && (
              <div style={{ marginTop: '10px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Product Specifications</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <tbody>
                    {product.specifications.map((spec, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '10px 0', fontWeight: '600', color: 'var(--color-text-muted)', width: '40%' }}>{spec.key}</td>
                        <td style={{ padding: '10px 0', color: 'var(--color-dark)', fontWeight: '700' }}>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Protection details row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '15px', marginTop: '20px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <FiShield style={{ color: 'var(--color-primary)', fontSize: '18px' }} />
                <span>1 Year Warranty</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <FiTruck style={{ color: 'var(--color-primary)', fontSize: '18px' }} />
                <span>Express Delivery</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <FiRotateCcw style={{ color: 'var(--color-primary)', fontSize: '18px' }} />
                <span>Easy 30-Day Return</span>
              </div>
            </div>

          </div>
        </div>

        {/* Section: Similar Products */}
        {similarProducts.length > 0 && (
          <section className="products-section" style={{ marginTop: '60px', padding: '40px 0 0' }}>
            <div style={{ marginBottom: '30px' }}>
              <span className="section-tagline">Related</span>
              <h2 className="section-title">Similar Products you may like</h2>
            </div>
            <div className="products-grid">
              {similarProducts.map(p => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={isInWishlist(p.id)}
                  onQuickView={() => {}} // Simple details routing handle
                />
              ))}
            </div>
          </section>
        )}

        {/* Section: Recently Viewed Products */}
        {recentlyViewed.length > 0 && (
          <section className="products-section" style={{ marginTop: '40px', padding: '40px 0 0' }}>
            <div style={{ marginBottom: '30px' }}>
              <span className="section-tagline">History</span>
              <h2 className="section-title">Recently Viewed</h2>
            </div>
            <div className="products-grid">
              {recentlyViewed.map(p => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={isInWishlist(p.id)}
                  onQuickView={() => {}}
                />
              ))}
            </div>
          </section>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;
