import { useEffect, useState } from "react";
import Loader from "@/components/loader";
import PaymentCard from "@/components/payment-card";
import { getPayments } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPayments()
      .then((res) => setPayments(res?.data))
      .catch((err) => {
        console.log(err);
        toast("Failed to fetch payments", { style: { color: "red" } });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Payments</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {payments.map((p: { id: number }) => (
            <PaymentCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
