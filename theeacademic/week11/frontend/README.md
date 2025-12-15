# PayVerse Frontend

A modern React-based frontend for the PayVerse distributed payments platform, demonstrating key technical trade-offs in web application architecture.

## 🏗️ Technical Trade-Offs Implemented

### 1. **React-Vite vs Next.js** → **React with Vite**
**Decision**: React with Vite for faster development and simpler deployment
- ✅ **Fast HMR** and instant server start
- ✅ **Lightweight** build tool with minimal configuration
- ✅ **ES modules** native support
- ❌ **No SSR** out of the box
- ❌ **Manual routing** setup required

### 2. **REST API Integration** → **Axios HTTP Client**
**Decision**: Axios for REST API communication (aligns with backend choice)
- ✅ **Request/Response interceptors** for auth and error handling
- ✅ **Promise-based** with async/await support
- ✅ **Automatic JSON** parsing
- ❌ **Larger bundle** size compared to fetch
- ❌ **Additional dependency** to maintain

### 3. **JWT Token Storage** → **localStorage**
**Decision**: localStorage for JWT token persistence
- ✅ **Persistent** across browser sessions
- ✅ **Simple** implementation
- ✅ **No server** storage required
- ❌ **XSS vulnerability** if not handled properly
- ❌ **Not accessible** from server-side

## 🚀 Features

- **User Authentication** (Login/Register with JWT)
- **Dashboard** with balance overview and quick actions
- **Send Money** with recipient search functionality
- **Transaction History** with pagination
- **Deposit Simulation** for account funding
- **Responsive Design** for mobile and desktop
- **Real-time Balance Updates**
- **Loading States** and error handling

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- PayVerse Backend running on port 3000

## 🛠️ Installation

1. **Clone and install dependencies**:
```bash
cd payverse-frontend
npm install
```

2. **Start the development server**:
```bash
npm run dev
```

The application will run on `http://localhost:5173`

## 🎨 Pages & Components

### Pages
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user registration
- **Dashboard** (`/dashboard`) - Balance overview and quick actions
- **Send Money** (`/send`) - Transfer money to other users
- **Transaction History** (`/history`) - View all transactions

### Components
- **Navbar** - Navigation with user info and logout
- **LoadingSpinner** - Reusable loading indicator
- **AuthContext** - Global authentication state management

## 🔧 Architecture Decisions

### State Management
- **React Context** for global auth state
- **Local state** for component-specific data
- **No Redux** - keeping it simple for this scope

### Styling Approach
- **Vanilla CSS** with CSS custom properties
- **Component-scoped** styles
- **Responsive design** with CSS Grid and Flexbox
- **Design system** with consistent colors and spacing

### API Integration
```javascript
// Axios configuration with interceptors
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 10000
})

// Automatic token attachment
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### Authentication Flow
1. User logs in → JWT token received
2. Token stored in localStorage
3. Token attached to all API requests
4. Automatic logout on token expiration
5. Protected routes redirect to login

## 🎯 User Experience Features

### Loading States
- Skeleton loading for better perceived performance
- Button loading states during API calls
- Page-level loading spinners

### Error Handling
- Form validation with real-time feedback
- API error messages displayed to users
- Graceful fallbacks for network issues

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interface elements

## 🏃‍♂️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📱 Mobile Responsiveness

The application is fully responsive with:
- Collapsible navigation on mobile
- Touch-optimized buttons and forms
- Readable typography on small screens
- Optimized layouts for different screen sizes

## 🔒 Security Considerations

- JWT tokens with expiration handling
- Input validation on all forms
- XSS protection through React's built-in escaping
- CORS configuration for API communication
- Secure token storage practices

## 🎨 Design System

### Colors
- Primary: `#3b82f6` (Blue)
- Success: `#10b981` (Green)
- Error: `#ef4444` (Red)
- Gray scale: `#1e293b` to `#f8fafc`

### Typography
- System font stack for optimal performance
- Consistent font sizes and weights
- Proper contrast ratios for accessibility

### Components
- Consistent button styles and states
- Form inputs with focus states
- Card-based layout system
- Icon integration with Lucide React

## 🚀 Performance Optimizations

- Vite's fast HMR for development
- Code splitting with React Router
- Optimized bundle size
- Efficient re-renders with proper state management
- Image optimization and lazy loading ready