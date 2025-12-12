import { useState } from "react";
import Loader from "../components/Loader";
import ErrorBox from "../components/ErrorBox";
import api from "../services/api";

export default function CreatePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentId, setPaymentId] = useState<number | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPaymentId(null);

    const form = e.currentTarget;

    const body = {
      fromAccountId: (form.from as any).value,
      toAccountId: (form.to as any).value,
      amount: Number((form.amount as any).value),
    };

    try {
      const res = await api.post("/payments", body);
      setPaymentId(res.data.id);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Create Payment
      </h1>

      <form onSubmit={submit} className="space-y-4">
        <input
          placeholder="From Account"
          name="from"
          className="w-full border px-3 py-2 rounded focus:outline-blue-500"
        />

        <input
          placeholder="To Account"
          name="to"
          className="w-full border px-3 py-2 rounded focus:outline-blue-500"
        />

        <input
          placeholder="Amount"
          name="amount"
          type="number"
          className="w-full border px-3 py-2 rounded focus:outline-blue-500"
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:bg-gray-300"
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      {loading && <Loader />}
      {error && <ErrorBox message={error} />}

      {paymentId && (
        <p className="mt-4 bg-green-100 text-green-700 px-4 py-2 rounded">
          Payment Created: <span className="font-bold">{paymentId}</span>
        </p>
      )}
    </div>
  );
}
