# Production Setup Guide

Complete guide to deploy the Hospital Management System publicly.

## Architecture

```
Internet Users
      │
      ▼
┌─────────────────┐     VITE_API_URL      ┌──────────────────┐     MONGODB_URI     ┌────────────────┐
│  Netlify (SPA)  │ ───────────────────►  │  Render (API)    │ ──────────────────► │ MongoDB Atlas  │
│  React + Vite   │     HTTPS + WS        │  Express + JWT   │                     │  Cloud DB      │
└─────────────────┘                       └──────────────────┘                     └────────────────┘
```

---

## Where VITE_API_URL Is Used

| File | Purpose |
|------|---------|
| `hospital-management/src/config/apiConfig.js` | Resolves REST API base URL + Socket.IO URL |
| `hospital-management/src/services/api.js` | Axios `baseURL` on every request |
| `hospital-management/src/services/socketService.js` | WebSocket connection URL |
| `hospital-management/scripts/generate-redirects.js` | Netlify `/api/*` proxy at build time |
| `hospital-management/src/utils/apiErrors.js` | Detects missing API config |

All other API calls go through `src/services/api.js` → `src/services/index.js` (no hardcoded URLs).

---

## Environment Files

### Frontend (`hospital-management/`)

| File | When loaded | Purpose |
|------|-------------|---------|
| `.env.development` | `npm run dev` | Local proxy to `localhost:5001` |
| `.env.production` | `npm run build` | Template — replace placeholder OR set in Netlify |
| `.env.example` | Reference | Documents all variables |

### Backend (`backend/`)

| File | When loaded | Purpose |
|------|-------------|---------|
| `.env.development` | `NODE_ENV=development` | Local MongoDB + localhost CORS |
| `.env.production` | `NODE_ENV=production` | Template for Render values |
| `.env.example` | Reference | Documents all variables |
| `.env` | Always (local) | Your actual local secrets (gitignored) |

---

## Step 1: MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → Create free **M0** cluster.
2. **Database Access** → Add user (save username + password).
3. **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`).
4. **Connect** → Drivers → copy connection string:

```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/hospital-management?retryWrites=true&w=majority
```

5. Seed the database (run once from your Mac):

```bash
cd backend
cp .env.example .env
# Edit .env → set MONGODB_URI to Atlas connection string
npm install
npm run seed
```

---

## Step 2: Deploy Backend on Render

1. Push your code to GitHub.
2. [dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service**.
3. Connect your GitHub repo.

| Setting | Value |
|---------|-------|
| Name | `hospital-management-api` |
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |

4. **Environment Variables** (Render dashboard):

| Key | Value | Example |
|-----|-------|---------|
| `NODE_ENV` | `production` | `production` |
| `MONGODB_URI` | Atlas connection string | `mongodb+srv://user:pass@cluster...` |
| `JWT_SECRET` | Random 32+ char string | `a8f3k9m2x7p1q5w8e2r6t0y4u7i1o3p` |
| `FRONTEND_URL` | Your Netlify URL (set after Step 3) | `https://your-app.netlify.app` |

> Do **not** set `PORT` — Render sets it automatically.

5. Click **Create Web Service** → wait for deploy.
6. Copy your backend URL: `https://hospital-management-api.onrender.com`
7. Verify:

```bash
curl https://hospital-management-api.onrender.com/api/health
```

---

## Step 3: Configure Netlify

1. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**.
2. Build settings (auto-detected from `netlify.toml`):

| Setting | Value |
|---------|-------|
| Base directory | `hospital-management` |
| Build command | `npm run build` |
| Publish directory | `dist` |

3. **Environment Variables** (critical — must be set BEFORE first deploy):

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://hospital-management-api.onrender.com` |
| `NODE_ENV` | `production` |

> Use your actual Render URL. **No `/api` suffix.**

4. Deploy the site.
5. Copy your Netlify URL: `https://your-app.netlify.app`

---

## Step 4: Link Frontend ↔ Backend

Go back to **Render** → your service → **Environment**:

```
FRONTEND_URL=https://your-app.netlify.app
```

Click **Save** → Render will redeploy automatically.

This enables CORS and Socket.IO for your Netlify domain.

---

## Step 5: Redeploy Frontend

After setting `VITE_API_URL` in Netlify:

1. Netlify → **Deploys** → **Trigger deploy** → **Deploy site**
2. Wait for build to complete (should show `✅ API proxy redirect` in logs)

---

## Environment Variable Cheat Sheet

### Netlify (Frontend)

```env
VITE_API_URL=https://hospital-management-api.onrender.com
NODE_ENV=production
```

### Render (Backend)

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hospital-management?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret_here
FRONTEND_URL=https://your-app.netlify.app
```

### Local Development

**Frontend** — auto-loaded from `.env.development`:
```env
VITE_DEV_API_URL=http://localhost:5001
```

**Backend** — copy and edit:
```bash
cp backend/.env.example backend/.env
```

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/hospital-management
JWT_SECRET=dev_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:3000,http://localhost:5173
```

Run locally:
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd hospital-management && npm run dev
```

Open: `http://localhost:3000/login`

---

## Verification Checklist

Test from **any device** (phone, tablet, another computer):

- [ ] `https://your-app.netlify.app` loads the login page
- [ ] `curl https://YOUR-RENDER-URL.onrender.com/api/health` returns `"success":true`
- [ ] Login works (`admin@hospital.com` / `admin123` after seeding)
- [ ] Admin dashboard loads with data
- [ ] Appointments page loads and can create appointments
- [ ] Patient login/registration works
- [ ] Doctor, Nurse, Pharmacist dashboards load
- [ ] No CORS errors in browser DevTools → Console
- [ ] No `VITE_API_URL` or `404` errors on login
- [ ] API calls in Network tab go to `https://YOUR-RENDER-URL.onrender.com/api/...`

### Browser DevTools Check

1. Open login page → F12 → **Network** tab
2. Try to login
3. Look for `login` request:
   - **Correct:** `https://your-render-app.onrender.com/api/auth/login` → Status 200
   - **Wrong:** `https://your-netlify-app.netlify.app/api/auth/login` → means `VITE_API_URL` not set

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| "API server is not configured" | `VITE_API_URL` missing in Netlify build | Set in Netlify env vars → redeploy |
| Build fails on Netlify | Placeholder URL in `.env.production` | Set `VITE_API_URL` in Netlify dashboard |
| CORS error | `FRONTEND_URL` wrong on Render | Set exact Netlify URL on Render |
| Network Error / timeout | Render free tier cold start | Wait 30–60 seconds, retry |
| MongoDB connection failed | Atlas IP whitelist | Add `0.0.0.0/0` in Network Access |
| 401 Invalid credentials | Database not seeded | Run `npm run seed` with Atlas URI |
| Login works locally only | Expected before deploy | Complete Steps 1–5 above |

---

## Files Modified for Production

| File | Change |
|------|--------|
| `hospital-management/.env.development` | Local dev config |
| `hospital-management/.env.production` | Production template |
| `hospital-management/.env.example` | Documentation |
| `hospital-management/src/config/apiConfig.js` | Dev/prod URL resolution |
| `hospital-management/scripts/generate-redirects.js` | Netlify proxy + build validation |
| `hospital-management/netlify.toml` | Netlify build settings |
| `hospital-management/package.json` | `NODE_ENV=production` in build |
| `backend/.env.development` | Local backend config |
| `backend/.env.production` | Production template |
| `backend/server.js` | Load mode-specific env files |
| `backend/config/cors.js` | Netlify domain CORS support |
