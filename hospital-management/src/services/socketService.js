import { io } from 'socket.io-client';
import { getSocketUrl } from '../config/apiConfig';

let socket = null;

export const initializeSocket = (token) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(getSocketUrl(), {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  });

  socket.on('connect', () => {
    console.log('🔌 Connected to real-time server');
    console.log('Socket ID:', socket.id);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Disconnected from real-time server:', reason);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('🔌 Socket disconnected');
  }
};

export const getSocket = () => socket;

// Event listeners
export const onPatientUpdate = (callback) => {
  if (socket) {
    socket.on('patient_update', callback);
    return () => socket.off('patient_update', callback);
  }
};

export const onAppointmentUpdate = (callback) => {
  if (socket) {
    socket.on('appointment_update', callback);
    return () => socket.off('appointment_update', callback);
  }
};

export const onLabTestUpdate = (callback) => {
  if (socket) {
    socket.on('lab_test_update', callback);
    return () => socket.off('lab_test_update', callback);
  }
};

export const onPrescriptionUpdate = (callback) => {
  if (socket) {
    socket.on('prescription_update', callback);
    return () => socket.off('prescription_update', callback);
  }
};

export const onInventoryUpdate = (callback) => {
  if (socket) {
    socket.on('inventory_update', callback);
    return () => socket.off('inventory_update', callback);
  }
};

export const onLowStockAlert = (callback) => {
  if (socket) {
    socket.on('low_stock_alert', callback);
    return () => socket.off('low_stock_alert', callback);
  }
};

export const onNewNotification = (callback) => {
  if (socket) {
    socket.on('new_notification', callback);
    return () => socket.off('new_notification', callback);
  }
};

export const onActivityLogUpdate = (callback) => {
  if (socket) {
    socket.on('activity_log_update', callback);
    return () => socket.off('activity_log_update', callback);
  }
};

export const onDashboardUpdate = (callback) => {
  if (socket) {
    socket.on('dashboard_update', callback);
    return () => socket.off('dashboard_update', callback);
  }
};

export const onUserJoined = (callback) => {
  if (socket) {
    socket.on('user_joined', callback);
    return () => socket.off('user_joined', callback);
  }
};

export const onUserLeft = (callback) => {
  if (socket) {
    socket.on('user_left', callback);
    return () => socket.off('user_left', callback);
  }
};

export const onConnectedUsersCount = (callback) => {
  if (socket) {
    socket.on('connected_users_count', callback);
    return () => socket.off('connected_users_count', callback);
  }
};

export default {
  initializeSocket,
  disconnectSocket,
  getSocket,
  onPatientUpdate,
  onAppointmentUpdate,
  onLabTestUpdate,
  onPrescriptionUpdate,
  onInventoryUpdate,
  onLowStockAlert,
  onNewNotification,
  onActivityLogUpdate,
  onDashboardUpdate,
  onUserJoined,
  onUserLeft,
  onConnectedUsersCount
};
