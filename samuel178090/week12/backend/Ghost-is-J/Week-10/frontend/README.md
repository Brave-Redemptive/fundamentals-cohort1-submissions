# SyncForge Frontend

A React-Vite application that consumes the SyncForge backend API and demonstrates
distributed-team engineering practices (branching, PRs, code reviews, CI, issues, and documentation).

---

## 🚀 Tech Stack

- React 18
- Vite
- Axios
- React Router
- Vitest + Testing Library
- ESLint (Airbnb config)
- GitHub Actions CI

---

## 📌 Available Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |

---

## 🧩 Project Structure
src/
pages/
TasksPage.jsx
CreateTaskPage.jsx
components/
TaskItem.jsx
App.jsx
main.jsx
tests/
tasks.test.jsx

## 🔗 API Integration
The frontend proxies API calls to: http://localhost:4000/api


Configured in `vite.config.js`.

## 🛠 Collaboration Workflow

- Create issues before starting work  
- Use feature branches (`feature/<name>`)
- Open meaningful PRs with:
  - Screenshots
  - Linked issues
  - Checklists
- Require review before merge
- CI must pass before merging

## 🧪 Testing
Unit tests are found in:

## tests/
Run all tests:
npm test

## 🤝 Code Reviews
PRs must follow:
- Small, atomic changes  
- Clear summaries  
- Screenshots for UI work  
- No direct commits to `main`  

## ✔️ CI/CD
GitHub Actions automatically runs:

- ESLint  
- Tests  

before allowing merges.

## 📜 License
MIT License.
