const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const { corsOptions } = require('./config/cors');
const { initializeSocket } = require('./services/socketService');

// Load env vars (.env.local overrides, then mode-specific, then .env)
const nodeEnv = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${nodeEnv}.local` });
dotenv.config({ path: `.env.${nodeEnv}` });
dotenv.config({ path: '.env.local' });
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// ============================================================================
// MIDDLEWARE SETUP (in correct order)
// ============================================================================

// 1. CORS middleware - must be before routes
app.use(cors(corsOptions));

// 2. Explicit preflight handler for OPTIONS requests
app.options('/*', cors(corsOptions));

// 3. Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Request logging middleware (optional - for debugging)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path} from ${req.headers.origin || 'no-origin'}`);
    next();
  });
}

// ============================================================================
// API ROUTES
// ============================================================================

app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/bills', require('./routes/billRoutes'));
app.use('/api/patient', require('./routes/patientPortalRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/pharmacy', require('./routes/pharmacyRoutes'));
app.use('/api/nurse', require('./routes/nurseRoutes'));
app.use('/api/nurse/tasks', require('./routes/nurseTaskRoutes'));
app.use('/api/nurse/lab-reports', require('./routes/nurseLabRoutes'));
app.use('/api/vitals', require('./routes/vitalRoutes'));
app.use('/api/medications', require('./routes/medicationLogRoutes'));
app.use('/api/nurse-notes', require('./routes/nurseNoteRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/enquiries', require('./routes/enquiryRoutes'));
app.use('/api/lab', require('./routes/labRoutes'));
app.use('/api/doctor-portal', require('./routes/doctorPortalRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/lab-admin', require('./routes/labAdminRoutes'));
app.use('/api/export', require('./routes/exportRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/medical-records', require('./routes/medicalRecordRoutes'));

// ============================================================================
// DIAGNOSTIC ENDPOINTS
// ============================================================================

// Health check route
app.get('/api/health', (req, res) => {
  const { getConnectedUsers, getOnlineCountByRole } = require('./services/socketService');
  
  res.json({ 
    success: true, 
    message: 'Hospital Management System API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    frontend: process.env.FRONTEND_URL || 'not configured',
    realTime: {
      enabled: true,
      connectedUsers: getConnectedUsers().length,
      onlineByRole: getOnlineCountByRole()
    }
  });
});

// Socket.IO status endpoint
app.get('/api/socket-status', (req, res) => {
  const { getConnectedUsers, getOnlineCountByRole } = require('./services/socketService');
  
  res.json({
    success: true,
    data: {
      connectedUsers: getConnectedUsers(),
      onlineCount: getConnectedUsers().length,
      onlineByRole: getOnlineCountByRole()
    }
  });
});

// CORS debugging endpoint (development only)
if (process.env.NODE_ENV === 'development') {
  app.get('/api/cors-debug', (req, res) => {
    const { getAllowedOrigins } = require('./config/cors');
    res.json({
      success: true,
      debug: {
        requestOrigin: req.headers.origin,
        allowedOrigins: getAllowedOrigins(),
        frontendUrl: process.env.FRONTEND_URL,
        nodeEnv: process.env.NODE_ENV
      }
    });
  });
}

// ============================================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================================

// CORS error handler
app.use((err, req, res, next) => {
  if (err.message?.startsWith('CORS blocked')) {
    console.error(`❌ CORS Error: ${err.message}`);
    return res.status(403).json({
      success: false,
      message: 'Origin not allowed by CORS policy',
      requestOrigin: req.headers.origin,
      environment: process.env.NODE_ENV
    });
  }
  next(err);
});

// General error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
    hint: 'Check the API documentation or /api/health for available endpoints'
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 Hospital Management System - Backend Server');
  console.log('='.repeat(70));
  console.log(`Environment:        ${process.env.NODE_ENV || 'development'}`);
  console.log(`Port:               ${PORT}`);
  console.log(`Frontend URL:       ${process.env.FRONTEND_URL || 'not configured'}`);
  console.log(`WebSocket:          ✓ Active`);
  console.log(`Database:           ✓ Connected`);
  console.log('');
  console.log('📍 Diagnostic Endpoints:');
  console.log(`   - GET /api/health           (Check server status)`);
  console.log(`   - GET /api/socket-status    (Check real-time connections)`);
  if (process.env.NODE_ENV === 'development') {
    console.log(`   - GET /api/cors-debug       (Check CORS configuration)`);
  }
  console.log('='.repeat(70) + '\n');

  // Warn if FRONTEND_URL is not set in production
  if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
    console.error('⚠️  WARNING: FRONTEND_URL not configured in production!');
    console.error('   CORS will be restrictive. Set FRONTEND_URL in Render dashboard.');
  }
});
