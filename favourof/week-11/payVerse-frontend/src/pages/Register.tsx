/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/register", form);
      setMsg(res.data.message);
    } catch (err: any) {
      setMsg(err.response?.data?.error || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-6 rounded w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4">Register</h1>

        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 w-full mb-3 rounded"
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded w-full"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        {msg && <p className="mt-4 text-center text-sm text-gray-700">{msg}</p>}

        <div className="mt-3 text-center">
          <a href="/login" className="text-blue-500 underline">
            Already have an account? Login Instead
          </a>
        </div>
      </form>
    </div>
  );
}
