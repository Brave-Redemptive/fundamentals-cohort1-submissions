import {type Job } from "../types";
import StatusBadge from "./StatusBadge";

interface JobTableProps {
  jobs: Job[];
}

export default function JobTable({ jobs }: JobTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              To
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Message
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Attempts
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {jobs.map((job) => (
            <tr key={job._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <StatusBadge status={job.status} />
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 text-xs rounded-full bg-gray-100 font-medium">
                  {job.type.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                {job.to}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                {job.payload.message || JSON.stringify(job.payload)}
              </td>
              <td className="px-6 py-4 text-sm text-center font-medium">
                {job.attempts}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(job.createdAt).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
