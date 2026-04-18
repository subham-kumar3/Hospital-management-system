import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './LabNotifications.css';

const LabNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      const params = {};
      if (filter) params.isRead = filter;

      const response = await api.get('/lab/notifications', { params });
      if (response.data.success) {
        setNotifications(response.data.data);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/lab/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/lab/notifications/read-all');
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/lab/notifications/${notificationId}`);
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'Urgent Test': return '🚨';
      case 'Sample Collection': return '🧬';
      case 'Expiry Alert': return '⏰';
      case 'Equipment Alert': return '⚙️';
      default: return '📢';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#d32f2f';
      case 'High': return '#f44336';
      case 'Medium': return '#ff9800';
      case 'Low': return '#4caf50';
      default: return '#999';
    }
  };

  return (
    <div className="lab-notifications-page">
      <div className="page-header">
        <h1>Notifications</h1>
        <p>{unreadCount} unread notifications</p>
      </div>

      <div className="notifications-controls">
        <div className="filter-group">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Notifications</option>
            <option value="false">Unread Only</option>
            <option value="true">Read Only</option>
          </select>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="mark-all-btn">
            Mark All as Read
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading notifications...</div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-card ${notification.isRead ? 'read' : 'unread'}`}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content">
                <div className="notification-header">
                  <h3>{notification.title}</h3>
                  <span
                    className="priority-indicator"
                    style={{ backgroundColor: getPriorityColor(notification.priority) }}
                  ></span>
                </div>
                <p className="notification-message">{notification.message}</p>
                <div className="notification-meta">
                  <span className="notification-type">{notification.type}</span>
                  <span className="notification-time">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="notification-actions">
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="action-btn mark-read"
                  >
                    Mark Read
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification._id)}
                  className="action-btn delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {notifications.length === 0 && !loading && (
        <div className="no-data">No notifications</div>
      )}
    </div>
  );
};

export default LabNotifications;
