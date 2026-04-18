import React, { useState, useEffect } from 'react'
import { Search, Users } from 'lucide-react'
import { adminService, doctorService } from '../services'
import './AdminStaffManagement.css'

const AdminStaffManagement = () => {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')

  useEffect(() => {
    fetchStaff()
  }, [roleFilter])

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const response = await adminService.getAllUsers({
        search,
        role: roleFilter
      })
      setStaff(response.data || [])
    } catch (error) {
      console.error('Error fetching staff:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-staff-management">
      <div className="page-header">
        <h1>Staff Management</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={32} />
          </div>
          <div className="stat-info">
            <h3>{staff.length}</h3>
            <p>Total Staff</p>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="All">All Roles</option>
          <option value="Doctor">Doctors</option>
          <option value="Nurse">Nurses</option>
          <option value="Receptionist">Receptionists</option>
          <option value="Pharmacist">Pharmacists</option>
          <option value="Lab Technician">Lab Technicians</option>
        </select>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="loading">Loading staff...</td></tr>
            ) : staff.length === 0 ? (
              <tr><td colSpan="6" className="no-data">No staff found</td></tr>
            ) : (
              staff.map((user) => (
                <tr key={user._id}>
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || '-'}</td>
                  <td><span className="role-badge">{user.role}</span></td>
                  <td><span className="status-badge">{user.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminStaffManagement
