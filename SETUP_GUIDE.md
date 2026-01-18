# Setup Guide

This guide will help you get the Health & Fitness Tracker project up and running on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or MongoDB Atlas account)

## 🛠️ Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd "FINAL PROJECT"
   ```

2. **Install Dependencies**
   Install both root and frontend dependencies:
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   The project requires several environment variables to function correctly.

   ### Backend Setup
   Create a `.env` file in the `backend/` directory:
   ```env
   NODE_ENV=development
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/health_tracker
   JWT_SECRET=your_super_secret_key_here
   JWT_EXPIRE=30d
   ```

   ### Frontend Setup
   Create a `.env` file in the `frontend/` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5001/api/v1
   ```

4. **Database Initialization**
   Ensure your MongoDB service is running. If you are using MongoDB Atlas, update the `MONGO_URI` in `backend/.env` with your connection string.

## 🚀 Running the Application

### Development Mode
Runs both the backend and frontend concurrently:
```bash
npm run dev
```
- Frontend will be available at: `http://localhost:3000`
- Backend API will be available at: `http://localhost:5001`

### Production Mode
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Start the production server:
   ```bash
   cd ..
   npm start
   ```

## 🧪 Testing
To run frontend tests:
```bash
cd frontend
npm test
```
