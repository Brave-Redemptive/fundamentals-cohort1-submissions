/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import api from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.href = "/send-money";
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <form
        onSubmit={submit}
        className="bg-white shadow-md rounded p-6 w-full max-w-md"
      >
        <h1 className="text-2xl mb-4 font-bold">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 mb-3 w-full rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-4 w-full rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="bg-blue-600 text-white py-2 rounded w-full">
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p className="text-center text-sm mt-4 text-red-600">{message}</p>
        )}
      </form>
    </div>
  );
}
