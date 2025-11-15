import React, { useEffect, useState } from 'react';
import HealthCard from './components/HealthCard';
import './styles.css';

interface HealthData {
  status: string;
  timestamp: string;
  uptime: number;
  service: string;
}

function App() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchHealth = async () => {
    try {
      const res = await fetch(`${API_URL}/health`);
      if (!res.ok) throw new Error('Failed');
      const data: HealthData = await res.json();
      setHealth(data);
      setError(false);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <h1>🚀 DeployHub Observability</h1>
      <p>Real-time System Monitor</p>

      {loading && <p>Connecting to satellite...</p>}

      {!loading && (
        <div className="grid">
          <HealthCard 
            title="System Status" 
            value={error ? 'DOWN' : health?.status || 'Unknown'} 
            status={error ? 'DOWN' : health?.status} 
          />
          
          <HealthCard 
            title="Uptime (Seconds)" 
            value={error || !health ? '---' : Math.floor(health.uptime)} 
          />

          <HealthCard 
            title="API Version" 
            value="v1.0.0" 
          />
        </div>
      )}

      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          ⚠️ Cannot connect to Backend at {API_URL}
        </div>
      )}
    </div>
  );
}

export default App;