import React, { useState, useEffect } from 'react'
import { UserCheck, Search, Edit, Trash2 } from 'lucide-react'
import { adminApi } from '../services/adminApi'
import './AdminPatients.css'

const AdminPatients = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchPatients()
  }, [search])

  const fetchPatients = async () => {
    try {
      const response = await adminApi.getPatients({ search })
      if (response.data.success) setPatients(response.data.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient?')) return
    try {
      await adminApi.deletePatient(id)
      fetchPatients()
    } catch (error) {
      alert('Failed to delete')
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="admin-patients">
      <div className="page-header"><h1>Patient Management</h1></div>
      <div className="filters">
        <div className="search-box">
          <Search size={20} />
          <input type="text" placeholder="Search patients..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead><tr><th>Name</th><th>Age</th><th>Gender</th><th>Phone</th><th>Email</th><th>Actions</th></tr></thead>
          <tbody>
            {patients.map(p => (
              <tr key={p._id}>
                <td>{p.name}</td><td>{p.age}</td><td>{p.gender}</td><td>{p.phone}</td><td>{p.email}</td>
                <td><button className="btn-delete" onClick={() => handleDelete(p._id)}><Trash2 size={18} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminPatients
