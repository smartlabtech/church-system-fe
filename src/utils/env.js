/**
 * Environment configuration utility
 * Supports both build-time (import.meta.env) and runtime (window._env_) environment variables
 *
 * Priority:
 * 1. Runtime environment variables (from Docker container)
 * 2. Build-time environment variables (from .env files)
 * 3. Default fallback values
 */

const getEnvVar = (key, defaultValue = "") => {
  // Check runtime environment variables first (injected by Docker)
  if (window._env_ && window._env_[key]) {
    return window._env_[key]
  }

  // Fall back to build-time environment variables
  if (import.meta.env[key]) {
    return import.meta.env[key]
  }

  // Return default value
  return defaultValue
}

export const ENV = {
  API_BASE_URL: getEnvVar("FRONTEND_API_BASE_URL", "/api/ar"),
  API_CHURCH_ID: getEnvVar("FRONTEND_CHURCH_ID", "691211212a01c0b942a9640a"),
  CHURCH_NAME_AR: getEnvVar("FRONTEND_CHURCH_NAME_AR", "كنيسة البابا كيرلس"),
  CHURCH_NAME_EN: getEnvVar(
    "FRONTEND_CHURCH_NAME_EN",
    "Pop Kirolos Church - Maadi"
  ),
  SITE_URL: getEnvVar("FRONTEND_SITE_URL", "http://localhost:5173")
}

// For debugging - log which environment variables are being used
if (import.meta.env.DEV) {
  console.log("Environment Configuration:", {
    source: window._env_ ? "Runtime (Docker)" : "Build-time",
    API_BASE_URL: ENV.API_BASE_URL,
    API_CHURCH_ID: ENV.API_CHURCH_ID,
    CHURCH_NAME_AR: ENV.CHURCH_NAME_AR,
    CHURCH_NAME_EN: ENV.CHURCH_NAME_EN,
    SITE_URL: ENV.SITE_URL
  })
}

export default ENV
