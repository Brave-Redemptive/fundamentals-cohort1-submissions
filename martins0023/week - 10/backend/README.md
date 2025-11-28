# SyncForge Backend API

Distributed task management API built with Node.js, Express, and TypeScript for remote collaboration teams.

## 📋 Project Structure

```
src/
├── server.ts              # Express application setup
├── types/
│   └── index.ts          # TypeScript interfaces and types
├── routes/
│   ├── tasks.ts          # Task endpoints
│   └── projects.ts       # Project endpoints
├── services/
│   ├── taskService.ts    # Task business logic
│   └── projectService.ts # Project business logic
├── middleware/
│   └── middleware.ts     # Express middleware & error handlers
└── .env.example          # Environment variables template
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- TypeScript

### Installation

```bash
# Clone repository
git clone https://github.com/martins0023/syncforge-backend.git
cd syncforge-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Build TypeScript
npm run build

# Start development server
npm run dev
```

## 📊 Available Scripts

```bash
npm run dev        # Start development server with hot reload
npm run build      # Compile TypeScript to JavaScript
npm start          # Start production server
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint errors
npm run test       # Run tests
npm run test:watch # Run tests in watch mode
npm run format     # Format code with Prettier
```

## 🔌 API Endpoints

### Health Check
```
GET /health
```

### Tasks
```
POST   /api/tasks              # Create new task
GET    /api/tasks              # List all tasks (with pagination)
GET    /api/tasks/:id          # Get task by ID
GET    /api/tasks/status/:status # Get tasks by status
PUT    /api/tasks/:id          # Update task
DELETE /api/tasks/:id          # Delete task
```

### Projects
```
POST   /api/projects           # Create new project
GET    /api/projects           # List all projects
GET    /api/projects/:id       # Get project by ID
GET    /api/projects/status/:status # Get projects by status
PUT    /api/projects/:id       # Update project
DELETE /api/projects/:id       # Delete project
```

## 📝 Example Requests

### Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Frontend Redesign",
    "description": "Redesigning user interface",
    "teamSize": 5,
    "status": "active"
  }'
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement dark mode",
    "description": "Add dark mode toggle to settings",
    "projectId": "project-uuid-here",
    "priority": "high",
    "status": "todo",
    "assignee": "john.doe@example.com"
  }'
```

### Get Tasks with Pagination
```bash
curl "http://localhost:5000/api/tasks?page=1&limit=10&projectId=project-uuid-here"
```

## 🔄 Collaboration Workflow

### Branching Strategy
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches

### Pull Request Process
1. Create feature branch from `develop`
2. Make changes and commit with clear messages
3. Push to remote and open PR
4. At least 1 approval before merge
5. Delete branch after merge

### Code Review Guidelines
- Review for code quality and TypeScript best practices
- Check for edge cases and error handling
- Verify tests are added
- Ensure documentation is updated
- Run linter and format checks

## 🧪 Testing
Tests are located in `src/**/*.test.ts` files.

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm test -- --coverage # With coverage report
```

## 🐛 Error Handling
All errors follow a consistent format:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 📚 Type Safety
- Strict TypeScript mode enabled
- All functions have explicit return types
- Custom error handling with ApiError class
- Type-safe request/response interfaces

## 🔐 Best Practices
✅ Input validation on all endpoints
✅ Consistent error handling
✅ Request logging middleware
✅ CORS configuration
✅ Environment-based configuration
✅ Clean Git history
✅ Comprehensive documentation
✅ Automated CI/CD with GitHub Actions

## 🤝 Contributing
See CONTRIBUTING.md for guidelines

## 📄 License
MIT License