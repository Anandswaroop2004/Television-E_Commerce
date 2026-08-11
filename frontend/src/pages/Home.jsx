import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

// Import modular reusable components
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CategoryCard from '../components/CategoryCard';
import ProductSection from '../components/ProductSection';
import Filters from '../components/Filters';
import BrandSection from '../components/BrandSection';
import ReviewCard from '../components/ReviewCard';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import { SkeletonCardLoader } from '../components/Loader';
import EmptyState from '../components/EmptyState';
import BackToTop from '../components/BackToTop';

import { FiHeart, FiEye, FiShoppingCart, FiStar, FiTruck, FiFileText, FiShield, FiLock } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const Home = () => {
  const { cart, wishlist, addToCart, toggleWishlist, isInWishlist } = useAuth();
  const location = useLocation();

  // Search & Filter state variables
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 800000 });
  const [selectedRating, setSelectedRating] = useState(0);
  const [availability, setAvailability] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Categories list
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Products states
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Testimonials
  const [reviews, setReviews] = useState([]);

  // Interactive Quick View modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewQty, setQuickViewQty] = useState(1);

  // Sync category & search routing from location state
  useEffect(() => {
    if (location.state) {
      if (location.state.category) {
        setSelectedCategory(location.state.category);
        setSearchQuery('');
        scrollToFilters();
      }
      if (location.state.search !== undefined) {
        setSearchQuery(location.state.search);
        setSelectedCategory('All');
        scrollToFilters();
      }
      // Reset state once read
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Load category list
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const list = await categoryService.getCategories();
        setCategories(list);
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  // Load products list and testimonials
  useEffect(() => {
    const loadProductsAndReviews = async () => {
      try {
        const prods = await productService.getProducts();
        setAllProducts(prods);
        const revs = await productService.getCustomerReviews();
        setReviews(revs);
      } catch (err) {
        console.error('Failed to load data', err);
      }
    };
    loadProductsAndReviews();
  }, []);

  // Filter products locally (API-ready filter layer)
  useEffect(() => {
    setLoadingProducts(true);
    const timer = setTimeout(async () => {
      try {
        const filtered = await productService.searchAndFilterProducts(
          searchQuery,
          selectedCategory,
          priceRange,
          selectedRating,
          availability,
          sortBy
        );
        setFilteredProducts(filtered);
      } catch (err) {
        console.error('Filtering failed', err);
      } finally {
        setLoadingProducts(false);
      }
    }, 400); // 400ms skeleton delay

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, priceRange, selectedRating, availability, sortBy]);

  const scrollToFilters = () => {
    document.getElementById('filters-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickViewAdd = () => {
    if (selectedProduct) {
      addToCart(selectedProduct, quickViewQty);
      setSelectedProduct(null);
      setQuickViewQty(1);
    }
  };

  // Split products for separate home sections
  const featuredProducts = filteredProducts.filter(p => p.isFeatured);
  const trendingProducts = filteredProducts.filter(p => p.isTrending);
  const bestSellers = filteredProducts.filter(p => p.isBestSeller);
  const flashSales = filteredProducts.filter(p => p.isFlashSale);
  const newArrivals = filteredProducts.filter(p => p.isNewArrival);
  const recommendedProducts = filteredProducts.filter(p => p.isRecommended);

  const isFilterActive = selectedCategory !== 'All' || searchQuery !== '' || selectedRating > 0 || priceRange.min > 0 || priceRange.max < 800000 || availability !== 'all' || sortBy !== 'featured';

  return (
    <div className="portal-body">
      
      {/* Sticky Navbar */}
      <Navbar 
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)} 
        wishlistCount={wishlist.length}
        onSearch={(query) => {
          setSearchQuery(query);
          setSelectedCategory('All');
          scrollToFilters();
        }}
      />

      {/* Hero section carousel */}
      <Hero onShopNowClick={scrollToFilters} />

      {/* Services Section */}
      <section className="services-section">
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon-box">
              <FiTruck style={{ fontSize: '24px', color: 'var(--color-primary)' }} />
            </div>
            <div>
              <h5 className="service-title">Free Delivery</h5>
              <p className="service-desc">On orders above ₹999</p>
            </div>
          </div>
          <div className="service-card">
            <div className="service-icon-box">
              <FiFileText style={{ fontSize: '24px', color: 'var(--color-primary)' }} />
            </div>
            <div>
              <h5 className="service-title">No Cost EMI</h5>
              <p className="service-desc">Easy installment plans</p>
            </div>
          </div>
          <div className="service-card">
            <div className="service-icon-box">
              <FiShield style={{ fontSize: '24px', color: 'var(--color-primary)' }} />
            </div>
            <div>
              <h5 className="service-title">2 Years Warranty</h5>
              <p className="service-desc">On all products</p>
            </div>
          </div>
          <div className="service-card">
            <div className="service-icon-box">
              <FiLock style={{ fontSize: '24px', color: 'var(--color-primary)' }} />
            </div>
            <div>
              <h5 className="service-title">30-Day Returns</h5>
              <p className="service-desc">Hassle-free returns</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="categories-section">
        <div className="section-container">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 className="section-title" style={{ fontSize: '24px', fontWeight: '800' }}>Shop by Category</h2>
            <button 
              onClick={() => {
                setSelectedCategory('All');
                scrollToFilters();
              }}
              style={{
                color: 'var(--color-primary)',
                fontWeight: '600',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>View All Categories</span>
              <span>→</span>
            </button>
          </div>
          
          {loadingCategories ? (
            <div style={{ display: 'flex', gap: '20px', overflowX: 'auto' }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton-card" style={{ height: '240px', width: '220px' }}></div>
              ))}
            </div>
          ) : (
            <div className="category-grid">
              {categories.map(cat => (
                <CategoryCard 
                  key={cat.id} 
                  category={cat} 
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setSearchQuery('');
                    scrollToFilters();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Partners Brand Section */}
      <BrandSection onBrandClick={(brandName) => {
        setSearchQuery(brandName);
        scrollToFilters();
      }} />

      {/* Core Products Grid with Sidebar Filters */}
      <section className="products-section" id="filters-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-title-wrapper">
              <span className="section-tagline">Catalogue</span>
              <h2 className="section-title">Explore Our Products</h2>
            </div>
          </div>

          {/* Decomposed Filters Panel */}
          <Filters 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            selectedRating={selectedRating}
            onRatingChange={setSelectedRating}
            availability={availability}
            onAvailabilityChange={setAvailability}
            sortBy={sortBy}
            onSortByChange={setSortBy}
          />

          {/* Products Render / Loader / Empty states */}
          {loadingProducts ? (
            <SkeletonCardLoader count={8} />
          ) : filteredProducts.length === 0 ? (
            <EmptyState 
              title={searchQuery ? 'No Search Results' : 'No Products Matching Filters'}
              description="Please try typing a different search query or expanding your filter bounds."
              isSearch={!!searchQuery}
              onActionClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setPriceRange({ min: 0, max: 800000 });
                setSelectedRating(0);
                setAvailability('all');
                setSortBy('featured');
              }}
            />
          ) : isFilterActive ? (
            <ProductSection 
              title={
                selectedCategory !== 'All' 
                  ? `${selectedCategory} Collection` 
                  : searchQuery 
                    ? `Search Results for "${searchQuery}"` 
                    : "Filtered Catalogue"
              }
              subtitle={`${filteredProducts.length} Premium Products Found`}
              products={filteredProducts}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
              isWishlisted={isInWishlist}
              onQuickView={setSelectedProduct}
              rows={3}
              defaultShowAll={true}
            />
          ) : (
            <>
              {/* Flash Sales section */}
              {flashSales.length > 0 && (
                <ProductSection 
                  title="Super Flash Deals" 
                  subtitle="Limited Time Offers"
                  products={flashSales}
                  isFlashSale={true}
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={isInWishlist}
                  onQuickView={setSelectedProduct}
                />
              )}

              {/* Featured Section */}
              {featuredProducts.length > 0 && (
                <ProductSection 
                  title="Featured Products" 
                  subtitle="Top Picks for You"
                  products={featuredProducts}
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={isInWishlist}
                  onQuickView={setSelectedProduct}
                />
              )}

              {/* Trending products */}
              {trendingProducts.length > 0 && (
                <ProductSection 
                  title="Trending Right Now" 
                  subtitle="Popular Items"
                  products={trendingProducts}
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={isInWishlist}
                  onQuickView={setSelectedProduct}
                />
              )}

              {/* Best Sellers */}
              {bestSellers.length > 0 && (
                <ProductSection 
                  title="Our Best Sellers" 
                  subtitle="Customer Favorites"
                  products={bestSellers}
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={isInWishlist}
                  onQuickView={setSelectedProduct}
                />
              )}

              {/* New Arrivals */}
              {newArrivals.length > 0 && (
                <ProductSection 
                  title="New Arrivals" 
                  subtitle="Fresh Additions"
                  products={newArrivals}
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={isInWishlist}
                  onQuickView={setSelectedProduct}
                />
              )}

              {/* Recommended Products */}
              {recommendedProducts.length > 0 && (
                <ProductSection 
                  title="Recommended Products" 
                  subtitle="Specially Selected"
                  products={recommendedProducts}
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={isInWishlist}
                  onQuickView={setSelectedProduct}
                />
              )}
            </>
          )}

        </div>
      </section>

      {/* Customer reviews section */}
      <section className="reviews-section">
        <div className="section-container">
          <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '40px' }}>
            <div className="section-title-wrapper" style={{ alignItems: 'center' }}>
              <span className="section-tagline">Testimonials</span>
              <h2 className="section-title">What Our Customers Say</h2>
            </div>
          </div>
          <div className="reviews-grid">
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter signup */}
      <Newsletter />

      {/* Footer */}
      <Footer />

      {/* Back to top scroll tracking button */}
      <BackToTop />

      {/* Quick View Item Detail Modal Overlay */}
      {selectedProduct && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            style={{
              backgroundColor: 'var(--color-white)',
              color: 'var(--color-dark)',
              width: '100%',
              maxWidth: '800px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
              display: 'grid',
              gridTemplateColumns: '1fr',
              position: 'relative'
            }}
            className="quickview-modal-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
              <div style={{ height: '380px', backgroundColor: '#f1f5f9' }}>
                <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                    {selectedProduct.category}
                  </span>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', marginTop: '6px', lineHeight: '1.3' }}>
                    {selectedProduct.name}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-warning)' }}>
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} style={{ color: i < Math.floor(selectedProduct.rating) ? 'var(--color-warning)' : '#cbd5e1' }} />
                  ))}
                  <span style={{ color: 'var(--color-text-muted)', marginLeft: '6px' }}>
                    {selectedProduct.rating} ({selectedProduct.reviewCount} reviews)
                  </span>
                </div>

                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-text-muted)' }}>
                  {selectedProduct.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '10px' }}>
                  <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-primary)' }}>
                    ₹{selectedProduct.price.toLocaleString('en-IN')}
                  </span>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <>
                      <span style={{ fontSize: '15px', textDecoration: 'line-through', color: 'var(--color-text-muted)' }}>
                        ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-error)' }}>
                        ({selectedProduct.discount}% OFF)
                      </span>
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '15px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600' }}>Quantity:</label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                    <button onClick={() => setQuickViewQty(q => Math.max(1, q - 1))} style={{ padding: '6px 12px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                    <span style={{ padding: '6px 16px', fontSize: '14px', borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)' }}>{quickViewQty}</span>
                    <button onClick={() => setQuickViewQty(q => Math.min(selectedProduct.stock, q + 1))} style={{ padding: '6px 12px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button 
                    onClick={handleQuickViewAdd}
                    className="btn-primary" 
                    style={{ flexGrow: 1, padding: '12px' }}
                    disabled={selectedProduct.stock <= 0}
                  >
                    <FiShoppingCart /> Add to Cart
                  </button>
                  <button 
                    onClick={() => { toggleWishlist(selectedProduct); setSelectedProduct(null); }}
                    className="btn-secondary" 
                    style={{ padding: '12px' }}
                  >
                    <FiHeart style={{ fill: isInWishlist(selectedProduct.id) ? 'var(--color-error)' : 'none', color: isInWishlist(selectedProduct.id) ? 'var(--color-error)' : 'currentColor' }} />
                  </button>
                </div>

              </div>
            </div>

            <button 
              onClick={() => setSelectedProduct(null)} 
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)',
                color: 'var(--color-dark)'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
