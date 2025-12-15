# SyncForge Frontend

A modern React + Vite application for task management and team collaboration at SyncForge, a remote-first software company.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Development](#development)
- [Building](#building)
- [Project Structure](#project-structure)
- [Collaboration Workflow](#collaboration-workflow)
- [Code Review Process](#code-review-process)
- [Contributing](#contributing)

## 🎯 Overview

SyncForge Frontend is a responsive web application that allows distributed teams to manage tasks and collaborate effectively. Built with React and Vite for optimal performance and developer experience.

## ✨ Features

- ✅ Task Management (Create, Read, Update, Delete)
- ✅ Task Status Filtering
- ✅ Team Member Directory
- ✅ Responsive Design
- ✅ Loading States & Error Handling
- ✅ Real-time API Integration
- ✅ Clean Component Architecture
- ✅ ESLint Configuration
- ✅ GitHub Actions CI/CD

## 🏗️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Axios** - HTTP client
- **CSS3** - Styling
- **Node.js** - Runtime

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/syncforge/syncforge-frontend.git
   cd syncforge-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file** (optional)
   ```bash
   cp .env.example .env.local
   ```

## 💻 Development

**Start development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

**Hot Module Replacement (HMR)** is enabled by default. Changes to your code are automatically reflected in the browser.

### API Integration
The frontend automatically proxies API requests to `http://localhost:5000` during development. Make sure the backend is running.

## 📦 Building

**Create production build:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

The build output will be in the `dist/` directory.

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.jsx      - Header navigation
│   ├── TaskCard.jsx        - Task display component
│   ├── TaskForm.jsx        - Task creation/editing form
│   ├── TeamMemberCard.jsx  - Team member display
│   ├── LoadingSpinner.jsx  - Loading indicator
│   └── ErrorMessage.jsx    - Error display
├── pages/               # Page components
│   ├── TasksPage.jsx       - Main tasks view
│   └── TeamPage.jsx        - Team members view
├── services/            # API calls & utilities
│   └── api.js             - Axios instance & API functions
├── hooks/               # Custom React hooks
│   └── useAsync.js        - Async operation hook
├── styles/              # Global styles
│   └── index.css         - Global CSS
├── utils/               # Helper functions
├── App.jsx              # Root component
└── main.jsx             # Application entry point

.github/
└── workflows/           # CI/CD pipelines
```

## 🌍 Collaboration Workflow

### Remote-First Development Practices

1. **Component-Based Architecture**: Each UI element is a reusable component
2. **Prop Documentation**: Clear props interfaces for component reusability
3. **Error Boundaries**: Graceful error handling and user feedback
4. **Async State Management**: Proper loading and error states
5. **Accessibility**: ARIA labels and semantic HTML

### Development Workflow

1. **Create Issue** → Define feature requirements
2. **Create Feature Branch** → `git checkout -b feature/component-name`
3. **Develop Component** → Build in isolation with Storybook mindset
4. **Test Integration** → Verify API communication
5. **Open PR** → Link to issue with screenshots
6. **Code Review** → Team reviews UI/UX and code quality
7. **Merge** → Squash merge to main/develop
8. **Deploy** → GitHub Actions builds and deploys

## 📋 Code Review Process

### Frontend-Specific Checklist

- [ ] Component is reusable and well-documented
- [ ] Props are properly typed/documented
- [ ] Loading states are implemented
- [ ] Error handling is present
- [ ] Responsive design is tested (mobile/tablet/desktop)
- [ ] No console errors or warnings
- [ ] CSS is organized and follows naming conventions
- [ ] Accessibility best practices are followed
- [ ] Performance implications are considered

### Review Standards

**UI/UX Quality:**
- Consistent styling with design system
- Clear visual hierarchy
- Accessible color contrasts
- Mobile responsiveness

**Code Quality:**
- ESLint passes without warnings
- No hardcoded values (use constants)
- Components are single-responsibility
- Props are validated

**Performance:**
- No unnecessary re-renders
- Lazy loading where appropriate
- Optimized images and assets
- Bundle size impact considered

## 🌿 Git Branching Strategy

Use **Gitflow** branching:

```
main (production)
  ↑
develop (staging)
  ↑
  ├─ feature/task-filtering
  ├─ feature/team-search
  └─ bugfix/navigation-link
```

### Branch Naming Convention
- `feature/` - New features or components
- `bugfix/` - Bug fixes
- `enhancement/` - Improvements to existing features
- `docs/` - Documentation updates
- `chore/` - Maintenance tasks

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>

Example:
feat(components): add task filter dropdown

Implement dropdown filter for task status.
Allows users to filter tasks by todo/in-progress/completed.

Closes #25
```

## 🧪 Testing

Run linting:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint:fix
```

## 🤝 Contributing

### Before You Start
1. Check existing issues/PRs to avoid duplicates
2. Discuss major changes in an issue first
3. Follow the code style (ESLint enforces it)

### Development Checklist
- [ ] Fork or create a feature branch
- [ ] Make changes in a feature branch
- [ ] Commit with clear messages
- [ ] Push to your branch
- [ ] Open a PR with description and screenshots

### PR Description Template
```
## What does this PR do?
[Brief description]

## Related Issues
Closes #123

## Screenshots
[Add screenshots for UI changes]

## Testing
How can reviewers test this?
1. ...
2. ...
```

## 🔧 Troubleshooting

**Port 5173 already in use?**
```bash
npm run dev -- --port 5174
```

**API not connecting?**
- Check backend is running on port 5000
- Verify `VITE_API_URL` in `.env.local`
- Check browser console for CORS errors

**Build failing?**
```bash
npm run lint:fix  # Fix linting issues
npm run build      # Try again
```

## 📚 Documentation

### Component Documentation
Each component should include:
- JSDoc comments for props
- Usage examples in comments
- Any special requirements or dependencies

### API Documentation
See backend README for API endpoints and schemas.

## 📞 Support

For issues or questions:
1. Check the GitHub Issues
2. Create a detailed issue with:
   - Steps to reproduce
   - Browser & OS info
   - Screenshots/error logs
3. Ask in team Slack

## 📄 License

MIT License - See LICENSE file for details

---

**Last Updated**: November 2025
**Maintained by**: SyncForge Engineering Team
