#!/bin/sh
# Docker entrypoint script to inject runtime environment variables

set -e

# Default values if not provided
export FRONTEND_API_BASE_URL=${FRONTEND_API_BASE_URL:-/api/ar}
export FRONTEND_CHURCH_ID=${FRONTEND_CHURCH_ID:-63cd11f4808cc1923ca5f3ca}
export FRONTEND_CHURCH_NAME_AR=${FRONTEND_CHURCH_NAME_AR:-كنيسة القديس مارمرقس}
export FRONTEND_CHURCH_NAME_EN=${FRONTEND_CHURCH_NAME_EN:-Saint Mark Church - Maadi}
export FRONTEND_SITE_URL=${FRONTEND_SITE_URL:-https://stmarkmaadi-fekin.ondigitalocean.app}

echo "Injecting runtime environment variables..."
echo "FRONTEND_API_BASE_URL: $FRONTEND_API_BASE_URL"
echo "FRONTEND_CHURCH_ID: $FRONTEND_CHURCH_ID"
echo "FRONTEND_CHURCH_NAME_AR: $FRONTEND_CHURCH_NAME_AR"
echo "FRONTEND_CHURCH_NAME_EN: $FRONTEND_CHURCH_NAME_EN"
echo "FRONTEND_SITE_URL: $FRONTEND_SITE_URL"

# Replace placeholders in env-config.js with actual environment variable values
envsubst '${FRONTEND_API_BASE_URL},${FRONTEND_CHURCH_ID},${FRONTEND_CHURCH_NAME_AR},${FRONTEND_CHURCH_NAME_EN},${FRONTEND_SITE_URL}' < /usr/share/nginx/html/env-config.template.js > /usr/share/nginx/html/env-config.js

# Replace placeholders in index.html with actual environment variable values
# This ensures meta tags are set correctly for SEO and social media sharing
envsubst '${FRONTEND_CHURCH_ID},${FRONTEND_CHURCH_NAME_AR},${FRONTEND_SITE_URL}' < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp && mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html

echo "Environment configuration generated successfully"
echo "Meta tags updated in index.html"

# Execute the main container command (nginx)
exec "$@"
