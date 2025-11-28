import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Payments from "./pages/Payments";
import Navbar from "./components/navbar";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster position="bottom-right"/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payments" element={<Payments />} />
      </Routes>
    </BrowserRouter>
  );
}
