import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://127.0.0.1:5000/api';

// Create axios instance
const axiosInstance = axios.create({ baseURL: BASE_URL });

// Attach token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global 401 handler — clear token and redirect to login
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      Cookies.remove('token');
      // Only redirect if not already on the login page
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

const api = {
  get:    (url)       => axiosInstance.get(url),
  post:   (url, data) => axiosInstance.post(url, data),
  put:    (url, data) => axiosInstance.put(url, data),
  delete: (url)       => axiosInstance.delete(url),
};

export default api;