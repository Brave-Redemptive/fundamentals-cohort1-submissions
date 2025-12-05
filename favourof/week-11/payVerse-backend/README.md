# PayVerse Backend

A distributed payments platform backend built with Node.js, Express, TypeScript, and PostgreSQL.

## Technical Decisions

### 1. SQL (PostgreSQL) vs NoSQL

**Decision: PostgreSQL**

**Justification:**

- **ACID Transactions**: Payment systems require atomicity - money transfers must be all-or-nothing
- **Strong Consistency**: Prevents double-spending and overdrafts
- **Data Integrity**: Foreign keys and constraints ensure referential integrity
- **Fixed Schema**: Payment data structure (amount, sender, receiver) is predictable
- **Audit Trails**: Complex queries for compliance and reporting

### 2. JWT vs Session-Based Authentication

**Decision: JWT with Refresh Tokens**

**Justification:**

- **Stateless**: No server-side session storage needed, enabling horizontal scaling
- **Performance**: No database lookup per request for authentication
- **Multi-Region**: Any server can verify any token without shared state
- **Security Balance**:
  - Short-lived access tokens (15 min) limit exposure window
  - Refresh tokens stored in database enable immediate revocation
  - Suitable for distributed fintech platform

### 3. REST vs gRPC

**Decision: REST API**

**Justification:**

- **Frontend Integration**: Native browser support, works seamlessly with React
- **Developer Experience**: Simple to test with Postman, easy to debug
- **Simplicity**: Minimal learning curve for POC implementation
- **Production Note**: For production scale (10,000+ requests/second), recommend hybrid approach:
  - REST for external client-facing API
  - gRPC for internal service-to-service communication

## Architecture

```
┌─────────────────┐
│   REST API      │
└────────┬────────┘
         │
┌────────▼────────┐
│  Controllers    │  ← HTTP handlers
└────────┬────────┘
         │
┌────────▼────────┐
│   Services      │  ← Business logic
└────────┬────────┘
         │
┌────────▼────────┐
│  PostgreSQL     │  ← Data persistence
└─────────────────┘
```

## API Endpoints

### Authentication

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "account_number": "ACC1733432100567"
    }
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "account_number": "ACC1733432100567",
    "balance": 1000.0
  }
}
```

### Transactions

#### Send Money

```http
POST /api/transactions/send
Authorization: Bearer
Content-Type: application/json

{
  "toAccountNumber": "ACC1733432100999",
  "amount": 50.00,
  "description": "Payment for lunch"
}
```

**Response:**

```json
{
  "message": "Transaction successful",
  "transaction": {
    "id": "uuid",
    "from_account_id": "uuid",
    "to_account_id": "uuid",
    "amount": 50.0,
    "status": "completed",
    "description": "Payment for lunch",
    "created_at": "2024-12-06T10:30:00.000Z"
  }
}
```

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone
cd payverse-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create `.env` file:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=payverse_db

JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

4. **Create database**

```bash
psql -U postgres
CREATE DATABASE payverse_db;
\c payverse_db
```

5. **Run database migrations**

```bash
psql -U postgres -d payverse_db -f database/init.sql
```

6. **Start development server**

```bash
npm run dev
```

Server will run on `http://localhost:5000`

## Project Structure

```
payverse-backend/
├── src/
│   ├── config/
│   │   └── database.ts          # PostgreSQL connection
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── transaction.controller.ts
│   ├── services/
│   │   ├── authService.ts
│   │   └── transactionService.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── transaction.routes.ts
│   ├── middlewares/
│   │   └── auth.middleware.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── account.model.ts
│   │   └── transaction.model.ts
│   ├── utils/
│   │   ├── jwt.util.ts
│   │   └── password.util.ts
│   ├── app.ts
│   └── server.ts
├── database/
│   └── init.sql
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

## Database Schema

### Users

- id (UUID, Primary Key)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- full_name (VARCHAR)
- created_at (TIMESTAMP)

### Accounts

- id (UUID, Primary Key)
- user_id (UUID, Foreign Key → users)
- account_number (VARCHAR, UNIQUE)
- balance (DECIMAL, DEFAULT 1000.00)
- currency (VARCHAR, DEFAULT 'USD')

### Transactions

- id (UUID, Primary Key)
- from_account_id (UUID, Foreign Key → accounts)
- to_account_id (UUID, Foreign Key → accounts)
- amount (DECIMAL)
- status (VARCHAR)
- description (TEXT)
- created_at (TIMESTAMP)

### Refresh Tokens

- id (UUID, Primary Key)
- user_id (UUID, Foreign Key → users)
- token (TEXT, UNIQUE)
- expires_at (TIMESTAMP)

## Testing with Postman

1. Import the Postman collection from `postman/PayVerse.postman_collection.json`
2. Register a user
3. Login to get access token
4. Use access token in Authorization header for protected endpoints

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ Parameterized SQL queries (prevents SQL injection)
- ✅ ACID transactions for money transfers
- ✅ Balance validation (prevents negative balances)
- ✅ Refresh token revocation capability

## Production Considerations

For production deployment:

1. Use environment-specific secrets
2. Implement rate limiting
3. Add request validation middleware
4. Set up logging and monitoring
5. Configure HTTPS
6. Implement blacklist for revoked tokens (Redis)
7. Add comprehensive error handling
8. Set up database connection pooling limits

## Trade off PDF

[PayVerse Technical Trade‑Off Report](https://docs.google.com/document/d/1vADONCQG_9-MXkxxXmyFwnScJQ_ZzVukKCW9rsk2YqQ/edit?usp=sharing)
