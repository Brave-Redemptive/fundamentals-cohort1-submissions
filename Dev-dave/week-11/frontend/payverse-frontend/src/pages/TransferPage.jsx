import { useState } from "react";
import axios from "axios";

export default function TransferPage() {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const transfer = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/transfer`,
        { fromId: 1, toId: 2, amount: Number(amount) }
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Transfer failed");
    }
  };

  return (
    <div>
      <h2>Transfer Money</h2>

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={transfer}>Send</button>

      <p>{message}</p>
    </div>
  );
}
