import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './LabSamples.css';

const LabSamples = () => {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchSamples();
  }, [filter]);

  const fetchSamples = async () => {
    try {
      const params = {};
      if (filter) params.collectionStatus = filter;

      const response = await api.get('/lab/samples', { params });
      if (response.data.success) {
        setSamples(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching samples:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionUpdate = async (sampleId, status) => {
    try {
      await api.put(`/lab/samples/${sampleId}/collection`, {
        collectionStatus: status
      });
      fetchSamples();
    } catch (error) {
      console.error('Error updating collection:', error);
      alert('Failed to update collection status');
    }
  };

  return (
    <div className="lab-samples-page">
      <div className="page-header">
        <h1>Sample Management</h1>
        <p>Track and manage patient samples</p>
      </div>

      <div className="samples-controls">
        <div className="filter-group">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Samples</option>
            <option value="Pending">Pending</option>
            <option value="Collected">Collected</option>
            <option value="Not Collected">Not Collected</option>
          </select>
        </div>
        <button
          className="create-sample-btn"
          onClick={() => setShowCreateModal(true)}
        >
          + Add New Sample
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading samples...</div>
      ) : (
        <div className="samples-grid">
          {samples.map((sample) => (
            <div key={sample._id} className="sample-card">
              <div className="sample-header">
                <h3>{sample.sampleId}</h3>
                <span className={`collection-status ${sample.collectionStatus.toLowerCase().replace(' ', '-')}`}>
                  {sample.collectionStatus}
                </span>
              </div>

              <div className="sample-details">
                <div className="detail-item">
                  <label>Patient:</label>
                  <span>{sample.patient?.name}</span>
                </div>
                <div className="detail-item">
                  <label>Sample Type:</label>
                  <span>{sample.sampleType}</span>
                </div>
                <div className="detail-item">
                  <label>Test:</label>
                  <span>{sample.labTest?.testName}</span>
                </div>
                <div className="detail-item">
                  <label>Collection Date:</label>
                  <span>{new Date(sample.collectionDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <label>Expiry Date:</label>
                  <span>{new Date(sample.expiryDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <label>Storage:</label>
                  <span>{sample.storageConditions}</span>
                </div>
                {sample.storageLocation && (
                  <div className="detail-item">
                    <label>Location:</label>
                    <span>{sample.storageLocation}</span>
                  </div>
                )}
              </div>

              <div className="sample-actions">
                {sample.collectionStatus === 'Pending' && (
                  <button
                    onClick={() => handleCollectionUpdate(sample._id, 'Collected')}
                    className="action-btn collect"
                  >
                    Mark Collected
                  </button>
                )}
                {sample.collectionStatus === 'Pending' && (
                  <button
                    onClick={() => handleCollectionUpdate(sample._id, 'Not Collected')}
                    className="action-btn not-collect"
                  >
                    Mark Not Collected
                  </button>
                )}
                <button className="action-btn view">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {samples.length === 0 && !loading && (
        <div className="no-data">No samples found</div>
      )}
    </div>
  );
};

export default LabSamples;
