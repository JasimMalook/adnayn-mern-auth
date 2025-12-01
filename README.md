# Smart Content Manager

Full-stack SaaS web application for small businesses and content creators to generate AI-powered content, save it, and plan posts.

## Tech Stack

- Backend: Node.js, Express.js, MongoDB, JWT
- Frontend: React.js, Next.js, Tailwind CSS
- AI: OpenAI API (or compatible OpenRouter endpoint)

## Monorepo Structure

- `backend/` – Express API, MongoDB models, auth, AI routes
- `frontend/` – Next.js app (pages: Home, Login, Signup, Dashboard, Admin)

## Getting Started

### 1. Clone and install

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` files:

- At project root (for reference)
- In `backend/.env` (required)
- In `frontend/.env.local` (required)

Update:

- `MONGODB_URI`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_API_BASE_URL`

### 3. Run locally

In one terminal (backend):

```bash
cd backend
npm run dev
```

In another terminal (frontend):

```bash
cd frontend
npm run dev
```

- Backend runs on http://localhost:5000
- Frontend runs on http://localhost:3000

### 4. Deployment Overview

- **Backend**: Deploy `backend/` to Render or Railway.
- **Frontend**: Deploy `frontend/` to Vercel.
- **Database**: Use a free MongoDB Atlas cluster.

Remember to set environment variables on each platform.

## Features

- Email/password auth with JWT
- FREE/PREMIUM roles with usage limits
- AI content generation (posts, captions, product descriptions, 30-day plans)
- Save, list, edit, delete content
- Dashboard with basic stats
- Admin panel for managing users and content

## Future Improvements

- Stripe/PayPal subscription integration
- More detailed analytics and charts
- Calendar view for content planning
- Team collaboration and shared workspaces
