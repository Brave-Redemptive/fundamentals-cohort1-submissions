# flowserve-backend

## Overview

FlowServe is a Node.js + Express + Prisma + Postgres + TypeScript backend API designed for managing users, authentication, and transactions.  
It provides secure JWT-based authentication and supports rate-limited, role-based operations.

## Run locally

1. copy .env
2. docker compose up -d
3. npm install
4. npx prisma generate
5. npx prisma migrate dev --name init
6. npm run dev

## APIs

- POST /api/v1/users
- GET /api/v1/users?page=1&limit=20
- GET /api/v1/users/:id
- POST /api/v1/transactions
- GET /api/v1/transactions/user/:userId/recent

## Features

- User registration and authentication (JWT)
- Access + Refresh token system
- Account lockout protection on failed logins
- Transaction creation and user-specific history
- Swagger API documentation for easy testing
- Input validation using **Zod**
- Prisma ORM with PostgreSQL

## Notes

- Use raw SQL migrations for CONCURRENTLY or GIN/trigram indexes.
- Logging via Pino, validation via Zod, rate limiting via express-rate-limit.

## Tech Stack

- **Node.js** + **Express.js**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **Zod** (validation)
- **JWT** (authentication)
- **bcryptjs** (password hashing)
- **Swagger UI** (API docs)

## Setup Instructions

git clone https://github.com/IsamaDes/Flowserve-Backend
cd flowserve-be
npm install

## create .env

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/flowserve_db?schema=public"

PORT=4000
NODE_ENV=development

JWT_SECRET=SuperSecretKey
JWT_REFRESH_SECRET=AnotherSuperSecretKey

RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100

## run database migrations

npx prisma migrate dev --name init

## generate prisma client

npx prisma generate

## start server

npm run dev

## Your API will be live at:

➡️ http://localhost:4000

📘 API Documentation

Interactive Swagger documentation is available here:

👉 http://localhost:4000/api-docs/#/

You can test all endpoints directly from the browser.

🔑 Authentication Flow

| Step | Endpoint                         | Description                                      |
| ---- | -------------------------------- | ------------------------------------------------ |
| 1️⃣   | **POST** `/api/v1/auth/register` | Register a new user                              |
| 2️⃣   | **POST** `/api/auth/login`       | Log in user and receive access + refresh tokens  |
| 3️⃣   | **POST** `/api/auth/refresh`     | Refresh expired access token using refresh token |
| 4️⃣   | **POST** `/api/auth/logout`      | Log out and invalidate tokens                    |

👤 User Endpoints

| Method   | Endpoint            | Description              |
| -------- | ------------------- | ------------------------ |
| **POST** | `/api/v1/users`     | Create a new user        |
| **GET**  | `/api/v1/users`     | Get all registered users |
| **GET**  | `/api/v1/users/:id` | Find a user by ID        |

💳 Transaction Endpoints

| Method   | Endpoint                              | Description                           |
| -------- | ------------------------------------- | ------------------------------------- |
| **POST** | `/api/v1/transactions`                | Create a new transaction              |
| **GET**  | `/api/v1/transactions/recent/:userId` | Get a user’s most recent transactions |

🧑‍💻 Developer Notes

Passwords are automatically hashed before saving.

Repeated failed login attempts trigger account lockout for 30 minutes.

Tokens are securely stored in HTTP-only cookies.

Zod validation ensures consistent data shape and prevents invalid input.

🧾 License

This project is licensed under the MIT License.
