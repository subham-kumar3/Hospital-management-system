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

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
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

// Health check route
app.get('/api/health', (req, res) => {
  const { getConnectedUsers, getOnlineCountByRole } = require('./services/socketService');
  
  res.json({ 
    success: true, 
    message: 'Hospital Management System API is running',
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.message?.startsWith('CORS blocked')) {
    return res.status(403).json({
      success: false,
      message: 'Origin not allowed by CORS policy'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🔌 Real-time WebSocket server is active`);
  console.log(`📊 Health check: /api/health`);
  if (process.env.FRONTEND_URL) {
    console.log(`🌐 Allowed frontend origins: ${process.env.FRONTEND_URL}`);
  }
});
