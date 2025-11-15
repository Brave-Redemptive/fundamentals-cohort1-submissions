
---

### 2. Frontend README (`deployhub-frontend/README.md`)

```markdown
# DeployHub Dashboard 🖥️

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)

**DeployHub Dashboard** is a lightweight, real-time React application designed to visualize the health and observability metrics of the DeployHub ecosystem. It connects to the backend API to provide live status updates, ensuring operators have immediate visibility into system uptime.

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Deployment](#-deployment)

---

## ✨ Features

* **Real-time Polling:** Automatically fetches system health status every 5 seconds.
* **Visual Health Indicators:** Clear Color-coded UI for UP/DOWN states.
* **Error Handling:** Gracefully handles network failures or backend outages.
* **Type Safety:** Built entirely with TypeScript for robust component logic.
* **Fast Build:** Powered by Vite.

---

## 🛠 Tech Stack

* **Framework:** React 18
* **Build Tool:** Vite
* **Language:** TypeScript
* **Styling:** CSS Modules / Plain CSS
* **Deployment:** Vercel

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18+

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/deployhub-frontend.git](https://github.com/YOUR_USERNAME/deployhub-frontend.git)
    cd deployhub-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env` file in the root directory:
    ```bash
    VITE_API_URL=http://localhost:3000
    ```
    *Note: Ensure your backend is running locally on port 3000.*

4.  **Run Locally:**
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:5173`.

---

## 🔐 Environment Variables

The application relies on specific environment variables to connect to the backend.

| Variable | Description | Default (Local) |
| :--- | :--- | :--- |
| `VITE_API_URL` | The base URL of the DeployHub Backend API | `http://localhost:3000` |

*In production (Vercel), this variable must be set to your Render/Railway Backend URL (e.g., `https://deployhub-backend.onrender.com`).*

---

## ⚙️ CI/CD Pipeline

This project uses **GitHub Actions** to ensure code quality before deployment (`.github/workflows/pipeline.yml`).

### Quality Assurance (CI)
Before any code is merged or deployed, the pipeline performs:
1.  **Linting:** Checks for code style violations.
2.  **Type Checking:** Runs `tsc` to ensure no TypeScript errors exist.
3.  **Build Verification:** Ensures `npm run build` completes successfully without errors.

*If any of these steps fail, the deployment is blocked.*

---

## ☁️ Deployment

### Vercel Deployment
This project is optimized for deployment on **Vercel**.

1.  Push code to GitHub.
2.  Import project into Vercel.
3.  **Crucial Step:** In Vercel Project Settings > Environment Variables, add:
    * `VITE_API_URL`: `https://your-backend-url.onrender.com`
4.  Deploy.


