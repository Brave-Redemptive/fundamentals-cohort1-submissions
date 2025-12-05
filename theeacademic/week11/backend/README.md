# PayVerse Backend

A distributed payments platform backend built with Node.js and Express, demonstrating key technical trade-offs in fintech architecture.

## 🏗️ Technical Trade-Offs Implemented

### 1. **SQL vs NoSQL** → **PostgreSQL (SQL)**
**Decision**: PostgreSQL for ACID compliance and data consistency
- ✅ **ACID transactions** ensure financial data integrity
- ✅ **Strong consistency** for balance updates
- ✅ **Complex queries** for transaction history and analytics
- ❌ **Vertical scaling** limitations
- ❌ **Schema rigidity** requires migrations

### 2. **REST vs gRPC** → **REST APIs**
**Decision**: RESTful APIs for simplicity and frontend integration
- ✅ **HTTP/JSON** standard, easy debugging
- ✅ **Frontend compatibility** with web browsers
- ✅ **Tooling ecosystem** (Postman, curl, etc.)
- ❌ **Larger payload** size compared to gRPC
- ❌ **No built-in streaming** capabilities

### 3. **JWT vs Session-Based Auth** → **JWT Tokens**
**Decision**: JWT for stateless authentication and scalability
- ✅ **Stateless** - no server-side session storage
- ✅ **Horizontal scaling** friendly
- ✅ **Cross-service** authentication
- ❌ **Token revocation** complexity
- ❌ **Larger request** headers

## 🚀 Features

- **User Authentication** (Register/Login with JWT)
- **Money Transfers** with ACID transaction guarantees
- **Deposit Simulation** for account funding
- **Transaction History** with pagination
- **User Search** for finding recipients
- **Balance Management** with real-time updates

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

## 🛠️ Installation

1. **Clone and install dependencies**:
```bash
cd payverse-backend
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Set up PostgreSQL database**:
```sql
CREATE DATABASE payverse_db;
```

4. **Start the server**:
```bash
# Development
npm run dev

# Production
npm start
```

The server will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login

### Transactions
- `POST /api/v1/transactions/send` - Send money to another user
- `POST /api/v1/transactions/deposit` - Deposit money (simulation)
- `GET /api/v1/transactions/history` - Get transaction history

### Users
- `GET /api/v1/users/profile` - Get current user profile
- `GET /api/v1/users/search` - Search users by email
- `GET /api/v1/users/balance` - Get current balance

### Health Check
- `GET /health` - Service health status

## 🔧 Architecture Decisions

### Database Schema
```sql
-- Users table with balance tracking
users (id, email, password_hash, first_name, last_name, balance, status, created_at, updated_at)

-- Transactions with ACID compliance
transactions (id, from_user_id, to_user_id, amount, currency, type, status, description, reference_id, created_at, updated_at)
```

### Security Features
- Password hashing with bcrypt (12 rounds)
- JWT token authentication
- Input validation with Joi
- SQL injection prevention with parameterized queries
- CORS configuration
- Helmet.js security headers

### Error Handling
- Global error handler middleware
- Database constraint error mapping
- Validation error responses
- Request logging and monitoring

## 🧪 Testing with Postman

Import the API collection and test all endpoints:

1. Register a new user
2. Login to get JWT token
3. Use token in Authorization header for protected routes
4. Test money transfers between users
5. Check transaction history

## 🏃‍♂️ Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Check health
curl http://localhost:3000/health
```

## 📊 Performance Considerations

- **Connection pooling** for database efficiency
- **Indexed queries** for fast lookups
- **Transaction isolation** for data consistency
- **Pagination** for large result sets
- **Input validation** to prevent malformed requests

## 🔒 Security Best Practices

- Environment variable configuration
- Password hashing with salt
- JWT token expiration
- Input sanitization and validation
- Database transaction isolation
- CORS policy enforcement