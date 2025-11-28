import { useState } from "react";
import { Link } from "react-router-dom";


type AddCartItem = {
  productId: string;
  productName: string;
  productQuantity: number;
  manufactureDate: string;
  expiryDate: string;
};

function AddToCart() {
  const [item, setItem] = useState<AddCartItem>({
    productId: "",
    productName: "",
    productQuantity: 1,
    manufactureDate: "",
    expiryDate: "",
  });

  const [message, setMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/cart/add-to-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Item added to cart!");
      } else {
        setMessage(data.message || "Failed to add item");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error adding item to cart");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Add Item to Cart</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <input
          type="text"
          name="productId"
          placeholder="Product ID"
          value={item.productId}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={item.productName}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="productQuantity"
          placeholder="Quantity"
          value={item.productQuantity}
          onChange={handleChange}
          min={1}
          required
        />
        <input
          type="date"
          name="manufactureDate"
          placeholder="Manufacture Date"
          value={item.manufactureDate}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="expiryDate"
          placeholder="Expiry Date"
          value={item.expiryDate}
          onChange={handleChange}
          required
        />
        <button type="submit">Add to Cart</button>
      </form>
      {message && <p>{message}</p>}

      <p>
        <Link to="/cart" style={{ color: "blue", textDecoration: "underline" }}>
        View Cart Items Here
        </Link>
      </p>
    </div>
  );
}

export default AddToCart;
