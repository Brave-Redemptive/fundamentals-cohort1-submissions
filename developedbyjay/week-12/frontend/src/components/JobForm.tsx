import React, { useState } from "react";
import { createJob, type MessagePayload } from "../services/api";

export default function JobForm() {
  const [to, setTo] = useState("");
  const [channel, setChannel] = useState<MessagePayload["channel"]>("email");
  const [template, setTemplate] = useState("WELCOME");
  const [data, setData] = useState("{}");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const parsed = JSON.parse(data || "{}");
      const payload = { to, template, data: parsed };
      const resp = await createJob(channel, payload); // now matches backend Job schema { type, payload }
      setMsg(`Job created: ${resp._id || resp.jobId || "created"}`);
      setTo("");
      setData("{}");
    } catch (err: any) {
      setMsg(err.message || "Invalid JSON in data field");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mb-8 p-4 border rounded-lg" onSubmit={submit}>
      <h2 className="text-xl font-semibold mb-4">Create Notification Job</h2>

      <label className="block text-sm">Recipient</label>
      <input
        className="w-full p-2 border rounded mb-3"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      <label className="block text-sm">Channel</label>
      <select
        className="w-full p-2 border rounded mb-3"
        value={channel}
        onChange={(e) => setChannel(e.target.value as any)}
      >
        <option value="email">Email</option>
        <option value="sms">SMS</option>
        <option value="push">Push</option>
      </select>

      <label className="block text-sm">Template</label>
      <input
        className="w-full p-2 border rounded mb-3"
        value={template}
        onChange={(e) => setTemplate(e.target.value)}
      />

      <label className="block text-sm">Data (JSON)</label>
      <textarea
        className="w-full p-2 border rounded mb-3"
        value={data}
        rows={3}
        onChange={(e) => setData(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Job"}
      </button>

      {msg && <p className="mt-3 text-green-600">{msg}</p>}
    </form>
  );
}
