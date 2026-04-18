import React, { useState, useEffect } from 'react'
import { Users, UserCheck, Calendar, DollarSign, TrendingUp, Clock, Pill, FlaskConical, Activity, AlertCircle } from 'lucide-react'
import { adminApi } from '../services/adminApi'
import { appointmentService, patientService, doctorService } from '../services'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentAppointments, setRecentAppointments] = useState([])
  const [financialStats, setFinancialStats] = useState(null)
  const [allPatients, setAllPatients] = useState([])
  const [allDoctors, setAllDoctors] = useState([])
  const [allAppointments, setAllAppointments] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      console.log('📊 Fetching admin dashboard data...')
      
      // Fetch admin dashboard stats
      const dashboardResponse = await adminApi.getDashboard()
      if (dashboardResponse.data.success) {
        setStats(dashboardResponse.data.data.stats)
        setRecentAppointments(dashboardResponse.data.data.recentAppointments)
        console.log('✅ Dashboard stats:', dashboardResponse.data.data.stats)
      }

      // Fetch financial data
      const financialResponse = await adminApi.getFinancial()
      if (financialResponse.data.success) {
        setFinancialStats(financialResponse.data.data.stats)
        console.log('💰 Financial stats:', financialResponse.data.data.stats)
      }

      // Fetch all data for comprehensive view
      const [patientsRes, doctorsRes, appointmentsRes, usersRes] = await Promise.all([
        patientService.getAllPatients().catch(() => ({ success: false, data: [] })),
        doctorService.getAllDoctors().catch(() => ({ success: false, data: [] })),
        appointmentService.getAllAppointments().catch(() => ({ success: false, data: [] })),
        adminApi.getUsers().catch(() => ({ success: false, data: [] }))
      ])

      if (patientsRes.success) {
        setAllPatients(patientsRes.data)
        console.log('👥 Patients:', patientsRes.data.length)
      }

      if (doctorsRes.success) {
        setAllDoctors(doctorsRes.data)
        console.log('👨‍⚕️ Doctors:', doctorsRes.data.length)
      }

      if (appointmentsRes.success) {
        setAllAppointments(appointmentsRes.data)
        console.log('📅 Appointments:', appointmentsRes.data.length)
      }

      if (usersRes.success) {
        setAllUsers(usersRes.data)
        console.log('👤 Users:', usersRes.data.length)
      }

    } catch (error) {
      console.error('❌ Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading dashboard...</div>

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Hospital Overview & Statistics - Real-time Data</p>
      </div>

      {/* Primary Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon patients">
            <Users size={28} />
          </div>
          <div className="stat-info">
            <h3>{allPatients.length || stats?.totalPatients || 0}</h3>
            <p>Total Patients</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon doctors">
            <UserCheck size={28} />
          </div>
          <div className="stat-info">
            <h3>{allDoctors.length || stats?.totalDoctors || 0}</h3>
            <p>Total Doctors</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon appointments">
            <Calendar size={28} />
          </div>
          <div className="stat-info">
            <h3>{allAppointments.length || 0}</h3>
            <p>Total Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon users">
            <Users size={28} />
          </div>
          <div className="stat-info">
            <h3>{allUsers.length || stats?.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <Clock size={28} />
          </div>
          <div className="stat-info">
            <h3>{stats?.pendingAppointments || 0}</h3>
            <p>Pending Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bills">
            <DollarSign size={28} />
          </div>
          <div className="stat-info">
            <h3>{stats?.pendingBills || 0}</h3>
            <p>Pending Bills</p>
          </div>
        </div>
      </div>

      {/* Financial Stats */}
      {financialStats && (
        <div className="stats-grid secondary-stats">
          <div className="stat-card">
            <div className="stat-icon revenue">
              <DollarSign size={28} />
            </div>
            <div className="stat-info">
              <h3>${financialStats.totalRevenue?.toLocaleString() || 0}</h3>
              <p>Total Revenue</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon collected">
              <TrendingUp size={28} />
            </div>
            <div className="stat-info">
              <h3>${financialStats.totalPaid?.toLocaleString() || 0}</h3>
              <p>Total Collected</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending-amount">
              <AlertCircle size={28} />
            </div>
            <div className="stat-info">
              <h3>${financialStats.totalPending?.toLocaleString() || 0}</h3>
              <p>Pending Amount</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon paid-bills">
              <Activity size={28} />
            </div>
            <div className="stat-info">
              <h3>{financialStats.paidBills || 0}</h3>
              <p>Paid Bills</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Appointments */}
      <div className="recent-section">
        <h2>Recent Appointments</h2>
        {recentAppointments.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <p>No recent appointments</p>
          </div>
        ) : (
          <div className="appointments-table">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((apt) => (
                  <tr key={apt._id}>
                    <td>{apt.patient?.name || 'Unknown'}</td>
                    <td>Dr. {apt.doctor?.name || 'Unknown'}</td>
                    <td>{new Date(apt.date).toLocaleDateString()}</td>
                    <td>{apt.time}</td>
                    <td>
                      <span className={`status-badge ${apt.status?.toLowerCase()}`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Data Summary */}
      <div className="data-summary">
        <h2>Data Summary</h2>
        <div className="summary-grid">
          <div className="summary-card">
            <h3>👥 Patients</h3>
            <p className="summary-count">{allPatients.length}</p>
            <div className="summary-details">
              <p>Admitted: {allPatients.filter(p => p.status === 'Admitted').length}</p>
              <p>Stable: {allPatients.filter(p => p.status === 'Stable').length}</p>
              <p>Critical: {allPatients.filter(p => p.status === 'Critical').length}</p>
            </div>
          </div>

          <div className="summary-card">
            <h3>👨‍⚕️ Doctors</h3>
            <p className="summary-count">{allDoctors.length}</p>
            <div className="summary-details">
              {allDoctors.slice(0, 3).map(doc => (
                <p key={doc._id}>Dr. {doc.name} - {doc.specialization}</p>
              ))}
            </div>
          </div>

          <div className="summary-card">
            <h3>📅 Appointments</h3>
            <p className="summary-count">{allAppointments.length}</p>
            <div className="summary-details">
              <p>Today: {allAppointments.filter(a => {
                const today = new Date().toDateString()
                return new Date(a.date).toDateString() === today
              }).length}</p>
              <p>Pending: {allAppointments.filter(a => a.status === 'Pending').length}</p>
              <p>Completed: {allAppointments.filter(a => a.status === 'Completed').length}</p>
            </div>
          </div>

          <div className="summary-card">
            <h3>👤 Users by Role</h3>
            <p className="summary-count">{allUsers.length}</p>
            <div className="summary-details">
              <p>Admins: {allUsers.filter(u => u.role === 'Admin').length}</p>
              <p>Doctors: {allUsers.filter(u => u.role === 'Doctor').length}</p>
              <p>Nurses: {allUsers.filter(u => u.role === 'Nurse').length}</p>
              <p>Receptionists: {allUsers.filter(u => u.role === 'Receptionist').length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
