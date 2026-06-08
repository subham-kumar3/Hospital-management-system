// Simplified, production-safe CORS configuration
// Exports: corsOptions, getAllowedOrigins, getSocketCorsOrigins

const processEnvFrontend = (process.env.FRONTEND_URL || '').trim();

// Allowed origins (explicit list). Add more origins if needed.
const allowedOrigins = [
  'https://shubham-hospital-management.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

// Return array of allowed origins (used by debug endpoints)
const getAllowedOrigins = () => {
  // If FRONTEND_URL env var is set, include it (normalize no trailing slash)
  const envFrontend = processEnvFrontend ? processEnvFrontend.replace(/\/$/, '') : null;
  const set = new Set(allowedOrigins.map((u) => u.replace(/\/$/, '')));
  if (envFrontend) set.add(envFrontend.replace(/\/$/, ''));
  return Array.from(set);
};

// Socket.IO origin helper
const getSocketCorsOrigins = () => {
  if (process.env.NODE_ENV !== 'production') return true;
  const list = getAllowedOrigins();
  return list.length > 0 ? list : false;
};

// CORS options for express
const corsOptions = {
  origin(origin, callback) {
    // allow requests with no origin (e.g., curl, mobile apps, Postman)
    if (!origin) return callback(null, true);

    const normalized = origin.replace(/\/$/, '');
    const allowed = getAllowedOrigins();

    if (allowed.includes(normalized)) {
      return callback(null, true);
    }

    console.warn('❌ CORS BLOCKED:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = {
  corsOptions,
  getAllowedOrigins,
  getSocketCorsOrigins
};
