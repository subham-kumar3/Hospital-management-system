const getAllowedOrigins = () => {
  const frontendUrl = process.env.FRONTEND_URL;
  const devDefaults = ['http://localhost:3000', 'http://localhost:5173'];

  if (process.env.NODE_ENV !== 'production') {
    if (!frontendUrl) {
      return devDefaults;
    }
    return [...new Set([...devDefaults, ...frontendUrl.split(',').map((url) => url.trim())])];
  }

  if (!frontendUrl) {
    console.warn('⚠️  FRONTEND_URL is not set. CORS will block browser requests in production.');
    return [];
  }

  return frontendUrl.split(',').map((url) => url.trim()).filter(Boolean);
};

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

const allowedOrigins = getAllowedOrigins();

const corsOptions = {
  origin(origin, callback) {
    // Allow server-to-server / curl requests
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    // Development: allow localhost + LAN IPs (phone/tablet on same WiFi)
    if (process.env.NODE_ENV !== 'production' && isLocalNetworkOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const getSocketCorsOrigins = () => {
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  return allowedOrigins.length > 0 ? allowedOrigins : false;
};

module.exports = {
  corsOptions,
  getAllowedOrigins,
  getSocketCorsOrigins
};
