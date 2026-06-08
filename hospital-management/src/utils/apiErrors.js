import { isProductionApi } from '../config/apiConfig';

/**
 * Converts axios/network errors into user-friendly messages.
 */
export const getApiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error) {
    return fallback;
  }

  if (error.friendlyMessage) {
    return error.friendlyMessage;
  }

  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }
    if (import.meta.env.PROD) {
      return 'Unable to reach the server. Backend may be starting (wait 60s) or CORS is misconfigured — set FRONTEND_URL on Render to your Netlify URL.';
    }
    return 'Unable to reach the server. Check your internet connection and ensure the backend is running.';
  }

  const { status, data } = error.response;
  const requestUrl = error.config?.baseURL
    ? `${error.config.baseURL.replace(/\/$/, '')}${error.config.url || ''}`
    : error.config?.url;

  if (data && typeof data === 'object' && data.message) {
    return data.message;
  }

  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Invalid credentials or session expired. Please log in again.';
    case 403:
      if (data?.message?.includes('CORS')) {
        return 'CORS blocked. On Render set FRONTEND_URL=https://shubham-hospital-management.netlify.app then redeploy.';
      }
      return data?.message || 'You do not have permission to perform this action.';
    case 404:
      if (import.meta.env.PROD && !isProductionApi()) {
        return 'API server is not configured. Set VITE_API_URL in Netlify to your Render backend URL, then redeploy.';
      }
      return `API endpoint not found (404). Check your backend URL${requestUrl ? `: ${requestUrl}` : ''}.`;
    case 409:
      return 'This action conflicts with existing data.';
    case 422:
      return 'Validation failed. Please check your input.';
    case 429:
      return 'Too many requests. Please wait and try again.';
    case 500:
      return 'Server error. Please try again later.';
    case 503:
      return 'Service temporarily unavailable. The backend may be starting up — wait 30 seconds and retry.';
    default:
      return fallback;
  }
};
