# DeployHub Backend API 🚀

![CI Status](https://github.com/YOUR_USERNAME/deployhub-backend/actions/workflows/pipeline.yml/badge.svg)
![Node Version](https://img.shields.io/badge/node-18.x-green)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![License](https://img.shields.io/badge/license-MIT-gray)

**DeployHub Backend** is a robust, observable microservice built with Node.js, Express, and TypeScript. It serves as the core logic layer for the DeployHub observability platform, featuring built-in structured logging, Prometheus metrics, and a fully automated CI/CD pipeline.

---

## 📋 Table of Contents
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Key Features](#-key-features)
- [Observability Strategy](#-observability-strategy)
- [Getting Started](#-getting-started)
- [Dockerization](#-dockerization)
- [API Documentation](#-api-documentation)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Project Structure](#-project-structure)

---

## 🛠 Architecture & Tech Stack

* **Runtime:** Node.js (v18 LTS)
* **Framework:** Express.js
* **Language:** TypeScript (Strict Mode)
* **Logging:** Winston (JSON formatted for log aggregation)
* **Metrics:** Prom-client (Prometheus format)
* **Containerization:** Docker (Multi-stage builds)
* **Testing:** Jest & Supertest
* **Deployment:** Render (Web Service)

---

## ✨ Key Features

1.  **Production-Ready TypeScript:** Fully typed codebase using strict configuration.
2.  **Automated Health Checks:** `/health` endpoint for load balancers and uptime monitors.
3.  **Structured Logging:** All logs are emitted as JSON objects, making them parsable by tools like Datadog, ELK Stack, or CloudWatch.
4.  **Prometheus Metrics:** Exposes HTTP duration histograms and error counters at `/metrics`.
5.  **Graceful Shutdown:** Handles `SIGTERM` signals to close server connections safely.

---

## 👁 Observability Strategy

This project moves beyond `console.log` to implement the three pillars of observability:

1.  **Metrics (Quantitative):**
    * We use `prom-client` to expose a scrapable endpoint at `/metrics`.
    * **Key Metric:** `http_request_duration_seconds` (Histogram) tracks latency across percentiles (p50, p90, p99).
    * **Key Metric:** `app_errors_total` (Counter) tracks handled vs unhandled exceptions.

2.  **Logs (Qualitative):**
    * Used `winston` to format logs.
    * **Dev Mode:** Simple text logs for readability.
    * **Prod Mode:** JSON logs containing timestamps, severity, service labels, and metadata (correlation IDs).

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18+
* npm v9+

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [[https://github.com/YOUR_USERNAME/deployhub-backend.git](https://github.com/martins0023/fundamentals-cohort1-submissions/tree/main/martins0023/week%20-%208/deployhub-backend)]
    cd deployhub-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```
    *Adjust `PORT` or `ALLOWED_ORIGINS` if necessary.*

4.  **Run Locally (Development):**
    ```bash
    npm run dev
    ```
    *Server will start on http://localhost:3000*

5.  **Run Tests:**
    ```bash
    npm test
    ```

---

## 🐳 Dockerization

The project uses a **multi-stage Dockerfile** to keep the final image lightweight (removing devDependencies and TS source files).

**Build the image:**
```bash
docker build -t deployhub-backend .
```

* Run the container:
```Bash
docker run -p 3000:3000 -e NODE_ENV=production deployhub-backend
```

## 📡 API Documentation
```
    Method,Endpoint,Description
    GET,/health,"Returns API status, uptime, and timestamp. Used by the Frontend."
    GET,/metrics,Exposes Prometheus metrics for scraping.
    GET,/api/v1/example,Returns sample data.
    GET,/api/v1/example/error,Test Only: Intentionally triggers an error to test logging/alerting.
```

**Example Health Response:**
```
{
  "status": "UP",
  "timestamp": "2023-10-27T10:00:00.000Z",
  "uptime": 120.5,
  "service": "deployhub-backend"
}
```

## ⚙️ CI/CD Pipeline
Managed via GitHub Actions with a unified pipeline strategy (.github/workflows/pipeline.yml).

1. Continuous Integration (CI)
    - Triggers: On Push and Pull Request to main.
    - Steps:
        1. Install Dependencies (Cached).
        2. Linting: Ensures code style.
        3. Type Checking: Runs tsc to catch type errors.
        4. Unit Testing: Runs Jest.
        5. Docker Check: Verifies the image builds successfully.

2. Continuous Deployment (CD)
    - Triggers: Only on Push to main AND if CI passes.
    - Strategy: Uses a Deploy Hook to trigger a zero-downtime deployment on Render.
    - Safety: Auto-deploy is disabled on Render; deployment only happens via the specific GitHub Action hook.

## 📂 Project Structure
```
src/
├── config/         # Environment configuration
├── controllers/    # Request logic
├── lib/            # Shared utilities (Logger, Metrics Client)
├── middleware/     # Interceptors (Request Logging, Error Handling)
├── routes/         # API Route definitions
├── app.ts          # Express App Setup
└── index.ts        # Entry Point
```
