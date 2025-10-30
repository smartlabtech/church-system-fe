# Production Deployment Guide

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

## Important Notes

⚠️ **The Vite proxy configuration in `vite.config.js` does NOT work in production builds!**

✅ **For production, you must either:**
- Configure a reverse proxy on your web server (nginx/Apache)
- Use CORS if frontend and backend are on different domains
- Deploy both frontend and backend on the same domain

## Troubleshooting

### API calls return 404 in production
- Check that your web server is configured to proxy `/api` requests
- Verify the `VITE_API_BASE_URL` environment variable is set correctly

### CORS errors
- Ensure backend has proper CORS configuration
- Check that credentials are included in requests if needed

### API calls return HTML instead of JSON
- This usually means the proxy is not configured correctly
- In production, ensure your web server (nginx/Apache) is proxying `/api` requests to your backend