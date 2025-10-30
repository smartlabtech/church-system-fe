# File: Dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Set build arguments
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Debug: Print the environment variable
RUN echo "VITE_API_BASE_URL is set to: $VITE_API_BASE_URL"

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Install envsubst for runtime environment variable injection and curl for healthcheck
RUN apk add --no-cache gettext curl

# Copy the build output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy environment config template
COPY public/env-config.template.js /usr/share/nginx/html/env-config.template.js

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Use custom entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 