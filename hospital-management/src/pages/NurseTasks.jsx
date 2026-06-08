import React, { useState, useEffect } from 'react'
import { Plus, CheckCircle, Clock, AlertCircle, Trash2, Edit } from 'lucide-react'
import { getTasks, getTaskStats, createTask, updateTask, deleteTask, getAssignedPatients } from '../services/nurseApi'
import './NurseTasks.css'

const NurseTasks = () => {
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState(null)
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [formData, setFormData] = useState({
    patientId: '',
    taskName: '',
    taskType: 'Medication',
    description: '',
    priority: 'Medium',
    scheduledTime: '',
    notes: ''
  })

  useEffect(() => {
    fetchTasks()
    fetchStats()
    fetchPatients()
  }, [filterStatus, filterPriority, currentPage])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        limit: 20
      }
      if (filterStatus) params.status = filterStatus
      if (filterPriority) params.priority = filterPriority
      if (searchTerm) params.search = searchTerm

      const response = await getTasks(params)
      if (response.success) {
        setTasks(response.data)
        setTotalPages(response.pages)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await getTaskStats()
      if (response.success) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchPatients = async () => {
    try {
      const response = await getAssignedPatients()
      if (response.success) {
        setPatients(response.data)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await createTask(formData)
      if (response.success) {
        alert('Task created successfully!')
        setFormData({
          patientId: '',
          taskName: '',
          taskType: 'Medication',
          description: '',
          priority: 'Medium',
          scheduledTime: '',
          notes: ''
        })
        setShowForm(false)
        fetchTasks()
        fetchStats()
      }
    } catch (error) {
      alert('Error creating task')
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus })
      fetchTasks()
      fetchStats()
    } catch (error) {
      alert('Error updating task')
    }
  }

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId)
        fetchTasks()
        fetchStats()
      } catch (error) {
        alert('Error deleting task')
      }
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchTasks()
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'urgent'
      case 'High': return 'high'
      case 'Medium': return 'medium'
      case 'Low': return 'low'
      default: return 'medium'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle size={20} />
      case 'In Progress': return <Edit size={20} />
      case 'Pending': return <Clock size={20} />
      default: return <Clock size={20} />
    }
  }

  if (loading && !tasks.length) {
    return <div className="loading">Loading tasks...</div>
  }

  return (
    <div className="nurse-tasks">
      <div className="page-header">
        <h1>Task Management</h1>
        <p>Manage your daily nursing tasks</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card warning">
            <div className="stat-icon">
              <Clock size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>Pending Tasks</p>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">
              <Edit size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.inProgress}</h3>
              <p>In Progress</p>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">
              <CheckCircle size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.completed}</h3>
              <p>Completed</p>
            </div>
          </div>

          <div className="stat-card danger">
            <div className="stat-icon">
              <AlertCircle size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.urgent}</h3>
              <p>Urgent Tasks</p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="tasks-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="filter-group">
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select value={filterPriority} onChange={(e) => { setFilterPriority(e.target.value); setCurrentPage(1); }}>
            <option value="">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button className="btn-add" onClick={() => setShowForm(!showForm)}>
            <Plus size={20} /> {showForm ? 'Cancel' : 'Add Task'}
          </button>
        </div>
      </div>

      {/* Add Task Form */}
      {showForm && (
        <div className="task-form-card">
          <h2>Create New Task</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Patient *</label>
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map(p => (
                    <option key={p._id} value={p._id}>{p.name} - Room {p.roomNumber || 'N/A'}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Task Name *</label>
                <input
                  type="text"
                  value={formData.taskName}
                  onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                  required
                  placeholder="e.g., Morning Medication"
                />
              </div>

              <div className="form-group">
                <label>Task Type</label>
                <select
                  value={formData.taskType}
                  onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
                >
                  <option value="Medication">Medication</option>
                  <option value="Checkup">Checkup</option>
                  <option value="Vitals Check">Vitals Check</option>
                  <option value="Wound Care">Wound Care</option>
                  <option value="IV Therapy">IV Therapy</option>
                  <option value="Patient Education">Patient Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div className="form-group">
                <label>Scheduled Time *</label>
                <input
                  type="datetime-local"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
                placeholder="Additional notes..."
              ></textarea>
            </div>

            <button type="submit" className="btn-submit">Create Task</button>
          </form>
        </div>
      )}

      {/* Tasks List */}
      <div className="tasks-list">
        {tasks.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Patient</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Scheduled</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className={`task-row ${task.status.toLowerCase().replace(' ', '-')}`}>
                  <td>
                    <div className="task-name">{task.taskName}</div>
                    {task.description && <div className="task-desc">{task.description}</div>}
                  </td>
                  <td>
                    <div>{task.patient?.name}</div>
                    <small>Room {task.patient?.roomNumber || 'N/A'}</small>
                  </td>
                  <td>{task.taskType}</td>
                  <td>
                    <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>{new Date(task.scheduledTime).toLocaleString()}</td>
                  <td>
                    <div className="status-with-icon">
                      {getStatusIcon(task.status)}
                      <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                        {task.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {task.status === 'Pending' && (
                        <button
                          className="btn-icon btn-start"
                          onClick={() => handleStatusChange(task._id, 'In Progress')}
                          title="Start Task"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      {(task.status === 'Pending' || task.status === 'In Progress') && (
                        <button
                          className="btn-icon btn-complete"
                          onClick={() => handleStatusChange(task._id, 'Completed')}
                          title="Mark Complete"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {task.status !== 'Completed' && (
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDelete(task._id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>No tasks found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default NurseTasks
