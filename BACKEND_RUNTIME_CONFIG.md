# Backend Runtime Configuration - CRITICAL SETUP

## The Problem

When you build the frontend and copy it to the backend:
1. ✅ Frontend builds with values from `.env.production`
2. ✅ `dist/env-config.js` contains default values
3. ❌ **BUT** these are baked-in build-time values
4. ❌ Docker environment variables are ignored

## The Solution

The backend **MUST** dynamically generate `/env-config.js` to override the static file.

---

## Backend Implementation (REQUIRED)

### Step 1: Express Route Order (CRITICAL!)

The `/env-config.js` endpoint **MUST** come **BEFORE** static file serving:

```javascript
const express = require('express');
const path = require('path');
const app = express();

// ============================================
// 1. DYNAMIC ENV-CONFIG ENDPOINT (FIRST!)
// ============================================
// This MUST be BEFORE express.static()

app.get('/env-config.js', (req, res) => {
  // Generate JavaScript file with runtime values from Docker env
  const config = `// Runtime Configuration (Generated: ${new Date().toISOString()})
window._env_ = {
  VITE_API_BASE_URL: '${process.env.FRONTEND_API_BASE_URL || '/api/ar'}',
  VITE_API_CHURCH_ID: '${process.env.FRONTEND_CHURCH_ID || '63cd11f4808cc1923ca5f3ca'}'
};`;

  // Set proper content type and cache headers
  res.type('application/javascript');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(config);
});

// ============================================
// 2. STATIC FILE SERVING (AFTER ENV-CONFIG!)
// ============================================

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
  setHeaders: (res, filePath) => {
    // Don't cache index.html
    if (filePath.endsWith('index.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// ============================================
// 3. API ROUTES
// ============================================

app.use('/api', require('./routes/api'));

// ============================================
// 4. CLIENT-SIDE ROUTING FALLBACK (LAST!)
// ============================================

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3041;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Frontend API: ${process.env.FRONTEND_API_BASE_URL || '/api/ar'}`);
  console.log(`✅ Church ID: ${process.env.FRONTEND_CHURCH_ID || '63cd11f4808cc1923ca5f3ca'}`);
});
```

---

## Docker Compose Configuration

### Backend docker-compose.yml

```yaml
version: "3.8"

services:
  backend:
    image: ghcr.io/smartlabtech/church-system-be:latest
    container_name: church-system-be
    ports:
      - "${PORT:-3041}:3041"
    environment:
      # Backend config
      NODE_ENV: production
      PORT: "${PORT:-3041}"
      DB_URI: "${DB_URI}"
      JWT_SECRET: "${JWT_SECRET}"

      # Frontend runtime config (THESE ARE INJECTED!)
      FRONTEND_API_BASE_URL: "${FRONTEND_API_BASE_URL:-/api/ar}"
      FRONTEND_CHURCH_ID: "${FRONTEND_CHURCH_ID:-63cd11f4808cc1923ca5f3ca}"

      # ... other backend env vars
    restart: unless-stopped
    networks:
      - proxy-network

networks:
  proxy-network:
    external: true
```

### Backend .env file

```bash
# Frontend Runtime Configuration
FRONTEND_API_BASE_URL=/api/ar
FRONTEND_CHURCH_ID=63cd11f4808cc1923ca5f3ca

# Backend Configuration
DB_URI=mongodb://...
JWT_SECRET=...
# ... other vars
```

---

## How It Works

### Build Time (Frontend Repository)

```bash
# 1. Build with default values
npm run build

# dist/env-config.js contains:
window._env_ = {
  VITE_API_BASE_URL: '/api/ar',        # Build-time default
  VITE_API_CHURCH_ID: '63cd11f4808cc1923ca5f3ca'  # Build-time default
};
```

### Copy Time

```bash
# 2. Copy built files to backend
cp -r dist/* ../backend/public/

# backend/public/env-config.js still has build-time values (ignored!)
```

### Runtime (Backend Deployment)

```bash
# 3. Backend starts with Docker env vars
docker-compose up -d

# Backend generates /env-config.js dynamically:
# GET http://localhost:3041/env-config.js returns:
window._env_ = {
  VITE_API_BASE_URL: '/api/ar',        # From Docker env!
  VITE_API_CHURCH_ID: '63cd11f4808cc1923ca5f3ca'  # From Docker env!
};
```

### Browser Loading

```html
<!-- index.html loads env-config.js FIRST -->
<script src="/env-config.js"></script>  <!-- Backend serves dynamic version -->
<script type="module" src="/src/main.jsx"></script>

<!-- React app uses window._env_ values -->
```

---

## Verification Steps

### 1. Check Backend Serves Dynamic Config

```bash
# After backend deployment
curl http://localhost:3041/env-config.js
```

**Expected:** Should show current timestamp in comment
```javascript
// Runtime Configuration (Generated: 2025-10-31T12:34:56.789Z)
window._env_ = {
  VITE_API_BASE_URL: '/api/ar',
  VITE_API_CHURCH_ID: '63cd11f4808cc1923ca5f3ca'
};
```

### 2. Test Environment Variable Override

```bash
# Change env var in docker-compose.yml
FRONTEND_API_BASE_URL: "/api/en"  # Change to English API

# Restart backend (NO frontend rebuild needed!)
docker-compose restart backend

# Check config
curl http://localhost:3041/env-config.js
```

**Expected:** Should show new value
```javascript
window._env_ = {
  VITE_API_BASE_URL: '/api/en',  // ✅ Changed!
  ...
};
```

### 3. Browser Console Test

```javascript
// Open browser console at http://localhost:3041/
console.log(window._env_);
// Should show Docker environment values, NOT build-time values
```

---

## Common Mistakes

### ❌ WRONG: Static file served instead of dynamic

```javascript
// WRONG ORDER - Static middleware first
app.use(express.static('public'));  // This serves dist/env-config.js
app.get('/env-config.js', ...);     // This never runs!
```

**Result:** Browser gets build-time values, Docker env vars ignored

### ✅ CORRECT: Dynamic endpoint first

```javascript
// RIGHT ORDER - Dynamic endpoint first
app.get('/env-config.js', ...);     // This runs and serves dynamic config
app.use(express.static('public'));  // Static files for everything else
```

**Result:** Browser gets Docker env var values ✅

---

## Troubleshooting

### Issue: Browser shows build-time values

**Check:**
```bash
# Does backend serve dynamic config?
curl http://localhost:3041/env-config.js | grep "Generated"
```

**Solution:** Ensure `/env-config.js` route is **before** `express.static()`

---

### Issue: env-config.js returns 404

**Check:**
```bash
# Is the route registered?
curl -v http://localhost:3041/env-config.js
```

**Solution:** Add the `/env-config.js` route to backend

---

### Issue: Changes to Docker env not reflected

**Check:**
```bash
# Are env vars set in container?
docker exec church-system-be env | grep FRONTEND
```

**Solution:**
1. Update `docker-compose.yml` environment section
2. Restart: `docker-compose restart backend`
3. No frontend rebuild needed!

---

## Complete Backend Example File

Save this as `backend/src/server.js`:

```javascript
require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// FRONTEND RUNTIME CONFIG (MUST BE FIRST!)
// ============================================

app.get('/env-config.js', (req, res) => {
  const timestamp = new Date().toISOString();
  const apiBaseUrl = process.env.FRONTEND_API_BASE_URL || '/api/ar';
  const churchId = process.env.FRONTEND_CHURCH_ID || '63cd11f4808cc1923ca5f3ca';

  console.log(`[${timestamp}] Serving runtime config:`, { apiBaseUrl, churchId });

  const config = `// Runtime Configuration (Generated: ${timestamp})
// Values injected from Docker environment variables
window._env_ = {
  VITE_API_BASE_URL: '${apiBaseUrl}',
  VITE_API_CHURCH_ID: '${churchId}'
};
console.log('[Runtime Config] Loaded from backend:', window._env_);
`;

  res.type('application/javascript');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.send(config);
});

// ============================================
// STATIC FILES
// ============================================

app.use(express.static(path.join(__dirname, '../public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('index.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// ============================================
// API ROUTES
// ============================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    frontendConfig: {
      apiBaseUrl: process.env.FRONTEND_API_BASE_URL || '/api/ar',
      churchId: process.env.FRONTEND_CHURCH_ID || '63cd11f4808cc1923ca5f3ca'
    }
  });
});

// Import your API routes
const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

// ============================================
// CLIENT-SIDE ROUTING FALLBACK (LAST!)
// ============================================

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      error: 'API endpoint not found',
      path: req.path
    });
  }

  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 3041;
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`✅ Church System Backend - Running`);
  console.log('='.repeat(60));
  console.log(`Port:                ${PORT}`);
  console.log(`Environment:         ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend API URL:    ${process.env.FRONTEND_API_BASE_URL || '/api/ar'}`);
  console.log(`Church ID:           ${process.env.FRONTEND_CHURCH_ID || '63cd11f4808cc1923ca5f3ca'}`);
  console.log('='.repeat(60));
  console.log(`🌐 Frontend:         http://localhost:${PORT}/`);
  console.log(`🔧 API:              http://localhost:${PORT}/api`);
  console.log(`⚙️  Runtime Config:   http://localhost:${PORT}/env-config.js`);
  console.log('='.repeat(60));
});

module.exports = app;
```

---

## Summary

✅ **Frontend:** Build once with defaults
✅ **Backend:** Serve dynamic `/env-config.js` with Docker env vars
✅ **Result:** Change environment without rebuilding frontend

**Key Points:**
1. Backend `/env-config.js` route **MUST** come before `express.static()`
2. Docker environment variables override build-time values
3. No frontend rebuild needed when changing config
4. Test with `curl http://localhost:3041/env-config.js`
