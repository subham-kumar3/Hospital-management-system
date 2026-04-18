const express = require('express');
const router = express.Router();
const {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getUserNotifications)
  .post(protect, authorize('Admin'), createNotification);

router.put('/read-all', protect, markAllAsRead);
router.get('/unread-count', protect, getUnreadCount);
router.put('/:id/read', protect, markAsRead);

module.exports = router;
