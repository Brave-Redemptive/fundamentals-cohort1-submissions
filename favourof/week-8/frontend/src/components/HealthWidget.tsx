import { useEffect, useState } from "react";

type Health = {
  status: string;
  timestamp: string;
  uptime: number;
  service: string;
  version: string;
};

export default function HealthWidget() {
  const [data, setData] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/health`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setError("Unable to fetch health status"));
  }, []);

  if (error) return <div>{error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h3>Service: {data.service}</h3>
      <p>Status: {data.status}</p>
      <p>Version: {data.version}</p>
      <p>Uptime: {Math.round(data.uptime)}s</p>
      <small>{new Date(data.timestamp).toLocaleString()}</small>
    </div>
  );
}
