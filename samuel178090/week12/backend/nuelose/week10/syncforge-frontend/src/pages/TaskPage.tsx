import { useEffect, useState } from "react";
import api from "../services/api";
import type { Task, ApiResponse } from "../types/task.types";
import Loader from "../components/Loader";
import ErrorBanner from "../components/ErrorBanner";
import axios from "axios";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get<ApiResponse<Task[]>>("/tasks");
      setTasks(res.data.data ?? []);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error as string);
      } else {
        setError("Failed to load tasks");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/tasks", { message: message.trim() });

      setMessage("");
      setSuccess("Task created successfully!");
      await fetchTasks();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      if (!axios.isAxiosError(err) || !err.response?.data) {
        setError("Network error — check your connection");
        return;
      }

      const payload = err.response.data as ApiResponse<never>;

      if (payload.code === "DUPLICATE_MESSAGE") {
        setError("This task already exists!");
      } else if (payload.details?.[0]?.message) {
        setError(payload.details[0].message);
      } else if (payload.error) {
        setError(payload.error);
      } else {
        setError("Failed to create task");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tasks</h1>

      {/* Create Task Form */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What needs to be done?"
            className="input w-full"
            disabled={submitting}
            autoFocus
          />

          {error && <ErrorBanner message={error} />}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg font-medium">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={!message.trim() || submitting}
            className={`btn-primary ${
              !message.trim() || submitting
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {submitting ? (
              <>
                <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Creating...
              </>
            ) : (
              "Add Task"
            )}
          </button>
        </form>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">All Tasks</h2>
          <span className="text-sm text-gray-500">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading && <Loader />}

        {!loading && tasks.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-6xl mb-4">No tasks yet</p>
            <p>Use the form above to create your first task!</p>
          </div>
        )}

        {tasks.length > 0 && (
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li key={task.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-medium text-gray-800">
                      {task.message}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(task.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {task.id.slice(0, 8)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
