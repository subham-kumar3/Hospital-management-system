import axios from 'axios';
import { getApiBaseUrl } from '../config/apiConfig';
import { getApiErrorMessage } from '../utils/apiErrors';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

api.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseUrl();
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const friendlyMessage = getApiErrorMessage(error);

    if (error.response?.status === 401) {
      const isAuthRoute = error.config?.url?.includes('/auth/login')
        || error.config?.url?.includes('/auth/register');

      if (!isAuthRoute) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        const publicPaths = ['/login', '/patient-login', '/pharmacist-login', '/register'];
        const isPublicPath = publicPaths.some((path) => window.location.pathname.startsWith(path));

        if (!isPublicPath) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(
      Object.assign(error, { friendlyMessage })
    );
  }
);

export default api;
