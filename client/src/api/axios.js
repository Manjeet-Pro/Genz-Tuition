import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Ensure baseURL always ends with /api (without double slashes)
if (!baseURL.endsWith('/api') && !baseURL.endsWith('/api/')) {
  baseURL = baseURL.replace(/\/$/, '') + '/api';
}

const API = axios.create({
  baseURL: baseURL,
});

// Middleware to add token to requests
API.interceptors.request.use((config) => {
  const adminInfo = localStorage.getItem('adminInfo');
  if (adminInfo) {
    const { token } = JSON.parse(adminInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
