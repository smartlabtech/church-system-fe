/**
 * Environment configuration utility
 * Supports both build-time (import.meta.env) and runtime (window._env_) environment variables
 *
 * Priority:
 * 1. Runtime environment variables (from Docker container)
 * 2. Build-time environment variables (from .env files)
 * 3. Default fallback values
 */

const getEnvVar = (key, defaultValue = '') => {
  // Check runtime environment variables first (injected by Docker)
  if (window._env_ && window._env_[key]) {
    return window._env_[key];
  }

  // Fall back to build-time environment variables
  if (import.meta.env[key]) {
    return import.meta.env[key];
  }

  // Return default value
  return defaultValue;
};

export const ENV = {
  API_BASE_URL: getEnvVar('FRONTEND_API_BASE_URL', '/api/ar'),
  API_CHURCH_ID: getEnvVar('FRONTEND_CHURCH_ID', '63cd11f4808cc1923ca5f3ca'),
  CHURCH_NAME_AR: getEnvVar('FRONTEND_CHURCH_NAME_AR', 'كنيسة القديس مارمرقس'),
  CHURCH_NAME_EN: getEnvVar('FRONTEND_CHURCH_NAME_EN', 'Saint Mark Church - Maadi'),
};

// For debugging - log which environment variables are being used
if (import.meta.env.DEV) {
  console.log('Environment Configuration:', {
    source: window._env_ ? 'Runtime (Docker)' : 'Build-time',
    API_BASE_URL: ENV.API_BASE_URL,
    API_CHURCH_ID: ENV.API_CHURCH_ID,
    CHURCH_NAME_AR: ENV.CHURCH_NAME_AR,
    CHURCH_NAME_EN: ENV.CHURCH_NAME_EN,
  });
}

export default ENV;
