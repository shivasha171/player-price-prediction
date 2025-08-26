CrickPredict - Demo project
===========================

This is an original demo project implementing a simple cricket prediction app.
It contains:
- backend/: Node.js + Express server using lowdb (file-based storage)
- frontend/: Vite + React single page app

Quick start (locally):
1. Backend:
   cd backend
   npm install
   node server.js
   -> server runs on http://localhost:4000

2. Frontend:
   cd frontend
   npm install
   npm run dev
   -> open http://localhost:5173 (or address shown by Vite)

Notes:
- This project is an original implementation and not a copy of any third-party site.
- For a production-ready app, add authentication, input validation, persistent DB, and HTTPS.
