const LabNotification = require('../models/LabNotification');
const Notification = require('../models/Notification');

// @desc    Get all notifications for technician
// @route   GET /api/lab/notifications
// @access  Private/Lab Technician
exports.getNotifications = async (req, res) => {
  try {
    const { isRead, priority, page = 1, limit = 20 } = req.query;

    let query = { technician: req.user.id };

    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    if (priority) {
      query.priority = priority;
    }

    const notifications = await LabNotification.find(query)
      .populate('relatedTest', 'testType testName status priority')
      .populate('relatedSample', 'sampleId sampleType collectionStatus')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await LabNotification.countDocuments(query);
    const unreadCount = await LabNotification.countDocuments({ 
      technician: req.user.id, 
      isRead: false 
    });

    res.json({
      success: true,
      count: notifications.length,
      total: count,
      unreadCount,
      pages: Math.ceil(count / limit),
      currentPage: page,
      data: notifications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/lab/notifications/:id/read
// @access  Private/Lab Technician
exports.markAsRead = async (req, res) => {
  try {
    const notification = await LabNotification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.technician.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to access this notification' 
      });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, data: notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/lab/notifications/read-all
// @access  Private/Lab Technician
exports.markAllAsRead = async (req, res) => {
  try {
    await LabNotification.updateMany(
      { technician: req.user.id, isRead: false },
      { isRead: true }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete notification
// @route   DELETE /api/lab/notifications/:id
// @access  Private/Lab Technician
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await LabNotification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.technician.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this notification' 
      });
    }

    await notification.deleteOne();

    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Helper function to create notification
exports.createNotification = async (notificationData) => {
  try {
    return await LabNotification.create(notificationData);
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// ===== General Notification Functions =====

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getUserNotifications = async (req, res) => {
  try {
    const { isRead, page = 1, limit = 20 } = req.query;

    let query = {
      $or: [
        { targetRole: { $in: [req.user.role] } },
        { createdBy: req.user.id }
      ]
    };

    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    const notifications = await Notification.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Notification.countDocuments(query);

    res.json({
      success: true,
      count: notifications.length,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
      data: notifications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    // Add to readBy array if not already there
    const alreadyRead = notification.readBy.find(
      r => r.user.toString() === req.user.id
    );

    if (!alreadyRead) {
      notification.readBy.push({
        user: req.user.id,
        readAt: new Date()
      });
      notification.isRead = true;
    }

    await notification.save();

    res.json({ success: true, data: notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const notifications = await Notification.find({
      targetRole: { $in: [req.user.role] },
      isRead: false
    });

    await Promise.all(
      notifications.map(async (notification) => {
        const alreadyRead = notification.readBy.find(
          r => r.user.toString() === req.user.id
        );

        if (!alreadyRead) {
          notification.readBy.push({
            user: req.user.id,
            readAt: new Date()
          });
        }
        
        notification.isRead = true;
        await notification.save();
      })
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get unread count
// @route   GET /api/notifications/unread-count
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      targetRole: { $in: [req.user.role] },
      isRead: false
    });

    res.json({
      success: true,
      count: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private/Admin
exports.createGeneralNotification = async (req, res) => {
  try {
    const { title, message, type, targetRole } = req.body;

    const notification = await Notification.create({
      title,
      message,
      type,
      targetRole,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
