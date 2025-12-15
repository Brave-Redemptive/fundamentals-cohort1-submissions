## SyncForge Backend (Node.js + Express) ##

A collaboration-driven backend built for distributed engineering workflows.

# Overview

This backend is part of the SyncForge challenge, where you simulate real-world remote engineering:

Clean Git branching

Code reviews

Automated checks

Documented workflows

Collaboration using GitHub Issues + Projects

The backend provides:
> Node.js + Express API
> JWT-based authentication
> Protected routes
> Clean folder structure
> Input validation
> Standardized error handling
> Ready-to-use GitHub Actions CI
> Fully documented Postman collection

# Project Structure
syncforge-backend/
│  package.json
│  tsconfig.json
│  README.md
│  .env
│  
├─ src/
│   ├─ server.ts
│   ├─ app.ts
│   ├─ config/
│   │    └─ env.ts
│   ├─ routes/
│   │    ├─ auth.routes.ts
│   │    └─ tasks.routes.ts
│   ├─ controllers/
│   │    ├─ auth.controller.ts
│   │    └─ tasks.controller.ts
│   ├─ middlewares/
│   │    ├─ auth.middleware.ts
│   │    └─ error.middleware.ts
│   ├─ services/
│   │    ├─ auth.service.ts
│   │    └─ tasks.service.ts
│   ├─ utils/
│   │    └─ generateToken.ts
│   └─ types/
│        └─ index.d.ts
│
└─ tests/
     └─ sample.test.ts

# Installation & Setup
1. Clone the Repo
git clone https://github.com/YOUR_USERNAME/syncforge-backend.git
cd syncforge-backend

2. Install Dependencies
npm install

3. Create Environment File

Create a .env file:

PORT=5000
JWT_SECRET

4. Run the App
npm run dev

# Authentication (JWT)

The app includes full authentication:

Endpoints
POST /auth/register

Registers a new user.

Request Body
{
  "name": "John Doe",
  "email": "john@mail.com",
  "password": "password123"
}

POST /auth/login

Logs in and returns a JWT token.

Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5c..."
}

Protected Route Example

GET /tasks

➡ Requires header:

Authorization: Bearer <token>

 Middleware
auth.middleware.ts

Extracts JWT

Validates token

Injects req.user

Sends 401 for invalid tokens

# Testing

A GitHub Actions workflow runs on every push.

Local testing:

npm run test

🛠 Scripts
"scripts": {
  "dev": "nodemon src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "test": "jest --runInBand",
  "lint": "eslint . --ext .ts"
}


# Collaboration Workflow (Very Important)


> GitHub Project Board

Columns:

Backlog

To Do

In Progress

In Review

Done

> GitHub Issues


Title

Description

Acceptance Criteria

Labels (backend, auth, tasks, bug, etc.)

Example Issue:

Issue #4 – Implement JWT Authentication

Create /auth/register

Create /auth/login

Hash passwords

Sign tokens

Add auth middleware

Write tests

# Branching Strategy (Feature Branch Workflow)

Main branches:

main → stable

dev → active development

>Feature branches:

feature/auth
feature/tasks-api
feature/error-handler
feature/testing


Naming rule:

feature/<issue-number>-short-description


Example:

feature/4-jwt-authentication

# Pull Request Rules

Every PR must contain:

✔ Linked Issue
✔ Clear title
✔ Summary of changes
✔ Checklist
✔ Passing GitHub Actions checks

PR Template example:

---
### Summary
Implemented JWT authentication system.

### Changes
- Added register/login routes
- Added password hashing
- Added auth middleware
- Updated Postman collection

### Checklist
- [ ] Code tested
- [ ] Lint passed

 Mock Code Reviews
