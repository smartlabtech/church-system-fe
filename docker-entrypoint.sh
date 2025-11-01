#!/bin/sh
# Docker entrypoint script to inject runtime environment variables

set -e

# Default values if not provided
export VITE_API_BASE_URL=${VITE_API_BASE_URL:-/api/ar}
export VITE_API_CHURCH_ID=${VITE_API_CHURCH_ID:-63cd11f4808cc1923ca5f3ca}
export VITE_CHURCH_NAME_AR=${VITE_CHURCH_NAME_AR:-كنيسة القديس مارمرقس}
export VITE_CHURCH_NAME_EN=${VITE_CHURCH_NAME_EN:-Saint Mark Church - Maadi}

echo "Injecting runtime environment variables..."
echo "VITE_API_BASE_URL: $VITE_API_BASE_URL"
echo "VITE_API_CHURCH_ID: $VITE_API_CHURCH_ID"
echo "VITE_CHURCH_NAME_AR: $VITE_CHURCH_NAME_AR"
echo "VITE_CHURCH_NAME_EN: $VITE_CHURCH_NAME_EN"

# Replace placeholders in env-config.js with actual environment variable values
envsubst '${VITE_API_BASE_URL},${VITE_API_CHURCH_ID},${VITE_CHURCH_NAME_AR},${VITE_CHURCH_NAME_EN}' < /usr/share/nginx/html/env-config.template.js > /usr/share/nginx/html/env-config.js

echo "Environment configuration generated successfully"

# Execute the main container command (nginx)
exec "$@"
