# Production Deployment Guide - Monolithic Architecture

## Overview

This guide covers deploying the Church System in a **monolithic architecture** where:
- Backend serves both API endpoints (`/api/*`) and frontend static files
- Single Docker container runs the entire application
- Frontend environment variables are injected at runtime (no rebuild needed)

## Development vs Production API Configuration

### Current Setup

#### Development (Working)
- Vite proxy in `vite.config.js` forwards `/api` requests to `http://localhost:3041`
- This proxy ONLY works during development (`npm run dev`)
- No changes needed to API calls in the code

#### Production Options

### Option 1: Same Domain (Recommended)
Deploy both frontend and backend on the same server/domain.

**Nginx Configuration Example:**
```nginx
server {
    listen 80;
    server_name yourchurch.com;

    # Serve frontend files
    location / {
        root /var/www/church-frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:3041;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Environment Variables:**
```bash
VITE_API_BASE_URL='/api/ar'
```

### Option 2: Different Domains
Frontend and backend on different servers.

**Environment Variables:**
```bash
VITE_API_BASE_URL='https://api.yourchurch.com/api/ar'
```

**CORS Configuration Required on Backend:**
```javascript
// Backend CORS settings
app.use(cors({
    origin: 'https://yourchurch.com',
    credentials: true
}));
```

### Option 3: DigitalOcean App Platform
Using DigitalOcean's managed hosting.

**Environment Variables:**
```bash
VITE_API_BASE_URL='https://stmarkmaadi-fekin.ondigitalocean.app/api/ar'
```

## Build for Production

1. **Set environment variables:**
```bash
# Create .env.production file
cp .env.example .env.production
# Edit .env.production with your production values
```

2. **Build the application:**
```bash
npm run build
```

3. **Test the production build locally:**
```bash
npm run preview
```

## Deployment Steps

### For Nginx/Apache Server

1. Build the application:
```bash
npm run build
```

2. Upload the `dist` folder to your server

3. Configure your web server (see nginx example above)

### For DigitalOcean App Platform

1. Push your code to GitHub

2. Create a new App in DigitalOcean

3. Set environment variables in the App settings:
   - `VITE_API_BASE_URL`
   - `VITE_API_CHURCH_ID`

4. Set build command: `npm run build`

5. Set output directory: `dist`

### For Vercel/Netlify

1. Connect your GitHub repository

2. Set environment variables in the platform dashboard

3. Deploy (they handle the build automatically)

## Monolithic Deployment (Recommended)

### Architecture
```
┌─────────────────────────────────────────┐
│      Backend Container (port 3041)      │
│                                         │
│  ┌──────────────┐   ┌───────────────┐  │
│  │   Express    │   │   Static      │  │
│  │   API Server │   │   Files       │  │
│  │   /api/*     │   │   (dist/)     │  │
│  └──────────────┘   └───────────────┘  │
└─────────────────────────────────────────┘
```

### Step-by-Step Deployment

#### 1. Build Frontend
```bash
cd church-system-fe
npm install --legacy-peer-deps
npm run build
```

This creates `dist/` folder with:
- `index.html`, `assets/`, `manifest.json`
- `env-config.js` (runtime configuration template)
- `service-worker.js` (PWA support)

#### 2. Copy to Backend
```bash
# Copy entire dist folder to backend
cp -r dist/* ../church-system-be/public/

# Or create tarball for manual deployment
tar -czf church-system-fe-v1.0.x.tar.gz dist/
```

#### 3. Configure Backend to Serve Frontend

Your backend **must**:

**A. Serve Static Files:**
```javascript
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'public')));
```

**B. Generate Runtime Config Endpoint:**
```javascript
// Inject environment variables into frontend at runtime
app.get('/env-config.js', (req, res) => {
  const config = `
window._env_ = {
  VITE_API_BASE_URL: '${process.env.FRONTEND_API_BASE_URL || '/api/ar'}',
  VITE_API_CHURCH_ID: '${process.env.FRONTEND_CHURCH_ID || '63cd11f4808cc1923ca5f3ca'}'
};
  `;
  res.type('application/javascript');
  res.send(config);
});
```

**C. Handle Client-Side Routing:**
```javascript
// API routes first
app.use('/api', apiRouter);

// Fallback to index.html for client-side routing (MUST be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

#### 4. Configure Environment Variables

Create `.env` file in backend deployment directory:

```bash
# Copy template
cp .env.docker .env

# Edit with your values
nano .env
```

**Frontend Runtime Variables:**
```bash
FRONTEND_API_BASE_URL=/api/ar
FRONTEND_CHURCH_ID=63cd11f4808cc1923ca5f3ca
```

**Backend Variables:** (See `.env.docker` for full list)
```bash
DB_URI=mongodb://...
JWT_SECRET=your-secret
GMAIL_USER=...
# ... etc
```

#### 5. Deploy with Docker Compose

```bash
# Start services
docker-compose up -d

# Check logs
docker-compose logs -f backend

# Verify
curl http://localhost:3041/api          # API
curl http://localhost:3041/env-config.js # Runtime config
curl http://localhost:3041/              # Frontend
```

### Using Runtime Config in Code

The frontend automatically loads runtime config via `src/config/env.js`:

```javascript
import config from '@/config/env';

// Access values (runtime overrides build-time)
console.log(config.apiBaseUrl);   // from FRONTEND_API_BASE_URL
console.log(config.churchId);     // from FRONTEND_CHURCH_ID
```

Priority: **Runtime (window._env_) > Build-time (import.meta.env) > Defaults**

## Important Notes

⚠️ **The Vite proxy configuration in `vite.config.js` ONLY works in development!**

✅ **For monolithic production deployment:**
- Backend serves static files from `dist/` folder
- Backend generates `/env-config.js` with runtime environment variables
- Backend handles client-side routing (all routes → `index.html`)
- No CORS configuration needed (same domain)
- Frontend env variables can be changed without rebuilding

✅ **Benefits of Runtime Configuration:**
- Change API URL without rebuilding frontend
- Different configs for staging/production without separate builds
- Environment-specific values injected at container startup

## Troubleshooting

### Frontend shows blank page
- **Check:** Browser console for errors
- **Verify:** `curl http://localhost:3041/env-config.js` returns valid JS
- **Solution:** Ensure backend serves `/env-config.js` endpoint

### API calls return 404 in production
- **Check:** Network tab shows correct API URL
- **Verify:** `FRONTEND_API_BASE_URL` is set in Docker environment
- **Solution:** Restart container after env changes

### API calls return HTML instead of JSON
- **Check:** Backend routing order (API routes before fallback)
- **Verify:** `/api` routes are registered before `app.get('*', ...)`
- **Solution:** Reorder Express routes

### Changes to env variables not reflected
- **Check:** Docker Compose environment section
- **Solution:** `docker-compose restart backend` (no rebuild needed)

### 404 on client-side routes (e.g., /dashboard)
- **Check:** Backend has fallback route to `index.html`
- **Verify:** `app.get('*', ...)` is the last route
- **Solution:** Add fallback route after all API routes

### env-config.js shows build-time values
- **Check:** Backend is generating the file dynamically
- **Verify:** Not serving static `env-config.js` from `dist/`
- **Solution:** Add `/env-config.js` endpoint before static middleware