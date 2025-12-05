# 📑 LegacyBridge Backend

## Overview

LegacyBridge is a fintech integration service designed to **bridge legacy systems** (monolithic PHP APIs) with modern microservices.  
This backend is built with **Node.js (Express + TypeScript)** and demonstrates:

- API **versioning** for backward compatibility.
- **Retry logic** with exponential backoff for resilience.
- **Caching** with NodeCache for performance.
- **Centralized error handling** for consistent responses.
- **Postman documentation** for API testing.

---

## 🚀 Tech Stack

- **Node.js + Express** → API framework
- **TypeScript** → Strong typing & maintainability
- **Axios** → HTTP client for legacy API calls
- **NodeCache** → In-memory caching
- **Jest + ts-jest** → Unit testing framework
- **dotenv** → Environment variable management

---

## 📂 Project Structure

- src/
- ├── controllers/ # Request handlers
- ├── middleware/ # Error handling
- ├── routes/ # Versioned API routes
- ├── services/ # Legacy API integration
- ├── tests/ # Jest unit tests
- ├── app.ts # Express app setup
- └── server.ts # Entry point

---

---

## ⚙️ Setup Instructions

1. Clone repo:

   ```bash
   git clone <your-repo-url>
   cd legacybridge-backend

   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment:
   ```bash
   PORT=5000
   LEGACY_API=https://jsonplaceholder.typicode.com/posts
   ```
4. Run in dev mode:
   ```bash
   npm run dev
   ```
5. Build & start:
   ```bash
   npm run build
   npm start
   ```

## 🔄 API Versioning

/api/v1/payments → Legacy passthrough (simulated).

/api/v2/payments → Modernized endpoint with transformed data.

## 🔁 Retry Logic

Retries failed legacy API calls up to 2 times after the initial attempt.

Uses exponential backoff (delay doubles each retry).

Prevents transient failures from breaking the API.

---

## 🗄️ Caching

Uses NodeCache with TTL = 60 seconds.

Reduces repeated calls to legacy API.

Returns cached data instantly if available.

---

## 🧪 Testing

Run unit tests:

bash
npm test
Service tests → Verify retry + caching.

Controller tests → Verify success/error responses.

---

## Frontend URl
[https://api-egacybridge-frontend.vercel.app/]

## Backend URl
[https://api-egacybridge-backend.onrender.com/api]
