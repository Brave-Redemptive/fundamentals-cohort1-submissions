# SyncForge - Complete Setup & Integration Guide

## 🚀 Quick Start (5 Minutes)

### Backend Setup

```bash
# Clone backend repository
git clone https://github.com/yourusername/syncforge-backend.git
cd syncforge-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

Expected output:
```
✅ Server running on port 5000
📊 Environment: development
🔗 Health check: http://localhost:5000/health
```

### Frontend Setup

```bash
# In a new terminal, clone frontend repository
git clone https://github.com/yourusername/syncforge-frontend.git
cd syncforge-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

Expected output:
```
VITE v4.3.0 running at:
  ➜  Local:   http://localhost:5173/
```

---

## 📁 Project Structure Overview

### Backend Structure
```
syncforge-backend/
├── src/
│   ├── server.ts              # Express app
│   ├── types/
│   │   └── index.ts           # Interfaces
│   ├── routes/
│   │   ├── tasks.ts           # Task endpoints
│   │   └── projects.ts        # Project endpoints
│   ├── services/
│   │   ├── taskService.ts     # Business logic
│   │   └── projectService.ts
│   └── middleware/
│       └── middleware.ts      # Auth, error handling
├── dist/                      # Compiled output
├── .github/
│   ├── workflows/
│   │   └── ci.yml            # GitHub Actions
│   └── pull_request_template.md
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .env.example
├── .env                       # (create locally)
└── README.md
```

### Frontend Structure
```
syncforge-frontend/
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Root component
│   ├── index.css             # Global styles
│   ├── pages/
│   │   ├── ProjectsPage.tsx
│   │   └── TasksPage.tsx
│   ├── services/
│   │   └── api.ts            # API client
│   ├── types/
│   │   └── index.ts          # Interfaces
│   └── styles/
│       ├── ProjectsPage.css
│       └── TasksPage.css
├── index.html
├── dist/                     # Build output
├── .github/
│   ├── workflows/
│   │   └── ci.yml
│   └── pull_request_template.md
├── vite.config.ts
├── tsconfig.json
├── .eslintrc.cjs
├── package.json
├── .env.example
├── .env                      # (create locally)
└── README.md
```

---

## 🔌 API Endpoints Reference

### Projects Endpoints

```bash
# Create project
POST /api/projects
{
  "name": "Mobile App Redesign",
  "description": "Full mobile app redesign",
  "teamSize": 4,
  "status": "active"
}

# Get all projects
GET /api/projects

# Get specific project
GET /api/projects/:id

# Update project
PUT /api/projects/:id
{
  "status": "archived"
}

# Delete project
DELETE /api/projects/:id

# Get by status
GET /api/projects/status/active
```

### Tasks Endpoints

```bash
# Create task
POST /api/tasks
{
  "title": "Design homepage",
  "description": "Create modern homepage design",
  "projectId": "project-uuid",
  "priority": "high",
  "status": "todo",
  "assignee": "designer@example.com",
  "dueDate": "2024-02-01"
}

# Get all tasks (with pagination)
GET /api/tasks?page=1&limit=10&projectId=project-uuid

# Get specific task
GET /api/tasks/:id

# Update task
PUT /api/tasks/:id
{
  "status": "in-progress",
  "priority": "medium"
}

# Delete task
DELETE /api/tasks/:id

# Get by status
GET /api/tasks/status/in-progress
```

### Health Check

```bash
GET /health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600
}
```

---

## 🧪 Testing the Integration

### 1. Test Backend with cURL

```bash
# Test health check
curl http://localhost:5000/health

# Create a project
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "description": "Testing integration",
    "teamSize": 3
  }'

# Save the returned project ID, then create a task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "projectId": "YOUR_PROJECT_ID_HERE",
    "priority": "high"
  }'
```

### 2. Test Frontend Integration

1. Open http://localhost:5173
2. Click "New Project" button
3. Fill in project details:
   - Name: "Integration Test"
   - Description: "Testing frontend-backend"
   - Team Size: 2
4. Click "Create Project"
5. Select the project to view tasks
6. Click "New Task" and create a task
7. Drag task between statuses using dropdown

### 3. Verify Both Communicate

```bash
# Check backend console for request logs
# Check browser DevTools Network tab for API calls
# Verify in your API requests show no errors
```

---

## 🐛 Troubleshooting

### Backend Won't Start

```bash
# Error: Port already in use
# Solution: Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Error: Module not found
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json dist
npm install

# Error: TypeScript compilation fails
# Solution: Check tsconfig.json and types
npm run build
```

### Frontend Won't Connect to Backend

**Problem**: Network requests fail

**Solutions**:
```bash
# 1. Check backend is running
curl http://localhost:5000/health

# 2. Verify API URL in .env
cat .env
# Should show: VITE_API_URL=http://localhost:5000/api

# 3. Check CORS is enabled
# Backend should have cors() middleware enabled

# 4. Check browser console for errors
# Open DevTools → Network tab → Look for failed requests
```

**Problem**: CORS errors

**Solution** (Backend):
```typescript
// In server.ts, CORS is configured as:
app.use(cors());
// This allows requests from any origin in development
```

### API Returns 404

```bash
# Check endpoint is correct
# Endpoints are:
/api/projects
/api/tasks
# NOT:
/api/Projects  # Wrong capitalization
/projects/api  # Wrong order
```

### Tasks Don't Save

1. Check browser DevTools → Network tab
2. Verify request has correct projectId
3. Check response status (should be 201 for create)
4. Look for error messages in response body

---

## 📝 Postman Collection

### Setup in Postman

1. Create new collection "SyncForge"
2. Set base URL: `http://localhost:5000/api`

### Environment Variables

```json
{
  "baseUrl": "http://localhost:5000/api",
  "projectId": "your-project-id",
  "taskId": "your-task-id"
}
```

### Example Requests

```
# Create Project
POST {{baseUrl}}/projects
{
  "name": "New Project",
  "description": "Description",
  "teamSize": 3
}

# Get All Projects
GET {{baseUrl}}/projects

# Create Task
POST {{baseUrl}}/tasks
{
  "title": "Task Title",
  "projectId": "{{projectId}}",
  "priority": "high"
}

# Get Tasks for Project
GET {{baseUrl}}/tasks?projectId={{projectId}}
```

---

## 🔄 Development Workflow

### Morning Setup

```bash
# Terminal 1: Backend
cd syncforge-backend
git pull origin develop
npm run dev

# Terminal 2: Frontend  
cd syncforge-frontend
git pull origin develop
npm run dev

# Browser: Open http://localhost:5173
```

### During Development

```bash
# Make changes to files
# Files auto-reload in browser (Vite)
# Backend auto-restarts (ts-node-dev)

# Run quality checks
npm run lint
npm run type-check
npm run format

# Test the feature
# Manually test in browser
# Check API responses in DevTools
```

### Before Committing

```bash
# Terminal 1 & 2: Commit changes
npm run lint:fix
npm run build
git add .
git commit -m "feat(feature): description"
git push origin feature/branch-name

# Create PR on GitHub
```

---

## 📊 Database Mock

Both backend services use **in-memory storage**:
- Projects stored in Map
- Tasks stored in Map
- Data persists only while server is running
- Data resets on server restart

### For Production

Replace in-memory storage with:
- **PostgreSQL** + TypeORM
- **MongoDB** + Mongoose
- **Firebase** Realtime Database
- **Supabase**

Example with PostgreSQL:
```typescript
// services/projectService.ts
import { db } from '../database';

const projects = await db.query('SELECT * FROM projects');
```

---

## 🚀 Deployment Checklist

### Before Deploying

- [ ] Run `npm run lint` - no errors
- [ ] Run `npm run test` - all pass
- [ ] Run `npm run build` - builds successfully
- [ ] Test locally with fresh clone
- [ ] Update README with setup steps
- [ ] Create .env.example with all vars
- [ ] Set production environment variables
- [ ] Review security (no hardcoded secrets)

### Backend Deployment (Heroku Example)

```bash
# Login to Heroku
heroku login

# Create app
heroku create syncforge-backend

# Set environment variables
heroku config:set PORT=5000

# Deploy
git push heroku main

# Monitor logs
heroku logs --tail
```

### Frontend Deployment (Vercel Example)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in dashboard
# VITE_API_URL=https://syncforge-backend.herokuapp.com/api
```

---

## 📚 API Documentation

### Request/Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { /* response data */ },
  "timestamp": "2024-01-15T10:30:00Z"
}

// Error response
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common Status Codes

- `200` - OK (GET, PUT)
- `201` - Created (POST)
- `204` - No Content (DELETE)
- `400` - Bad Request (validation error)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

### Error Codes

- `MISSING_FIELDS` - Required field missing
- `INVALID_INPUT` - Input validation failed
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Multiple validation errors

---

## 🔒 Environment Variables

### Backend (.env)

```bash
# Server
PORT=5000
NODE_ENV=development

# API
API_VERSION=v1
LOG_LEVEL=info

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

```bash
# API
VITE_API_URL=http://localhost:5000/api

# App
VITE_APP_NAME=SyncForge
VITE_APP_VERSION=1.0.0
```

---

## ✅ Next Steps

1. **Set up both repositories** following Quick Start
2. **Test API endpoints** with provided cURL commands
3. **Verify frontend connects** to backend
4. **Run quality checks**: lint, type-check, format
5. **Create GitHub Issues** for features
6. **Start development** with feature branches
7. **Open PRs** with proper documentation
8. **Code review** and merge

---

## 🎓 Learn More

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Collaboration Guide](./COLLABORATION.md)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🤝 Support

- Check README.md files first
- Search GitHub Issues
- Check GitHub Discussions
- Create detailed issue if stuck

Happy coding! 🚀