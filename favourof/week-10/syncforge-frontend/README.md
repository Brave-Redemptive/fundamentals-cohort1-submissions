# 🚀 SyncForge Frontend

Frontend implementation for the **Week 10 Challenge**:  
*Code Reviews & Distributed Collaboration: Building High‑Quality Software as a Remote Team*

---

## 📘 Project Overview
This is the **React‑Vite + TailwindCSS frontend** for the SyncForge project.  
It consumes APIs from the backend (`syncforge-backend`) and demonstrates remote‑friendly collaboration practices.

---

## 🛠 Features
- ✅ **Two Pages**
  - **User List Page** → Fetches users from `GET /api/users`
  - **Create User Page** → Adds new users via `POST /api/users`
- ✅ **Reusable API Client** (Axios)
- ✅ **TypeScript Types** for strong typing
- ✅ **Error + Loading States**
- ✅ **Reusable Components**
- ✅ **Collaboration Workflow** with Issues + PRs
- ✅ **GitHub Actions** for linting

---

## 📂 Project Structure
- src/ 
- api/ # Axios client 
- components/ # Reusable UI components
- pages/ # Page-level components 
- types/ # TypeScript interfaces


---

## 🚀 Features Required

- At least **2 pages**:
  - User List (GET /api/users)
  - Create User (POST /api/users)
- Error + loading states
- Reusable API client
- Documentation in README

---

## ⚙️ GitHub Actions

- Linting workflow runs on every PR.
- Ensure `npm run lint` passes before submitting.

---

## ✔️ Code Review Philosophy

- Clear, descriptive PRs
- Linked issues
- Screenshots for UI changes
- Checklist completed before merge

