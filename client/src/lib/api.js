import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'https://annakshetram.onrender.com/api';
export const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://annakshetram.onrender.com';

// Handles both Cloudinary full URLs and legacy /uploads/ paths
export const imgUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
};

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('annakshetram_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('annakshetram_token');
      localStorage.removeItem('annakshetram_user');
    }
    return Promise.reject(error);
  }
);

export default api;
