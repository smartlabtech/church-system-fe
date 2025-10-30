# Installation Guide - Church Management System

## ✅ Installation Successfully Fixed!

The dependency installation issues have been resolved. The application is now running successfully.

## Installation Steps

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Fresh Installation

1. **Clone or navigate to the project**
```bash
cd "/mnt/g/Church System/Church System FE"
```

2. **Install dependencies using npm with legacy peer deps**
```bash
npm install --legacy-peer-deps
```

Note: We use `--legacy-peer-deps` because some packages (like react-qr-reader) don't fully support React 18 yet.

3. **Start the development server**
```bash
npm run dev
```

The application will be available at: **http://localhost:5173/**

## Important Files Created

### `.npmrc`
This file ensures npm always uses legacy peer deps for this project:
```
legacy-peer-deps=true
engine-strict=false
```

## Known Issues & Solutions

### Issue: Yarn install fails with I/O errors
**Solution**: Use npm instead of yarn. The project works perfectly with npm.

### Issue: Peer dependency conflicts
**Solution**: The `.npmrc` file automatically handles this with `legacy-peer-deps=true`

### Issue: Windows file system I/O errors
**Solution**:
1. Delete problematic directories:
```bash
rm -rf node_modules/@esbuild node_modules/@rollup
```
2. Use npm install instead of yarn

## Available Scripts

- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack Versions

### Core Dependencies
- React: 18.3.1
- Mantine UI: 8.3.1 (upgraded from v7)
- Redux Toolkit: 2.5.0
- React Query: 5.81.2
- React Router: 7.0.1
- Vite: 6.0.1

### New Modern Libraries Added
- Framer Motion: 12.19.2 (animations)
- React Hook Form: 7.58.1 (forms)
- Yup: 1.6.1 (validation)
- Date-fns: 4.1.0 (date utilities)
- Recharts: 3.0.2 (charts)
- Lucide React: 0.524.0 (icons)

## Development Server

The application is currently running at:
- Local: **http://localhost:5173/**
- Network: Use `--host` flag to expose on network

## Next Steps

1. **Test the existing application**
   - Navigate to http://localhost:5173/
   - Check if existing pages work

2. **Use the new modern components**
   - To use the new modern routing, rename `App.modern.jsx` to `App.jsx`
   - The new layouts are in `/src/layouts/`
   - New pages are in `/src/pages/`

3. **Continue modernization**
   - Follow the MODERNIZATION_CHECKLIST.md
   - Create missing pages as needed
   - Migrate existing components

## Troubleshooting

### If dev server doesn't start:
1. Kill any existing processes on port 5173
2. Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run dev
```

### If you see Mantine v8 breaking changes:
- The app is configured to handle most v8 changes
- Check Mantine's migration guide if needed
- Use the modern components in `/src/layouts/` as reference

## Success! 🎉

Your Church Management System is now running with:
- ✅ All dependencies installed
- ✅ Modern Mantine v8
- ✅ Development server running
- ✅ Ready for modernization

Visit **http://localhost:5173/** to see your application!