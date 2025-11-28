## SyncForge Backend
A Node.js + Express backend implementing a simple tasks API for the **code reviews and Distributed Collaboration** challenge.
This backend demonstrates clean architecture, structured Git workflows, automated CI, and proper documentation.

## Tech Stack
Node.js + Express
Jest + Supertest (API testing)
ESLint (Airbnb config)
Github Actions CI Workflow
Postman Collection

## Project Structure
src/
  app.js
  server.js
  routes/
  controllers/
  services/
  models/
  validators/
tests/
.github/workflows/ci.yml

## Branching Strategy (Gitflow)
<!-- Main branches -->
# main --> production-ready work
# develop --> integration/staging branch

## Supporting branches:
Branch type	        Prefix	        Purpose
Feature	            feature/<name>	New features
Bugfix	            bugfix/<name>	Fixes
Hotfix (urgent)	    hotfix/<name>	Critical fixes into main
Release	            release/<version>	Prepare release

## Rules
1. Every feature **must start from** develop
2. Every PR must:
2a. Link an issue
2b. Pass lint + tests
2c Use the PR template
3. Merges to **main** require passing CI workflow

## Code Review Philosophy
1. Small, focused PRs
2. Clear descriptions with test instructions
3. Screenshots or API samples for all PRs
4. No direct commits to **develop** or **main**
5. All comments resolved before merge
6. Automated checks must pass

## API Documentation
# Base URL
http://localhost:3000

## GET/tasks
Returns all tasks
#REsponse
[
  {
    "id": "uuid",
    "title": "Task A",
    "description": "Some text",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
## POST/tasks
Creates a new task
# Request
{
  "title": "Buy milk",
  "description": "From the supermarket"
}
# Response
{
  "id": "uuid",
  "title": "Buy milk",
  "description": "From the supermarket",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
# Validation
**title**: required string
**description**: optional string

## Running Tests
npm test
## Linting
npm run lint
## Development
npm run dev

## Continuous Integration
Github Actions workflow runs automatically on:
Push to **main** or **develop**
Any Pull Request
# It performs:
Dependency Installation
Linting
Jest tests
File: .github/workflows/ci.yml

## Postman Collection
A complete Postman collection is included at:
postman/syncforge-backend.postman.json
Import it into Postman to test all endpoints

## Team Collaboration Workflow
1. Create lan Issue from Github Project
2. Move it to **In Progress**
3. Create a branch: git checkout -b feature/<issue-number>-short-name
4. Commit work and push
5. Open a PR using the PR template
6. Request review + run CI
7. After approval & passing checks --> merge
Move issue to Done

## Contributing 
Open a PR using the template and follow all collaboration rules.

## License
MIT

## Postman Collection JSON
postman/
# Create file:
postman/syncforge-backend.postman.json
# paste this JSON:
{
  "info": {
    "name": "SyncForge Backend",
    "description": "Postman collection for Tasks API.",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "GET /tasks",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3000/tasks",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["tasks"]
        }
      }
    },
    {
      "name": "POST /tasks",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Demo task\",\n  \"description\": \"Test description\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/tasks",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["tasks"]
        }
      }
    }
  ]
}
