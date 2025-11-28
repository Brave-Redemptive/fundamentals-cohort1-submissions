// src/pages/HomePage.jsx
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to the Shop</h1>
      <p>This is the homepage. Use the link below to view your cart.</p>
      <Link to="/add-to-cart" style={{ color: "blue", textDecoration: "underline" }}>
        Go to Cart
      </Link>
    </div>
  );
}

export default HomePage;
