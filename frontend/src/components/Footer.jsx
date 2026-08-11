import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiCheckCircle, FiHeadphones, FiAward, FiChevronDown } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer-section" style={{ backgroundColor: '#f8fafc', padding: '60px 24px 30px 24px', borderTop: '1px solid #e2e8f0' }}>
      <div className="footer-grid">
        
        {/* Column 1: Brand Info & Stay Updated */}
        <div className="footer-info-col" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Link to="/home" className="logo-container-custom" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div className="logo-icon-wrapper" style={{ backgroundColor: 'var(--color-primary)', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
                <rect x="11" y="13" width="2" height="3" rx="0.5" fill="#ffffff"></rect>
              </svg>
            </div>
            <div className="logo-text-wrapper">
              <div className="logo-title-custom">
                <span className="text-sales" style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>Sales</span>
                <span className="text-basket" style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-primary)' }}>Basket</span>
              </div>
              <span className="logo-tagline-custom" style={{ fontSize: '11px', color: '#64748b' }}>Shop More, Pay Less</span>
            </div>
          </Link>
          <p className="footer-desc" style={{ fontSize: '14px', lineHeight: '1.6', color: '#64748b', margin: 0, maxWidth: '300px' }}>
            Your one-stop destination for premium TVs and home entertainment. Top brands, best prices, and exceptional service.
          </p>
          <div className="footer-socials" style={{ display: 'flex', gap: '10px' }}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
              <FiFacebook size={16} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
              <FiInstagram size={16} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
              <FiTwitter size={16} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
              <FiYoutube size={16} />
            </a>
          </div>
          
          {/* Stay Updated Block */}
          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h5 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>Stay Updated</h5>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.5', maxWidth: '280px' }}>
              Subscribe to get the latest offers, new arrivals & exclusive discounts.
            </p>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', marginTop: '4px', maxWidth: '280px' }}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                style={{ 
                  flexGrow: 1, 
                  padding: '10px 14px', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '6px 0 0 6px', 
                  fontSize: '13px', 
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }} 
              />
              <button 
                type="submit" 
                style={{ 
                  backgroundColor: 'var(--color-primary)', 
                  color: '#ffffff', 
                  border: 'none', 
                  borderRadius: '0 6px 6px 0', 
                  padding: '0 16px', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  cursor: 'pointer' 
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Column 2: Shop Links */}
        <div className="footer-links-col">
          <div className="footer-title-wrapper">
            <h4 className="footer-col-title" style={{ margin: 0, fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a' }}>Shop</h4>
            <div className="title-accent-line" style={{ width: '18px', height: '2px', backgroundColor: 'var(--color-primary)', marginTop: '6px', marginBottom: '16px' }}></div>
          </div>
          <ul className="footer-links" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li className="footer-link-item"><Link to="/home">All Products</Link></li>
            <li className="footer-link-item"><Link to="/home" state={{ category: '4K Ultra HD TVs' }}>4K Ultra HD TVs</Link></li>
            <li className="footer-link-item"><Link to="/home" state={{ category: 'QLED TVs' }}>QLED TVs</Link></li>
            <li className="footer-link-item"><Link to="/home" state={{ category: 'OLED TVs' }}>OLED TVs</Link></li>
            <li className="footer-link-item"><Link to="/home" state={{ category: 'Gaming TVs' }}>Gaming TVs</Link></li>
            <li className="footer-link-item"><Link to="/home">Accessories</Link></li>
            <li className="footer-link-item"><Link to="/home">Deals & Offers</Link></li>
            <li className="footer-link-item"><Link to="/home">New Arrivals</Link></li>
          </ul>
        </div>

        {/* Column 3: Customer Service Links */}
        <div className="footer-links-col">
          <div className="footer-title-wrapper">
            <h4 className="footer-col-title" style={{ margin: 0, fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a' }}>Customer Service</h4>
            <div className="title-accent-line" style={{ width: '18px', height: '2px', backgroundColor: 'var(--color-primary)', marginTop: '6px', marginBottom: '16px' }}></div>
          </div>
          <ul className="footer-links" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li className="footer-link-item"><a href="#contact">Contact Us</a></li>
            <li className="footer-link-item"><a href="#faqs">FAQs</a></li>
            <li className="footer-link-item"><a href="#shipping">Shipping Policy</a></li>
            <li className="footer-link-item"><a href="#returns">Return Policy</a></li>
            <li className="footer-link-item"><a href="#warranty">Warranty Policy</a></li>
            <li className="footer-link-item"><Link to="/orders">Track Order</Link></li>
            <li className="footer-link-item"><a href="#bulk">Bulk Orders</a></li>
            <li className="footer-link-item"><a href="#install">Installation Guide</a></li>
          </ul>
        </div>

        {/* Column 4: Company Links */}
        <div className="footer-links-col">
          <div className="footer-title-wrapper">
            <h4 className="footer-col-title" style={{ margin: 0, fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a' }}>Company</h4>
            <div className="title-accent-line" style={{ width: '18px', height: '2px', backgroundColor: 'var(--color-primary)', marginTop: '6px', marginBottom: '16px' }}></div>
          </div>
          <ul className="footer-links" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li className="footer-link-item"><a href="#about">About Us</a></li>
            <li className="footer-link-item"><a href="#careers">Careers</a></li>
            <li className="footer-link-item"><a href="#blog">Blog</a></li>
            <li className="footer-link-item"><a href="#media">News & Media</a></li>
            <li className="footer-link-item"><a href="#terms">Terms & Conditions</a></li>
            <li className="footer-link-item"><a href="#privacy">Privacy Policy</a></li>
            <li className="footer-link-item"><a href="#sitemap">Sitemap</a></li>
          </ul>
        </div>

        {/* Column 5: Help Links */}
        <div className="footer-links-col">
          <div className="footer-title-wrapper">
            <h4 className="footer-col-title" style={{ margin: 0, fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a' }}>Help</h4>
            <div className="title-accent-line" style={{ width: '18px', height: '2px', backgroundColor: 'var(--color-primary)', marginTop: '6px', marginBottom: '16px' }}></div>
          </div>
          <ul className="footer-links" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li className="footer-link-item"><Link to="/profile">My Account</Link></li>
            <li className="footer-link-item"><Link to="/orders">Order History</Link></li>
            <li className="footer-link-item"><Link to="/wishlist">Wishlist</Link></li>
            <li className="footer-link-item"><a href="#compare">Compare</a></li>
            <li className="footer-link-item"><a href="#support">Support Center</a></li>
            <li className="footer-link-item"><a href="#cancellation">Cancellation Policy</a></li>
          </ul>
        </div>

      </div>

      {/* Structured Trust & Payment Banner Box */}
      <div className="footer-trust-box" style={{ 
        maxWidth: '1400px', 
        margin: '30px auto', 
        backgroundColor: '#f0f7ff', 
        border: '1px solid #d0e7ff', 
        borderRadius: '16px', 
        padding: '20px 24px', 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        alignItems: 'center'
      }}>
        
        {/* We Accept block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>We Accept</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* Visa */}
            <span style={{ fontFamily: '"Arial Black", sans-serif', fontWeight: '900', fontStyle: 'italic', fontSize: '18px', color: '#1a1f71' }}>VISA</span>
            {/* Mastercard */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ display: 'flex', position: 'relative', width: '22px', height: '14px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#eb001b', position: 'absolute', left: 0 }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f00', position: 'absolute', right: 0, opacity: 0.85 }}></div>
              </div>
              <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#334155', fontFamily: 'sans-serif' }}>mastercard</span>
            </div>
            {/* UPI */}
            <span style={{ fontFamily: '"Arial Black", sans-serif', fontWeight: '900', fontStyle: 'italic', fontSize: '14px', color: '#097969', letterSpacing: '-0.5px' }}>UPI</span>
            {/* Paytm */}
            <span style={{ fontFamily: 'sans-serif', fontWeight: '900', fontSize: '14px', color: '#002e6e' }}>pay<span style={{ color: '#00baf2' }}>tm</span></span>
            {/* PhonePe */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '4px', backgroundColor: '#5f259f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '10px', fontWeight: 'bold' }}>पे</div>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#5f259f', fontFamily: 'sans-serif' }}>PhonePe</span>
            </div>
          </div>
        </div>

        {/* Divider line in grid */}
        <div className="trust-divider" style={{ borderLeft: '1px solid #cbd5e1', height: '100%', display: 'none' }}></div>

        {/* Buy with Confidence block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Buy With Confidence</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiCheckCircle size={16} style={{ color: 'var(--color-primary)' }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>100% Original</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Genuine Products</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiHeadphones size={16} style={{ color: 'var(--color-primary)' }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>Expert Support</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>24/7 Assistance</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiAward size={16} style={{ color: 'var(--color-primary)' }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>Best Price</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Price Match Guarantee</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Sub Footer Copyright row */}
      <div className="sub-footer-row" style={{ 
        maxWidth: '1400px', 
        margin: '20px auto 0 auto', 
        borderTop: '1px solid #cbd5e1', 
        paddingTop: '20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '15px' 
      }}>
        <p className="footer-copy" style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
          &copy; 2024 SalesBasket. All rights reserved.
        </p>

        {/* Middle Localization selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '13px', color: '#64748b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
            <span style={{ fontSize: '14px' }}>🌐</span>
            <span>English</span>
            <FiChevronDown size={12} />
          </div>
          <div style={{ width: '1px', height: '12px', backgroundColor: '#cbd5e1' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* India Flag mini SVG */}
            <svg width="16" height="11" viewBox="0 0 3 2">
              <rect width="3" height="2" fill="#FF9933"/>
              <rect width="3" height="1.333" y="0.667" fill="#FFFFFF"/>
              <rect width="3" height="0.667" y="1.333" fill="#138808"/>
              <circle cx="1.5" cy="1" r="0.2" fill="#000080"/>
            </svg>
            <span>India</span>
          </div>
        </div>

        {/* Right Made with love */}
        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
          Made with ❤️ in India
        </p>
      </div>
    </footer>
  );
};

export default Footer;
