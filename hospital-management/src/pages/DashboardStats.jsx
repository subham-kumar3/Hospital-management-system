import React, { useState, useEffect } from 'react'
import { Users, UserCheck, UserX, Clock } from 'lucide-react'
import { adminService } from '../services'
import './DashboardStats.css'

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    lockedUsers: 0,
    byRole: {}
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await adminService.getDashboardStats()
      setStats(response.data.stats || {})
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading stats...</div>

  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <Users size={32} />
        <div>
          <h3>{stats.totalUsers}</h3>
          <p>Total Users</p>
        </div>
      </div>
      <div className="stat-card active">
        <UserCheck size={32} />
        <div>
          <h3>{stats.activeUsers}</h3>
          <p>Active Users</p>
        </div>
      </div>
      <div className="stat-card inactive">
        <UserX size={32} />
        <div>
          <h3>{stats.inactiveUsers}</h3>
          <p>Inactive Users</p>
        </div>
      </div>
      <div className="stat-card locked">
        <Clock size={32} />
        <div>
          <h3>{stats.lockedUsers}</h3>
          <p>Locked Users</p>
        </div>
      </div>

      {stats.byRole && (
        <div className="role-breakdown">
          <h4>Users by Role</h4>
          <div className="role-grid">
            {Object.entries(stats.byRole).map(([role, count]) => (
              <div key={role} className="role-item">
                <span>{role}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardStats
