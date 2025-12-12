import { useState, useEffect } from "react";
import axios from "axios";
import type{ Job, ApiResponse } from "../types";

export const useJobs = (autoRefresh: boolean) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      const response = await axios.get<ApiResponse>(
        "http://localhost:5001/api/notifications"
      );
      setJobs(response.data.jobs || []);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error || err.message || "Failed to fetch jobs"
        );
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();

    if (autoRefresh) {
      const interval = setInterval(fetchJobs, 3000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  return { jobs, loading, error, refetch: fetchJobs };
};
