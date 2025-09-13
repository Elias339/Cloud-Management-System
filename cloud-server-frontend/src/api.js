import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  timeout: 15000,
});

api.interceptors.request.use(config => {
  try {
    const info = JSON.parse(sessionStorage.getItem('userInfo'));
    if (info?.token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${info.token}`;
    }
  } catch (e) {
    console.log(e);
    
  }
  return config;
}, err => Promise.reject(err));

export default api;
