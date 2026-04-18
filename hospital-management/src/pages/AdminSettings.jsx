import React, { useState, useEffect } from 'react'
import { Save, Database, Activity, Clock, Shield, Building2, Bell } from 'lucide-react'
import { settingsService } from '../services'
import './AdminSettings.css'

const AdminSettings = () => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('hospital')
  const [backupLoading, setBackupLoading] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await settingsService.getSettings()
      setSettings(response.data)
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (section, data) => {
    try {
      await settingsService.updateSettings({ [section]: data })
      alert('Settings saved successfully')
      fetchSettings()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save settings')
    }
  }

  const handleBackup = async () => {
    setBackupLoading(true)
    try {
      await settingsService.backupDatabase()
      alert('Backup created successfully')
      fetchSettings()
    } catch (error) {
      alert(error.response?.data?.message || 'Backup failed')
    } finally {
      setBackupLoading(false)
    }
  }

  if (loading) {
    return <div className="loading-container">Loading settings...</div>
  }

  const tabs = [
    { id: 'hospital', label: 'Hospital Info', icon: Building2 },
    { id: 'working', label: 'Working Hours', icon: Clock },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notification', label: 'Notifications', icon: Bell },
    { id: 'backup', label: 'Backup', icon: Database },
    { id: 'activity', label: 'Activity Logs', icon: Activity }
  ]

  return (
    <div className="admin-settings">
      <div className="page-header">
        <h1>Settings & Configuration</h1>
      </div>

      <div className="settings-container">
        <div className="settings-tabs">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="settings-content">
          {/* Hospital Info */}
          {activeTab === 'hospital' && (
            <div className="settings-section">
              <h2>Hospital Information</h2>
              <form onSubmit={(e) => {
                e.preventDefault()
                handleSave('hospitalInfo', {
                  name: e.target.name.value,
                  address: e.target.address.value,
                  phone: e.target.phone.value,
                  email: e.target.email.value,
                  website: e.target.website.value
                })
              }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Hospital Name</label>
                    <input type="text" name="name" defaultValue={settings?.hospitalInfo?.name} />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" name="phone" defaultValue={settings?.hospitalInfo?.phone} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" defaultValue={settings?.hospitalInfo?.email} />
                  </div>
                  <div className="form-group">
                    <label>Website</label>
                    <input type="url" name="website" defaultValue={settings?.hospitalInfo?.website} />
                  </div>
                  <div className="form-group full-width">
                    <label>Address</label>
                    <textarea name="address" rows="3" defaultValue={settings?.hospitalInfo?.address} />
                  </div>
                </div>
                <button type="submit" className="btn-primary">
                  <Save size={18} /> Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Working Hours */}
          {activeTab === 'working' && (
            <div className="settings-section">
              <h2>Working Hours</h2>
              <div className="working-hours-grid">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                  <div key={day} className="day-row">
                    <div className="day-label">{day.charAt(0).toUpperCase() + day.slice(1)}</div>
                    <div className="time-inputs">
                      <input
                        type="time"
                        defaultValue={settings?.workingHours?.[day]?.open}
                        disabled={settings?.workingHours?.[day]?.open === 'Closed'}
                      />
                      <span>to</span>
                      <input
                        type="time"
                        defaultValue={settings?.workingHours?.[day]?.close}
                        disabled={settings?.workingHours?.[day]?.close === 'Closed'}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-primary" onClick={() => handleSave('workingHours', settings?.workingHours)}>
                <Save size={18} /> Save Working Hours
              </button>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>Security Settings</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Max Login Attempts</label>
                  <input
                    type="number"
                    defaultValue={settings?.security?.maxLoginAttempts}
                    onChange={(e) => handleSave('security', {
                      ...settings?.security,
                      maxLoginAttempts: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Lockout Duration (hours)</label>
                  <input
                    type="number"
                    defaultValue={settings?.security?.lockoutDuration}
                    onChange={(e) => handleSave('security', {
                      ...settings?.security,
                      lockoutDuration: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Password Min Length</label>
                  <input
                    type="number"
                    defaultValue={settings?.security?.passwordMinLength}
                    onChange={(e) => handleSave('security', {
                      ...settings?.security,
                      passwordMinLength: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Session Timeout (hours)</label>
                  <input
                    type="number"
                    defaultValue={settings?.security?.sessionTimeout}
                    onChange={(e) => handleSave('security', {
                      ...settings?.security,
                      sessionTimeout: parseInt(e.target.value)
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notification' && (
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              <div className="toggle-group">
                <div className="toggle-item">
                  <label>Email Notifications</label>
                  <input
                    type="checkbox"
                    checked={settings?.notificationPreferences?.email}
                    onChange={(e) => handleSave('notificationPreferences', {
                      ...settings?.notificationPreferences,
                      email: e.target.checked
                    })}
                  />
                </div>
                <div className="toggle-item">
                  <label>SMS Notifications</label>
                  <input
                    type="checkbox"
                    checked={settings?.notificationPreferences?.sms}
                    onChange={(e) => handleSave('notificationPreferences', {
                      ...settings?.notificationPreferences,
                      sms: e.target.checked
                    })}
                  />
                </div>
                <div className="toggle-item">
                  <label>In-App Notifications</label>
                  <input
                    type="checkbox"
                    checked={settings?.notificationPreferences?.inApp}
                    onChange={(e) => handleSave('notificationPreferences', {
                      ...settings?.notificationPreferences,
                      inApp: e.target.checked
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Backup */}
          {activeTab === 'backup' && (
            <div className="settings-section">
              <h2>Database Backup</h2>
              <div className="backup-info">
                <div className="info-card">
                  <Database size={40} />
                  <div className="info-content">
                    <h3>Last Backup</h3>
                    <p>
                      {settings?.backupSchedule?.lastBackup
                        ? new Date(settings.backupSchedule.lastBackup).toLocaleString()
                        : 'No backup created yet'}
                    </p>
                  </div>
                </div>
                <div className="info-card">
                  <Clock size={40} />
                  <div className="info-content">
                    <h3>Backup Frequency</h3>
                    <p>{settings?.backupSchedule?.frequency || 'Daily'}</p>
                  </div>
                </div>
              </div>
              <button
                className="btn-primary"
                onClick={handleBackup}
                disabled={backupLoading}
              >
                <Database size={18} /> {backupLoading ? 'Creating Backup...' : 'Create Backup Now'}
              </button>
            </div>
          )}

          {/* Activity Logs */}
          {activeTab === 'activity' && (
            <ActivityLogs />
          )}
        </div>
      </div>
    </div>
  )
}

// Activity Logs Component
const ActivityLogs = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await settingsService.getActivityLogs()
      setLogs(response.data || [])
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="settings-section">
      <h2>Activity Logs</h2>
      <div className="logs-table-container">
        <table className="logs-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Description</th>
              <th>Performed By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="loading">Loading logs...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan="4" className="no-data">No activity logs found</td></tr>
            ) : (
              logs.map(log => (
                <tr key={log._id}>
                  <td><span className="action-badge">{log.action}</span></td>
                  <td>{log.description}</td>
                  <td>{log.performedBy?.name || 'Unknown'}</td>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminSettings
