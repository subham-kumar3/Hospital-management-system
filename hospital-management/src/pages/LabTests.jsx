import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './LabTests.css';

const LabTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTests();
  }, [statusFilter, priorityFilter]);

  const fetchTests = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (search) params.search = search;

      const response = await api.get('/lab/tests', { params });
      if (response.data.success) {
        setTests(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchTests();
  };

  const handleStatusUpdate = async (testId, status) => {
    try {
      await api.put(`/lab/tests/${testId}/status`, { status });
      fetchTests();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const viewTestDetails = (test) => {
    setSelectedTest(test);
    setShowModal(true);
  };

  return (
    <div className="lab-tests-page">
      <div className="page-header">
        <h1>Test Requests</h1>
        <p>View and manage all lab test requests</p>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="Search by patient name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="search-input"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Priority</option>
          <option value="Normal">Normal</option>
          <option value="Urgent">Urgent</option>
          <option value="Critical">Critical</option>
        </select>
        <button onClick={handleSearch} className="search-btn">Search</button>
      </div>

      {loading ? (
        <div className="loading">Loading tests...</div>
      ) : (
        <div className="tests-table-container">
          <table className="tests-table">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Sample</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test._id} className={`priority-${test.priority.toLowerCase()}`}>
                  <td><strong>{test.testName}</strong></td>
                  <td>{test.patient?.name}</td>
                  <td>{test.doctor?.name}</td>
                  <td>{test.testType}</td>
                  <td>
                    <span className={`priority-badge ${test.priority.toLowerCase()}`}>
                      {test.priority}
                    </span>
                  </td>
                  <td>
                    <select
                      value={test.status}
                      onChange={(e) => handleStatusUpdate(test._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    {test.sampleCollected ? (
                      <span className="collected-badge">✓ Collected</span>
                    ) : (
                      <span className="not-collected-badge">✗ Not Collected</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => viewTestDetails(test)}
                      className="view-details-btn"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedTest && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Test Details</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <label>Test Name:</label>
                <span>{selectedTest.testName}</span>
              </div>
              <div className="detail-row">
                <label>Test Type:</label>
                <span>{selectedTest.testType}</span>
              </div>
              <div className="detail-row">
                <label>Patient:</label>
                <span>{selectedTest.patient?.name} (Age: {selectedTest.patient?.age})</span>
              </div>
              <div className="detail-row">
                <label>Doctor:</label>
                <span>{selectedTest.doctor?.name}</span>
              </div>
              <div className="detail-row">
                <label>Priority:</label>
                <span className={`priority-badge ${selectedTest.priority.toLowerCase()}`}>
                  {selectedTest.priority}
                </span>
              </div>
              <div className="detail-row">
                <label>Status:</label>
                <span>{selectedTest.status}</span>
              </div>
              <div className="detail-row">
                <label>Sample Collected:</label>
                <span>{selectedTest.sampleCollected ? 'Yes' : 'No'}</span>
              </div>
              {selectedTest.assignedEquipment && (
                <div className="detail-row">
                  <label>Equipment:</label>
                  <span>{selectedTest.assignedEquipment}</span>
                </div>
              )}
              {selectedTest.notes && (
                <div className="detail-row">
                  <label>Notes:</label>
                  <span>{selectedTest.notes}</span>
                </div>
              )}
              <div className="detail-row">
                <label>Created:</label>
                <span>{new Date(selectedTest.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabTests;
