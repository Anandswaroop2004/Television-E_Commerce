import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const ProductSection = ({ 
  title, 
  subtitle, 
  products = [], 
  isFlashSale = false,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onQuickView,
  rows = 1,
  defaultShowAll = false
}) => {
  const [timeLeft, setTimeLeft] = useState(8 * 60 * 60); // 8 hours in seconds
  const [columns, setColumns] = useState(4);
  const [showAll, setShowAll] = useState(defaultShowAll);
  
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    if (!isFlashSale) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isFlashSale]);

  useEffect(() => {
    if (!gridRef.current) return;

    const updateColumns = () => {
      if (gridRef.current) {
        const width = gridRef.current.getBoundingClientRect().width;
        // columns * 260 + (columns - 1) * 30 <= width
        // columns * 290 - 30 <= width
        // columns * 290 <= width + 30
        const cols = Math.max(1, Math.floor((width + 30) / 290));
        setColumns(cols);
      }
    };

    updateColumns();

    if (typeof window !== 'undefined' && window.ResizeObserver) {
      const observer = new ResizeObserver(() => {
        updateColumns();
      });
      observer.observe(gridRef.current);
      return () => observer.disconnect();
    } else {
      window.addEventListener('resize', updateColumns);
      return () => window.removeEventListener('resize', updateColumns);
    }
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggle = () => {
    if (showAll) {
      setShowAll(false);
      // Wait a tick for the collapse to render, then scroll to section start
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else {
      setShowAll(true);
    }
  };

  if (products.length === 0) return null;

  const limitCount = columns * rows;
  const displayedProducts = showAll ? products : products.slice(0, limitCount);

  return (
    <section 
      ref={sectionRef} 
      className="products-section" 
      style={isFlashSale ? { backgroundColor: 'var(--color-primary-light)' } : {}}
    >
      <div className="section-container">
        
        {/* Section Header */}
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '15px' }}>
          <div className="section-title-wrapper">
            {isFlashSale ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span className="flash-sale-badge">⚡ FLASH SALE</span>
                <span 
                  style={{ 
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: '700',
                    fontSize: '14px',
                    color: 'var(--color-white)',
                    backgroundColor: 'var(--color-dark)',
                    padding: '4px 10px',
                    borderRadius: '4px'
                  }}
                >
                  Ends in: {formatTime(timeLeft)}
                </span>
              </div>
            ) : (
              <span className="section-tagline">{subtitle}</span>
            )}
            <h2 className="section-title" style={{ marginTop: '6px' }}>{title}</h2>
          </div>

          {products.length > limitCount && (
            <button 
              onClick={handleToggle}
              className="view-all-top-btn"
            >
              <span>{showAll ? 'View Less' : 'View All'}</span>
              <span>→</span>
            </button>
          )}
        </div>

        {/* Products Grid */}
        <div 
          ref={gridRef} 
          className="products-grid" 
          style={{ marginTop: '30px' }}
        >
          {displayedProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={isWishlisted(product.id)}
              onQuickView={onQuickView}
            />
          ))}
        </div>



      </div>
    </section>
  );
};

export default ProductSection;
