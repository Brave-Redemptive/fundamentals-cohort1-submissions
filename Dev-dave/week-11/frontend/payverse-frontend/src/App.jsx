import { useState } from "react";
import AccountPage from "./pages/AccountPage";
import TransferPage from "./pages/TransferPage";

export default function App() {
  const [page, setPage] = useState("account");

  return (
    <div>
      <button onClick={() => setPage("account")}>Account</button>
      <button onClick={() => setPage("transfer")}>Transfer</button>

      {page === "account" && <AccountPage />}
      {page === "transfer" && <TransferPage />}
    </div>
  );
}
