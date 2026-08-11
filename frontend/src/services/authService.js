import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (email, password, rememberMe) => {
    const response = await apiClient.post('/api/auth/login', { email, password, rememberMe });
    return response.data;
  },

  register: async (username, email, password, confirmPassword) => {
    const response = await apiClient.post('/api/auth/register', {
      username,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  },

  verifyOtp: async (email, otp) => {
    const response = await apiClient.post('/api/auth/verify-otp', { email, otp });
    return response.data;
  },

  resendOtp: async (email) => {
    const response = await apiClient.post('/api/auth/resend-otp', { email });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await apiClient.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (email, otp, newPassword, confirmPassword) => {
    const response = await apiClient.post('/api/auth/reset-password', {
      email,
      otp,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  getHomeDetails: async (token) => {
    const response = await apiClient.get('/api/home', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
