# 🚀 SyncForge Engineering Handbook (Week 10 Challenge)

## **Project Title**

### 🎯 Goal

This project was executed to demonstrate best practices in **distributed collaboration and code review discipline** for the SyncForge remote engineering team. The emphasis was placed on implementing clean Git workflows, structured Pull Requests, and clear task management using GitHub tools.

---

## 1. Local Setup and Running the Application

### A. Backend (`syncforge-backend`)

| Prerequisite | Version |
| :--- | :--- |
| Node.js | 20.x.x|
| npm/Yarn | 12.x.x |

1.  Clone the repository: `git clone `
2.  Install dependencies: `npm install` (or `yarn`)
3.  Start the server: `npm run dev`
4.  The API should be available at: `http://localhost:[Your Port | 3000]`

### B. Frontend (`syncforge-frontend`)

| Prerequisite | Version |
| :--- | :--- |
| Node.js | 20.x.x|
| npm/Yarn | 12.x.x |

1.  Clone the repository: `git clone https://github.com/olamarvel/sync-frontend`
2.  Install dependencies: `npm install` (or `yarn`)
3.  Start the development server: `npm run dev`
4.  The application should be available at: `http://localhost:[Vite Port]`

***Note:** Ensure the backend is running before testing the frontend, as the frontend consumes the backend API endpoints.*

---

## 2. Collaboration Workflow Documentation

### A. Task Management (GitHub Project Board)

We utilize a **Kanban board** linked to the GitHub Issues across both repositories. This provides a single source of truth for all ongoing work.


* **Workflow:** Issues transition through the following states to ensure visibility and accountability:
    1.  **To Do:** Ready to be picked up.
    2.  **In Progress:** Assigned to a developer and actively being coded.
    3.  **Awaiting Review:** PR is open and needs code review.
    4.  **Review Feedback:** Review comments require changes/corrections.
    5.  **Done:** PR has been merged and the feature is complete.

![Project Screenshot](./project borad.png)


---

### B. Git Branching Rules

We employ a **Trunk-Based** strategy to maintain a clean history and stable branches.

* **Primary Branches (Protected):**
    * `main`: Always represents the latest production-ready, stable code. No direct commits allowed.
    * `develop`: Integration branch where all new features are merged after review.
* **Feature Branches (Working Branches):**
    * **Naming Convention:** All new feature work must start from `main` and use the prefix `username/issues number` (e.g., `feature/user-validation`).
    * **Lifespan:** Short-lived; deleted immediately after the successful merge into `develop`.
* **Hotfix/Bugfix Branches:** (If applicable) Start from `main` and are merged back into both `main`.

---

### C. Code Review Philosophy & PR Protocol

The code review process is our primary quality gate, ensuring code is **secure, readable, and functional** before merging.

#### 1. Pull Request (PR) Requirements:
* **Templates:** All PRs must use the standard `PULL_REQUEST_TEMPLATE.md` to ensure required information is provided automatically.
* **Linked Issues:** Every PR must clearly link the GitHub Issue it resolves (e.g., `Closes #5`).
* **Proof of Work:** PR descriptions **must** include visual evidence (screenshots for frontend, Postman samples for backend) demonstrating the feature works as expected.
* **Automated Checks:** The PR cannot be merged until all GitHub Actions (linting/tests) have passed successfully.

#### 2. Reviewer Checklist (Mock Review Demonstration):
Reviewers prioritize the following:
1.  **Functionality:** Does the code meet all the Acceptance Criteria defined in the linked Issue?
2.  **Readability:** Is the code clean, commented where necessary, and easily understood by another team member?
3.  **Security/Error Handling:** Are inputs validated? Are necessary error states (404, 500) handled gracefully on both the backend and frontend?

![Project Screenshot](./pull_request.png)


---

## 3. Automation (GitHub Actions)

To maintain consistent code quality across our distributed team, we enforce automated checks on every PR.

* **Implementation:** A GitHub Actions workflow is configured in `.github/workflows/ci.yml`.
* **Purpose:** This workflow runs **[e.g., ESLint for linting / Jest for unit tests]** automatically on the feature branch.
* **Status:** A successful run is mandatory before a PR can be merged into the `develop` branch.

---

## 4. API Documentation (Backend Only)

The backend API endpoints are fully documented for consumption by the frontend team and other services.

* **Tool:** Postman
* **Link:** [postman](./postman.json)