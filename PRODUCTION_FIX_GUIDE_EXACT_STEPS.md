# 🔥 COMPLETE PRODUCTION DEBUGGING & FIX GUIDE

## QUICK DIAGNOSIS

Your system is failing because:
1. ❌ **Netlify** - `VITE_API_URL` environment variable NOT SET during build
2. ❌ **Render** - `FRONTEND_URL` environment variable NOT SET in dashboard
3. ❌ Frontend built without knowing Render URL → can't reach backend
4. ❌ Backend doesn't allow Netlify frontend → CORS rejection

---

## STEP 1: VERIFY CURRENT STATE

### 1.1 Check Your Render Backend URL

```bash
# Visit: https://dashboard.render.com
# Find your service in the list
# Copy the URL shown (e.g., https://hospital-management-xyz.onrender.com)
# Save it - you'll need this in every step below
```

**Example Render URLs:**
```
https://hospital-management-5a2b.onrender.com
https://hospital-management-system-111.onrender.com
https://your-service.onrender.com
```

### 1.2 Test Backend is Running

```bash
# Replace with YOUR actual Render URL
curl https://hospital-management-xyz.onrender.com/api/health

# Should return:
{
  "success": true,
  "message": "Hospital Management System API is running",
  "environment": "production"
}

# If you get connection timeout or cannot reach:
❌ Backend is not running or crashed
→ Check Render dashboard logs
→ Click "Deploy" button to restart
```

### 1.3 Check Current Netlify Build Environment

```bash
# Visit: https://app.netlify.com
# Select your site (shubham-hospital-management)
# Go to: Site Settings → Build & Deploy → Environment
# Check if VITE_API_URL is set

# Currently should show:
❌ VITE_API_URL = (empty or not set)
✅ NODE_ENV = production (probably)

# Your current Netlify URL:
https://shubham-hospital-management.netlify.app
```

### 1.4 Check Current Render Environment

```bash
# Visit: https://dashboard.render.com
# Select your service
# Go to: Environment
# Check these variables:

❌ FRONTEND_URL = (empty or not set)
✅ MONGODB_URI = (should be set)
✅ JWT_SECRET = (should be set)
✅ NODE_ENV = production
```

---

## STEP 2: FIX NETLIFY BUILD ENVIRONMENT

### 2.1 Add VITE_API_URL to Netlify Dashboard

**EXACT STEPS:**

1. Go to: https://app.netlify.com
2. Click your site: **shubham-hospital-management**
3. Go to: **Site settings** (top menu)
4. Left sidebar: **Build & Deploy**
5. Click: **Environment**
6. Click: **Add environment variable**
7. **Key:** `VITE_API_URL`
8. **Value:** `https://hospital-management-xyz.onrender.com` (your actual Render URL)
9. Click: **Save**

**Proof it's set:**
```
Environment variables section should now show:
KEY                VALUE
VITE_API_URL       https://hospital-management-xyz.onrender.com
NODE_ENV           production
```

### 2.2 Rebuild Frontend on Netlify

**EXACT STEPS:**

1. Go to: https://app.netlify.com
2. Click your site: **shubham-hospital-management**
3. Go to: **Deploys** (top menu)
4. Find latest deploy or click: **Trigger deploy** → **Deploy site**
5. Wait for build to complete
6. Build log should show:
```
VITE_API_URL = https://hospital-management-xyz.onrender.com
npm run build
✅ Build successful
```

**Verify build used the variable:**
```bash
# After deploy completes:
# Open browser DevTools (F12)
# Go to Console
# Paste this and press Enter:

console.log(import.meta.env.VITE_API_URL);

# Should print your Render URL (not empty)
```

---

## STEP 3: FIX RENDER BACKEND ENVIRONMENT

### 3.1 Add FRONTEND_URL to Render

**EXACT STEPS:**

1. Go to: https://dashboard.render.com
2. Click your backend service
3. Go to: **Environment** (in service details)
4. Click: **Add Environment Variable**
5. **Key:** `FRONTEND_URL`
6. **Value:** `https://shubham-hospital-management.netlify.app`
7. Click: **Save**

**Proof it's set:**
```
Environment section should now show:
KEY                VALUE
FRONTEND_URL       https://shubham-hospital-management.netlify.app
MONGODB_URI        mongodb+srv://...
JWT_SECRET         ***
NODE_ENV           production
```

### 3.2 Restart Render Backend

**Option A: Auto-restart (recommended)**
```
Render automatically restarts when you save env variables
Wait 30-60 seconds for restart
```

**Option B: Manual restart**
```
1. Go to: https://dashboard.render.com
2. Click your service
3. Top right: Click "Manual Deploy"
4. Click: "Deploy latest commit"
5. Wait for deployment to complete
```

### 3.3 Verify Backend Restarted Successfully

```bash
# Check backend is running with new config
curl https://hospital-management-xyz.onrender.com/api/health

# Should return with correct FRONTEND_URL:
{
  "success": true,
  "environment": "production",
  "frontend": "https://shubham-hospital-management.netlify.app"
}

# If still shows empty frontend:
❌ Restart didn't complete
→ Wait 60 seconds
→ Try curl again
```

---

## STEP 4: VERIFY CORS IS WORKING

### 4.1 Test CORS Configuration

```bash
# Test if backend allows Netlify frontend
curl -H "Origin: https://shubham-hospital-management.netlify.app" \
     https://hospital-management-xyz.onrender.com/api/debug/cors

# Should return:
{
  "success": true,
  "corsEnabled": true,
  "frontendUrl": "https://shubham-hospital-management.netlify.app",
  "requestOrigin": "https://shubham-hospital-management.netlify.app",
  "message": "✅ CORS configured"
}

# If CORS not configured:
{
  "corsEnabled": false,
  "message": "⚠️ FRONTEND_URL not configured"
}
→ FRONTEND_URL not set on Render yet
→ Go back to Step 3
```

### 4.2 Test OPTIONS Preflight

```bash
# Test preflight request (what browser sends before actual request)
curl -X OPTIONS https://hospital-management-xyz.onrender.com/api/auth/login \
     -H "Origin: https://shubham-hospital-management.netlify.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type, Authorization" \
     -v

# Should see response headers:
Access-Control-Allow-Origin: https://shubham-hospital-management.netlify.app
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
Access-Control-Allow-Credentials: true
HTTP/1.1 204 No Content (or 200 OK)

# If you see:
HTTP/1.1 403 Forbidden or CORS error
→ FRONTEND_URL not set correctly
→ Wait 60 seconds for Render to restart
→ Try again
```

---

## STEP 5: TEST LOGIN FLOW END-TO-END

### 5.1 Frontend Test

**EXACT STEPS:**

1. Open: https://shubham-hospital-management.netlify.app
2. Open browser DevTools: **F12**
3. Go to: **Network** tab
4. Go to: **Console** tab
5. Paste and run:
```javascript
// Check if VITE_API_URL is set correctly in frontend
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
console.log("Expected:", "https://hospital-management-xyz.onrender.com");
```

Should output:
```
VITE_API_URL: https://hospital-management-xyz.onrender.com
Expected: https://hospital-management-xyz.onrender.com
```

### 5.2 Try Login

**EXACT STEPS:**

1. Stay on https://shubham-hospital-management.netlify.app/login
2. Keep DevTools **Network** tab open
3. Keep DevTools **Console** tab open
4. Enter test credentials:
   - **Email:** `admin@example.com`
   - **Password:** `admin123`
5. Click **Login**
6. Watch Network tab - should see:

```
POST https://hospital-management-xyz.onrender.com/api/auth/login
Status: 200 OK
Response: { success: true, data: { token: "...", user: {...} } }
```

### 5.3 Verify Successful Login

**If you see Status 200:**
```
✅ CORS working
✅ Backend reachable
✅ Login successful
→ Page should redirect to dashboard
→ Check browser console for any errors
```

**If you see Status 403 or CORS error:**
```
❌ CORS blocked
→ Check FRONTEND_URL on Render
→ Restart Render service
→ Wait 60 seconds
→ Try login again
```

**If you see Status 401:**
```
❌ Invalid credentials
→ Try different test user:
   Email: doctor@gmail.com
   Password: password123
```

**If you see "Cannot reach server":**
```
❌ Frontend can't reach backend
→ Check VITE_API_URL on Netlify (Step 5.1)
→ Rebuild Netlify frontend
→ Wait for build to complete
→ Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
```

---

## STEP 6: VERIFY EVERYTHING IS WORKING

### 6.1 Backend Health Check

```bash
# Replace with your actual Render URL
RENDER_URL="https://hospital-management-xyz.onrender.com"

# Test health endpoint
curl $RENDER_URL/api/health

# Expected:
{
  "success": true,
  "message": "Hospital Management System API is running",
  "environment": "production",
  "frontend": "https://shubham-hospital-management.netlify.app"
}
```

### 6.2 Frontend Build Check

```bash
# Open browser console at: https://shubham-hospital-management.netlify.app
# Paste and check:

console.log("Build Info:", {
  API_URL: import.meta.env.VITE_API_URL,
  ENV: import.meta.env.MODE,
  IS_PROD: import.meta.env.PROD
});

# Should show:
{
  API_URL: "https://hospital-management-xyz.onrender.com",
  ENV: "production",
  IS_PROD: true
}
```

### 6.3 Database Connection Check

```bash
# Test database connectivity by fetching an endpoint that needs DB
curl https://hospital-management-xyz.onrender.com/api/patients

# Should return patients data (may need auth token, but should connect)
```

### 6.4 Final Verification

```bash
# From frontend - try API call
curl -X POST https://hospital-management-xyz.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Should return:
{
  "success": true,
  "data": {
    "token": "eyJ...",
    "user": { "id": "...", "name": "Admin", "role": "admin" }
  }
}
```

---

## TROUBLESHOOTING CHECKLIST

### ❌ "Cannot reach server"
```
✓ Check Netlify has VITE_API_URL set (Step 2.1)
✓ Check frontend was rebuilt (Step 2.2)
✓ Hard refresh browser: Ctrl+Shift+R
✓ Check browser console: import.meta.env.VITE_API_URL value
✓ Verify Render URL is correct (no typos)
```

### ❌ "CORS error" or "Origin blocked"
```
✓ Check Render has FRONTEND_URL set (Step 3.1)
✓ Check FRONTEND_URL exactly matches: https://shubham-hospital-management.netlify.app
✓ Restart Render service (Step 3.2)
✓ Wait 60 seconds
✓ Test: curl with -H "Origin: ..." header (Step 4.2)
```

### ❌ "Connection timeout"
```
✓ Check Render service is running
✓ Check Render logs for errors
✓ Click "Deploy" on Render to restart
✓ MongoDB Atlas - check IP is whitelisted
✓ Check MONGODB_URI is correct on Render
```

### ❌ "Invalid credentials"
```
✓ Use correct test user credentials:
  Email: admin@example.com
  Password: admin123
✓ Or try: doctor@gmail.com / password123
✓ Or try: patient@example.com / patient123
```

### ❌ Login shows error but no CORS error
```
✓ Request reached backend (not CORS)
✓ Check credentials are correct
✓ Check MongoDB has data
✓ Check backend logs: https://dashboard.render.com → View logs
```

---

## FINAL CHECKLIST - PRODUCTION READY

```
Frontend (Netlify):
  ✅ VITE_API_URL set in Dashboard
  ✅ VITE_API_URL = your actual Render URL (no typos)
  ✅ Frontend rebuilt after setting VITE_API_URL
  ✅ browser console shows correct API_URL
  ✅ No CORS errors in Network tab
  
Backend (Render):
  ✅ FRONTEND_URL set in Dashboard
  ✅ FRONTEND_URL = https://shubham-hospital-management.netlify.app (exact)
  ✅ Service restarted after setting FRONTEND_URL
  ✅ /api/health returns correct frontend URL
  ✅ /api/debug/cors shows CORS enabled
  
Network / Deployment:
  ✅ Browser can reach backend (no 500 errors)
  ✅ CORS preflight succeeds (OPTIONS returns 204)
  ✅ Login POST request succeeds (200 OK)
  ✅ Token stored in localStorage
  ✅ Redirects to dashboard
  
Testing:
  ✅ Can login as admin
  ✅ Can see dashboard
  ✅ Can see patient list / appointments
  ✅ No network errors in console
  ✅ Real-time updates working (WebSocket connected)
```

---

## TIME ESTIMATE

- Step 1-2 (Netlify setup): 2 minutes
- Step 3-4 (Render setup): 2 minutes
- Step 5-6 (Testing): 3 minutes
- **Total: ~7 minutes**

---

## SUPPORT COMMANDS

If something doesn't work, share output of:

```bash
# Check Render URL (replace with yours)
curl -I https://hospital-management-xyz.onrender.com/api/health

# Check CORS headers
curl -i -X OPTIONS https://hospital-management-xyz.onrender.com/api/auth/login \
  -H "Origin: https://shubham-hospital-management.netlify.app"

# Check if backend is receiving FRONTEND_URL
curl https://hospital-management-xyz.onrender.com/api/debug/cors

# Frontend build environment (check in browser console)
Object.keys(import.meta.env).filter(k => k.startsWith('VITE'))
```

---

**Status:** 🔥 Production Fix Guide Ready  
**Last Updated:** 2026-06-08  
**Next Step:** Follow Step 1 → Step 2 → Step 3 → Step 4 → Step 5 → Step 6
