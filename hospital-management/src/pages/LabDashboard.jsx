import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './LabDashboard.css';

const LabDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/lab/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const { statistics, urgentTests, recentTests } = dashboardData || {};

  return (
    <div className="lab-dashboard">
      <div className="dashboard-header">
        <h1>Lab Technician Dashboard</h1>
        <p>Welcome to the Laboratory Management System</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card pending">
          <div className="stat-icon">🧪</div>
          <div className="stat-info">
            <h3>{statistics?.pendingTests || 0}</h3>
            <p>Pending Tests</p>
          </div>
        </div>

        <div className="stat-card progress">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{statistics?.inProgressTests || 0}</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{statistics?.completedTests || 0}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card urgent">
          <div className="stat-icon">🚨</div>
          <div className="stat-info">
            <h3>{statistics?.urgentTests || 0}</h3>
            <p>Urgent Tests</p>
          </div>
        </div>

        <div className="stat-card samples">
          <div className="stat-icon">🧬</div>
          <div className="stat-info">
            <h3>{statistics?.pendingSamples || 0}</h3>
            <p>Pending Samples</p>
          </div>
        </div>

        <div className="stat-card collected">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{statistics?.collectedSamples || 0}</h3>
            <p>Collected Samples</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/lab-tests" className="action-btn">
            <span className="action-icon">🧪</span>
            <span>View Test Requests</span>
          </Link>
          <Link to="/lab-results" className="action-btn">
            <span className="action-icon">📝</span>
            <span>Add Test Result</span>
          </Link>
          <Link to="/lab-samples" className="action-btn">
            <span className="action-icon">🧬</span>
            <span>Track Samples</span>
          </Link>
          <Link to="/lab-reports" className="action-btn">
            <span className="action-icon">📄</span>
            <span>View Reports</span>
          </Link>
        </div>
      </div>

      {/* Urgent Tests Alert */}
      {urgentTests && urgentTests.length > 0 && (
        <div className="urgent-tests-section">
          <h2>🚨 Urgent Tests</h2>
          <div className="tests-list">
            {urgentTests.map((test) => (
              <div key={test._id} className={`test-item ${test.priority.toLowerCase()}`}>
                <div className="test-info">
                  <h4>{test.testName}</h4>
                  <p>Patient: {test.patient?.name}</p>
                  <p>Doctor: {test.doctor?.name}</p>
                </div>
                <div className="test-meta">
                  <span className={`priority-badge ${test.priority.toLowerCase()}`}>
                    {test.priority}
                  </span>
                  <span className="status-badge">{test.status}</span>
                  <Link to="/lab-tests" className="view-btn">View</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Tests */}
      <div className="recent-tests-section">
        <h2>Recent Tests</h2>
        {recentTests && recentTests.length > 0 ? (
          <div className="tests-list">
            {recentTests.map((test) => (
              <div key={test._id} className="test-item">
                <div className="test-info">
                  <h4>{test.testName}</h4>
                  <p>Patient: {test.patient?.name}</p>
                  <p>Type: {test.testType}</p>
                </div>
                <div className="test-meta">
                  <span className="status-badge">{test.status}</span>
                  <span className="date-badge">
                    {new Date(test.createdAt).toLocaleDateString()}
                  </span>
                  <Link to="/lab-tests" className="view-btn">View</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No recent tests</p>
        )}
      </div>
    </div>
  );
};

export default LabDashboard;
