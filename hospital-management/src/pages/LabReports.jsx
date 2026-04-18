import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './LabReports.css';

const LabReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const params = {};
      if (search) params.search = search;

      const response = await api.get('/lab/reports', { params });
      if (response.data.success) {
        setReports(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchReports();
  };

  const viewReport = async (reportId) => {
    try {
      const response = await api.get(`/lab/reports/${reportId}`);
      if (response.data.success) {
        alert(`Report ${response.data.data.reportId}\n\nPatient: ${response.data.data.patient?.name}\nTest: ${response.data.data.testName}\nResult: ${response.data.data.testResults?.result || 'N/A'}`);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  return (
    <div className="lab-reports-page">
      <div className="page-header">
        <h1>Lab Reports</h1>
        <p>View and manage generated lab reports</p>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="Search by report ID, test name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn">Search</button>
      </div>

      {loading ? (
        <div className="loading">Loading reports...</div>
      ) : (
        <div className="reports-grid">
          {reports.map((report) => (
            <div key={report._id} className="report-card">
              <div className="report-header">
                <h3>{report.reportId}</h3>
                <span className={`status-badge ${report.status.toLowerCase()}`}>
                  {report.status}
                </span>
              </div>

              <div className="report-details">
                <div className="detail-item">
                  <label>Patient:</label>
                  <span>{report.patient?.name}</span>
                </div>
                <div className="detail-item">
                  <label>Test:</label>
                  <span>{report.testName}</span>
                </div>
                <div className="detail-item">
                  <label>Type:</label>
                  <span>{report.testType}</span>
                </div>
                <div className="detail-item">
                  <label>Doctor:</label>
                  <span>{report.doctor?.name}</span>
                </div>
                <div className="detail-item">
                  <label>Date:</label>
                  <span>{new Date(report.interpretedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="report-actions">
                <button
                  onClick={() => viewReport(report._id)}
                  className="action-btn view"
                >
                  View Report
                </button>
                <button className="action-btn print">Print</button>
                <button className="action-btn download">Download</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {reports.length === 0 && !loading && (
        <div className="no-data">No reports found</div>
      )}
    </div>
  );
};

export default LabReports;
