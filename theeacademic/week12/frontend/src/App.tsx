import { useState } from 'react';
import NotificationForm from './components/NotificationForm';
import JobsList from './components/JobsList';

export default function App(): JSX.Element {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleNotificationCreated = (): void => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="container">
      <header>
        <h1>WaveCom Notification System</h1>
        <p>Enterprise-grade notification delivery for email, SMS, and push notifications</p>
      </header>

      <div className="main-content">
        <div className="card">
          <h2>Send Notification</h2>
          <NotificationForm onSuccess={handleNotificationCreated} />
        </div>

        <div className="card">
          <h2>Notification Jobs</h2>
          <JobsList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}
