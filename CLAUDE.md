# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Church Management System frontend application built with React + Vite. It's designed for St. Mark Maadi church and provides features for user management, servant tracking, attendance, store/points system, Bible MCQ marathons, and administrative functions.

## Development Commands

```bash
# Development server (runs on Vite dev server)
yarn dev

# Build for production (auto-increments patch version in package.json)
yarn build

# Lint code
yarn lint

# Preview production build
yarn preview
```

## Tech Stack & Key Dependencies

- **Framework**: React 18.3.1 with Vite 6
- **UI Library**: Mantine 7.15.1 (components, forms, hooks, notifications, dates, dropzone)
- **State Management**: Redux Toolkit with Redux Thunk for async actions
- **Routing**: React Router DOM v7
- **Internationalization**: i18next with react-i18next (Arabic/English)
- **HTTP Client**: Axios 1.7.9
- **Special Features**:
  - QR code scanning (@zxing/browser, react-qr-reader)
  - Service Worker for PWA capabilities
  - Redux Persist for state persistence

## Architecture

### State Management (Redux)

The application uses a traditional Redux architecture with actions, reducers, and constants:

- **Actions** (`src/actions/`): Async thunks for API calls (user, servant, store, orders, products, MCQ, etc.)
- **Reducers** (`src/reducers/`): Manage state slices for each domain
- **Constants** (`src/constants/`): Action type constants for each feature
- **Store** (`src/store.js`): Combines all reducers with Redux Thunk middleware and Redux DevTools

Key state domains:
- User authentication and management
- Servant tracking (servantIn/servedBy)
- Services and attendance
- Store/products/orders system
- Bible MCQ marathons
- Announcements and expenses
- Modal states

### Routing Structure

Main routes defined in `src/layout/AppShellLayout.jsx`:
- `/` - Home screen
- `/dashboard` - Servant dashboard
- `/my-profile` - User account
- `/follow-up` - Follow-up screen
- `/admin-panel` - Admin panel
- `/store` - Store screen
- `*` - 404 Not Found

### Component Organization

- **Layout**: `src/layout/AppShellLayout.jsx` - Main shell using Mantine AppShell with header, navbar, aside, footer
- **Components**: `src/components/` - Reusable UI components organized by feature
- **Screens**: `src/screens/` - Page-level components
- **Pages**: `src/pages/` - Standalone pages (auth, privacy policy, API docs, not found)

### Internationalization

The app supports Arabic (default) and English:
- Translation files: `src/i18n/ar.json`, `src/i18n/en.json`
- Initialization: `src/i18n/i18n.js`
- Default language: Arabic (AR), stored in localStorage as `lang`
- Usage: Import `useTranslation` from `react-i18next`

### API Integration

- Base URL configured in `.env` as `VITE_API_BASE_URL` (defaults to `/api/ar`)
- Church ID: `VITE_API_CHURCH_ID = '63cd11f4808cc1923ca5f3ca'`
- API calls are made through Redux actions using Axios
- User authentication stored in localStorage as `userInfo`

### PWA Features

- Service Worker registered in `src/main.jsx`
- Cache name auto-updates with version during build (see `vite.config.js`)
- Manifest at `public/manifest.json`
- Custom build plugin auto-increments patch version and updates service worker cache name

## Key Patterns

### Redux Actions Pattern

Actions follow a standard async pattern with REQUEST/SUCCESS/FAIL:
```javascript
export const someAction = (params) => async (dispatch) => {
  try {
    dispatch({ type: SOME_ACTION_REQUEST })
    const { data } = await axios.post('/api/endpoint', params)
    dispatch({ type: SOME_ACTION_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: SOME_ACTION_FAIL, payload: error.response?.data?.message || error.message })
  }
}
```

### Service Selection

Users can be "served by" multiple services (e.g., different classes or groups):
- Selected service stored in Redux state (`servedBy.service`)
- Servant dashboard shows "servantIn" list (servants in a service)
- Service selection modals: `SET_SERVEDBYMODAL`, `SET_SERVANTINMODAL`

### Modal Management

Modals are controlled through Redux actions:
- Auth modal: `SET_AUTH_MODAL`, `RESET_AUTH_MODAL`
- Service modals: `SET_SERVANTINMODAL`, `SET_SERVEDBYMODAL`
- CRUD modals for users, servants, services

### Theming

Custom Mantine theme defined in `src/theme.ts` with PostCSS configuration for Mantine preset.

## Build Process

The custom Vite plugin in `vite.config.js` performs these tasks on build:
1. Reads current version from `package.json`
2. Increments the patch version (e.g., 1.0.18 → 1.0.19)
3. Updates `package.json` with new version
4. Updates `CACHE_NAME` in both `dist/service-worker.js` and `public/service-worker.js` to match new version

## Important Notes

- The app is in Arabic (RTL) by default but supports English
- User authentication state persists in localStorage
- Redux DevTools are enabled in development mode
- StrictMode causes double renders in development (noted in `src/main.jsx`)
- Many components handle both servant and regular user roles
