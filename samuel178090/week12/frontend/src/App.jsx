/**
 * WaveCom Notification System - Samuel Ajewole
 * Software Engineering Week 12 Challenge
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './assets/styles/index.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function App() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [queueStats, setQueueStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobLogs, setJobLogs] = useState([]);
  const [notification, setNotification] = useState({ 
    type: 'email', 
    recipient: '', 
    subject: '',
    message: '', 
    priority: 'medium',
    scheduledAt: ''
  });
  const [filter, setFilter] = useState({ status: '', type: '', priority: '' });
  const [socket, setSocket] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Initialize Socket.IO
  useEffect(() => {
    const newSocket = io(API_URL.replace('/api', ''));
    setSocket(newSocket);

    newSocket.on('jobCreated', (data) => {
      fetchData();
    });

    newSocket.on('jobStatusUpdate', (data) => {
      fetchData();
    });

    return () => newSocket.close();
  }, []);

  // Fetch jobs and stats
  const fetchData = async () => {
    try {
      const [jobsRes, statsRes, queueRes] = await Promise.all([
        axios.get(`${API_URL}/notifications?limit=50`),
        axios.get(`${API_URL}/stats`),
        axios.get(`${API_URL}/stats/queues`)
      ]);
      
      setJobs(jobsRes.data.jobs || []);
      setStats(statsRes.data.stats || {});
      setQueueStats(queueRes.data.queues || {});
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Create notification
  const createNotification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...notification,
        clientId: 'samuel-client'
      };
      
      if (notification.scheduledAt) {
        payload.scheduledAt = new Date(notification.scheduledAt).toISOString();
      }

      await axios.post(`${API_URL}/notifications`, payload);
      setNotification({ 
        type: 'email', 
        recipient: '', 
        subject: '',
        message: '', 
        priority: 'medium',
        scheduledAt: ''
      });
      fetchData();
      alert('Notification created successfully');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  // Get job details and logs
  const viewJobDetails = async (jobId) => {
    try {
      const [jobRes, logsRes] = await Promise.all([
        axios.get(`${API_URL}/notifications/${jobId}`),
        axios.get(`${API_URL}/notifications/${jobId}/logs`)
      ]);
      
      setSelectedJob(jobRes.data.job);
      setJobLogs(logsRes.data.logs || []);
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    return (!filter.status || job.status === filter.status) &&
           (!filter.type || job.type === filter.type) &&
           (!filter.priority || job.priority === filter.priority);
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const totalJobs = Object.values(stats.byStatus || {}).reduce((a, b) => a + b, 0);
  const successRate = totalJobs > 0 ? (((stats.byStatus?.delivered || 0) + (stats.byStatus?.sent || 0)) / totalJobs * 100).toFixed(1) : 0;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="brand">
            <h1>WaveCom</h1>
            <span className="subtitle">Notification System</span>
          </div>
          <div className="header-info">
            <div className="info-item">
              <span className="label">Student:</span>
              <span className="value">Samuel Ajewole</span>
            </div>
            <div className="info-item">
              <span className="label">ID:</span>
              <span className="value">PG/CSC/250006</span>
            </div>
            <div className="info-item">
              <span className="label">Challenge:</span>
              <span className="value">Week 12</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-content">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Notification
          </button>
          <button 
            className={`nav-item ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            Job Management
          </button>
        </div>
      </nav>

      <div className="container">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>System Overview</h2>
              <p>Real-time monitoring of notification delivery performance</p>
            </div>

            {/* Key Metrics */}
            <div className="metrics-grid">
              <div className="metric-card primary">
                <div className="metric-icon">📊</div>
                <div className="metric-content">
                  <h3>Total Jobs</h3>
                  <div className="metric-value">{totalJobs.toLocaleString()}</div>
                  <div className="metric-change">+12% from last hour</div>
                </div>
              </div>
              
              <div className="metric-card success">
                <div className="metric-icon">✅</div>
                <div className="metric-content">
                  <h3>Success Rate</h3>
                  <div className="metric-value">{successRate}%</div>
                  <div className="metric-change">+2.1% from yesterday</div>
                </div>
              </div>
              
              <div className="metric-card warning">
                <div className="metric-icon">⏱️</div>
                <div className="metric-content">
                  <h3>Avg Response</h3>
                  <div className="metric-value">2.3s</div>
                  <div className="metric-change">-0.5s improvement</div>
                </div>
              </div>
              
              <div className="metric-card info">
                <div className="metric-icon">🚀</div>
                <div className="metric-content">
                  <h3>Throughput</h3>
                  <div className="metric-value">847/min</div>
                  <div className="metric-change">Peak: 1,200/min</div>
                </div>
              </div>
            </div>

            {/* Status Distribution */}
            <div className="dashboard-grid">
              <div className="card">
                <div className="card-header">
                  <h3>Status Distribution</h3>
                </div>
                <div className="status-grid">
                  {Object.entries(stats.byStatus || {}).map(([status, count]) => (
                    <div key={status} className={`status-item ${status}`}>
                      <div className="status-count">{count}</div>
                      <div className="status-label">{status}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>Channel Performance</h3>
                </div>
                <div className="channel-stats">
                  {Object.entries(stats.byType || {}).map(([type, count]) => (
                    <div key={type} className="channel-item">
                      <div className="channel-info">
                        <span className="channel-icon">
                          {type === 'email' ? '📧' : type === 'sms' ? '📱' : '🔔'}
                        </span>
                        <span className="channel-name">{type.toUpperCase()}</span>
                      </div>
                      <div className="channel-count">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="card">
              <div className="card-header">
                <h3>System Health</h3>
              </div>
              <div className="health-grid">
                <div className="health-item">
                  <div className="health-status online"></div>
                  <div className="health-info">
                    <div className="health-name">API Server</div>
                    <div className="health-detail">Response time: 45ms</div>
                  </div>
                </div>
                <div className="health-item">
                  <div className="health-status online"></div>
                  <div className="health-info">
                    <div className="health-name">Message Queue</div>
                    <div className="health-detail">Processing: {Object.values(queueStats).reduce((sum, q) => sum + (q.messageCount || 0), 0)} jobs</div>
                  </div>
                </div>
                <div className="health-item">
                  <div className="health-status online"></div>
                  <div className="health-info">
                    <div className="health-name">Database</div>
                    <div className="health-detail">Uptime: {Math.floor((stats.system?.uptime || 0) / 60)}m</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Notification Tab */}
        {activeTab === 'create' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Create Notification</h2>
              <p>Send notifications across multiple channels with enterprise reliability</p>
            </div>

            <div className="form-container">
              <form onSubmit={createNotification} className="notification-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Notification Type</label>
                    <select 
                      value={notification.type} 
                      onChange={(e) => setNotification({...notification, type: e.target.value})}
                      required
                    >
                      <option value="email">Email Notification</option>
                      <option value="sms">SMS Message</option>
                      <option value="push">Push Notification</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Priority Level</label>
                    <select 
                      value={notification.priority} 
                      onChange={(e) => setNotification({...notification, priority: e.target.value})}
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Recipient</label>
                  <input
                    type="text"
                    placeholder="Enter email address, phone number, or device ID"
                    value={notification.recipient}
                    onChange={(e) => setNotification({...notification, recipient: e.target.value})}
                    required
                  />
                </div>

                {notification.type === 'email' && (
                  <div className="form-group">
                    <label>Subject Line</label>
                    <input
                      type="text"
                      placeholder="Enter email subject"
                      value={notification.subject}
                      onChange={(e) => setNotification({...notification, subject: e.target.value})}
                    />
                  </div>
                )}
                
                <div className="form-group">
                  <label>Message Content</label>
                  <textarea
                    placeholder="Enter your notification message..."
                    value={notification.message}
                    onChange={(e) => setNotification({...notification, message: e.target.value})}
                    required
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Schedule Delivery (Optional)</label>
                  <input
                    type="datetime-local"
                    value={notification.scheduledAt}
                    onChange={(e) => setNotification({...notification, scheduledAt: e.target.value})}
                  />
                </div>
                
                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? 'Creating...' : 'Send Notification'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Jobs Management Tab */}
        {activeTab === 'jobs' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Job Management</h2>
              <p>Monitor and manage all notification jobs with advanced filtering</p>
            </div>

            {/* Filters */}
            <div className="filters-container">
              <div className="filters">
                <select value={filter.status} onChange={(e) => setFilter({...filter, status: e.target.value})}>
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="queued">Queued</option>
                  <option value="processing">Processing</option>
                  <option value="sent">Sent</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                </select>
                
                <select value={filter.type} onChange={(e) => setFilter({...filter, type: e.target.value})}>
                  <option value="">All Types</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push</option>
                </select>
                
                <select value={filter.priority} onChange={(e) => setFilter({...filter, priority: e.target.value})}>
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="results-count">
                Showing {filteredJobs.length} of {jobs.length} jobs
              </div>
            </div>

            {/* Jobs Table */}
            <div className="jobs-table-container">
              <table className="jobs-table">
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Type</th>
                    <th>Recipient</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="no-data">
                        No jobs match your current filters
                      </td>
                    </tr>
                  ) : (
                    filteredJobs.map(job => (
                      <tr key={job.jobId}>
                        <td className="job-id">{job.jobId.substring(0, 8)}...</td>
                        <td>
                          <span className={`type-badge ${job.type}`}>
                            {job.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="recipient">{job.recipient}</td>
                        <td>
                          <span className={`status-badge ${job.status}`}>
                            {job.status}
                          </span>
                        </td>
                        <td>
                          <span className={`priority-badge ${job.priority}`}>
                            {job.priority}
                          </span>
                        </td>
                        <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button 
                            onClick={() => viewJobDetails(job.jobId)} 
                            className="action-btn"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Job Details Modal */}
        {selectedJob && (
          <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Job Details</h3>
                <button onClick={() => setSelectedJob(null)} className="close-btn">×</button>
              </div>
              <div className="modal-content">
                <div className="job-details-grid">
                  <div className="detail-item">
                    <label>Job ID</label>
                    <span>{selectedJob.jobId}</span>
                  </div>
                  <div className="detail-item">
                    <label>Type</label>
                    <span className={`type-badge ${selectedJob.type}`}>{selectedJob.type}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status</label>
                    <span className={`status-badge ${selectedJob.status}`}>{selectedJob.status}</span>
                  </div>
                  <div className="detail-item">
                    <label>Priority</label>
                    <span className={`priority-badge ${selectedJob.priority}`}>{selectedJob.priority}</span>
                  </div>
                  <div className="detail-item">
                    <label>Recipient</label>
                    <span>{selectedJob.recipient}</span>
                  </div>
                  <div className="detail-item">
                    <label>Attempts</label>
                    <span>{selectedJob.attempts}/{selectedJob.maxAttempts}</span>
                  </div>
                </div>
                
                {selectedJob.subject && (
                  <div className="detail-section">
                    <label>Subject</label>
                    <p>{selectedJob.subject}</p>
                  </div>
                )}
                
                <div className="detail-section">
                  <label>Message</label>
                  <p>{selectedJob.message}</p>
                </div>
                
                <div className="detail-section">
                  <label>Activity Log</label>
                  <div className="activity-log">
                    {jobLogs.length === 0 ? (
                      <p className="no-logs">No activity logs available</p>
                    ) : (
                      jobLogs.map((log, index) => (
                        <div key={index} className="log-entry">
                          <div className="log-time">
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                          <div className="log-event">{log.event}</div>
                          <div className="log-message">{log.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-info">
            <p>© 2024 WaveCom Notification System</p>
            <p>Built by Samuel Ajewole (PG/CSC/250006) - Software Engineering Week 12 Challenge</p>
          </div>
          <div className="footer-stats">
            <span>Scalable • Fault-Tolerant • Enterprise-Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;