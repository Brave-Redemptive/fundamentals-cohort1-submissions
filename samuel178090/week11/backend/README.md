# PayVerse Backend API

> Distributed payment processing platform built with Node.js and Express

## Architecture Overview

PayVerse implements a modern fintech backend with strategic technical decisions for scalability and security.

### Technical Trade-off Decisions

#### 1. PostgreSQL (SQL) over NoSQL
- **ACID Compliance**: Financial transactions require atomicity and consistency
- **Complex Queries**: Advanced reporting and analytics capabilities  
- **Data Integrity**: Referential integrity for user accounts and transactions

#### 2. REST API over gRPC
- **Web Compatibility**: Native browser support and HTTP standards
- **Developer Experience**: Easier debugging and integration
- **Ecosystem**: Mature tooling and widespread adoption

#### 3. JWT Authentication over Sessions
- **Stateless Architecture**: Enables horizontal scaling
- **Microservices Ready**: Self-contained authentication tokens
- **Mobile Support**: Perfect for cross-platform applications

## Features

- 🔐 **Secure Authentication**: JWT-based with refresh token rotation
- 💰 **Inter-Account Transfers**: Real-time P2P payments across regions
- 🌍 **Multi-Regional Support**: Cross-regional transaction processing
- 👥 **User Management**: Role-based access control (Admin/User)
- 📊 **Real-time Analytics**: Transaction statistics and regional reporting
- 💳 **Account Management**: Balance tracking and account discovery
- 🛡️ **Security**: Input validation, error handling, and rate limiting

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
# Configure your environment variables
```

3. **Start Development Server**
```bash
npm start
```

Server runs on `http://localhost:3002`

## Live Deployment

🌐 **Production URLs:**
- **Backend API**: https://payverse-backend.onrender.com
- **Frontend App**: https://payvers.netlify.app

## Demo Credentials

For testing distributed payments:

- **Admin Account**: admin@payverse.com / password123 (₦1,000,000 - PV001)
- **User Account**: user@payverse.com / password123 (₦150,000 - PV002)
- **Alice Account**: alice@payverse.com / password123 (₦75,000 - PV003)
- **Bob Account**: bob@payverse.com / password123 (₦200,000 - PV004)

## API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Create new user account
```json
{
  "email": "user@example.com",
  "password": "securePassword",
  "fullName": "John Doe"
}
```

#### POST `/api/auth/login`
Authenticate user and receive JWT tokens
```json
{
  "email": "user@example.com",
  "password": "securePassword"
}
```

#### GET `/api/auth/validate`
Validate JWT token (requires Authorization header)

### Transaction Endpoints

#### POST `/api/transactions`
Create deposit/withdrawal transaction
```json
{
  "amount": 50000,
  "type": "deposit",
  "description": "Account funding"
}
```

#### POST `/api/transactions/transfer`
Transfer funds between accounts
```json
{
  "receiverId": 3,
  "amount": 25000,
  "description": "Payment for services"
}
```

#### GET `/api/transactions`
Get user's transaction history (authenticated)

#### GET `/api/transactions/all`
Get all system transactions (admin only)

#### GET `/api/transactions/balance`
Get current account balance

#### GET `/api/transactions/stats`
Get transaction statistics (admin only)

### User Management

#### GET `/api/users`
Get all users with balances (admin only)

#### GET `/api/users/search?query=alice`
Search users for transfers

#### GET `/api/users/profile`
Get current user profile and account details

## Project Structure

```
src/
├── controllers/     # Request handlers and business logic
├── middleware/      # Authentication and validation
├── models/          # Data access layer
├── routes/          # API route definitions
└── services/        # Business services
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Request payload validation
- **Error Handling**: Comprehensive error responses
- **CORS Protection**: Cross-origin request security

## Environment Variables

```env
PORT=3002
JWT_SECRET=your-super-secret-key
NODE_ENV=development
```

## Development

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
```

## Deployment

### Production Build
```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details

---

**PayVerse Backend** - Built for secure financial transactions