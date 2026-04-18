import React, { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { notificationService } from '../services'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getUserNotifications()
      if (response.success) setNotifications(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      fetchNotifications()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      fetchNotifications()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'warning': return '⚠️'
      case 'alert': return '🚨'
      default: return 'ℹ️'
    }
  }

  return (
    <div style={{ padding: '20px', background: '#f5f6fa', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Bell size={32} /> Notifications
        </h1>
        <button onClick={markAllAsRead} style={{ padding: '12px 24px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
          Mark All as Read
        </button>
      </div>

      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {notifications.length > 0 ? notifications.map(notification => (
            <div
              key={notification._id}
              onClick={() => !notification.isRead && markAsRead(notification._id)}
              style={{
                padding: '20px',
                background: notification.isRead ? 'white' : '#f0f7ff',
                border: notification.isRead ? '1px solid #dee2e6' : '2px solid #667eea',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'start', gap: '15px' }}>
                <span style={{ fontSize: '2rem' }}>{getTypeIcon(notification.type)}</span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 10px', color: '#2c3e50' }}>{notification.title}</h3>
                  <p style={{ margin: '0 0 10px', color: '#495057' }}>{notification.message}</p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#7f8c8d' }}>
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.isRead && (
                  <span style={{ padding: '4px 12px', background: '#667eea', color: 'white', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600' }}>
                    NEW
                  </span>
                )}
              </div>
            </div>
          )) : (
            <p style={{ textAlign: 'center', padding: '60px', color: '#7f8c8d', fontSize: '1.1rem' }}>
              No notifications
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default Notifications
