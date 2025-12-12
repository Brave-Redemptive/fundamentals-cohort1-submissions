import React, { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CreateJob() {
  const [type, setType] = useState<"email" | "sms" | "push">("email");
  const [to, setTo] = useState("");
  const [payload, setPayload] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const toObj =
        type === "email"
          ? { email: to }
          : type === "sms"
          ? { phone: to }
          : { deviceId: to };
      const body = { type, to: toObj, payload: { body: payload } };
      const res = await api.post("/notifications", body);
      const jobId = res.data.jobId ?? res.data._id;
      navigate(`/job/${jobId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create job");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Create Notification Job</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded shadow"
        >
          <div>
            <label className="block text-sm font-medium">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="mt-1 block w-full border rounded p-2"
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">To</label>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder={
                type === "email" ? "user@example.com" : "phone or device id"
              }
              className="mt-1 block w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              {loading ? "Sending..." : "Send Job"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
