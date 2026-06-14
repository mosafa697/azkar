# Azkar App - AI Coding Instructions

## Project Overview
React PWA for Islamic supplications (azkar) with counter tracking, offline support, swipe navigation, theme switching, long-press copy, and search. Built with React 19, Redux Toolkit, React Router v7, and Create React App.

## Architecture & Data Flow

### State Management (Redux Toolkit)
All app state is managed through Redux slices in `src/store`:
- `phasesSlice.js`: Holds the current category's phrase array, shuffle toggle, `wasShuffled` flag, and reset logic.
- `indexCountSlice.js`: Tracks the current phrase index, total phrase length, and whether the current phrase is last.
- `totalCountSlice.js`: Tracks cumulative tap count across all phrases and persists it to storage.
- `themeSlice.js`: Manages the selected theme and persists it to storage.
- `fontScaleSlice.js`: Manages font scaling with range and increment config, persisted to localStorage.
- `subTextSlice.js`: Toggles showing phrase subtext and persists the preference.

Pattern:
- `themeSlice` and `totalCountSlice` use the centralized helper in `src/utils/localStorage.js`.
- `fontScaleSlice`, `subTextSlice`, and `phasesSlice` access `localStorage` directly for persistence.
- `CategoryAzkar.js` uses `sessionStorage` to remember the active index per category.

### Component Hierarchy
```
App
└── ErrorBoundary
    └── AzkarApp (Router)
         ├── CategoriesPage -> Categories
         ├── CategoryPage -> CategoryAzkar
         │    └── ZekrCard
         │         ├── ZekrCounter
         │         └── SubPhrase
         └── SettingsPageWrapper -> SettingsPage
```

### Data Loading Pattern
1. Static JSON data is loaded from `src/dataset/azkar-sample.json`.
2. `src/mappers/azkarMapper.js` normalizes the dataset into category and phrase objects.
3. `azkar.json` exists in the repo but is currently commented out in the mapper.
4. Selecting a category loads its phrases into `phasesSlice` and sets phrase length state.
5. `sessionStorage` retains the current phrase index for each category so users can resume.

### Navigation & Routing
- `src/components/AzkarApp.js` configures React Router v7.
- Routes:
  - `/` → `CategoriesPage`
  - `/category/:categoryId` → `CategoryPage`
  - `/settings` → `SettingsPageWrapper`
- Wrapper components use `useNavigate()` and `useParams()` and pass callbacks to presentational components.

## Key Patterns & Conventions

### LocalStorage Utility (`src/utils/localStorage.js`)
- Centralized helper with safe reads/writes and an in-memory fallback when `localStorage` is unavailable.
- Exports helper functions for strings, booleans, numbers, JSON, and storage diagnostics.
- Enables `themeSlice` and `totalCountSlice` to persist safely.
- Note: not all slices currently use the helper; some still access `localStorage` directly.

### Swipe Navigation (`src/components/ZekrCard.js`)
Uses `react-swipeable` with a custom `useSwipeNavigation` hook:
- `SWIPE_DAMPENING = 0.5`
- `SWIPE_ANIMATION_DURATION = 200`
- `SWIPE_THRESHOLD = 50`
- `onSwipedLeft` and `onSwipedRight` dispatch phrase navigation actions after animation.
- `ZekrCard` also supports long-press copy-to-clipboard and font-size controls.

### Phrase Interaction
- `CategoryAzkar.js` tracks phrase click count in local component state.
- When the click count reaches the phrase `count`, it advances to the next phrase after 300ms.
- `CategoryAzkar.js` also resets state and clears saved index when navigating back.

### Settings and Theme
- `SettingsPage.js` controls:
  - theme selection
  - shuffle toggle
  - subtext visibility toggle
  - total count reset
- It applies the selected theme class to `document.documentElement`.

### Store Middleware and DevTools
`src/store/store.js` configures `configureStore` with:
- custom immutable and serializable checks
- higher `warnAfter` thresholds in development
- custom serializability logic that permits Dates and plain objects
- enhanced Redux DevTools setup with tracing and state sanitization

## Development Workflows

### Running & Building
```bash
npm start
npm run build
```

### Configuration
- Font config is defined in `src/config/config.js`:
  - `minScale` default `1.4`
  - `maxScale` default `4.0`
  - `defaultScale` default `2.8`
  - `scaleIncrement` default `0.2`
- Theme classes are applied via root element class names.
- `src/index.js` loads saved theme from localStorage and registers the service worker.

## Common Gotchas

1. `sessionStorage` is used for category-specific phrase index persistence, while global settings persist in `localStorage`.
2. Phrase advancement in `CategoryAzkar.js` uses a 300ms delay after the current phrase reaches its count.
3. `phasesSlice.toggleShuffle` persists shuffle mode and resets `wasShuffled` when shuffle is disabled.
4. Only `themeSlice` and `totalCountSlice` currently use the centralized `src/utils/localStorage.js` helper consistently.
5. The active data source is `azkar-sample.json`; `azkar.json` is present but commented out.

## Adding New Features

### New Redux State
1. Create a new slice in `src/store`.
2. Add the reducer to `src/store/store.js`.
3. Export actions and use them in components.

### New Theme
1. Add a theme name to `themeSlice.list`.
2. Add corresponding CSS styles for the theme.
3. Update `src/mappers/themeIconsMapper.js` if you add a new icon.

### New Setting
Add UI to `SettingsPage.js`, dispatch slice actions, and persist the setting using the storage helper or direct `localStorage` as appropriate.
