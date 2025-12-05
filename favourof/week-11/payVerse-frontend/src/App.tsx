import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SendMoney from "./pages/SendMoney";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/send-money" element={<SendMoney />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
