import React from 'react';

const BRANDS = [
  { name: 'Sony' },
  { name: 'Samsung' },
  { name: 'LG' },
  { name: 'TCL' },
  { name: 'Hisense' },
  { name: 'Xiaomi' }
];

const renderBrandLogo = (brand) => {
  switch (brand.name) {
    case 'Sony':
      return <span style={{ fontFamily: '"Georgia", serif', fontWeight: 'bold', fontSize: '26px', letterSpacing: '4px', color: '#0f172a' }}>SONY</span>;
    case 'Samsung':
      return <span style={{ fontFamily: '"Arial Black", sans-serif', fontWeight: '900', fontSize: '22px', letterSpacing: '-1.5px', color: '#1428a0' }}>SAMSUNG</span>;
    case 'LG':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#c6004e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '11px', fontWeight: 'bold', fontFamily: 'sans-serif' }}>LG</div>
          <span style={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '22px', color: '#454545' }}>LG</span>
        </div>
      );
    case 'TCL':
      return <span style={{ fontFamily: '"Arial Black", sans-serif', fontWeight: '900', fontSize: '28px', color: '#e1251b', letterSpacing: '-1px' }}>TCL</span>;
    case 'Hisense':
      return <span style={{ fontFamily: '"Trebuchet MS", sans-serif', fontWeight: 'bold', fontSize: '24px', color: '#00857a' }}>Hisense</span>;
    case 'Xiaomi':
      return <span style={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '22px', color: '#0f172a', textTransform: 'lowercase' }}>xiaomi</span>;
    default:
      return brand.name;
  }
};

const BrandSection = ({ onBrandClick }) => {
  return (
    <section className="services-section" style={{ borderBottom: '1px solid var(--color-border)', padding: '50px 24px' }}>
      <div className="section-container">
        
        {/* Brand Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 className="section-title" style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>Shop by Featured Brands</h2>
          <button 
            onClick={() => document.getElementById('filters-section')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              color: 'var(--color-primary)',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'inherit',
              fontSize: '14px'
            }}
          >
            <span>View All Brands</span>
            <span>→</span>
          </button>
        </div>
        
        {/* Brand Cards Grid */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
            gap: '20px',
            marginTop: '20px'
          }}
        >
          {BRANDS.map((brand, idx) => (
            <div 
              key={idx}
              className="brand-card"
              onClick={() => onBrandClick && onBrandClick(brand.name)}
              style={{
                backgroundColor: 'var(--color-white)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '140px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.01)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.01)';
              }}
            >
              {/* Logo container */}
              <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {renderBrandLogo(brand)}
              </div>
              
              {/* Link */}
              <span style={{ color: 'var(--color-primary)', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Explore Now <span style={{ fontSize: '14px' }}>→</span>
              </span>
            </div>
          ))}
        </div>

        {/* Features Bar */}
        <div 
          className="brand-features-bar"
          style={{ 
            marginTop: '50px',
            backgroundColor: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.01)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
              </svg>
            </div>
            <div>
              <h5 style={{ margin: 0, fontWeight: '700', fontSize: '15px', color: 'var(--color-dark)' }}>Expert Support</h5>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>24/7 Dedicated Support</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="m9 11 2 2 4-4"></path>
              </svg>
            </div>
            <div>
              <h5 style={{ margin: 0, fontWeight: '700', fontSize: '15px', color: 'var(--color-dark)' }}>Secure Payments</h5>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>100% Secure Payments</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <div>
              <h5 style={{ margin: 0, fontWeight: '700', fontSize: '15px', color: 'var(--color-dark)' }}>Quality Guaranteed</h5>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>Genuine Products Only</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
            </div>
            <div>
              <h5 style={{ margin: 0, fontWeight: '700', fontSize: '15px', color: 'var(--color-dark)' }}>Best Price</h5>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>Price Match Guarantee</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BrandSection;
