# BatchTask - Asset Management System

A full-stack premium asset management system with real-time tracking, soft-deletion (trash), and advanced filtering.

## 🚀 Deployment Guide

### Backend (Node.js/Express)
1. **Environment Variables**:
   - `MONGO_URL`: Your MongoDB connection string.
   - `PORT`: (Optional) Defaults to 3001.
2. **Build**: `cd backend && npm install && npm run build`
3. **Start**: `npm start` (Runs the transpiled JS from `dist/`)

### Frontend (React/Vite)
1. **Environment Variables**:
   - `VITE_API_BASE_URL`: The full URL of your deployed backend (e.g., `https://your-api.com`).
2. **Build**: `cd frontend && npm install && npm run build`
3. **Serve**: Upload the `frontend/dist` folder to your static hosting provider (Vercel, Netlify, etc.).

## 🛠 Features
- **Premium UI**: Sleek dark mode with glassmorphism effects.
- **Soft Delete**: Move items to trash before permanent removal.
- **Power Search**: Filter by size, color, category, and price range.
- **RESTful API**: Fully documented endpoints with health check monitoring.

## 🩺 Health Check
The backend includes a health check endpoint at `/health` to verify service status.
