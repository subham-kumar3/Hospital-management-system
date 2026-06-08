# 🚀 PRODUCTION DEPLOYMENT GUIDE

## Quick Fix for "Unable to reach server" Error

### Root Cause
Your frontend is trying to connect to the wrong Render backend URL, or the backend doesn't allow your Netlify frontend.

### Fix in 5 Steps

#### 1️⃣ Find Your Render Backend URL
- Go to https://dashboard.render.com
- Find your backend service
- Copy the URL (e.g., `https://hospital-management-xyz.onrender.com`)

#### 2️⃣ Set Netlify Environment Variable
```
Dashboard → Site Settings → Build & Deploy → Environment

VITE_API_URL = https://hospital-management-xyz.onrender.com
(use your actual Render URL from step 1)
```

#### 3️⃣ Rebuild Frontend on Netlify
```
Dashboard → Deploys → Trigger deploy
Wait for build to complete
```

#### 4️⃣ Set Render Environment Variable
```
Render Dashboard → Your Service → Environment

FRONTEND_URL = https://shubham-hospital-management.netlify.app
```

#### 5️⃣ Test
- Open https://shubham-hospital-management.netlify.app
- Try login
- Should work now! ✅

### Verification

**Check backend health:**
```bash
curl https://<your-render-url>/api/health
```

**Check CORS is configured:**
```bash
curl https://<your-render-url>/api/debug/cors
```

---

## Environment Variables Reference

### Netlify (Frontend Build)
```
VITE_API_URL = https://<your-render-backend>.onrender.com
```

### Render (Backend Runtime)
```
NODE_ENV = production
FRONTEND_URL = https://shubham-hospital-management.netlify.app
MONGODB_URI = mongodb+srv://hospital-management123:Hospital123@cluster0.6tqhjcj.mongodb.net/hospital-management?retryWrites=true&w=majority
JWT_SECRET = hospital_management_secret_key_2024
```

---

## Troubleshooting

### "CORS error" or "Origin not allowed"
- ✅ Check FRONTEND_URL is set on Render
- ✅ Check it matches your Netlify domain exactly
- ✅ Restart Render service

### "Cannot reach server"
- ✅ Check VITE_API_URL is set on Netlify
- ✅ Check it's your actual Render URL (not old URL)
- ✅ Rebuild frontend on Netlify
- ✅ Wait 60 seconds for Render to start

### "Connection timeout"
- ✅ MongoDB connection is failing
- ✅ Check MONGODB_URI on Render is correct
- ✅ Check MongoDB Atlas allows Render IP in Network Access
