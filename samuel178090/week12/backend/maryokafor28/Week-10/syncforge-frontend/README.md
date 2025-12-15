# SyncForge Frontend

A modern task management system built with React, TypeScript, and Tailwind CSS. This application provides a clean, responsive interface for managing tasks with full CRUD functionality.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [Collaboration Workflow](#collaboration-workflow)
- [Branching Strategy](#branching-strategy)
- [Code Review Philosophy](#code-review-philosophy)

---

## ✨ Features

- ✅ **Create Tasks** - Add new tasks with title, description, status, and priority
- ✅ **View Tasks** - Display all tasks in a responsive grid layout
- ✅ **Edit Tasks** - Update existing tasks with a reusable form component
- ✅ **Delete Tasks** - Remove tasks with confirmation dialog
- ✅ **Status Management** - Track tasks as Pending, In Progress, or Completed
- ✅ **Priority Levels** - Assign Low, Medium, or High priority
- ✅ **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- ✅ **Loading States** - Visual feedback during API calls
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Form Validation** - Client-side validation for required fields
- ✅ **Real-time Updates** - UI updates immediately after CRUD operations

---

## 🛠️ Tech Stack

### Core

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

### State Management & Data Fetching

- **React Hooks** - Custom hooks for state management
- **Axios** - HTTP client for API calls

### Code Quality

- **ESLint** - Code linting
- **TypeScript** - Static type checking

### CI/CD

- **GitHub Actions** - Automated workflows

---

## 📦 Prerequisites

- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher) or **yarn**
- **Git**
- **SyncForge Backend** running on `http://localhost:5000`

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/maryokafor28/syncforge-frontend.git
cd syncforge-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# .env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 🔧 Environment Variables

| Variable            | Description          | Default                     | Required |
| ------------------- | -------------------- | --------------------------- | -------- |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` | Yes      |

**Example `.env` file:**

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🔌 API Integration

### Backend Requirements

This frontend requires the **SyncForge Backend** to be running. The backend should expose the following endpoints:

| Method   | Endpoint         | Description     |
| -------- | ---------------- | --------------- |
| `GET`    | `/api/tasks`     | Get all tasks   |
| `GET`    | `/api/tasks/:id` | Get single task |
| `POST`   | `/api/tasks`     | Create new task |
| `PUT`    | `/api/tasks/:id` | Update task     |
| `DELETE` | `/api/tasks/:id` | Delete task     |

```
---

##  Collaboration Workflow

This project follows a structured Git workflow suitable for remote teams.

### Workflow Overview
```

feature/xxx → develop → main
↓ ↓ ↓
Work Staging Production

````

### Step-by-Step Process

1. **created issues on github

2. **Created a branch** from `develop`:
```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/xxx
````

3. **Work on feature** - Made commits with descriptive messages
4. **Push to GitHub**:

```bash
   git push origin feature/xxx
```

5. **Create Pull Request** on GitHub: `feature/xxx` → `develop`
6. **Code Review** - Team reviews the PR
7. **Address feedback** - Make changes if requested
8. **Merge PR** - Once approved, merge to `develop`
9. **Deploy to staging** - `develop` branch is deployed to staging
10. **Create Release PR** - `develop` → `main` when ready for production
11. **Tag release** - Create version tag (e.g., `v1.0.0`)

---

## 🌿 Branching Strategy

I followed **Git Flow** with three main branches:

### Branch Types

#### 1. **`main`** (Production)

- Protected branch
- Contains production-ready code
- Only accepts PRs from `develop`
- Direct commits NOT allowed

#### 2. **`develop`** (Staging)

- Integration branch for features
- Contains latest development changes
- Accepts PRs from feature branches
- Base branch for all new features

#### 3. **`feature/xxx`** (Feature Branches)

- Created from `develop`
- Naming convention: `feature/task`, `feature/components`
- Merged back to `develop` via PR

#### 4. **`docs/xxx`** (Documentation)

- Created from `develop`
- For documentation updates
- Naming: `docs/readme`

### Branching Rules

✅ **DO:**

- Always create feature branches from `develop`
- Use descriptive branch names
- Keep branches focused (one feature per branch)
- Delete branches after merging
- Pull latest `develop` before creating new branches

  **DON'T:**

- Commit directly to `main` or `develop`
- Create branches from other feature branches
- Keep stale branches around
- Use generic names like `fix`, `update`

---

## 🔍 Code Review Philosophy

I believe code reviews are essential for:

- **Knowledge sharing** across the team
- **Code quality** improvement
- **Bug prevention** before production
- **Learning** from each other

### Pull Request Guidelines

#### Creating a PR

1. **Write a clear title**

```
  feat: add task filtering by status
```

2. **Provide detailed description**

   - What does this PR do?
   - Why is it needed?
   - How was it tested?
   - Screenshots (if UI changes)

3. **Use PR template** (see example below)

4. **Link related issues**

```markdown
Closes #123
Related to #456
```

#### PR Template

```markdown
## Description

Brief description of what this PR does

## Changes

- Added TaskList component
- Implemented delete functionality
- Added loading states
```

### Reviewing PRs

#### As a Reviewer:

✅ **Check for:**

- Code follows project conventions
- No unnecessary console.logs
- Proper error handling
- Component reusability
- TypeScript types are correct
- No hardcoded values (use env variables)
- Comments for complex logic
- Responsive design

✅ **Provide constructive feedback:**

```
Good: "Consider extracting this into a reusable hook for better maintainability"
Bad: "This is wrong"
```

✅ **Types of comments:**

- **Blocking**: Must be fixed before merge (prefix with ⚠️)
- **Non-blocking**: Suggestions for improvement (prefix with 💡)
- **Question**: Ask for clarification (prefix with ❓)

✅ **Approve when:**

- All blocking issues resolved
- Code meets quality standards
- Tests pass (if applicable)

#### As a PR Author:

✅ **Respond to feedback:**

- Address all comments
- Explain your reasoning if disagreeing
- Mark conversations as resolved
- Push changes in response to feedback

✅ **Keep PRs small:**

- Aim for < 400 lines changed
- Break large features into smaller PRs
- Easier to review = faster merges

### Code Review Process Flow

```
1. Author creates PR
        ↓
2. Automated checks run (CI/CD)
        ↓
3. Reviewers notified
        ↓
4. Reviewers leave comments
        ↓
5. Author addresses feedback
        ↓
6. Reviewers approve
        ↓
7. PR merged to develop
        ↓
8. Branch deleted
```

---

<<<<<<< HEAD
=======
## 📝 Issue Tracking & Pull Requests

### 🔹 Example Issue Created

Here is a screenshot of one of the issues I created during development:

![Issue Screenshot](./src//assets/issues%20for%20frontend.png)

### 🔗 Related Issues

- [Issue #7 – create form component](https://github.com/maryokafor28/syncforge-frontend/issues/7)
- [Issue #6 – Implement Task list Component](https://github.com/maryokafor28/syncforge-frontend/issues/6)
- [Issue #5 – implement home page components](https://github.com/maryokafor28/syncforge-frontend/issues/5)
- [Issue #2 – set up project structure and configuration](https://github.com/maryokafor28/syncforge-frontend/issues/2)

---

### 🔹 Example Pull Request

Screenshot of one of the pull requests I created and merged:

![Pull Request Screenshot](./src/assets/merging%20request%20for%20frontend.png)

>>>>>>> develop
## 👨‍💻 Author

**Mary Amadi**

- Email: vincyokafor@gmail.com

---
