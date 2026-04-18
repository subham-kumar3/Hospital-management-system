import React, { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { adminApi } from '../services/adminApi'

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await adminApi.getNotifications()
      if (response.data.success) setNotifications(response.data.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ marginBottom: '2rem' }}><h1>Notifications</h1></div>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {notifications.map(notif => (
          <div key={notif._id} style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem' }}>
            <h3>{notif.title}</h3>
            <p>{notif.message}</p>
            <small>{new Date(notif.createdAt).toLocaleString()}</small>
          </div>
        ))}
        {notifications.length === 0 && <p>No notifications</p>}
      </div>
    </div>
  )
}

export default AdminNotifications
