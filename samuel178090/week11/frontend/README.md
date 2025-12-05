# PayVerse Frontend

Distributed payments platform frontend built with React + Vite. Demonstrates client-side implementation of PayVerse's technical trade-offs (REST + JWT) with full inter-account transfer capabilities and multi-regional payment processing.

## Trade-off Implementation

1. REST API integration using `axios` (simple HTTP requests)
2. JWT-based authentication with access + refresh token handling
3. React Context for authentication state and protected routes

## Features

- 🔐 **Secure Authentication**: JWT-based login with role-based access
- 💸 **Inter-Account Transfers**: Real-time P2P payments between users
- 🔍 **User Discovery**: Search recipients by name, email, or account number
- 💰 **Balance Management**: Real-time balance tracking and updates
- 🌍 **Multi-Regional Support**: Cross-regional transaction processing
- 📊 **Analytics Dashboard**: Different views for admin vs regular users
- 📱 **Responsive Design**: Mobile-friendly interface with loading states

## Quickstart

1. Install dependencies
```powershell
cd .\payverse-frontend
npm install
```

2. Configure API base URL (optional):

Edit `src/services/api.js` to point to your backend (default expected: `http://localhost:3001`). Alternatively, set an environment variable in a `.env` file at the project root:

```
VITE_API_BASE_URL=http://localhost:3001
```

3. Start the dev server
```powershell
npm run dev
```

Vite will print the local dev URL (commonly `http://localhost:5173`). Open that URL in your browser.

## Live Deployment

🌐 **Production URLs:**
- **Backend API**: https://payverse-backend.onrender.com
- **Frontend App**: https://payvers.netlify.app

## Demo Credentials

For testing distributed payments:

- **Admin Account**: admin@payverse.com / password123 (₦1,000,000 - PV001 - NG-LAGOS)
- **User Account**: user@payverse.com / password123 (₦150,000 - PV002 - NG-ABUJA)
- **Alice Account**: alice@payverse.com / password123 (₦75,000 - PV003 - NG-LAGOS)
- **Bob Account**: bob@payverse.com / password123 (₦200,000 - PV004 - NG-KANO)

## Testing Inter-Account Transfers

1. Login as any user
2. Click "Transfer Funds" button
3. Search for recipient by name/email/account
4. Enter amount and description
5. Complete transfer and see real-time balance updates

## Architecture notes

- `AuthContext.jsx` manages auth state and tokens
- `services/api.js` wraps `axios` and sets base URL + interceptors
- Pages: `Login.jsx`, `Dashboard.jsx` (protected)
- UI handles loading and error states explicitly (spinners, toast or inline messages)

## API Integration

Distributed payments platform endpoints:

**Authentication:**
- `POST /api/auth/login` - User authentication
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/validate` - Token validation

**Transactions:**
- `GET /api/transactions` - User transaction history
- `POST /api/transactions` - Create deposit/withdrawal
- `POST /api/transactions/transfer` - Inter-account transfers
- `GET /api/transactions/balance` - Current balance
- `GET /api/transactions/stats` - System statistics (admin)

**Users:**
- `GET /api/users/search` - Search users for transfers
- `GET /api/users/profile` - User profile and account details
- `GET /api/users` - All users (admin only)

## Postman

Use the Postman collection included in the backend repository (`payverse-backend/PayVerse_API.postman_collection.json`) to inspect expected request/response shapes.

## Troubleshooting

- If authentication fails, check that the backend is running and `VITE_API_BASE_URL` is correct.
- If CORS issues appear, ensure the backend allows requests from the frontend origin (or use a proxy in development).

## Next improvements (optional)

- Add logout and refresh token rotation UI flows
- Add form validation and better error messaging
- Add end-to-end tests (Cypress)