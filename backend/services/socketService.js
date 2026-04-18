const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

// Store connected users by role and ID
const connectedUsers = new Map();

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Middleware for authentication
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      socket.userName = decoded.name || 'User';
      
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.userName} (${socket.userRole}) - Socket ID: ${socket.id}`);

    // Store user connection
    connectedUsers.set(socket.id, {
      userId: socket.userId,
      role: socket.userRole,
      name: socket.userName,
      connectedAt: new Date()
    });

    // Join role-specific room
    socket.join(`role:${socket.userRole}`);
    socket.join(`user:${socket.userId}`);

    // Join general hospital room
    socket.join('hospital:all');

    // Send current connected users count
    socket.emit('connected_users_count', connectedUsers.size);

    // Broadcast user joined
    socket.to('hospital:all').emit('user_joined', {
      userId: socket.userId,
      role: socket.userRole,
      name: socket.userName,
      onlineCount: connectedUsers.size
    });

    // Handle client events
    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`📍 ${socket.userName} joined room: ${room}`);
    });

    socket.on('leave_room', (room) => {
      socket.leave(room);
    });

    socket.on('typing', (data) => {
      socket.to(`room:${data.room}`).emit('user_typing', {
        userId: socket.userId,
        name: socket.userName,
        ...data
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.userName} (${socket.userRole})`);
      connectedUsers.delete(socket.id);

      socket.to('hospital:all').emit('user_left', {
        userId: socket.userId,
        role: socket.userRole,
        name: socket.userName,
        onlineCount: connectedUsers.size
      });
    });
  });

  console.log('✅ Socket.IO initialized');
  return io;
};

// Helper function to emit events
const emitEvent = (event, data, options = {}) => {
  if (!io) return;

  const { room, role, userId, broadcast = true } = options;

  if (userId) {
    // Send to specific user
    io.to(`user:${userId}`).emit(event, data);
  } else if (role) {
    // Send to specific role
    io.to(`role:${role}`).emit(event, data);
  } else if (room) {
    // Send to specific room
    io.to(room).emit(event, data);
  } else if (broadcast) {
    // Broadcast to all
    io.emit(event, data);
  }
};

// Real-time event emitters
const emitPatientUpdate = (action, patient) => {
  emitEvent('patient_update', {
    action, // created, updated, deleted
    patient,
    timestamp: new Date()
  });
};

const emitAppointmentUpdate = (action, appointment) => {
  emitEvent('appointment_update', {
    action, // created, updated, cancelled, completed
    appointment,
    timestamp: new Date()
  });

  // Notify specific doctor
  if (appointment.doctor) {
    emitEvent('doctor_appointment_update', {
      action,
      appointment,
      timestamp: new Date()
    }, { userId: appointment.doctor._id || appointment.doctor });
  }
};

const emitLabTestUpdate = (action, labTest) => {
  emitEvent('lab_test_update', {
    action, // requested, in_progress, completed, cancelled
    labTest,
    timestamp: new Date()
  });

  // Notify the requesting doctor
  if (labTest.requestedBy) {
    emitEvent('doctor_lab_update', {
      action,
      labTest,
      timestamp: new Date()
    }, { userId: labTest.requestedBy });
  }
};

const emitPrescriptionUpdate = (action, prescription) => {
  emitEvent('prescription_update', {
    action, // created, updated, dispensed
    prescription,
    timestamp: new Date()
  });
};

const emitInventoryUpdate = (action, item) => {
  emitEvent('inventory_update', {
    action, // updated, low_stock, out_of_stock
    item,
    timestamp: new Date()
  });

  // Alert pharmacists about low stock
  if (action === 'low_stock' || action === 'out_of_stock') {
    emitEvent('low_stock_alert', {
      item,
      action,
      timestamp: new Date()
    }, { role: 'Pharmacist' });
  }
};

const emitNotification = (notification, targetOptions = {}) => {
  emitEvent('new_notification', {
    notification,
    timestamp: new Date()
  }, targetOptions);
};

const emitActivityLog = (log) => {
  emitEvent('activity_log_update', {
    log,
    timestamp: new Date()
  }, { role: 'Admin' });
};

const emitDashboardUpdate = (data) => {
  emitEvent('dashboard_update', {
    data,
    timestamp: new Date()
  });
};

// Get connected users info
const getConnectedUsers = () => {
  return Array.from(connectedUsers.values());
};

// Get online count by role
const getOnlineCountByRole = () => {
  const counts = {};
  connectedUsers.forEach(user => {
    counts[user.role] = (counts[user.role] || 0) + 1;
  });
  return counts;
};

module.exports = {
  initializeSocket,
  emitEvent,
  emitPatientUpdate,
  emitAppointmentUpdate,
  emitLabTestUpdate,
  emitPrescriptionUpdate,
  emitInventoryUpdate,
  emitNotification,
  emitActivityLog,
  emitDashboardUpdate,
  getConnectedUsers,
  getOnlineCountByRole,
  getIO: () => io
};
