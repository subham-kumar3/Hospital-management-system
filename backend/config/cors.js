/**
 * CORS Configuration for Hospital Management System
 * Supports Render deployment with Netlify frontend
 */

const normalizeOrigin = (url) => {
  if (!url) return '';
  return url.trim().replace(/\/$/, '');
};

/**
 * Get list of allowed origins from environment
 */
const getAllowedOrigins = () => {
  const frontendUrl = process.env.FRONTEND_URL;
  const devDefaults = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ];

  if (process.env.NODE_ENV !== 'production') {
    if (!frontendUrl) {
      return devDefaults.map(normalizeOrigin);
    }
    return [...new Set([
      ...devDefaults.map(normalizeOrigin),
      ...frontendUrl.split(',').map((url) => normalizeOrigin(url))
    ])];
  }

  // Production: require FRONTEND_URL to be set
  if (!frontendUrl) {
    console.error('❌ FRONTEND_URL is not set in production. CORS will be restrictive.');
    return [];
  }

  return frontendUrl.split(',').map((url) => normalizeOrigin(url)).filter(Boolean);
};

/**
 * Check if origin is from localhost/local network
 */
const isLocalNetworkOrigin = (origin) => {
  if (!origin) return false;

  return (
    /^https?:\/\/localhost(:\d+)?$/.test(origin)
    || /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)
    || /^https?:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin)
    || /^https?:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin)
    || /^https?:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin)
  );
};

/**
 * CORS middleware options
 * - Credentials: true (allows cookies and auth headers)
 * - Methods: Standard REST methods + OPTIONS for preflight
 * - AllowedHeaders: Content-Type and Authorization
 * - MaxAge: 86400 seconds (24 hours) to cache preflight
 */
const corsOptions = {
  origin(origin, callback) {
    // Allow requests without origin (e.g., curl, server-to-server)
    if (!origin) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = normalizeOrigin(origin);
    const allowedOrigins = getAllowedOrigins();

    // Check against allowed origins list
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
      return;
    }

    // Development: allow local network origins
    if (process.env.NODE_ENV !== 'production' && isLocalNetworkOrigin(normalizedOrigin)) {
      callback(null, true);
      return;
    }

    // Log and reject
    const allowedList = allowedOrigins.length > 0 ? allowedOrigins.join(', ') : 'none configured';
    console.warn(`🚫 CORS blocked origin: ${normalizedOrigin}`);
    console.warn(`   Allowed origins: ${allowedList}`);
    callback(new Error(`CORS blocked for origin: ${normalizedOrigin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24 hours
};

/**
 * Get Socket.IO CORS origins
 */
const getSocketCorsOrigins = () => {
  if (process.env.NODE_ENV !== 'production') {
    return true; // Allow all in development
  }

  const allowed = getAllowedOrigins();
  if (allowed.length === 0) {
    console.warn('⚠️  Socket.IO: No allowed origins configured for production');
    return false;
  }
  return allowed;
};

module.exports = {
  corsOptions,
  getAllowedOrigins,
  getSocketCorsOrigins
};
