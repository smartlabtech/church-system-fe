// Development Environment Configuration
// This file is used in development mode only
// In production, the backend serves this file dynamically with runtime values

// For development, we use empty config or defaults
// The app will fall back to import.meta.env values from .env files
window._env_ = window._env_ || {};

console.log('[Dev Mode] Using static env-config.js - runtime config will be loaded from .env files');
