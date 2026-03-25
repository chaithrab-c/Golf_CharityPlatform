# Golf Charity Subscription Platform

A full-stack MERN application combining golf performance tracking, charity fundraising, and monthly draw-based rewards.

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Backend Setup
```bash
cd backend
cp .env.example .env    # Edit with your MongoDB URI & JWT secret
npm install
npm run seed            # Seeds admin + test user + charities
npm run dev             # Starts on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev             # Starts on http://localhost:5173
```

### Test Credentials (after seeding)
- **Admin:** admin@golfcharity.com / admin123
- **User:** john@example.com / user123

## Features
- User auth (JWT), registration, login
- Subscription plans (monthly/yearly)
- Golf score entry (Stableford 1-45, rolling 5 scores)
- Monthly draw system (random + algorithmic)
- Charity directory with search/filter
- Winner verification & payout tracking
- Full admin dashboard with stats, user/draw/charity management

## Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, React Router
- **Backend:** Node.js, Express, MongoDB/Mongoose, JWT, bcrypt
- **API:** RESTful with validation (express-validator)

## Project Structure
```
├── backend/
│   ├── controllers/    # Route handlers
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── middleware/      # Auth & upload middleware
│   ├── utils/          # Email, seed script
│   └── server.js       # Entry point
├── frontend/
│   └── src/
│       ├── pages/      # All page components
│       ├── components/ # Layout, auth components
│       ├── context/    # Auth context
│       └── services/   # API client (axios)
```
"# Golf_Charity_Platform" 
"# Golf_Charity_Platform" 
