import React, { useState, useEffect } from 'react'
import { Bell, Check, Trash2, Filter, Search } from 'lucide-react'
import { notificationService } from '../services'
import './Notifications.css'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getAllNotifications()
      if (response.success) {
        setNotifications(response.data)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      fetchNotifications()
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      fetchNotifications()
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id)
      fetchNotifications()
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) ||
      (filter === 'read' && notification.read)
    
    const matchesSearch = notification.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.title?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment':
        return '📅'
      case 'patient':
        return '👤'
      case 'billing':
        return '💰'
      case 'enquiry':
        return '📝'
      default:
        return '🔔'
    }
  }

  const getTimeAgo = (date) => {
    const now = new Date()
    const notificationDate = new Date(date)
    const seconds = Math.floor((now - notificationDate) / 1000)
    
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    return `${Math.floor(seconds / 86400)} days ago`
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading notifications...</p>
      </div>
    )
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <h1>
            <Bell size={28} />
            Notifications
          </h1>
          <p className="subtitle">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="header-actions">
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="btn-mark-all">
              <Check size={18} />
              Mark All Read
            </button>
          )}
        </div>
      </div>

      <div className="notifications-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </button>
          <button
            className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div
              key={notification._id}
              className={`notification-card ${!notification.read ? 'unread' : ''}`}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="notification-content">
                <div className="notification-header">
                  <h3>{notification.title || 'Notification'}</h3>
                  <span className="notification-time">
                    {getTimeAgo(notification.createdAt)}
                  </span>
                </div>
                <p className="notification-message">{notification.message}</p>
              </div>

              <div className="notification-actions">
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="btn-action btn-read"
                    title="Mark as read"
                  >
                    <Check size={18} />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification._id)}
                  className="btn-action btn-delete"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Bell size={64} />
            <h3>No notifications</h3>
            <p>
              {searchTerm || filter !== 'all'
                ? 'No notifications match your filters'
                : 'You\'re all caught up!'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications
