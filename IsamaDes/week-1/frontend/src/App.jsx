import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GetCartPage from "./pages/getCartPage";
import HomePage from "./pages/HomePage";
import AddToCartPage from "./pages/AddToCartPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<GetCartPage />} />
        <Route path="/add-to-cart" element={<AddToCartPage />} />
      </Routes>
    </Router>
  );
}

export default App;
