# GirlBoss Frontend

React, TypeScript, Vite, React Router, TanStack Query, React Hook Form, and Zod frontend for GirlBoss.

## Run locally

```sh
npm install
npm run dev
```

The frontend expects the GirlBoss API at `http://localhost:4000` by default. To
use another API origin, create a local `.env` file with:

```env
VITE_API_BASE_URL=http://localhost:4000
```

Only the public API origin belongs in this variable. Never put Supabase service
role keys or other administrative credentials in frontend environment files.

## Authentication

- Login: `POST /api/auth/login`, followed by `GET /api/auth/me`.
- Registration: `POST /api/auth/register`; the UI asks the user to check their
  email rather than assuming registration created an authenticated session.
- The backend response and `/api/auth/me` determine the account role. The
  login role selector is only a UI context.
- The access token is kept in `sessionStorage` for the current browser tab and
  revalidated with `/api/auth/me` after a reload. The frontend does not persist
  the refresh token; the backend currently exposes no refresh endpoint or
  HttpOnly-cookie session flow.

Available validation scripts:

```sh
npm run build
npm run lint
```
