
# PayVerse Core Services (Backend)

## 📌 Project Overview
This is the backend API for **PayVerse**, a distributed fintech platform designed to handle high-volume financial transactions. This Proof of Concept (POC) focuses on demonstrating critical architectural trade-offs regarding data consistency and security.

## 🛠 Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL (SQL)
* **Authentication:** JWT (Stateless)
* **Language:** JavaScript/Node

## ⚖️ Technical Trade-Off Decisions
This architecture implements specific choices to satisfy fintech requirements:

1.  **SQL (PostgreSQL) vs NoSQL:**
    * *Decision:* **SQL**
    * *Reasoning:* Financial data requires strict ACID compliance. We prioritized data consistency and relational integrity over the flexible schema of NoSQL to prevent ledger discrepancies.

2.  **JWT vs Session Auth:**
    * *Decision:* **JWT**
    * *Reasoning:* To support horizontal scalability, we chose stateless JWTs. This eliminates the bottleneck of a central session store (e.g., Redis) and allows independent scaling of API instances.

3.  **Docker vs Kubernetes :**
  * *Decision:* **Docker**
  * *Reasoning:* For the current phase (Proof of Concept), speed and developer velocity are paramount. Kubernetes introduces significant "operational overhead" that is unnecessary for a validation prototype. Docker Compose allows us to define the Backend, Frontend, and Database in a single file, ensuring that any engineer can spin up the entire PayVerse environment locally in minutes. We can migrate to K8s once the application logic is proven.


  For more details visit the detailed Technical report here:([Google Doc](https://docs.google.com/document/d/1p8MAzipRViXthndJCeEtcFLGtrZ6p7oLkBvswzFwEvA/edit?usp=sharing)) 


## 🚀 Setup & Installation

### Prerequisites
* Node.js (v16+)
* PostgreSQL running locally or via Docker

### 1. Clone & Install
```bash
git clone https://github.com/olamarvel/payserve-backend
cd payserve-backend
npm install
```

### 2\. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/payverse_db
JWT_SECRET=your_super_secret_key_123
```

### 3\. Database Setup

Ensure your PostgreSQL instance is running and create the database:

```sql
CREATE DATABASE payverse_db;
```

*(Note: Tables are auto-generated via the ORM/Migration script on start)*

### 4\. Run the Server

```bash
# Development Mode
npm run dev

# Production Mode
npm start
```

## 📚 API Documentation

Key Endpoints:

  * `POST /api/auth/register` - Create account
  * `POST /api/auth/login` - Get JWT
  * `GET /api/transactions/balance` - View funds (Protected)
  * `POST /api/transactions/send` - Transfer funds (Protected)

*A Postman Collection is included in the repository for testing.*
