# Azkar App - AI Coding Instructions

## Project Overview
React PWA for Islamic supplications (azkar) with counter tracking, offline support, swipe navigation, and theming. Built with React 19, Redux Toolkit, and React Router v7.

## Architecture & Data Flow

### State Management (Redux Toolkit)
All state is managed through Redux slices in [src/store](src/store):
- **phasesSlice**: Holds current category's phrases array, shuffle state, tracks if shuffled
- **indexCountSlice**: Current phrase index, total phrases length, isLastPhrase flag
- **totalCountSlice**: Cumulative counter across all interactions
- **themeSlice**: Theme selection (light/solarized/dark) - persisted to localStorage
- **fontScaleSlice**: Font size scale (1.4-4.0, default 2.8) with 0.2 increments
- **subTextSlice**: Toggle for showing/hiding phrase subtexts

**Pattern**: Each slice uses localStorage for persistence (except phases which uses sessionStorage for index tracking per category).

### Component Hierarchy
```
App (ErrorBoundary wrapper)
└── AzkarApp (Router)
    ├── Categories (home page, category selection)
    ├── CategoryAzkar (phrase navigation, state orchestration)
    │   └── ZekrCard (UI display, swipe handling)
    │       ├── ZekrCounter (click counter display)
    │       └── SubPhrase (optional subtext display)
    └── SettingsPage (theme, font, shuffle, subtext toggles)
```

### Data Loading Pattern
1. Static JSON data in [src/dataset/azkar-sample.json](src/dataset/azkar-sample.json) (Arabic phrases with counts)
2. Mapped via [azkarMapper.js](src/mappers/azkarMapper.js) to normalize structure
3. Imported as static constant `azkar` - no API calls
4. On category selection: phrases loaded into Redux `phasesSlice`, optionally shuffled
5. SessionStorage tracks phrase index per category for resume-on-return

### Navigation & Routing
React Router v7 with programmatic navigation:
- `/` - Categories page
- `/category/:categoryId` - Phrase reading view
- `/settings` - Configuration page

**Important**: Navigation uses wrapper components (CategoriesPage, CategoryPage) that consume router hooks and pass callbacks to presentational components.

## Key Patterns & Conventions

### LocalStorage Utility ([src/utils/localStorage.js](src/utils/localStorage.js))
- **Never** access localStorage directly in components
- Use centralized utility with fallback to in-memory Map for SSR/privacy mode
- Exported functions: `getItem()`, `setItem()`, `removeItem()`, `isLocalStorageAvailable()`
- All Redux slices use this pattern for persistence

### Testing Setup ([src/tests/test-utils.js](src/tests/test-utils.js))
Custom `render()` wrapper required for all component tests:
```javascript
import { render, screen } from '../test-utils';  // Not from @testing-library/react
```
- Auto-wraps with Redux Provider + MemoryRouter
- Accepts `preloadedState` for Redux state setup
- Returns `{ store, ...renderResult }` for store inspection
- Mock localStorage/sessionStorage in beforeEach

### Swipe Navigation ([ZekrCard.js](src/components/ZekrCard.js))
Uses `react-swipeable` for phrase navigation:
- Custom hook `useSwipeNavigation` encapsulates swipe logic
- Dampening factor: 0.5x swipe distance for visual feedback
- Threshold: 50px before triggering navigation
- Animation: 200ms CSS transform on swipe complete
- Dispatches Redux actions (incrementIndex/decrementIndex) after animation

### Performance Optimizations
1. **Redux middleware config** ([store.js](src/store/store.js#L19-L50)):
   - Increased warnAfter thresholds (128ms vs 32ms default)
   - Ignored paths for immutable checks in development
   - Custom serializability check allowing Dates

2. **React hooks**:
   - `useCallback` for event handlers passed to children
   - Multiple `useEffect` hooks for separation of concerns (avoid one giant effect)

## Development Workflows

### Running & Building
```bash
npm start          # Dev server on localhost:3000
npm test           # Interactive test watch mode
npm run test:coverage  # Coverage report (70% threshold for all metrics)
npm run build      # Production build to /build directory
```

### Testing Requirements
- Coverage thresholds enforced: 70% branches/functions/lines/statements
- Excluded from coverage: index.js, service workers, reportWebVitals, setupTests, test files
- **Always** use custom test-utils render, never direct RTL import
- Mock azkarMapper in tests - see [CategoryAzkar.test.js](src/tests/components/CategoryAzkar.test.js#L7-L48)
- Use `jest.useFakeTimers()` for animation tests with setTimeout
- Clear localStorage/sessionStorage in beforeEach hooks

### Configuration
- Font scale config in [src/config/config.js](src/config/config.js) - supports env vars but has sensible defaults
- Tailwind with darkMode: "class" - themes applied via className toggle
- Service worker registered in [src/index.js](src/index.js) for PWA offline support

## Common Gotchas

1. **Session vs Local Storage**: Index position uses sessionStorage (per-category), settings use localStorage (global)
2. **Phrase Counter Logic** ([CategoryAzkar.js](src/components/CategoryAzkar.js#L64-L76)): Click increments local array, auto-advances to next phrase when count === phrase.count
3. **Shuffle Timing**: Only shuffles on first load when shuffle setting enabled (wasShuffled flag prevents re-shuffle)
4. **Router Version**: React Router v7 uses different patterns than v6 (useNavigate, not history)
5. **Dataset**: Currently uses azkar-sample.json - full dataset available but commented out in mapper

## Adding New Features

### New Redux State
1. Create slice in [src/store](src/store) following existing patterns (localStorage persistence if needed)
2. Add reducer to [store.js](src/store/store.js) configureStore
3. Update [test-utils.js](src/tests/test-utils.js) defaultState
4. Export actions from slice, import in components

### New Theme
1. Add theme name to themeSlice.list
2. Create CSS classes in [src/styles/App.css](src/styles/App.css)
3. Update themeIconsMapper if adding icons

### New Setting
Add to SettingsPage with Redux dispatch pattern - see existing toggles for font/theme/shuffle/subtext.
