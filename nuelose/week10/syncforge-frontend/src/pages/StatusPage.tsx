import { useEffect, useState } from "react";
import axios from "axios";
import api from "../services/api";
import Loader from "../components/Loader";
import ErrorBanner from "../components/ErrorBanner";

interface StatusResponse {
  service: string;
  status: string;
  timestamp: string;
}

export default function StatusPage() {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get<{
          service: string;
          status: string;
          timestamp: string;
        }>("/status");
        setData(res.data);
      } catch (err: unknown) {
        let msg = "Failed to connect to backend";

        if (axios.isAxiosError(err)) {
          msg =
            err.response?.data?.error ||
            err.message ||
            "Failed to connect to backend";
        }

        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Backend Status
      </h1>

      <div className="bg-white rounded-xl shadow-md p-8">
        {loading && <Loader />}

        {error && <ErrorBanner message={error} />}

        {data && !loading && !error && (
          <div className="space-y-6">
            <div className="flex items-center justify-between py-4 border-b">
              <span className="text-gray-600 font-medium">Service</span>
              <span className="text-lg font-mono text-primary">
                {data.service}
              </span>
            </div>

            <div className="flex items-center justify-between py-4 border-b">
              <span className="text-gray-600 font-medium">Status</span>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
                Running
              </span>
            </div>

            <div className="flex items-center justify-between py-4">
              <span className="text-gray-600 font-medium">Checked at</span>
              <span className="text-sm font-mono text-gray-500">
                {new Date(data.timestamp).toLocaleString()}
              </span>
            </div>

            <div className="mt-8 text-center">
              <p className="text-emerald-600 font-medium">
                Connection successful — backend is healthy
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        API URL:{" "}
        <code className="bg-gray-100 px-2 py-1 rounded">
          {import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api"}
          /status
        </code>
      </div>
    </div>
  );
}
