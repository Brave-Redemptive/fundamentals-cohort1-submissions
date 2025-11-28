import { useEffect, useState } from "react";

// ✅ Define the shape of a cart item
type CartItem = {
  productId: string;
  productName: string;
  productQuantity: number;
  manufactureDate: string;
  expiryDate: string;
};

// ✅ Define the shape of the API response
type CartResponse = {
  success: boolean;
  items: CartItem[];
};

function Cart() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/cart/get-cart/1234567890abcdef")
      .then((res) => res.json())
      .then((data: CartResponse) => {
        setCart(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch cart");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>{error}</p>;
  if (!cart || cart.items.length === 0) return <p>Your cart is empty</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Cart Items</h1>
      <ul>
        {cart.items.map((item) => (
          <li key={item.productId} style={{ marginBottom: "1rem" }}>
            <strong>{item.productName}</strong>
            <p>Quantity: {item.productQuantity}</p>
            <p>Manufacture Date: {new Date(item.manufactureDate).toLocaleDateString()}</p>
            <p>Expiry Date: {new Date(item.expiryDate).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Cart;
