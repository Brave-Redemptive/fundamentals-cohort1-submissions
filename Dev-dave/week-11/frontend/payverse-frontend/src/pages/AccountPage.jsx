import { useState } from "react";
import axios from "axios";

export default function AccountPage() {
  const [data, setData] = useState(null);

  const fetchAccount = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/accounts/1`
    );
    setData(res.data);
  };

  return (
    <div>
      <h2>Account Details</h2>
      <button onClick={fetchAccount}>Load Account</button>

      {data && (
        <div>
          <p>Owner: {data.owner}</p>
          <p>Balance: ₦{data.balance}</p>
        </div>
      )}
    </div>
  );
}
