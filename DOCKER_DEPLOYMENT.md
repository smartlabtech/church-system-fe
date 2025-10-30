# Docker Deployment Guide

This guide explains how to deploy the Church Management System using Docker and configure environment variables at runtime (especially useful for Portainer deployments).

## Environment Variable Configuration

This application supports **runtime environment variable injection**, meaning you can configure environment variables when deploying the container without rebuilding the Docker image.

### Available Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `VITE_API_BASE_URL` | Backend API base URL | `/api/ar` |
| `VITE_API_CHURCH_ID` | Church identifier | `63cd11f4808cc1923ca5f3ca` |

## Deployment Options

### Option 1: Docker Compose (Recommended for Portainer)

1. **Pull the latest image:**
   ```bash
   docker pull ghcr.io/smartlabtech/ebay-scraper-fe:latest
   ```

2. **Deploy using docker-compose.yml:**
   ```yaml
   version: "3.8"

   services:
     church-system:
       image: ghcr.io/smartlabtech/ebay-scraper-fe:latest
       container_name: church-system-fe
       restart: unless-stopped
       environment:
         - VITE_API_BASE_URL=https://your-backend-api.com/api/ar
         - VITE_API_CHURCH_ID=your-church-id-here
       ports:
         - "80:80"
       networks:
         - proxy-network

   networks:
     proxy-network:
       external: true
   ```

3. **Deploy:**
   ```bash
   docker-compose up -d
   ```

### Option 2: Portainer Stack Deployment

1. **Navigate to Portainer** → Stacks → Add Stack

2. **Paste the docker-compose.yml content** (from above)

3. **Configure Environment Variables** in Portainer's Environment Variables section:
   - `VITE_API_BASE_URL` = `https://your-backend-api.com/api/ar`
   - `VITE_API_CHURCH_ID` = `your-church-id-here`

4. **Deploy the stack**

### Option 3: Docker Run

```bash
docker run -d \
  --name church-system-fe \
  --restart unless-stopped \
  -p 80:80 \
  -e VITE_API_BASE_URL=https://your-backend-api.com/api/ar \
  -e VITE_API_CHURCH_ID=your-church-id-here \
  ghcr.io/smartlabtech/ebay-scraper-fe:latest
```

## How It Works

### Runtime Configuration Injection

1. **Build Time:**
   - The image is built with default environment variables
   - Build artifacts are created in `/app/dist`

2. **Container Startup:**
   - The custom entrypoint script (`/docker-entrypoint.sh`) runs
   - It reads environment variables from the container
   - Generates `/usr/share/nginx/html/env-config.js` with actual values
   - Nginx starts and serves the application

3. **Application Runtime:**
   - `index.html` loads `/env-config.js` before the app starts
   - React app reads from `window._env_` for runtime config
   - Falls back to build-time values if runtime config is not available

### Priority Order

The application checks environment variables in this order:

1. **Runtime variables** (Docker container environment) - **Highest Priority**
2. **Build-time variables** (baked into the image during build)
3. **Default fallback values** - **Lowest Priority**

## Usage in Code

Instead of using `import.meta.env.VITE_API_BASE_URL` directly, import the ENV utility:

```javascript
// ❌ Don't use this (only works with build-time vars)
const apiUrl = import.meta.env.VITE_API_BASE_URL;

// ✅ Use this instead (works with both runtime and build-time vars)
import ENV from '@/utils/env';
const apiUrl = ENV.API_BASE_URL;
const churchId = ENV.API_CHURCH_ID;
```

## Updating Environment Variables

To update environment variables for a running container:

### In Portainer:
1. Go to Stacks → Your Stack
2. Click "Editor"
3. Update environment variable values
4. Click "Update the stack"
5. Portainer will recreate the container with new variables

### With Docker Compose:
1. Update `docker-compose.yml` environment values
2. Run: `docker-compose up -d`
3. Docker will recreate only the changed containers

### With Docker Run:
1. Stop the container: `docker stop church-system-fe`
2. Remove it: `docker rm church-system-fe`
3. Run again with new environment variables

## Verifying Configuration

Check if environment variables are properly injected:

```bash
# View the generated runtime config
docker exec church-system-fe cat /usr/share/nginx/html/env-config.js

# Check container logs
docker logs church-system-fe
```

You should see output like:
```
Injecting runtime environment variables...
VITE_API_BASE_URL: https://your-backend-api.com/api/ar
VITE_API_CHURCH_ID: your-church-id-here
Environment configuration generated successfully
```

## Troubleshooting

### Issue: App still using default values

**Solution:** Clear browser cache and hard reload (Ctrl+Shift+R)

### Issue: env-config.js not found

**Solution:**
1. Check if the entrypoint script ran: `docker logs church-system-fe`
2. Verify the file exists: `docker exec church-system-fe ls -la /usr/share/nginx/html/env-config.js`

### Issue: Environment variables not updating

**Solution:** Make sure to **recreate** the container, not just restart it:
```bash
docker-compose up -d --force-recreate
```

## GitHub Actions CI/CD

The image is automatically built and pushed to GitHub Container Registry when code is pushed to the master branch.

- **Registry:** `ghcr.io`
- **Image Tags:**
  - `latest` - Most recent build
  - `sha-{commit}` - Specific commit
  - `v{run_number}` - Sequential version

You can use specific versions in production:
```yaml
image: ghcr.io/smartlabtech/ebay-scraper-fe:v42
```
