import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiInfo } from 'react-icons/fi';

import { orderService } from '../services/orderService';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, wishlist, token, showToast } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shipping = subtotal > 50000 || subtotal === 0 ? 0 : 500;
  const tax = subtotal * 0.08; // 8% sales tax
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!token) {
      showToast('Please sign in to place an order', 'error');
      navigate('/login');
      return;
    }

    orderService.checkout(token)
      .then((orderData) => {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "BrainBytes E-Shop",
          description: `Order Payment for ${orderData.id}`,
          handler: function (response) {
            orderService.verifyPayment(token, {
              razorpayPaymentId: response.razorpay_payment_id || "pay_mock_12345",
              razorpayOrderId: response.razorpay_order_id || orderData.razorpayOrderId,
              razorpaySignature: response.razorpay_signature || "signature_mock_12345",
              orderId: orderData.id
            })
            .then(() => {
              showToast(`Order placed and payment verified successfully!`, 'success');
              clearCart();
              navigate('/home');
            })
            .catch(err => {
              console.error('Payment verification failed', err);
              showToast(err.response?.data?.message || 'Payment verification failed. Please try again.', 'error');
              navigate('/orders');
            });
          },
          prefill: {
            name: orderData.customerName,
            email: orderData.customerEmail,
          },
          theme: {
            color: "#1e3a8a",
          },
          modal: {
            ondismiss: function () {
              showToast('Payment cancelled by user.', 'warning');
            }
          }
        };

        if (orderData.razorpayOrderId && !orderData.razorpayOrderId.startsWith("order_mock_")) {
          options.order_id = orderData.razorpayOrderId;
        }

        const rzp = new window.Razorpay(options);
        rzp.open();
      })
      .catch(err => {
        console.error('Checkout failed', err);
        showToast(err.response?.data?.message || 'Checkout failed. Please try again.', 'error');
      });
  };

  return (
    <div className="portal-body">
      <Navbar 
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)} 
        wishlistCount={wishlist.length} 
      />

      <main className="page-container">
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '32px', fontWeight: '700', marginBottom: '30px' }}>
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="empty-state">
            <FiShoppingBag className="empty-icon" />
            <h3 className="empty-title">Your Cart is empty</h3>
            <p className="empty-desc">Looks like you haven't added any products to your cart yet. Let's go and explore some deals!</p>
            <Link to="/home" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }} className="cart-grid-wrapper">
            {/* We can build a nice responsive 2-column layout for md+ screens */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
                
                {/* Cart list layout */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {cart.map(item => (
                    <div 
                      key={item.product.id} 
                      className="filter-panel-card" 
                      style={{ 
                        margin: 0, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '20px', 
                        flexWrap: 'wrap',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                        />
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                            {item.product.category}
                          </span>
                          <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-dark)', marginTop: '4px' }}>
                            {item.product.name}
                          </h4>
                          <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginTop: '4px' }}>
                            ₹{item.product.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                        
                        {/* Quantity picker */}
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                          <button 
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} 
                            style={{ padding: '4px 10px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            -
                          </button>
                          <span style={{ padding: '4px 12px', fontSize: '13px', borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)' }}>
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} 
                            style={{ padding: '4px 10px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            +
                          </button>
                        </div>

                        {/* Total item price */}
                        <span style={{ fontSize: '16px', fontWeight: '700', minWidth: '70px', textAlign: 'right' }}>
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>

                        {/* Delete button */}
                        <button 
                          onClick={() => removeFromCart(item.product.id)} 
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-error)',
                            cursor: 'pointer',
                            fontSize: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px',
                            borderRadius: '50%'
                          }}
                          title="Remove item"
                        >
                          <FiTrash2 />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

              </div>

              {/* Clear cart action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/home" className="btn-secondary" style={{ border: 'none' }}>
                  ← Continue Shopping
                </Link>
                <button 
                  onClick={clearCart} 
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Clear Shopping Cart
                </button>
              </div>
            </div>

            {/* Order summary card */}
            <div className="filter-panel-card" style={{ height: 'fit-content' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Order Summary</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Subtotal</span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Shipping Fee</span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>
                    {shipping === 0 ? <span style={{ color: 'var(--color-success)' }}>FREE</span> : `₹${shipping.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Estimated Tax (8%)</span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-dark)' }}>Order Total</span>
                  <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-primary)' }}>₹{total.toLocaleString('en-IN')}</span>
                </div>

                {shipping > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-light)', padding: '10px', borderRadius: '4px', marginTop: '10px' }}>
                    <FiInfo /> Add <strong>₹{(50000 - subtotal).toLocaleString('en-IN')}</strong> more to get free shipping!
                  </div>
                )}

                <button 
                  onClick={handleCheckout}
                  className="btn-primary" 
                  style={{ width: '100%', padding: '14px', marginTop: '20px', justifyContent: 'center' }}
                >
                  Proceed to Checkout <FiArrowRight />
                </button>
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
