import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import ErrorBox from "../components/ErrorBox";
import api from "../services/api";

interface Payment {
  id: number;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  createdAt: string;
}

export default function PaymentDetails() {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/payments/1")
      .then((res) => setPayment(res.data))
      .catch((err) =>
        setError(err.response?.data?.error || err.message || "Error")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorBox message={error} />;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow p-6 rounded">
      <h1 className="text-xl font-semibold mb-4 text-gray-800">
        Payment Details
      </h1>

      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
        {JSON.stringify(payment, null, 2)}
      </pre>
    </div>
  );
}
