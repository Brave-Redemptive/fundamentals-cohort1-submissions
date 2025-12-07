## 🚀 PayVerse Frontend

A simple financial web client built with React + TypeScript + TailwindCSS for Week 11 of the Software Engineering Program.
This frontend consumes three backend API endpoints:

POST /api/auth/register

POST /api/auth/login

POST /api/transactions/send

It communicates with the backend via Axios, uses React Router for navigation, and stores JWT tokens in localStorage.

## 📌 Features

✅ User Authentication

Register account

Login using email & password

JWT stored in browser for authenticated requests

## ✅ Money Transfer

Send money to another PayVerse user

Auto-attaches JWT in Axios headers

Backend validates balance and performs transaction

## ✅ Modern UI

Clean interface built with TailwindCSS

Fully responsive pages

Loading states & error handling

## 🛠️ Tech Stack

Technology Usage
React + TypeScript Core UI framework
React Router v6 Page routing
Axios API requests
TailwindCSS Styling
LocalStorage Token persistence
