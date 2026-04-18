import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, UserPlus, DollarSign, Clock, TrendingUp } from 'lucide-react'
import { appointmentService, patientService, billService, enquiryService } from '../services'
import './ReceptionistDashboard.css'

const ReceptionistDashboard = () => {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    newPatients: 0,
    todayBills: 0,
    pendingPayments: 0
  })
  const [todayAppointments, setTodayAppointments] = useState([])
  const [recentEnquiries, setRecentEnquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayStr = today.toISOString().split('T')[0]
      
      console.log('📅 Fetching appointments for:', todayStr)
      
      // Fetch all appointments and filter for today
      const aptResponse = await appointmentService.getAllAppointments()
      if (aptResponse.success) {
        const todayAppointmentsList = aptResponse.data.filter(apt => {
          if (!apt.date) return false
          const aptDate = new Date(apt.date)
          aptDate.setHours(0, 0, 0, 0)
          return aptDate.getTime() === today.getTime()
        })
        
        console.log('📊 Total appointments:', aptResponse.data.length)
        console.log('📊 Today\'s appointments:', todayAppointmentsList.length, todayAppointmentsList)
        
        setTodayAppointments(todayAppointmentsList)
        setStats(prev => ({ ...prev, todayAppointments: todayAppointmentsList.length }))
      }

      // Fetch all patients and filter today's
      const patientsResponse = await patientService.getAllPatients()
      if (patientsResponse.success) {
        const todayPatients = patientsResponse.data.filter(p => {
          return new Date(p.createdAt).toISOString().split('T')[0] === todayStr
        })
        setStats(prev => ({ ...prev, newPatients: todayPatients.length }))
      }

      // Fetch billing stats
      const billingResponse = await billService.getBillingStats()
      if (billingResponse.success) {
        setStats(prev => ({ 
          ...prev, 
          todayBills: billingResponse.data.today.count,
          pendingPayments: billingResponse.data.overall.pendingBills || 0
        }))
      }

      // Fetch recent enquiries
      const enquiryResponse = await enquiryService.getAllEnquiries()
      if (enquiryResponse.success) {
        setRecentEnquiries(enquiryResponse.data.slice(0, 5))
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="receptionist-dashboard">
      <div className="dashboard-header">
        <h1>Receptionist Dashboard</h1>
        <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">
            <Calendar size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.todayAppointments}</h3>
            <p>Today's Appointments</p>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">
            <UserPlus size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.newPatients}</h3>
            <p>New Patients Today</p>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">
            <DollarSign size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.todayBills}</h3>
            <p>Bills Generated Today</p>
          </div>
        </div>

        <div className="stat-card red">
          <div className="stat-icon">
            <TrendingUp size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.pendingPayments}</h3>
            <p>Pending Payments</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/patient-registration" className="action-btn primary">
            <UserPlus size={24} />
            <span>Add Patient</span>
          </Link>
          <Link to="/receptionist-appointments" className="action-btn success">
            <Calendar size={24} />
            <span>Book Appointment</span>
          </Link>
          <Link to="/billing" className="action-btn warning">
            <DollarSign size={24} />
            <span>Generate Bill</span>
          </Link>
          <Link to="/doctor-schedule" className="action-btn info">
            <Clock size={24} />
            <span>View Doctor Schedule</span>
          </Link>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="section">
        <div className="section-header">
          <h2>Today's Appointments</h2>
          <Link to="/receptionist-appointments" className="view-all">View All</Link>
        </div>
        {todayAppointments.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {todayAppointments.map(apt => (
                <tr key={apt._id}>
                  <td>{apt.time}</td>
                  <td>{apt.patient?.name || 'Unknown'}</td>
                  <td>{apt.doctor?.name || 'Unknown'}</td>
                  <td>{apt.department}</td>
                  <td>{apt.type}</td>
                  <td>
                    <span className={`status-badge ${apt.status.toLowerCase()}`}>
                      {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No appointments scheduled for today</p>
        )}
      </div>

      {/* Recent Enquiries */}
      <div className="section">
        <div className="section-header">
          <h2>Recent Enquiries</h2>
          <Link to="/enquiries" className="view-all">View All</Link>
        </div>
        {recentEnquiries.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentEnquiries.map(enquiry => (
                <tr key={enquiry._id}>
                  <td>{enquiry.name}</td>
                  <td>{enquiry.subject}</td>
                  <td>
                    <span className={`priority-badge ${enquiry.priority.toLowerCase()}`}>
                      {enquiry.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${enquiry.status.toLowerCase().replace(' ', '-')}`}>
                      {enquiry.status}
                    </span>
                  </td>
                  <td>{new Date(enquiry.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No enquiries yet</p>
        )}
      </div>
    </div>
  )
}

export default ReceptionistDashboard
