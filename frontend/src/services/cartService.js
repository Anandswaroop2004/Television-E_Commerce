import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

export const cartService = {
  getCart: async (token) => {
    const response = await axios.get(`${API_BASE_URL}/api/cart`, {
      headers: getHeaders(token)
    });
    return response.data;
  },

  addToCart: async (token, productId, quantity = 1) => {
    const response = await axios.post(`${API_BASE_URL}/api/cart`, { productId, quantity }, {
      headers: getHeaders(token)
    });
    return response.data;
  },

  updateCartItem: async (token, productId, quantity) => {
    const response = await axios.put(`${API_BASE_URL}/api/cart/${productId}`, { quantity }, {
      headers: getHeaders(token)
    });
    return response.data;
  },

  removeFromCart: async (token, productId) => {
    const response = await axios.delete(`${API_BASE_URL}/api/cart/${productId}`, {
      headers: getHeaders(token)
    });
    return response.data;
  },

  clearCart: async (token) => {
    const response = await axios.delete(`${API_BASE_URL}/api/cart`, {
      headers: getHeaders(token)
    });
    return response.data;
  }
};
