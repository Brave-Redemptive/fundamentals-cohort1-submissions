import { CheckCircle, XCircle, RefreshCw, Clock } from "lucide-react";
import {type JobStatus } from "../types";

interface StatusBadgeProps {
  status: JobStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const icons = {
    sent: <CheckCircle className="w-5 h-5 text-green-500" />,
    failed: <XCircle className="w-5 h-5 text-red-500" />,
    processing: <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />,
    pending: <Clock className="w-5 h-5 text-yellow-500" />,
  };

  const colors = {
    sent: "text-green-600 bg-green-50",
    failed: "text-red-600 bg-red-50",
    processing: "text-blue-600 bg-blue-50",
    pending: "text-yellow-600 bg-yellow-50",
  };

  return (
    <div
      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${colors[status]}`}
    >
      {icons[status]}
      <span className="capitalize">{status}</span>
    </div>
  );
}
