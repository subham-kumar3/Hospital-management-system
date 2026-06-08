import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar, 
  UserPlus, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Users,
  MessageSquare,
  Bell,
  Activity,
  ChevronRight,
  Plus,
  Search,
  Filter
} from 'lucide-react'
import { appointmentService, patientService, billService, enquiryService } from '../services'
import { onAppointmentUpdate, onPatientUpdate, onDashboardUpdate, getSocket } from '../services/socketService'
import './ReceptionistDashboard.css'

const ReceptionistDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingBills: 0,
    totalEnquiries: 0
  })
  const [todayAppointments, setTodayAppointments] = useState([])
  const [recentEnquiries, setRecentEnquiries] = useState([])
  const [recentPatients, setRecentPatients] = useState([])
  const [pendingBillsList, setPendingBillsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchDashboardData()
    
    // Setup real-time listeners
    const cleanupAppointment = onAppointmentUpdate((data) => {
      console.log('🔄 Real-time appointment update:', data.action)
      fetchDashboardData() // Refresh all data
    })
    
    const cleanupPatient = onPatientUpdate((data) => {
      console.log('🔄 Real-time patient update:', data.action)
      fetchDashboardData() // Refresh all data
    })
    
    const cleanupDashboard = onDashboardUpdate((data) => {
      console.log('🔄 Real-time dashboard update:', data.data.type)
      fetchDashboardData() // Refresh all data
    })
    
    // Cleanup listeners on unmount
    return () => {
      if (cleanupAppointment) cleanupAppointment()
      if (cleanupPatient) cleanupPatient()
      if (cleanupDashboard) cleanupDashboard()
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayStr = today.toISOString().split('T')[0]
      
      // Fetch total patients
      const patientsResponse = await patientService.getAllPatients()
      if (patientsResponse.success) {
        setStats(prev => ({ ...prev, totalPatients: patientsResponse.data.length }))
        setRecentPatients(patientsResponse.data.slice(0, 5))
      }

      // Fetch today's appointments
      const aptResponse = await appointmentService.getAllAppointments()
      if (aptResponse.success) {
        const todayAppointmentsList = aptResponse.data.filter(apt => {
          if (!apt.date) return false
          const aptDate = new Date(apt.date)
          aptDate.setHours(0, 0, 0, 0)
          return aptDate.getTime() === today.getTime()
        })
        
        setTodayAppointments(todayAppointmentsList)
        setStats(prev => ({ ...prev, todayAppointments: todayAppointmentsList.length }))
      }

      // Fetch billing stats
      const billingResponse = await billService.getBillingStats()
      if (billingResponse.success) {
        setStats(prev => ({ 
          ...prev, 
          pendingBills: billingResponse.data.overall.pendingBills || 0
        }))
      }

      // Fetch all bills to show pending ones
      const allBillsResponse = await billService.getAllBills()
      if (allBillsResponse.success) {
        const pending = allBillsResponse.data
          .filter(bill => bill.paymentStatus !== 'Paid')
          .slice(0, 5)
        setPendingBillsList(pending)
      }

      // Fetch recent enquiries
      const enquiryResponse = await enquiryService.getAllEnquiries()
      if (enquiryResponse.success) {
        setRecentEnquiries(enquiryResponse.data.slice(0, 5))
        setStats(prev => ({ ...prev, totalEnquiries: enquiryResponse.data.length }))
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAppointments = todayAppointments.filter(apt => 
    apt.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="receptionist-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Welcome back! 👋</h1>
            <p className="date">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="header-actions">
            <Link to="/patient-registration" className="btn-primary">
              <Plus size={18} />
              <span>New Patient</span>
            </Link>
            <Link to="/receptionist-appointments" className="btn-secondary">
              <Calendar size={18} />
              <span>Book Appointment</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">
            <Users size={28} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalPatients}</h3>
            <p>Total Patients</p>
            <span className="stat-trend positive">
              <TrendingUp size={14} /> +12% this month
            </span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">
            <Calendar size={28} />
          </div>
          <div className="stat-info">
            <h3>{stats.todayAppointments}</h3>
            <p>Today's Appointments</p>
            <span className="stat-trend">
              <Activity size={14} /> {todayAppointments.filter(a => a.status === 'Confirmed').length} confirmed
            </span>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">
            <DollarSign size={28} />
          </div>
          <div className="stat-info">
            <h3>{stats.pendingBills}</h3>
            <p>Pending Bills</p>
            <span className="stat-trend negative">
              Action needed
            </span>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">
            <MessageSquare size={28} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalEnquiries}</h3>
            <p>Total Enquiries</p>
            <span className="stat-trend">
              <Bell size={14} /> {recentEnquiries.filter(e => e.status === 'New').length} new
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/patient-registration" className="action-btn primary">
            <UserPlus size={24} />
            <span>Patient Registration</span>
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
            <span>Doctor Schedule</span>
          </Link>
          <Link to="/enquiries" className="action-btn secondary">
            <MessageSquare size={24} />
            <span>View Enquiries</span>
          </Link>
          <Link to="/notifications" className="action-btn accent">
            <Bell size={24} />
            <span>Notifications</span>
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="main-grid">
        {/* Today's Appointments */}
        <div className="section appointments-section">
          <div className="section-header">
            <div>
              <h2>Today's Appointments</h2>
              <p className="section-subtitle">
                {todayAppointments.length} appointment{todayAppointments.length !== 1 ? 's' : ''} scheduled
              </p>
            </div>
            <div className="header-actions-group">
              <div className="search-box">
                <Search size={18} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Link to="/receptionist-appointments" className="view-all">
                View All
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
          
          {filteredAppointments.length > 0 ? (
            <div className="appointments-list">
              {filteredAppointments.map(apt => (
                <div key={apt._id} className="appointment-card">
                  <div className="appointment-time">
                    <Clock size={16} />
                    <span>{apt.time}</span>
                  </div>
                  <div className="appointment-details">
                    <h4>{apt.patient?.name || 'Unknown Patient'}</h4>
                    <p>Dr. {apt.doctor?.name || 'Unknown'}</p>
                    <span className="department-tag">{apt.department}</span>
                  </div>
                  <span className={`status-badge ${apt.status.toLowerCase().replace(' ', '-')}`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Calendar size={48} />
              <p>No appointments scheduled for today</p>
              <Link to="/receptionist-appointments" className="btn-link">
                Book an appointment
              </Link>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Pending Bills */}
          <div className="section bills-section">
            <div className="section-header">
              <div>
                <h2>Pending Bills</h2>
                <p className="section-subtitle">Requires attention</p>
              </div>
              <Link to="/billing" className="view-all">
                View All
                <ChevronRight size={16} />
              </Link>
            </div>
            
            {pendingBillsList.length > 0 ? (
              <div className="bills-list">
                {pendingBillsList.map(bill => (
                  <div key={bill._id} className="bill-card">
                    <div className="bill-info">
                      <h4>{bill.billNumber}</h4>
                      <p>{bill.patient?.name || 'Unknown'}</p>
                    </div>
                    <div className="bill-amount">
                      <span className="amount">₹{bill.balance}</span>
                      <span className={`payment-status ${bill.paymentStatus.toLowerCase()}`}>
                        {bill.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state small">
                <DollarSign size={32} />
                <p>No pending bills</p>
              </div>
            )}
          </div>

          {/* Recent Enquiries */}
          <div className="section enquiries-section">
            <div className="section-header">
              <div>
                <h2>Recent Enquiries</h2>
                <p className="section-subtitle">Latest queries</p>
              </div>
              <Link to="/enquiries" className="view-all">
                View All
                <ChevronRight size={16} />
              </Link>
            </div>
            
            {recentEnquiries.length > 0 ? (
              <div className="enquiries-list">
                {recentEnquiries.map(enquiry => (
                  <div key={enquiry._id} className="enquiry-card">
                    <div className="enquiry-header">
                      <h4>{enquiry.subject}</h4>
                      <span className={`priority-badge ${enquiry.priority.toLowerCase()}`}>
                        {enquiry.priority}
                      </span>
                    </div>
                    <p className="enquiry-from">{enquiry.name} • {enquiry.phone}</p>
                    <span className={`status-badge ${enquiry.status.toLowerCase().replace(' ', '-')}`}>
                      {enquiry.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state small">
                <MessageSquare size={32} />
                <p>No enquiries yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Patients */}
      <div className="section patients-section">
        <div className="section-header">
          <div>
            <h2>Recently Registered Patients</h2>
            <p className="section-subtitle">Latest additions</p>
          </div>
          <Link to="/patient-list" className="view-all">
            View All
            <ChevronRight size={16} />
          </Link>
        </div>
        
        {recentPatients.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Blood Group</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {recentPatients.map(patient => (
                <tr key={patient._id}>
                  <td className="patient-id">{patient.patientId}</td>
                  <td className="patient-name">{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.phone}</td>
                  <td>
                    <span className="blood-group">{patient.bloodGroup}</span>
                  </td>
                  <td>{new Date(patient.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <Users size={48} />
            <p>No patients registered yet</p>
            <Link to="/patient-registration" className="btn-link">
              Register first patient
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReceptionistDashboard
