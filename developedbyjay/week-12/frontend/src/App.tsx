import JobForm from "./components/JobForm";
import JobsList from "./components/JobsList";

export default function App() {
  return (
    <div className="app max-w-4xl mx-auto p-4">
      <div className="header">
        <h1>WaveCom — Notification Dashboard</h1>
        <div style={{ fontSize: 12, color: "#6b7280" }}>Backend: /api/jobs</div>
      </div>

      <JobForm />
      <JobsList />
    </div>
  );
}
