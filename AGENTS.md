# Azkar — Agent Notes

## Project Overview

Azkar is a React-based Progressive Web App (PWA) for Islamic daily supplications (Azkar / Adhkar). It is a client-side only single-page application (SPA) with no required backend.

## Tech Stack

- **Framework:** Create React App (CRA) 5.x
- **Runtime:** React 19, React DOM 19
- **Routing:** React Router DOM 7.x (`BrowserRouter`)
- **State:** Redux Toolkit + React Redux
- **Styling:** Tailwind CSS 3.x with custom theme tokens (light / solarized / dark)
- **Icons:** Custom SVG icon components (`src/icons/iconRepo.js`)
- **PWA:** CRA service worker setup (`service-worker.js`, `serviceWorkerRegistration.js`)
- **Package Manager:** npm

## Project Structure

```
public/                 # Static assets copied to build output
  _redirects            # Cloudflare Pages SPA fallback
  index.html
  manifest.json
  robots.txt
  icon512*.png
src/
  App.js                # Root component with ErrorBoundary
  index.js              # Entry point, Redux Provider, theme init
  components/           # React components
  store/                # Redux slices and store configuration
  dataset/              # Azkar JSON data
  icons/                # SVG icon components
  mappers/              # Theme icon mapper
  styles/               # Global CSS and custom fonts
  config/               # App config with env var fallbacks
  utils/                # Utility helpers
```

## Build & Deployment

### Local Development

```bash
npm install
npm start
```

### Production Build

```bash
npm run build
```

Output directory: `build/`

### Cloudflare Pages

The project is configured as a static SPA for Cloudflare Pages:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Build output directory | `build` |
| Framework preset | Create React App |

`public/_redirects` provides the SPA fallback so direct links to React Router paths (e.g. `/category/1`, `/free-tasbih`, `/settings`) serve `index.html`.

There is no `wrangler.toml` currently; deployment settings are managed in the Cloudflare Pages dashboard.

### Deployment Script

`deploy-main.sh` automates merging `dev` into `main` and pushing both branches. It is intended for manual use, not CI.

## Coding Conventions

- Functional React components with hooks
- Redux slices in `src/store/*Slice.js` using Redux Toolkit
- Tailwind utility classes; custom CSS variables drive theme switching
- Theme class is applied to `document.documentElement` (`light`, `solarized`, `dark`)
- Arabic-first UI; text direction is generally RTL
- Use `dvh` units for mobile viewport sizing

## Environment Variables

All are optional and have defaults in `src/config/config.js`:

- `REACT_APP_MIN_FONT_SCALE`
- `REACT_APP_MAX_FONT_SCALE`
- `REACT_APP_DEFAULT_FONT_SCALE`
- `REACT_APP_FONT_SCALE_INCREMENT`
- `REACT_APP_COUNTER_GUARD_MS`
- `REACT_APP_NAV_BUTTON_GUARD_MS`
- `REACT_APP_FREE_TASBIH_TAP_GUARD_MS`
- `REACT_APP_FREE_TASBIH_ANIMATION_MS`
- `REACT_APP_LONG_PRESS_MS`
- `REACT_APP_APP_NAME`
- `REACT_APP_API_URL` (currently unused)

## Notes for Agents

- **No backend required.** The app is fully static. Do not add server-side dependencies unless explicitly requested.
- **Contact form is disabled.** `src/components/ContactMe.js` exists but is no longer imported in `SettingsPage.js`. It previously used Netlify Forms. If re-enabling, implement a Cloudflare Pages Function or external form backend.
- **Service worker is registered in production only.** PWA caching behavior follows CRA defaults.
- **Do not commit the `build/` directory.** It is gitignored.
- **Do not commit `node_modules/`.**
