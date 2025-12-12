# WaveCom Notification Dashboard (Frontend)

### Real-time Admin UI

Frontend repository for the WaveCom Notification Delivery System

## Features

- Real-time job monitoring (auto-refresh every 3 seconds)
- Live status updates: Pending → Processing → Sent / Failed
- Beautiful stats cards with color coding
- Type-safe React + TypeScript codebase

Tech Stack
| Technology | Purpose |
|--------------------|----------------------------------------------|
| React + TypeScript | Component logic & type safety |
| Vite | Lightning-fast dev server |
| Tailwind CSS | Modern utility-first styling |
| Lucide React | Beautiful, consistent icons |
| Axios | API calls to backend |
| Custom Hook | `useJobs` – reusable data-fetching logic |

Project Structure

```
src/
├── components/       ← Reusable UI components
│   ├── Header.tsx
│   ├── StatsCards.tsx
│   ├── JobTable.tsx
│   ├── StatusBadge.tsx
│   └── LoadingSpinner.tsx
├── hooks/
│   └── useJobs.ts    ← Real-time data fetching
├── types/
│   └── index.ts      ← Shared TypeScript interfaces
├── App.tsx           ← Main layout
└── main.tsx          ← Entry point
```

## Setup & Run (30 seconds)

### Prerequisites

- Node.js 18+
- Backend running at http://localhost:5001

1. Clone & Install

```Bash
git clone https://github.com/NueloSE/wavecom-backend.git
cd wavecom-frontend
npm install
```

2. Start Development Server

```Bash
npm run dev
Open → http://localhost:5173
```

## How to Use with Backend

1. Start your backend:

```Bash
cd ../wavecom-backend
docker-compose up backend worker
```

2. Run the test script to generate jobs:

```Bash
./test-integration.sh
```

3. Open this dashboard → Watch jobs go from Pending -> Processing -> Sent/Failed in real time!

## Backend Repository

https://github.com/nuelose/wavecom-backend
