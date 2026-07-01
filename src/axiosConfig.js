import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

// Otomatis tempel token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // Pastikan kuncinya sama dengan yg di Login.jsx
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;