import axios from 'axios';

const getApiBaseUrl = () => {
  let url = (import.meta.env.VITE_API_URL || '').trim();
  if (!url) {
    url = 'https://trustora-backend-uvkw.onrender.com/api';
  }
  url = url.replace(/\/+$/, '');
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('trustora_token') || localStorage.getItem('hostboost_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
