# Contributing to SyncForge

Thank you for considering contributing to SyncForge! 🎉

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](../../issues)
2. If not, create a new issue using the bug report template
3. Provide as much detail as possible

### Suggesting Features

1. Check if the feature has already been requested
2. Create a new issue using the feature request template
3. Explain why this feature would be useful

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write or update tests as needed
5. Ensure all tests pass
6. Commit your changes following our commit conventions
7. Push to your fork
8. Open a Pull Request

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
chore: maintenance tasks
```

### Code Style

- Follow the ESLint configuration
- Write clear, self-documenting code
- Add comments for complex logic
- Keep functions small and focused

### Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for high code coverage

## Questions?

Feel free to open a discussion or reach out to the maintainers!

Thank you for contributing! 🙏

```

---

### 8. **Frontend .env.example** (Make sure you have this)
```

VITE_API_URL=http://localhost:5000/api/v1

```

---

### 9. **Backend .env.example** (Make sure you have this)
```

PORT=5000
NODE_ENV=development
API_VERSION=v1

```

---

## 📊 COMPLETE FILE STRUCTURE SUMMARY
```

syncforge-backend/
├── .github/
│ ├── workflows/
│ │ └── backend-ci.yml ✅
│ ├── PULL_REQUEST_TEMPLATE.md ✅
│ └── ISSUE_TEMPLATE/
│ ├── bug_report.md ✅
│ └── feature_request.md ✅
├── src/
│ ├── controllers/
│ │ └── taskController.js ✅
│ ├── models/
│ │ └── Task.js ✅
│ ├── routes/
│ │ └── taskRoutes.js ✅
│ ├── middleware/
│ │ └── errorHandler.js ✅
│ └── app.js ✅
├── tests/
│ └── taskController.test.js ⭐ NEW
├── .env.example ✅
├── .eslintrc.json ✅
├── .gitignore ✅
├── jest.config.js ⭐ NEW
├── package.json ✅
├── postman_collection.json ⭐ NEW
├── LICENSE ⭐ NEW
├── CHANGELOG.md ⭐ NEW
├── CODE_OF_CONDUCT.md ⭐ NEW
├── CONTRIBUTING.md ⭐ NEW
├── COLLABORATION.md ✅
└── README.md ✅

syncforge-frontend/
├── .github/
│ ├── workflows/
│ │ └── frontend-ci.yml ✅
│ ├── PULL_REQUEST_TEMPLATE.md ✅
│ └── ISSUE_TEMPLATE/
│ ├── bug_report.md ✅
│ └── feature_request.md ✅
├── src/
│ ├── components/ ✅
│ ├── pages/ ✅
│ ├── services/ ✅
│ ├── App.jsx ✅
│ ├── main.jsx ✅
│ └── index.css ✅
├── public/
├── .env.example ✅
├── .eslintrc.json ✅
├── .gitignore ✅
├── index.html ✅
├── package.json ✅
├── vite.config.js ✅
├── tailwind.config.js ✅
├── postcss.config.js ✅
├── LICENSE ⭐ NEW
├── CHANGELOG.md ⭐ NEW
├── CODE_OF_CONDUCT.md ⭐ NEW
├── CONTRIBUTING.md ⭐ NEW
├── COLLABORATION.md ✅
└── README.md ✅
