import { useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import api from "../services/api";
import { usePoll } from "../hooks/usePoll";
import type { Job } from "../types/notifications";
import Loader from "../components/Loader";

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<Job[]>("/notifications?limit=50");
      setJobs(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  usePoll(fetchJobs, 3000);

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Recent Jobs</h1>
          <div className="text-sm text-slate-500">Auto-refresh every 3s</div>
        </div>

        <div className="grid gap-4">
          {loading && jobs.length === 0 && <Loader />}

          {jobs.length === 0 && !loading && (
            <div className="p-4 bg-white rounded shadow">
              No jobs yet. Create one.
            </div>
          )}

          {jobs.map((j) => (
            <JobCard key={j.jobId ?? j._id} job={j} />
          ))}
        </div>
      </main>
    </>
  );
}
