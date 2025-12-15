import { useState, useEffect } from 'react';
import { NotificationJobResponse, JobDetailResponse, StatsResponse } from '../types/notification';
import { getAllNotifications, getNotificationStatus, getStats } from '../api/notifications';

interface JobsListProps {
  refreshTrigger: number;
}

export default function JobsList({ refreshTrigger }: JobsListProps): JSX.Element {
  const [jobs, setJobs] = useState<NotificationJobResponse[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (): Promise<void> => {
    try {
      const [jobsData, statsData] = await Promise.all([
        getAllNotifications(1, 50),
        getStats()
      ]);
      setJobs(jobsData.jobs);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchJobDetail = async (jobId: string): Promise<void> => {
    try {
      const detail = await getNotificationStatus(jobId);
      setSelectedJob(detail);
    } catch (err) {
      console.error('Failed to fetch job detail:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  useEffect(() => {
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleString();
  };

  if (loading) {
    return <div className="empty-state">Loading...</div>;
  }

  return (
    <div>
      {stats && (
        <div className="stats-grid">
          <div className="stat-card pending">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card queued">
            <h3>{stats.queued}</h3>
            <p>Queued</p>
          </div>
          <div className="stat-card processing">
            <h3>{stats.processing}</h3>
            <p>Processing</p>
          </div>
          <div className="stat-card sent">
            <h3>{stats.sent}</h3>
            <p>Sent</p>
          </div>
          <div className="stat-card failed">
            <h3>{stats.failed}</h3>
            <p>Failed</p>
          </div>
        </div>
      )}

      <button className="refresh-btn" onClick={fetchData}>Refresh</button>

      {error && <div className="error-message">{error}</div>}

      <div className="jobs-list">
        {jobs.length === 0 ? (
          <div className="empty-state">No notification jobs yet</div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.jobId}
              className={`job-item ${selectedJob?.jobId === job.jobId ? 'selected' : ''}`}
              onClick={() => fetchJobDetail(job.jobId)}
            >
              <div className="job-header">
                <span className={`job-type ${job.type}`}>{job.type}</span>
                <span className={`job-status ${job.status}`}>{job.status}</span>
              </div>
              <div className="job-recipient">{job.recipient}</div>
              <div className="job-time">{formatDate(job.createdAt)}</div>
            </div>
          ))
        )}
      </div>

      {selectedJob && (
        <div className="job-detail">
          <h3>Job Details</h3>
          <p><strong>ID:</strong> {selectedJob.jobId}</p>
          <p><strong>Type:</strong> {selectedJob.type}</p>
          <p><strong>Recipient:</strong> {selectedJob.recipient}</p>
          <p><strong>Status:</strong> {selectedJob.status}</p>
          <p><strong>Retries:</strong> {selectedJob.retryCount}</p>
          {selectedJob.error && <p><strong>Error:</strong> {selectedJob.error}</p>}
          
          <h4 style={{ marginTop: '15px', marginBottom: '10px' }}>Activity Log</h4>
          {selectedJob.logs.map((log, idx) => (
            <div key={idx} className="log-item">
              <span className={`log-status ${log.status}`}>{log.status}</span>
              {log.message}
              <span className="log-time">{formatDate(log.timestamp)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
