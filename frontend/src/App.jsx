import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import NotFound from './pages/NotFound';
import ProductDetails from './pages/ProductDetails';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminReviews from './pages/AdminReviews';
import AdminCoupons from './pages/AdminCoupons';
import AdminSettings from './pages/AdminSettings';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

// Global Toast Notifications Renderer
const ToastCenter = () => {
  const { toasts, removeToast } = useAuth();

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle style={{ color: 'var(--color-success)', fontSize: '18px' }} />;
      case 'error':
        return <FiAlertCircle style={{ color: 'var(--color-error)', fontSize: '18px' }} />;
      case 'info':
      default:
        return <FiInfo style={{ color: 'var(--color-warning)', fontSize: '18px' }} />;
    }
  };

  return (
    <div className="toast-container-react">
      {toasts.map(t => (
        <div 
          key={t.id} 
          className={`toast-react ${t.type}`}
          onClick={() => removeToast(t.id)}
        >
          {getToastIcon(t.type)}
          <span style={{ flexGrow: 1 }}>{t.message}</span>
          <button 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'rgba(255,255,255,0.6)', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FiX />
          </button>
        </div>
      ))}
    </div>
  );
};

const RootRedirect = () => {
  const { token, user } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return user?.role === 'ADMIN' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/home" replace />;
};

// Root Router mapping
const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route 
        path="/" 
        element={<RootRedirect />} 
      />

      {/* Public Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/ADMIN" element={<Navigate to="/admin" replace />} />
      <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
      
      {/* Protected Enterprise Admin routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/products" element={
        <ProtectedRoute>
          <AdminProducts />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute>
          <AdminUsers />
        </ProtectedRoute>
      } />
      <Route path="/admin/orders" element={
        <ProtectedRoute>
          <AdminOrders />
        </ProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedRoute>
          <AdminAnalytics />
        </ProtectedRoute>
      } />
      <Route path="/admin/reviews" element={
        <ProtectedRoute>
          <AdminReviews />
        </ProtectedRoute>
      } />
      <Route path="/admin/coupons" element={
        <ProtectedRoute>
          <AdminCoupons />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute>
          <AdminSettings />
        </ProtectedRoute>
      } />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected E-Commerce routes */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/product/:id" 
        element={
          <ProtectedRoute>
            <ProductDetails />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cart" 
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/orders" 
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/wishlist" 
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        } 
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ToastCenter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
