# Cart Service API

This is the **Cart Service backend** for a microservices-based e-commerce application.  
It handles cart management, including adding items to a cart and retrieving a user's cart. Built with **Node.js, Express, and MongoDB**.

## The Frontend repo => "https://github.com/IsamaDes/cart-service-fe"

## **Features**

![Microservices Architecture](assets/microservice-architecture.png)

- Add an item to a user's cart (`POST /api/cart/add-to-cart`)
- Retrieve all items in a user's cart (`GET /api/cart/get-cart/:userId`)
- Delete an item from the cart (`POST /api/cart/delete-from-cart`)
- MongoDB persistence for cart data
- Cross-Origin Resource Sharing (CORS) enabled

---

## **Tech Stack**

- Node.js
- Express.js
- MongoDB & Mongoose
- dotenv (for environment variables)
- cors

---

## **Getting Started**

### **Prerequisites**

- Node.js >= 18
- MongoDB (local or cloud)
- npm

### **Installation**

1. Clone the repo:

```bash
git clone https://github.com/yourusername/cart-service-api.git
cd cart-service-api
```

Install dependencies:

npm install

Create a .env file:

PORT=5000
MONGO_URI=mongodb://localhost:27017/cart-service

Start the server:

npm start

Server will run at: http://localhost:5000

### **API Endpoints**

1. Add Item to Cart
   POST /api/cart/add-to-cart

Body Example:

{
"userId": "1234567890abcdef",
"productId": "P001",
"productName": "Sample Product",
"productQuantity": 2,
"manufactureDate": "2025-09-01",
"expiryDate": "2026-09-01"
}

2. Get Cart Items
   GET /api/cart/get-cart/:userId

Example:

GET /api/cart/get-cart/1234567890abcdef

3. Delete Item from Cart
   POST /api/cart/delete-from-cart

Body Example:

{
"userId": "1234567890abcdef",
"productId": "P001"
}

Swagger Documentation

Visit http://localhost:5000/api-docs for interactive API documentation.
