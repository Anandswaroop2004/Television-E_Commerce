import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiShoppingBag, FiCheckCircle, FiTruck, FiClock, FiAlertTriangle } from 'react-icons/fi';
import { orderService } from '../services/orderService';

const Orders = () => {
  const { cart, wishlist, token } = useAuth();
  const [ordersList, setOrdersList] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (token) {
      orderService.getOrders(token)
        .then(data => {
          const mapped = data.map(o => ({
            id: o.orderId,
            date: new Date(o.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            total: o.totalAmount,
            status: o.status === 'SUCCESS' ? 'Delivered' : o.status === 'PENDING' ? 'Processing' : 'Failed',
            items: o.orderItems ? o.orderItems.map(item => ({
              name: item.product.name,
              price: item.pricePerUnit,
              quantity: item.quantity,
              image: item.product.images && item.product.images.length > 0 ? item.product.images[0].imageUrl : ''
            })) : []
          }));
          // Sort orders by date descending
          setOrdersList(mapped.reverse());
        })
        .catch(err => {
          console.error('Failed to load orders from backend', err);
        })
        .finally(() => {
          setLoadingOrders(false);
        });
    } else {
      setOrdersList([]);
      setLoadingOrders(false);
    }
  }, [token]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered':
        return { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', icon: <FiCheckCircle /> };
      case 'Shipped':
        return { backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary)', icon: <FiTruck /> };
      case 'Processing':
      case 'Pending':
        return { backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)', icon: <FiClock /> };
      default:
        return { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', icon: <FiAlertTriangle /> };
    }
  };

  return (
    <div className="portal-body">
      <Navbar 
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)} 
        wishlistCount={wishlist.length} 
      />

      <main className="page-container">
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '32px', fontWeight: '700', marginBottom: '30px' }}>
          My Orders
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {loadingOrders ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading your orders...</div>
          ) : ordersList.length === 0 ? (
            <div className="empty-state">
              <FiShoppingBag className="empty-icon" />
              <h3 className="empty-title">No orders found</h3>
              <p className="empty-desc">Looks like you haven't placed any orders yet. Explore our premium televisions to make your first purchase!</p>
              <Link to="/home" className="btn-primary">
                Explore Catalog
              </Link>
            </div>
          ) : (
            ordersList.map(order => {
              const statusConfig = getStatusStyle(order.status);
            return (
              <div key={order.id} className="filter-panel-card" style={{ margin: 0, padding: '30px' }}>
                
                {/* Header details */}
                <div 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    borderBottom: '1px solid var(--color-border)', 
                    paddingBottom: '20px',
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                    gap: '15px'
                  }}
                >
                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'block' }}>Order ID</span>
                      <strong style={{ fontSize: '15px', color: 'var(--color-dark)' }}>{order.id}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'block' }}>Date Placed</span>
                      <strong style={{ fontSize: '15px', color: 'var(--color-dark)' }}>{order.date}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'block' }}>Total Amount</span>
                      <strong style={{ fontSize: '15px', color: 'var(--color-primary)' }}>₹{order.total.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  <span 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      fontWeight: '700',
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      ...statusConfig
                    }}
                  >
                    {statusConfig.icon} {order.status}
                  </span>
                </div>

                {/* Items grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} 
                      />
                      <div style={{ flexGrow: 1 }}>
                        <h4 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-dark)' }}>{item.name}</h4>
                        <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                          Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span style={{ fontSize: '15px', fontWeight: '700' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
