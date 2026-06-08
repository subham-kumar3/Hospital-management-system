/**
 * API URL resolution
 *
 * Development (npm run dev):
 *   import.meta.env.VITE_API_URL is empty
 *   → requests use /api/ → Vite proxy → http://localhost:5001
 *
 * Production (npm run build / Netlify):
 *   import.meta.env.VITE_API_URL = https://your-app.onrender.com
 *   → requests go directly to Render backend
 */
import { ENV } from './env';

const PLACEHOLDER_PATTERNS = ['REPLACE-WITH-YOUR', 'your-backend', 'your-app'];

export const normalizeBackendUrl = (url) => {
  if (!url) return '';

  let normalized = url.trim().replace(/\/$/, '');

  if (normalized.endsWith('/api')) {
    normalized = normalized.slice(0, -4);
  }

  return normalized;
};

const isValidApiUrl = (url) => {
  if (!url) return false;
  return !PLACEHOLDER_PATTERNS.some((pattern) => url.includes(pattern));
};

export const getApiBaseUrl = () => {
  const apiUrl = ENV.API_URL;

  if (isValidApiUrl(apiUrl)) {
    return `${normalizeBackendUrl(apiUrl)}/api/`;
  }

  return '/api/';
};

export const getSocketUrl = () => {
  const apiUrl = ENV.API_URL;

  if (isValidApiUrl(apiUrl)) {
    return normalizeBackendUrl(apiUrl);
  }

  if (typeof window !== 'undefined' && ENV.IS_DEV) {
    return window.location.origin;
  }

  return '';
};

export const isProductionApi = () => isValidApiUrl(ENV.API_URL);

export const getConfiguredBackendUrl = () => {
  const apiUrl = ENV.API_URL;
  return isValidApiUrl(apiUrl) ? normalizeBackendUrl(apiUrl) : null;
};
