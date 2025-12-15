### SyncForge Frontend

A Remote-Friendly React-Vite App with Authentication

This repository contains the complete frontend for the SyncForge challenge.
It connects to the backend API, includes authentication (login/register), and demonstrates a remote-team workflow using PRs, Issues, CI, and clean branching structure.

# Features

**Core Features**

> React + Vite + TypeScript
>
> JWT Authentication
>
> Login + Register pages
>
> Protected Routes
>
> Global Auth Context (React Context API)
>
> Shadcn/UI styling
>
> Hot-toast notifications
>
> Axios Interceptor for token injection
>
> Github Actions CI pipeline
>
> GitHub Issues + Project Board workflow
>
> Clean folder structure
>
> Authentication
>
> Login stores JWT in localStorage
>
> Axios automatically sends token via Authorization: Bearer
>
> Auto-load user profile on page reload
>
> Logout clears token + user state
>
> Protected routes require a valid user

# Environment Variables

Create a .env file:

VITE_API_URL=http://localhost:4000/api

# Installation

npm install

Install shadcn components:

npx shadcn-ui init
npx shadcn-ui add button card input badge

Run the dev server:

npm run dev

# Authentication Flow

1. Login
   POST /auth/login

Response:
{
"token": "jwt-here",
"user": { "id": "...", "name": "...", "email": "..." }
}

2. Register
   POST /auth/register

3. Load user (protected)
   GET /users/profile
   Authorization: Bearer <token>

# Branching Workflow

Following Gitflow:

main
develop
feature/\*

# open PR

# Pull Request Requirements

Every PR must include:

Linked issue

What changed and why

Screenshots (UI)

PR checklist

Reviewer tags

Small, focused commits

# Project Management

✔ A GitHub Project Board (Kanban)
✔ issues:

Example issues:

Setup Vite project

Create Login page

Add Protected routes

Connect API to backend

# Github Actions CI

CI pipeline does:

Install dependencies

Build project
