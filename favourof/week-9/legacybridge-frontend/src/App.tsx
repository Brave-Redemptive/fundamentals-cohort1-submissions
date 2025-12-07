import React from "react";
import PaymentList from "./components/PaymentList";

const App: React.FC = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>LegacyBridge Frontend</h1>
      <PaymentList />
    </div>
  );
};

export default App;
