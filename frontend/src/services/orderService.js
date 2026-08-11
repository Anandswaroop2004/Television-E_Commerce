import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

export const orderService = {
  getOrders: async (token) => {
    const response = await axios.get(`${API_BASE_URL}/api/orders`, {
      headers: getHeaders(token)
    });
    return response.data;
  },

  checkout: async (token) => {
    const response = await axios.post(`${API_BASE_URL}/api/orders/checkout`, {}, {
      headers: getHeaders(token)
    });
    return response.data;
  },

  verifyPayment: async (token, paymentDetails) => {
    const response = await axios.post(`${API_BASE_URL}/api/orders/verify`, paymentDetails, {
      headers: getHeaders(token)
    });
    return response.data;
  }
};
