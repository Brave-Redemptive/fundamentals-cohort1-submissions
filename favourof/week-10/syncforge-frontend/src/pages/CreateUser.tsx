import { useState } from "react";
import api from "../api/client";

export default function CreateUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error" | "info" | "">("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setType("");
    if (!name.trim() || !email.trim()) {
      setMessage("Please provide both name and email.");
      setType("error");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/users", { name: name.trim(), email: email.trim() });
      setMessage("User created successfully!");
      setType("success");
      resetForm();
    } catch {
      setMessage("Error creating user. Please try again.");
      setType("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Create User</h1>
          <span className="text-xs text-gray-400">Add new user</span>
        </div>

        {message && (
          <div
            className={
              "mb-4 px-4 py-2 rounded-md text-sm " +
              (type === "success"
                ? "bg-green-50 text-green-700 border border-green-100"
                : type === "error"
                ? "bg-red-50 text-red-700 border border-red-100"
                : "bg-blue-50 text-blue-700 border border-blue-100")
            }
            role="status"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="submit"
              disabled={submitting}
              className={
                "inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white " +
                (submitting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700")
              }
            >
              {submitting ? (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : null}
              {submitting ? "Creating..." : "Add User"}
            </button>

            <button
              type="button"
              onClick={() => {
                resetForm();
                setMessage("");
                setType("");
              }}
              className="text-sm px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </form>

        <p className="mt-4 text-xs text-gray-500">
          Users will receive an email after creation (if your backend sends emails). Make sure the email is valid.
        </p>
      </div>
    </div>
  );
}
