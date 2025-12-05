import React, { useEffect, useState } from "react";
import { getPayments } from "../services/api";

interface Payment {
  id: number;
  customer: string;
  amount: number;
  description: string;
}

const PaymentList: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPayments();
        if (result.success) {
          setPayments(result.data);
        } else {
          setError(result.message);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("❌ Error fetching payments:", err.message);
          setError(err.message);
        } else {
          setError("Failed to fetch payments");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Payments</h2>
      <ul>
        {payments.map((p) => (
          <li key={p.id}>
            <strong>{p.customer}</strong> — {p.description} (${p.amount})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentList;
