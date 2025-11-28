## Title
<!-- Use: feat|fix|chore|docs|test: short-description (e.g. feat: add tasks API) -->

## Related Issue
Closes #<issue-number>  <!-- Replace with the issue number this PR resolves, e.g. Closes #12 -->

## What I changed
- Short summary of changes (1–3 bullets)
- Files / modules touched

## Why this change is needed
- Short rationale (bugfix / feature / refactor / tests etc.)

## How to test
1. Checkout branch: `git checkout feature/your-branch`
2. Install / start (brief commands):
   - Backend: `cd backend && npm ci && npm start` (or `npm run dev`)
   - Frontend: `cd frontend && npm ci && npm run dev`
3. Manual test steps or curl examples:
   ```bash
   # Example: create a task
   curl -X POST http://localhost:3000/tasks \
     -H "Content-Type: application/json" \
     -d '{"title":"Buy milk","description":"From store"}'
