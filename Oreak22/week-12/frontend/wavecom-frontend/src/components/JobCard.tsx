import { Link } from "react-router-dom";
import type { Job } from "../types/notifications";

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="p-4 bg-white rounded shadow-sm flex justify-between">
      <div>
        <div className="text-xs text-slate-500 font-mono">
          {job.jobId ?? job._id}
        </div>
        <div className="font-semibold">
          {(job.type || "").toUpperCase()} —{" "}
          <span className="capitalize">{job.status}</span>
        </div>
        <div className="text-sm text-slate-600">{JSON.stringify(job.to)}</div>
      </div>

      <div className="text-right">
        <div className="text-xs text-slate-500">
          {job.createdAt ? new Date(job.createdAt).toLocaleString() : ""}
        </div>
        <Link
          to={`/job/${job.jobId ?? job._id}`}
          className="text-sm text-indigo-600 hover:underline"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
