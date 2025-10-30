// API Configuration for different environments
import ENV from '../utils/env'

const getApiBaseUrl = () => {
  // Use the ENV utility which supports both build-time and runtime configuration
  return ENV.API_BASE_URL || ''
}

export const API_BASE_URL = getApiBaseUrl()

// Helper function to construct API endpoints
export const getApiEndpoint = (path) => {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  // If we have a base URL, prepend it
  if (API_BASE_URL) {
    return `${API_BASE_URL}${normalizedPath}`
  }

  // Otherwise, return the path as-is (will use proxy in dev or same origin in prod)
  return normalizedPath
}

export default {
  API_BASE_URL,
  getApiEndpoint
}