import { useState } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import Header from "./components/Header";
import StatsCards from "./components/StatusCards";
import JobTable from "./components/JobTable";
import LoadingSpinner from "./components/LoadingSpinner";
import { useJobs } from "./hooks/useJobs";

export default function App() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { jobs, loading, error } = useJobs(autoRefresh);

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 max-w-7xl">
        <StatsCards jobs={jobs} />

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-800">
              Notification Jobs
            </h2>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-6 py-3 rounded-lg font-medium flex items-center gap-3 transition-all ${
                autoRefresh
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <RefreshCw
                className={`w-5 h-5 ${autoRefresh ? "animate-spin" : ""}`}
              />
              Auto-refresh {autoRefresh ? "ON" : "OFF"}
            </button>
          </div>

          {error ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <p className="text-red-600">Error: {error}</p>
            </div>
          ) : loading ? (
            <LoadingSpinner />
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">
                No jobs yet. Run{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  ./test-integration.sh
                </code>{" "}
                in backend!
              </p>
            </div>
          ) : (
            <JobTable jobs={jobs} />
          )}
        </div>
      </div>
    </>
  );
}
