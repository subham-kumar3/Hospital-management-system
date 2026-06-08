import React, { useState, useEffect } from 'react'
import { Bell, Check, Calendar, AlertCircle, Info } from 'lucide-react'
import { doctorPortalService } from '../services'
import { onNewNotification } from '../services/socketService'
import './DoctorNotifications.css'

const DoctorNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadNotifications()
    
    // Setup real-time listener for new notifications
    const cleanup = onNewNotification((data) => {
      console.log('🔄 Doctor Notifications: New notification received')
      loadNotifications()
    })
    
    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const response = await doctorPortalService.getNotifications()
      if (response.success) {
        setNotifications(response.data)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      await doctorPortalService.markNotificationRead(id)
      loadNotifications()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead)
      for (const notification of unreadNotifications) {
        await doctorPortalService.markNotificationRead(notification._id)
      }
      loadNotifications()
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead
    if (filter === 'read') return notification.isRead
    return true
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'Alert':
        return <AlertCircle size={20} />
      case 'Warning':
        return <AlertCircle size={20} />
      default:
        return <Info size={20} />
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'Alert':
        return '#ef4444'
      case 'Warning':
        return '#f59e0b'
      default:
        return '#3b82f6'
    }
  }

  if (loading) {
    return <div className="loading">Loading notifications...</div>
  }

  return (
    <div className="doctor-notifications">
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p>{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn-secondary" onClick={markAllAsRead}>
            <Check size={16} />
            Mark All as Read
          </button>
        )}
      </div>

      <div className="notification-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button 
          className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
          onClick={() => setFilter('read')}
        >
          Read ({notifications.length - unreadCount})
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="no-data">
            <Bell size={48} />
            <h3>No notifications</h3>
            <p>You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`notification-card ${!notification.isRead ? 'unread' : ''}`}
              onClick={() => !notification.isRead && markAsRead(notification._id)}
            >
              <div className="notification-icon" style={{ color: getNotificationColor(notification.type) }}>
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="notification-content">
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>
                <div className="notification-meta">
                  <Calendar size={14} />
                  <span>{new Date(notification.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {!notification.isRead && (
                <div className="unread-indicator">
                  <div className="unread-dot"></div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DoctorNotifications
