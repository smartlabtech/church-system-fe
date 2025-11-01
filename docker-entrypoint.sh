#!/bin/sh
# Docker entrypoint script to inject runtime environment variables

set -e

# Default values if not provided
export FRONTEND_API_BASE_URL=${FRONTEND_API_BASE_URL:-/api/ar}
export FRONTEND_CHURCH_ID=${FRONTEND_CHURCH_ID:-63cd11f4808cc1923ca5f3ca}
export FRONTEND_CHURCH_NAME_AR=${FRONTEND_CHURCH_NAME_AR:-كنيسة القديس مارمرقس}
export FRONTEND_CHURCH_NAME_EN=${FRONTEND_CHURCH_NAME_EN:-Saint Mark Church - Maadi}

echo "Injecting runtime environment variables..."
echo "FRONTEND_API_BASE_URL: $FRONTEND_API_BASE_URL"
echo "FRONTEND_CHURCH_ID: $FRONTEND_CHURCH_ID"
echo "FRONTEND_CHURCH_NAME_AR: $FRONTEND_CHURCH_NAME_AR"
echo "FRONTEND_CHURCH_NAME_EN: $FRONTEND_CHURCH_NAME_EN"

# Replace placeholders in env-config.js with actual environment variable values
envsubst '${FRONTEND_API_BASE_URL},${FRONTEND_CHURCH_ID},${FRONTEND_CHURCH_NAME_AR},${FRONTEND_CHURCH_NAME_EN}' < /usr/share/nginx/html/env-config.template.js > /usr/share/nginx/html/env-config.js

echo "Environment configuration generated successfully"

# Execute the main container command (nginx)
exec "$@"
