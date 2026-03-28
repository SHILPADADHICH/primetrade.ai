# Scalable REST API with Authentication & Role-Based Access

This is a full-stack assignment project featuring a robust Node.js/TypeScript backend and a Next.js frontend.

## Features

### Backend (Node.js + Express + TypeScript)
- **User Authentication**: Secure register & login with password hashing (BcryptJS) and JWT.
- **Role-Based Access Control (RBAC)**: Differentiated access for `USER` and `ADMIN`.
- **CRUD Operations**: Complete Task management system.
- **API Versioning**: All endpoints are prefixed with `/api/v1`.
- **Validation**: Strict input validation using Zod schemas.
- **Prisma ORM**: Modern database access with Type-safety (PostgreSQL).
- **Caching**: High-performance read operations using Redis.
- **Logging**: Comprehensive logging with Winston for better observability.
- **API Documentation**: Interactive Swagger UI integrated.

### Frontend (Next.js 15 + Tailwind CSS)
- **Modern UI**: High-quality, premium aesthetic with smooth animations.
- **Auth Integration**: Context-based session management with JWT.
- **Protected Dashboard**: Tasks list, Create, Update, and Delete functionality.
- **Role-Aware Views**: Admins can view all tasks, users only their own.
- **Feedback System**: Clear success/error notifications for all user actions.

## Tech Stack
- **Frontend**: Next.js, Tailwind CSS, Lucide React, Shadcn UI patterns.
- **Backend**: Node.js, Express, TypeScript, Zod, JWT, Winston.
- **Database**: PostgreSQL with Prisma ORM.
- **Cache**: Redis.
- **Documentation**: Swagger UI.

## Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL
- Redis

### Backend Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in your database and Redis credentials.
4. Run migrations: `npm run prisma:migrate`
5. Generate client: `npm run prisma:generate`
6. Start Dev Server: `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Start Dev Server: `npm run dev`

## API Documentation
Once the backend is running, visit: `http://localhost:5000/api-docs`
