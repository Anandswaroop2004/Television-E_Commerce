import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiEye, FiShoppingCart, FiInfo } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onQuickView }) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Navigate to product detail page, but ignore clicks on action buttons
    if (e.target.closest('.card-action-btn') || e.target.closest('.wishlist-btn-badge') || e.target.closest('.add-cart-btn')) {
      return;
    }
    navigate(`/product/${product.id}`);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (product.stock > 0) {
      onAddToCart(product, 1);
      navigate('/cart');
    }
  };

  return (
    <div className="product-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      
      {/* Product Image and Overlay Actions */}
      <div className="product-card-image-box">
        <img src={product.image} alt={product.name} className="product-card-img" />
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <span className="product-badge discount">-{product.discount}%</span>
        )}

        {/* Wishlist toggle */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }} 
          className={`wishlist-btn-badge ${isWishlisted ? 'active' : ''}`}
          aria-label="Toggle Wishlist"
        >
          <FiHeart style={{ fill: isWishlisted ? 'currentColor' : 'none' }} />
        </button>

        {/* Hover action overlays */}
        <div className="product-card-actions-overlay">
          <button 
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }} 
            className="overlay-action-btn card-action-btn"
            title="Quick View"
          >
            <FiEye />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product, 1); }} 
            className="overlay-action-btn card-action-btn"
            title="Add To Cart"
            disabled={product.stock <= 0}
          >
            <FiShoppingCart />
          </button>
        </div>
      </div>

      {/* Info details */}
      <div className="product-card-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="product-card-category">{product.category}</span>
          <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-text-muted)' }}>{product.brand}</span>
        </div>
        <h4 className="product-card-name" title={product.name}>{product.name}</h4>
        
        {/* Rating and Reviews */}
        <div className="product-card-rating">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} style={{ color: i < Math.floor(product.rating) ? 'var(--color-warning)' : '#cbd5e1' }} />
          ))}
          <span className="product-card-rating-text">{product.rating} ({product.reviewCount})</span>
        </div>

        {/* Stock Status */}
        <div style={{ marginBottom: '12px' }}>
          <span 
            style={{ 
              fontSize: '11px', 
              fontWeight: '700', 
              color: product.stock > 0 ? 'var(--color-success)' : 'var(--color-error)'
            }}
          >
            {product.stock > 0 ? `In Stock (${product.stock} items)` : 'Out of Stock'}
          </span>
        </div>

        {/* Price and Add/Buy actions */}
        <div className="product-card-footer">
          <div className="product-price-box">
            <span className="product-price-current">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice > product.price && (
              <span className="product-price-original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={(e) => { e.stopPropagation(); onAddToCart(product, 1); }} 
              className="add-cart-btn"
              disabled={product.stock <= 0}
              title={product.stock > 0 ? "Add to Cart" : "Out of stock"}
            >
              <FiShoppingCart size={15} />
            </button>
            <button 
              onClick={handleBuyNow} 
              className="add-cart-btn card-action-btn"
              style={{ backgroundColor: 'var(--color-dark)', color: 'var(--color-white)', padding: '6px 10px', fontSize: '11px', fontWeight: '700' }}
              disabled={product.stock <= 0}
              title="Buy Now"
            >
              Buy Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
