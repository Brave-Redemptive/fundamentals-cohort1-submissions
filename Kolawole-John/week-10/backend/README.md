# SyncForge Backend API 🚀

> Task Management API for distributed teams

![Node.js](https://img.shields.io/badge/Node.js-18.x%20|%2020.x-green)
![Express](https://img.shields.io/badge/Express-4.18.2-blue)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Collaboration Workflow](#collaboration-workflow)

## 🎯 Overview

SyncForge Backend is a RESTful API built for managing tasks in distributed teams. It provides endpoints for creating, reading, updating, and deleting tasks with filtering capabilities.

## ✨ Features

- ✅ RESTful API design
- ✅ Task CRUD operations
- ✅ Advanced filtering (status, priority, assignee)
- ✅ Input validation with express-validator
- ✅ Error handling middleware
- ✅ CORS enabled for frontend integration
- ✅ Environment-based configuration
- ✅ Clean code architecture

## 🛠️ Tech Stack

- **Runtime**: Node.js 18.x / 20.x
- **Framework**: Express 4.18.2
- **Validation**: express-validator 7.0.1
- **Testing**: Jest 29.7.0, Supertest 6.3.3
- **Code Quality**: ESLint 8.56.0
- **Dev Tools**: Nodemon 3.0.2

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- npm 9.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/syncforge-backend.git
cd syncforge-backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

```env
PORT=5000
NODE_ENV=development
API_VERSION=v1
```

### Available Scripts

```bash
npm start          # Run production server
npm run dev        # Run development server with auto-reload
npm test           # Run tests with coverage
npm run lint       # Check code style
npm run lint:fix   # Auto-fix code style issues
```

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Endpoints

#### Health Check

```http
GET /health
```

**Response:**

```json
{
  "status": "success",
  "message": "SyncForge API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Get All Tasks

```http
GET /api/v1/tasks
```

**Query Parameters:**

- `status` - Filter by status (todo, in-progress, review, done)
- `priority` - Filter by priority (low, medium, high, urgent)
- `assignee` - Filter by assignee name

**Response:**

```json
{
  "status": "success",
  "results": 2,
  "data": {
    "tasks": [...]
  }
}
```

#### Get Single Task

```http
GET /api/v1/tasks/:id
```

#### Create Task

```http
POST /api/v1/tasks
Content-Type: application/json

{
  "title": "Implement user authentication",
  "description": "Add JWT-based authentication to the API",
  "assignee": "John Doe",
  "priority": "high"
}
```

#### Update Task

```http
PUT /api/v1/tasks/:id
Content-Type: application/json

{
  "status": "in-progress",
  "priority": "urgent"
}
```

#### Delete Task

```http
DELETE /api/v1/tasks/:id
```

#### Get Task Statistics

```http
GET /api/v1/tasks/stats
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "stats": {
      "total": 10,
      "byStatus": {
        "todo": 3,
        "in-progress": 4,
        "review": 2,
        "done": 1
      },
      "byPriority": {
        "low": 2,
        "medium": 5,
        "high": 2,
        "urgent": 1
      }
    }
  }
}
```

### Postman Collection

Import the [Postman collection](./postman_collection.json) for easy testing.

## 📁 Project Structure

```
syncforge-backend/
├── src/
│   ├── controllers/      # Request handlers
│   │   └── taskController.js
│   ├── models/          # Data models
│   │   └── Task.js
│   ├── routes/          # Route definitions
│   │   └── taskRoutes.js
│   ├── middleware/      # Custom middleware
│   │   └── errorHandler.js
│   ├── utils/          # Helper functions
│   └── app.js          # Express app setup
├── tests/              # Test files
├── .github/
│   ├── workflows/      # GitHub Actions
│   └── ISSUE_TEMPLATE/ # Issue templates
├── .env.example        # Environment template
├── .eslintrc.json     # ESLint config
├── .gitignore
├── package.json
├── COLLABORATION.md    # Workflow guide
└── README.md
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test taskController.test.js
```

## 👥 Collaboration Workflow

See [COLLABORATION.md](./COLLABORATION.md) for:

- Branching strategy
- PR process
- Code review guidelines
- Commit message conventions

## 📊 GitHub Actions

Automated CI/CD pipeline runs on every push and PR:

- ✅ Linting
- ✅ Unit tests
- ✅ Code coverage
- ✅ Build verification

## 🤝 Contributing

1. Create an issue describing the feature/bug
2. Fork the repository
3. Create a feature branch (`git checkout -b feature/amazing-feature`)
4. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Your Name**

- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- Email: lekankolawolejohn@gmail.com

## 🙏 Acknowledgments

- Built as part of Software Engineering Week 10 Challenge
- Designed for distributed team collaboration
- Follows industry best practices

---

Made with ❤️ for remote teams worldwide 🌍
