# PayVerse Client (Frontend)

## 📌 Project Overview
The client-side application for PayVerse, built to provide a responsive and type-safe user interface for managing financial transactions.

## 🛠 Tech Stack
* **Framework:** React (Vite)
* **Language:** TypeScript
* **State Management:** Context API
* **HTTP Client:** Axios (with Interceptors)

## ⚖️ Key Implementation Details

1.  **TypeScript Integration:**
    * Adopted TypeScript to ensure type safety across financial data structures (User, Transaction), reducing runtime errors significantly compared to vanilla JS.

2.  **Auth Interceptors:**
    * Implemented Axios interceptors to automatically inject the JWT `Bearer` token into every authorized request, ensuring secure communication without repetitive code.

3.  **User Feedback Loops:**
    * Dedicated "Loading" and "Error" states for all asynchronous financial operations to ensure trust and transparency for the user.

## 🚀 Setup & Installation

### Prerequisites
* Node.js (v16+)
* PayVerse Backend running on Port 5000

### 1. Install Dependencies
```bash
got clone https://github.com/olamarvel/payverse-frontend
cd payverse-frontend
npm install
```

### 2\. Run Locally

```bash
npm run dev
```

Access the app at `http://localhost:5173`

### 3\. Build for Production

```bash
npm run build
```

## 📂 Project Structure

```text
src/
├── api/            # Centralized Axios instance & Endpoints
├── context/        # Global Auth State
├── pages/          # Views (Login, Dashboard, Register)
├── types/          # TypeScript Interfaces
└── App.tsx         # Routing & Layouts
```
