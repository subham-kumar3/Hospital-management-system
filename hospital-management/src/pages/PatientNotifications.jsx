import React, { useState, useEffect } from 'react'
import { Bell, Check } from 'lucide-react'
import { patientApi } from '../services/patientApi'
import './PatientNotifications.css'

const PatientNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await patientApi.getNotifications()
      if (response.data.success) {
        setNotifications(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await patientApi.markNotificationRead(id)
      fetchNotifications()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  if (loading) return <div className="loading">Loading notifications...</div>

  return (
    <div className="patient-notifications">
      <div className="page-header">
        <h1>Notifications</h1>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <Bell size={64} />
          <h3>No notifications</h3>
          <p>You're all caught up!</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`notification-card ${notification.isRead ? 'read' : 'unread'}`}
            >
              <div className="notification-icon">
                <Bell size={24} />
              </div>
              <div className="notification-content">
                <div className="notification-header">
                  <h3>{notification.title}</h3>
                  <span className={`notification-type ${notification.type.toLowerCase().replace(/\s+/g, '-')}`}>
                    {notification.type}
                  </span>
                </div>
                <p>{notification.message}</p>
                <div className="notification-footer">
                  <span className="notification-time">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                  {!notification.isRead && (
                    <button 
                      className="mark-read-btn"
                      onClick={() => handleMarkAsRead(notification._id)}
                    >
                      <Check size={16} />
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PatientNotifications
