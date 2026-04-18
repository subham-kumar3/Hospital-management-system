import React, { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Lock, Unlock, Key, Upload, X } from 'lucide-react'
import { adminService } from '../services'
import './AdminUserManagement.css'

const AdminUserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Receptionist',
    password: '123456'
  })

  useEffect(() => {
    fetchUsers()
  }, [roleFilter, statusFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await adminService.getAllUsers({
        search,
        role: roleFilter,
        status: statusFilter
      })
      setUsers(response.data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchUsers()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        await adminService.updateUser(editingUser._id, formData)
        alert('User updated successfully')
      } else {
        await adminService.createUser(formData)
        alert('User created successfully')
      }
      setShowModal(false)
      setEditingUser(null)
      setFormData({ name: '', email: '', phone: '', role: 'Receptionist', password: '123456' })
      fetchUsers()
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      password: ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await adminService.deleteUser(id)
      alert('User deleted successfully')
      fetchUsers()
    } catch (error) {
      alert(error.response?.data?.message || 'Delete failed')
    }
  }

  const handleResetPassword = async (id) => {
    if (!confirm('Reset password to default (123456)?')) return
    try {
      await adminService.resetPassword(id)
      alert('Password reset successfully')
    } catch (error) {
      alert(error.response?.data?.message || 'Reset failed')
    }
  }

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active'
    try {
      await adminService.updateUserStatus(user._id, newStatus)
      alert(`User ${newStatus.toLowerCase()}`)
      fetchUsers()
    } catch (error) {
      alert(error.response?.data?.message || 'Status update failed')
    }
  }

  const getStatusBadge = (status) => {
    const colors = {
      Active: '#10b981',
      Inactive: '#6b7280',
      Locked: '#ef4444'
    }
    return (
      <span className="status-badge" style={{ backgroundColor: colors[status] || '#6b7280' }}>
        {status}
      </span>
    )
  }

  return (
    <div className="admin-user-management">
      <div className="page-header">
        <h1>User Management</h1>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setShowImportModal(true)}>
            <Upload size={18} /> Bulk Import
          </button>
          <button className="btn-primary" onClick={() => { setEditingUser(null); setShowModal(true) }}>
            <Plus size={18} /> Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or user ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="filter-group">
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Pharmacist">Pharmacist</option>
            <option value="Lab Technician">Lab Technician</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Locked">Locked</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
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
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="loading">Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="8" className="no-data">No users found</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || '-'}</td>
                  <td><span className="role-badge">{user.role}</span></td>
                  <td>{getStatusBadge(user.status)}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <button className="btn-icon" onClick={() => handleEdit(user)} title="Edit">
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon" onClick={() => handleResetPassword(user._id)} title="Reset Password">
                      <Key size={16} />
                    </button>
                    <button className="btn-icon" onClick={() => handleToggleStatus(user)} title="Toggle Status">
                      {user.status === 'Active' ? <Lock size={16} /> : <Unlock size={16} />}
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDelete(user._id)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? 'Edit User' : 'Add User'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="Admin">Admin</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Pharmacist">Pharmacist</option>
                  <option value="Lab Technician">Lab Technician</option>
                </select>
              </div>
              {!editingUser && (
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    minLength="6"
                  />
                </div>
              )}
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingUser ? 'Update' : 'Create'} User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showImportModal && (
        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Bulk Import Users</h2>
              <button className="close-btn" onClick={() => setShowImportModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="import-section">
              <p>Upload a CSV file with the following columns:</p>
              <ul>
                <li>name</li>
                <li>email</li>
                <li>phone (optional)</li>
                <li>role (Admin, Doctor, Nurse, Receptionist, Pharmacist, Lab Technician)</li>
              </ul>
              <input type="file" accept=".csv" className="file-input" />
              <div className="form-actions">
                <button className="btn-secondary" onClick={() => setShowImportModal(false)}>
                  Cancel
                </button>
                <button className="btn-primary">Import Users</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUserManagement
