# WaveCom Notification Dashboard

React-Vite frontend for the WaveCom Notification Delivery System. Provides a real-time dashboard for sending notifications and monitoring job status.

## Features

- Send email, SMS, and push notifications
- Real-time job status updates (5-second polling)
- Statistics dashboard showing job counts by status
- Detailed job view with activity logs
- Responsive design

## Setup

### Prerequisites
- Node.js 18+
- Backend server running on port 3001

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## Configuration

The Vite dev server proxies `/api` requests to `http://localhost:3001`. For production, configure your web server or CDN to proxy API requests to the backend.

## Tech Stack

- React 18
- TypeScript
- Vite
- CSS (no framework)
