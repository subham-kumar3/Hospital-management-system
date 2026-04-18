import React, { useState, useEffect } from 'react'
import { Bell, Check, AlertTriangle } from 'lucide-react'
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/nurseApi'
import './NurseNotifications.css'

const NurseNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [filter])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const params = filter ? { type: filter } : {}
      const response = await getNotifications(params)
      if (response.success) setNotifications(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id)
      fetchNotifications()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead()
      fetchNotifications()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) return <div className="loading">Loading notifications...</div>

  return (
    <div className="nurse-notifications">
      <div className="page-header">
        <h1>Notifications</h1>
        <p>Stay updated with alerts and messages</p>
      </div>

      <div className="notif-controls">
        <div className="filter-group">
          <label>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Info">Info</option>
            <option value="Emergency">Emergency</option>
            <option value="Alert">Alert</option>
            <option value="Reminder">Reminder</option>
          </select>
        </div>
        <button className="btn-mark-all" onClick={handleMarkAllRead}>
          <Check size={20} /> Mark All as Read
        </button>
      </div>

      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div key={notif._id} className={`notification-card ${notif.type.toLowerCase()} ${notif.isRead ? 'read' : 'unread'}`}>
              <div className="notif-icon">
                {notif.type === 'Emergency' ? <AlertTriangle size={24} /> : <Bell size={24} />}
              </div>
              <div className="notif-content">
                <div className="notif-header">
                  <h3>{notif.title}</h3>
                  <span className="notif-type">{notif.type}</span>
                </div>
                <p>{notif.message}</p>
                <div className="notif-footer">
                  <span className="notif-date">{new Date(notif.createdAt).toLocaleString()}</span>
                  {!notif.isRead && (
                    <button className="btn-mark-read" onClick={() => handleMarkRead(notif._id)}>
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">No notifications</div>
        )}
      </div>
    </div>
  )
}

export default NurseNotifications
