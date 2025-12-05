/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import api from "../api/axios";

export default function SendMoney() {
  const [form, setForm] = useState({
    toAccountNumber: "",
    amount: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/transactions/send", {
        toAccountNumber: form.toAccountNumber,
        amount: Number(form.amount),
        description: form.description,
      });

      setMsg(`Success: ₦${form.amount} sent!`);
    } catch (err: any) {
      setMsg(err.response?.data?.error || "Transaction failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <form
        onSubmit={submit}
        className="bg-white shadow p-6 rounded w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4">Send Money</h1>

        <input
          type="text"
          placeholder="Receiver Account Number"
          className="border p-2 mb-3 w-full rounded"
          onChange={(e) =>
            setForm({ ...form, toAccountNumber: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Amount"
          className="border p-2 mb-3 w-full rounded"
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="border p-2 mb-4 w-full rounded"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        ></textarea>

        <button
          className="bg-green-600 text-white py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>

        {msg && <p className="mt-4 text-center">{msg}</p>}
      </form>
    </div>
  );
}
