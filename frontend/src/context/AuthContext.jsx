import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('auth_token') || null;
  });
  
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user_details');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error('Failed to parse user details from storage', e);
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [cart, setCart] = useState([]);

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (e) {
      console.error('Failed to parse wishlist from storage', e);
      return [];
    }
  });

  // Sync cart from backend when token changes
  useEffect(() => {
    if (token) {
      cartService.getCart(token)
        .then(items => {
          const mapped = items.map(item => ({
            product: {
              id: item.product.id ? String(item.product.id) : '',
              name: item.product.name,
              description: item.product.description || 'Premium e-commerce product.',
              price: item.product.price,
              originalPrice: parseFloat((item.product.price * 1.25).toFixed(2)),
              discount: 20,
              rating: parseFloat((4.2 + (item.product.id ? (item.product.id % 5) * 0.2 : 0)).toFixed(1)),
              reviewCount: 45 + (item.product.id ? (item.product.id * 17) % 300 : 0),
              brand: 'Brand',
              category: item.product.category ? item.product.category.name : 'Other',
              image: item.product.images && item.product.images.length > 0 ? item.product.images[0].imageUrl : '',
              images: item.product.images ? item.product.images.map(img => img.imageUrl) : [],
              stock: item.product.stock
            },
            quantity: item.quantity
          }));
          setCart(mapped);
        })
        .catch(err => {
          console.error('Failed to sync cart with database', err);
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            logout();
          }
        });
    } else {
      setCart([]);
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);


  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Toast helper
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Automatically remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Helper to parse validation/API errors
  const handleApiError = (error, fallbackMessage) => {
    if (error.response && error.response.data) {
      const data = error.response.data;
      if (data.errors) {
        // Return errors map for inline validation
        return { message: 'Validation failed. Please correct fields.', errors: data.errors };
      }
      return { message: data.message || fallbackMessage, errors: null };
    }
    return { message: error.message || fallbackMessage, errors: null };
  };

  const login = async (email, password, rememberMe) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password, rememberMe);
      
      setToken(data.token);
      setUser(data);

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_details', JSON.stringify(data));

      if (rememberMe) {
        localStorage.setItem('remember_email', email);
      } else {
        localStorage.removeItem('remember_email');
      }

      showToast(`Welcome back, ${data.username}!`, 'success');
      return { success: true, user: data };
    } catch (error) {
      const parsed = handleApiError(error, 'Invalid credentials');
      showToast(parsed.message, 'error');
      return { 
        success: false, 
        message: parsed.message, 
        isUnverified: error.response?.status === 401 && parsed.message.includes('not verified') 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, confirmPassword) => {
    setLoading(true);
    try {
      const data = await authService.register(username, email, password, confirmPassword);
      showToast(data.message || 'Registration successful!', 'success');
      return { success: true, message: data.message };
    } catch (error) {
      const parsed = handleApiError(error, 'Registration failed');
      showToast(parsed.message, 'error');
      return { success: false, message: parsed.message, errors: parsed.errors };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email, otp) => {
    setLoading(true);
    try {
      const data = await authService.verifyOtp(email, otp);
      showToast(data.message || 'Verification successful! Please log in.', 'success');
      return { success: true, message: data.message };
    } catch (error) {
      const parsed = handleApiError(error, 'Verification failed');
      showToast(parsed.message, 'error');
      return { success: false, message: parsed.message };
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (email) => {
    try {
      const data = await authService.resendOtp(email);
      showToast(data.message || 'A new verification OTP has been sent!', 'success');
      return { success: true, message: data.message };
    } catch (error) {
      const parsed = handleApiError(error, 'Failed to resend OTP');
      showToast(parsed.message, 'error');
      return { success: false, message: parsed.message };
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const data = await authService.forgotPassword(email);
      showToast(data.message || 'Reset OTP code has been sent!', 'success');
      return { success: true, message: data.message };
    } catch (error) {
      const parsed = handleApiError(error, 'Failed to send OTP code');
      showToast(parsed.message, 'error');
      return { success: false, message: parsed.message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, otp, newPassword, confirmPassword) => {
    setLoading(true);
    try {
      const data = await authService.resetPassword(email, otp, newPassword, confirmPassword);
      showToast(data.message || 'Password reset successful! Please log in.', 'success');
      return { success: true, message: data.message };
    } catch (error) {
      const parsed = handleApiError(error, 'Reset failed. Check OTP and verify passwords.');
      showToast(parsed.message, 'error');
      return { success: false, message: parsed.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_details');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_details');
    setToken(null);
    setUser(null);
    showToast('Signed out successfully', 'info');
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    if (token) {
      cartService.addToCart(token, parseInt(product.id), quantity)
        .then(() => showToast(`Added ${product.name} to Cart`, 'success'))
        .catch(err => {
          console.error('Failed to add cart item to database', err);
          showToast('Failed to sync item with database', 'error');
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            logout();
          }
        });
    } else {
      showToast(`Added ${product.name} to Cart`, 'success');
    }
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const product = prev.find(item => item.product.id === productId)?.product;
      if (product) {
        showToast(`Removed ${product.name} from Cart`, 'info');
      }
      return prev.filter(item => item.product.id !== productId);
    });

    if (token) {
      cartService.removeFromCart(token, parseInt(productId))
        .catch(err => {
          console.error('Failed to remove cart item from database', err);
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            logout();
          }
        });
    }
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));

    if (token) {
      cartService.updateCartItem(token, parseInt(productId), quantity)
        .catch(err => {
          console.error('Failed to update cart quantity in database', err);
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            logout();
          }
        });
    }
  };

  const clearCart = () => {
    setCart([]);
    if (token) {
      cartService.clearCart(token)
        .then(() => showToast('Cleared shopping cart', 'info'))
        .catch(err => {
          console.error('Failed to clear database cart', err);
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            logout();
          }
        });
    } else {
      showToast('Cleared shopping cart', 'info');
    }
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        showToast(`Removed ${product.name} from Wishlist`, 'info');
        return prev.filter(item => item.id !== product.id);
      }
      showToast(`Added ${product.name} to Wishlist`, 'success');
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };


  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        toasts,
        theme,
        toggleTheme,
        showToast,
        removeToast,
        login,
        register,
        verifyOtp,
        resendOtp,
        forgotPassword,
        resetPassword,
        logout,
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
