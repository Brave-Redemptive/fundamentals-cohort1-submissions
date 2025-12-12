import {type Job } from "../types";

interface StatsCardsProps {
  jobs: Job[];
}

export default function StatsCards({ jobs }: StatsCardsProps) {
  const stats = {
    total: jobs.length,
    pending: jobs.filter((j) => j.status === "pending").length,
    processing: jobs.filter((j) => j.status === "processing").length,
    sent: jobs.filter((j) => j.status === "sent").length,
    failed: jobs.filter((j) => j.status === "failed").length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
        <div className="text-sm text-gray-600">Total Jobs</div>
      </div>
      <div className="bg-yellow-50 rounded-lg shadow p-6 text-center">
        <div className="text-3xl font-bold text-yellow-600">
          {stats.pending}
        </div>
        <div className="text-sm text-gray-600">Pending</div>
      </div>
      <div className="bg-blue-50 rounded-lg shadow p-6 text-center">
        <div className="text-3xl font-bold text-blue-600">
          {stats.processing}
        </div>
        <div className="text-sm text-gray-600">Processing</div>
      </div>
      <div className="bg-green-50 rounded-lg shadow p-6 text-center">
        <div className="text-3xl font-bold text-green-600">{stats.sent}</div>
        <div className="text-sm text-gray-600">Delivered</div>
      </div>
      <div className="bg-red-50 rounded-lg shadow p-6 text-center">
        <div className="text-3xl font-bold text-red-600">{stats.failed}</div>
        <div className="text-sm text-gray-600">Failed</div>
      </div>
    </div>
  );
}
