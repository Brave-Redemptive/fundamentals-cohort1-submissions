import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CreatePayment from "./pages/CreatePayment";
import PaymentDetails from "./pages/PaymentDetails";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="bg-gray-800 text-white p-4 flex space-x-4">
        <Link className="hover:underline" to="/">
          Create Payment
        </Link>
        <Link className="hover:underline" to="/details">
          Payment Details
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<CreatePayment />} />
        <Route path="/details" element={<PaymentDetails />} />
      </Routes>
    </BrowserRouter>
  );
}
