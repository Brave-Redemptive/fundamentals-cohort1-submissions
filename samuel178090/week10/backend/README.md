# SyncForge Backend

A Node.js + Express REST API for task management and team collaboration at SyncForge, a remote-first software company.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Collaboration Workflow](#collaboration-workflow)
- [Code Review Process](#code-review-process)
- [Git Branching Strategy](#git-branching-strategy)
- [Testing](#testing)
- [Contributing](#contributing)

## 🎯 Overview

SyncForge Backend provides APIs for managing collaborative tasks and team members across a distributed, global team. Built with clean architecture principles, comprehensive error handling, and validation.

## ✨ Features

- ✅ RESTful API for task management (CRUD operations)
- ✅ Team member management endpoints
- ✅ Input validation and error handling
- ✅ CORS support for frontend integration
- ✅ Structured logging
- ✅ Clean folder structure (MVC pattern)
- ✅ Mock database (in-memory storage)
- ✅ ESLint configuration for code quality
- ✅ GitHub Actions CI/CD pipeline

## 🏗️ Architecture

```
src/
├── config/           # Configuration files (database, logger)
├── middleware/       # Express middleware (CORS, error handling, logging)
├── routes/           # API route definitions
├── controllers/      # Request handlers
├── services/         # Business logic layer
├── models/           # Data models (placeholder)
├── validators/       # Input validation
├── utils/            # Helper functions
└── index.js          # Application entry point

tests/                # Test files
.github/workflows/    # CI/CD pipelines
```

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/syncforge/syncforge-backend.git
   cd syncforge-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your configuration**
   ```
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   LOG_LEVEL=info
   ```

## 🏃 Running the Server

**Development mode** (with file watching):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:5000`

**Health check**:
```bash
curl http://localhost:5000/health
```

## 📡 API Endpoints

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get task by ID |
| GET | `/api/tasks?status=in-progress` | Filter tasks by status |
| GET | `/api/tasks?assignee=Alice` | Filter tasks by assignee |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Team Members
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/team` | Get all team members |
| GET | `/api/team/:id` | Get member by ID |
| GET | `/api/team?role=Engineer` | Filter members by role |

### Sample Task Creation
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement Auth System",
    "description": "Add JWT-based authentication",
    "status": "in-progress",
    "priority": "high",
    "assignee": "Alice Chen",
    "dueDate": "2025-12-05"
  }'
```

## 🌍 Collaboration Workflow

### Our Remote-First Principles

1. **Asynchronous Communication**: All changes documented in PRs and commits
2. **Clear Documentation**: Every feature has clear requirements and API samples
3. **Code Review**: Mandatory reviews before merge (2 approvals minimum)
4. **Distributed Ownership**: Tasks assigned to specific team members with clear timelines

### Workflow Steps

1. **Create Issue** → Define task with acceptance criteria
2. **Create Feature Branch** → `git checkout -b feature/task-id-description`
3. **Develop & Commit** → Write clean, descriptive commit messages
4. **Open PR** → Link to issue, add description and samples
5. **Code Review** → Team reviews and suggests improvements
6. **Iterate** → Address feedback and update PR
7. **Merge** → Squash merge to keep history clean
8. **Deploy** → GitHub Actions handles automated testing

## 📋 Code Review Process

### Review Checklist
- [ ] Code follows style guidelines (ESLint passes)
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No breaking changes without discussion
- [ ] Performance implications considered
- [ ] Security best practices followed
- [ ] API changes documented with examples

### Review Standards

**Approval requires checking:**
1. Functional correctness
2. Code quality and maintainability
3. Test coverage (minimum 80%)
4. Documentation accuracy
5. Performance impact
6. Security vulnerabilities

**Timeline**: PRs reviewed within 24 hours in async timezone-friendly manner.

## 🌿 Git Branching Strategy

We use a modified **Gitflow** strategy:

```
main (production)
  ↑
  ├─ release/v1.0.0 (release preparation)
  │
develop (staging)
  ↑
  ├─ feature/auth-system (new features)
  ├─ bugfix/login-error (bug fixes)
  └─ docs/api-guide (documentation)
```

### Branch Naming Convention
- `feature/` - New features
- `bugfix/` - Bug fixes
- `docs/` - Documentation
- `chore/` - Maintenance tasks
- `hotfix/` - Critical production fixes

Example: `feature/task-status-filtering`

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>

Example:
feat(tasks): add status filtering to task endpoints

Implement query parameter filtering for task status.
Allows users to retrieve only tasks matching specific status.

Closes #42
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 🧪 Testing

Run all tests:
```bash
npm test
```

Run with logging:
```bash
npm test -- --verbose
```

### Test Structure
- Unit tests for services
- Integration tests for routes
- Mock database for testing

Current test coverage: `70%+`

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit: `git commit -am 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request with detailed description

### Code Style
- ESLint: `npm run lint`
- Auto-fix: `npm run lint:fix`
- Use consistent naming: camelCase for variables, PascalCase for classes

### Before Submitting PR
- [ ] Run `npm run lint` - all checks pass
- [ ] Run `npm test` - all tests pass
- [ ] Update README if needed
- [ ] Add meaningful commit messages
- [ ] Link to related issues

## 📚 Documentation

### API Documentation
See `API.md` for detailed endpoint documentation and Postman collection.

### Architecture Decision Records
- ADR-001: Why we chose Express over Fastify
- ADR-002: In-memory database vs real DB
- ADR-003: Error handling strategy

## 🔧 Troubleshooting

**Port 5000 already in use?**
```bash
$PORT=5001 npm run dev
```

**CORS errors?**
Update `FRONTEND_URL` in `.env`

**Module not found?**
```bash
npm install
```

## 📞 Support

For issues or questions:
1. Check existing GitHub Issues
2. Create a detailed issue with steps to reproduce
3. Reach out in team Slack channel

## 📄 License

MIT License - See LICENSE file for details

---

**Last Updated**: November 2025
**Maintained by**: SyncForge Engineering Team
