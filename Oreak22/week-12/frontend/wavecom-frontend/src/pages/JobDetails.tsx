import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import type { Job } from "../types/notifications";
import Loader from "../components/Loader";

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const res = await api.get<Job>(`/notifications/${id}`);
      setJob(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
    const iv = setInterval(fetchJob, 2500);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto p-6">
        {!job && <Loader />}

        {job && (
          <>
            <h1 className="text-2xl font-bold mb-2">
              Job {job.jobId ?? job._id}
            </h1>

            <div className="bg-white p-4 rounded shadow">
              <div>
                <strong>Type:</strong> {job.type}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <span className="capitalize">{job.status}</span>
              </div>
              <div>
                <strong>To:</strong>{" "}
                <pre className="inline">{JSON.stringify(job.to)}</pre>
              </div>
              <div>
                <strong>Attempts:</strong> {job.attempts ?? 0}/
                {job.maxAttempts ?? "?"}
              </div>

              <div className="mt-3">
                <strong>Logs:</strong>
                <ul className="list-disc ml-6">
                  {job.logs && job.logs.length > 0 ? (
                    job.logs.map((l, i) => (
                      <li
                        key={i}
                        className={
                          l.success ? "text-green-700" : "text-red-600"
                        }
                      >
                        {l.attemptAt
                          ? new Date(l.attemptAt).toLocaleString()
                          : ""}{" "}
                        — {l.provider} —{" "}
                        {l.success ? "Success" : `Failure: ${l.response}`}
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500">No logs yet.</li>
                  )}
                </ul>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
