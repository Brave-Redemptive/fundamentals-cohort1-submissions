import { useEffect, useState } from "react";
import { listJobs, getJob } from "../services/api";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await listJobs();
        console.log("Loaded jobs:", data);
        setJobs(data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
    const id = setInterval(load, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Jobs</h2>
      {jobs.length === 0 && <div className="text-gray-500">No jobs yet</div>}

      {jobs.map((j: any) => (
        <div key={j._id} className="border p-4 rounded mb-4">
          {/* Depending on backend getJob response shape, support both */}
          <h3 className="font-semibold">{j.name}</h3>
          <p className="text-sm text-gray-600">Type: {j.type}</p>
          <p className="text-sm text-gray-600">Status: {j.status}</p>

          <div className="mt-3">
            {/* message/payload */}
            {(
              (j.job && j.messages) ||
              j.messages ||
              (j.payload ? [j.payload] : [])
            ).map((m: any, idx: number) => (
              <div
                key={m.messageId || m.to || idx}
                className="bg-gray-100 p-2 rounded mb-2"
              >
                <p>
                  <strong>{(m.channel || j.type || "").toUpperCase()}</strong> →{" "}
                  {m.to || m.payload?.to || (j.payload && j.payload.to)}
                </p>
                <p>Status: {m.status || j.status}</p>
                <p className="text-xs text-gray-500">
                  Attempts: {m.attempts ?? j.attempts ?? 0}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
