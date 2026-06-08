# ⚡ QUICK FIX CHECKLIST - Hospital Management System Production

> **Problem:** Login shows "Unable to reach server"  
> **Root Cause:** Missing Netlify VITE_API_URL + Missing Render FRONTEND_URL  
> **Time to Fix:** 5-7 minutes

---

## 🟢 QUICK CHECKLIST

### Before Starting
- [ ] Have your Render backend URL copied
- [ ] Have your Netlify site URL (should be: https://shubham-hospital-management.netlify.app)
- [ ] Access to both Netlify and Render dashboards

---

### ✅ PART 1: Verify Backend is Running (1 min)

```bash
# Get Render URL from: https://dashboard.render.com
# Example: https://hospital-management-xyz.onrender.com

# Test it:
curl https://hospital-management-xyz.onrender.com/api/health

# Expected output:
# {
#   "success": true,
#   "message": "Hospital Management System API is running",
#   "environment": "production"
# }

# If connection timeout:
# ❌ Backend not running
# → Go to Render dashboard
# → Click "Deploy" to restart
# → Wait 2 minutes
# → Come back to this step
```

**Status:** [ ] ✅ Backend running and responding

---

### ✅ PART 2: Fix Netlify Frontend (2 min)

**Step 1: Add VITE_API_URL to Netlify**
```
1. Go to: https://app.netlify.com
2. Select: shubham-hospital-management
3. Click: Site settings (top menu)
4. Left sidebar: Build & Deploy
5. Click: Environment variables (or "Environment")
6. Click: Add environment variable
7. Enter:
   KEY:   VITE_API_URL
   VALUE: https://hospital-management-xyz.onrender.com
           (Replace with YOUR Render URL)
8. Click: Save
```

**Status:** [ ] ✅ VITE_API_URL added to Netlify

**Step 2: Rebuild Frontend on Netlify**
```
1. Go to: https://app.netlify.com
2. Select: shubham-hospital-management
3. Click: Deploys (top menu)
4. Click: Trigger deploy → Deploy site
5. Wait for deploy to complete (2-3 min)
   - Should see: "Build successful"
```

**Status:** [ ] ✅ Frontend rebuilt

**Step 3: Verify Frontend Build**
```javascript
// Open: https://shubham-hospital-management.netlify.app
// Press: F12 (open DevTools)
// Go to: Console tab
// Paste this:

console.log(import.meta.env.VITE_API_URL)

// You should see your Render URL printed, like:
// "https://hospital-management-xyz.onrender.com"

// If you see empty string or undefined:
// ❌ Build didn't get the variable
// → Go back to Step 1
// → Make sure VITE_API_URL is set in Netlify
// → Rebuild again
```

**Status:** [ ] ✅ Frontend API_URL verified

---

### ✅ PART 3: Fix Render Backend (1 min)

**Step 1: Add FRONTEND_URL to Render**
```
1. Go to: https://dashboard.render.com
2. Select your backend service
3. Go to: Environment (should be in settings)
4. Click: Add Environment Variable
5. Enter:
   KEY:   FRONTEND_URL
   VALUE: https://shubham-hospital-management.netlify.app
6. Click: Save
```

**Note:** Make sure it's exactly:  
`https://shubham-hospital-management.netlify.app`  
(no trailing slash, exact domain)

**Status:** [ ] ✅ FRONTEND_URL added to Render

**Step 2: Wait for Restart**
```
After saving:
- Render automatically restarts your service
- Wait 30-60 seconds
- OR go to Deploys and click Manual Deploy to restart immediately
```

**Status:** [ ] ✅ Render service restarted

**Step 3: Verify Backend Config**
```bash
# Check backend has the new config:
curl https://hospital-management-xyz.onrender.com/api/debug/cors

# Expected output:
# {
#   "success": true,
#   "environment": "production",
#   "frontendUrl": "https://shubham-hospital-management.netlify.app",
#   "corsEnabled": true,
#   "message": "✅ CORS configured"
# }

# If "frontendUrl" is empty or "corsEnabled" is false:
# ❌ FRONTEND_URL not set correctly
# → Go back to Step 1
# → Check exact URL spelling
# → Make sure no trailing slash
# → Wait 60 seconds for restart
# → Try curl again
```

**Status:** [ ] ✅ Backend CORS configuration verified

---

### ✅ PART 4: Test Login (2 min)

**Step 1: Check Network with DevTools**
```
1. Open: https://shubham-hospital-management.netlify.app/login
2. Press: F12 (open DevTools)
3. Click: Network tab
4. Leave DevTools open
```

**Step 2: Try Login**
```
1. Email: admin@example.com
2. Password: admin123
3. Click: Login button
```

**Step 3: Check Network Tab**
```
Watch for request to: /api/auth/login

✅ Success if you see:
  - POST https://hospital-management-xyz.onrender.com/api/auth/login
  - Status: 200 OK
  - Response: { "success": true, "data": { "token": "..." } }
  - Page redirects to /dashboard
  
❌ Check if you see:
  - CORS error message
  - Status: 403 or 401
  - "Cannot reach server" error
  - Connection timeout
```

**Status:** [ ] ✅ Login successful, token stored

**Step 4: Verify Dashboard Loads**
```
1. After login, check if you're on dashboard
2. Should see patient list, appointments, etc.
3. Check browser console for any red errors
4. If WebSocket icon shows (🔌), real-time is working
```

**Status:** [ ] ✅ Dashboard loaded with data

---

## 🔴 TROUBLESHOOTING

### Issue: "Cannot reach server" (Login fails)

**Check 1:** Frontend knows backend URL?
```javascript
// In browser console:
console.log(import.meta.env.VITE_API_URL)

// Should show your Render URL
// If empty: VITE_API_URL not set on Netlify → Go to Part 2 Step 1
```

**Check 2:** Backend allows frontend?
```bash
curl https://hospital-management-xyz.onrender.com/api/debug/cors

# Should show your Netlify URL in "frontendUrl"
# If empty: FRONTEND_URL not set on Render → Go to Part 3 Step 1
```

**Check 3:** CORS headers OK?
```bash
curl -i -X OPTIONS https://hospital-management-xyz.onrender.com/api/auth/login \
  -H "Origin: https://shubham-hospital-management.netlify.app"

# Should see: HTTP/1.1 204 No Content or 200 OK
# Should see: Access-Control-Allow-Origin: https://shubham-hospital-management.netlify.app
# If 403: FRONTEND_URL not correct → Fix on Render
```

### Issue: Backend Returns 403 (CORS Error)

**Exact URLs Must Match:**
```
In Render Dashboard:
  FRONTEND_URL = https://shubham-hospital-management.netlify.app

Browser address bar:
  URL = https://shubham-hospital-management.netlify.app/login

These MUST be identical!

If you have:
  ❌ https://shubham-hospital-management.netlify.app/ (trailing slash)
  ❌ http://shubham-hospital-management.netlify.app (missing https)
  ❌ shubham-hospital-management.netlify.app (missing https://)

None of these will work! Use exactly:
  ✅ https://shubham-hospital-management.netlify.app
```

### Issue: Backend Service Not Running

**Check:**
```bash
curl https://hospital-management-xyz.onrender.com/api/health

# If: Connection timeout or "Cannot reach host"
# → Service is down

# Go to: https://dashboard.render.com
# → Click your service
# → Should show: "Deployed" (green)
# → If not: Click "Manual Deploy" to restart
# → Wait 2-3 minutes for restart
```

### Issue: Still Getting CORS Error After Setup

```bash
# 1. Verify backend has the env var:
curl https://hospital-management-xyz.onrender.com/api/debug/cors

# 2. If FRONTEND_URL is empty, service didn't restart:
# → Go to Render Dashboard
# → Service → Manual Deploy → Deploy latest commit
# → Wait 60 seconds
# → Try again

# 3. If FRONTEND_URL shows but still CORS error:
# → Check frontend URL in Netlify is NOT custom domain
# → Should be: shubham-hospital-management.netlify.app
# → NOT: yourdomain.com or custom domain

# 4. Hard refresh browser:
# → Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
# → Clear browser cache if needed
```

---

## ✅ FINAL VERIFICATION

After all steps, you should have:

```
✅ Netlify Environment:
   VITE_API_URL = https://hospital-management-xyz.onrender.com

✅ Render Environment:
   FRONTEND_URL = https://shubham-hospital-management.netlify.app
   MONGODB_URI = mongodb+srv://...
   JWT_SECRET = (set)
   NODE_ENV = production

✅ Frontend (browser console):
   import.meta.env.VITE_API_URL = "https://hospital-management-xyz.onrender.com"

✅ Backend (curl response):
   /api/debug/cors shows CORS enabled
   /api/health returns success

✅ Login Flow:
   - Email: admin@example.com
   - Password: admin123
   - → 200 OK with token
   - → Dashboard loads
   - → No CORS errors
```

---

## 🚀 SUCCESS INDICATORS

All of these should be true after fix:

- [ ] Frontend loads without errors
- [ ] Login form appears
- [ ] Can enter credentials
- [ ] Login button submits without "Cannot reach server" error
- [ ] Token appears in localStorage
- [ ] Redirects to dashboard
- [ ] Patient list loads
- [ ] No red errors in console
- [ ] WebSocket shows connected (real-time working)
- [ ] Can perform other actions (view appointments, etc.)

---

## 📞 IF SOMETHING STILL DOESN'T WORK

Run these debug commands and share output:

```bash
# 1. Backend health
curl -v https://hospital-management-xyz.onrender.com/api/health

# 2. CORS configuration
curl -v https://hospital-management-xyz.onrender.com/api/debug/cors

# 3. Frontend environment (in browser console)
Object.entries(import.meta.env).filter(([k]) => k.startsWith('VITE')).map(([k, v]) => `${k}: ${v}`)

# 4. Check Render logs
# Visit: https://dashboard.render.com → service → Logs
# Copy relevant error messages

# 5. Check Netlify build log
# Visit: https://app.netlify.com → site → Deploys → latest → View deploy log
# Check if VITE_API_URL was found during build
```

---

**ESTIMATED TIME:** 5-7 minutes total  
**DIFFICULTY:** Easy (just setting environment variables)  
**SUCCESS RATE:** 99% after following all steps correctly  

**Next Step:** Start with Part 1 (Verify Backend) → Part 2 (Fix Netlify) → Part 3 (Fix Render) → Part 4 (Test)
