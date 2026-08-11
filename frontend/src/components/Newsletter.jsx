import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (emailVal) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(emailVal);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email address is required');
      return;
    } else if (!validateEmail(email)) {
      setError('Please enter a valid email format');
      return;
    }

    alert(`Thank you for subscribing to SalesBasket updates with: ${email}!`);
    setEmail('');
  };

  return (
    <section className="newsletter-section" style={{ padding: '40px 24px', backgroundColor: 'transparent' }}>
      <div 
        className="section-container newsletter-container-custom"
        style={{
          backgroundColor: '#f1f5f9',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
        }}
      >
        {/* Left side content */}
        <div className="newsletter-left-pane" style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '8px', marginTop: 0 }}>Stay Updated</h2>
          <p style={{ fontSize: '15px', color: '#475569', marginBottom: '24px' }}>
            Get the latest offers, new arrivals, and exclusive discounts
          </p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', maxWidth: '480px', flexWrap: 'wrap' }} noValidate>
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="newsletter-input-custom"
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  fontSize: '14px',
                  outline: 'none'
                }}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                required
              />
              {error && (
                <span style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '6px', display: 'block' }}>
                  {error}
                </span>
              )}
            </div>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ 
                padding: '14px 28px', 
                borderRadius: '8px', 
                fontWeight: '700', 
                fontSize: '14px',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none'
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
        
        {/* Right side image */}
        <div className="newsletter-right-pane" style={{ height: '100%', minHeight: '220px', display: 'flex', alignItems: 'stretch' }}>
          <img 
            src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80" 
            alt="Stay Updated TV" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
