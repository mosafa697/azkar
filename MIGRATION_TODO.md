# CSS to Tailwind/Bootstrap Migration - TODO List

## Overview
Migrate from custom CSS (App.css, index.css) to Tailwind CSS or Bootstrap while preserving three-theme system (light/solarized/dark) and Arabic RTL support.

---

## Phase 1: Setup & Configuration
- [x] **1.1** Choose framework: Tailwind (recommended) or Bootstrap - **DONE**
- [x] **1.2** Extend tailwind.config.js with theme variants and custom utilities - **DONE**
  - [x] Add theme color definitions for light/solarized/dark - **DONE**
  - [x] Configure RTL support - **DONE**
  - [x] Add custom animations (pop, fadeIn) - **DONE**
  - [x] Define breakpoints if needed - **DONE**
- [x] **1.3** Migrate global styles from index.css - **DONE**
  - [x] Add @font-face for ScheherazadeNew - **DONE**
  - [x] Configure RTL direction globally - **DONE**
  - [x] Add font smoothing properties - **DONE**

---

## Phase 2: Component Style Migration

### 2.1 Categories.js
- [x] Replace `.container` with Tailwind/Bootstrap utilities
- [x] Replace `.card` with framework card classes
- [x] Replace `.category-btn` with button utilities
- [x] Replace `.search-input` with input utilities
- [x] Replace `.categories-container` with grid/flexbox utilities
- [x] Verify search and responsive grid at 480px breakpoint

### 2.2 ZekrCard.js (High Priority - Complex Inline Styles)
- [x] Replace `.zekr-container`, `.zekr-card`, `.controls-container` with utilities
- [x] Replace `.phrase` class with utilities (keep inline `fontSize` and `transform` for dynamic behavior)
- [x] Migrate progress bar width inline style to utility classes
- [x] Migrate swipe animation (transform, opacity, transition) - keep as inline styles
- [x] Replace visibility toggles with framework utilities or conditional classes
- [x] Test swipe navigation and dampening on mobile

### 2.3 SettingsPage.js
- [x] Replace `.setting-card`, `.setting-item` with utilities
- [x] Replace `.slider` and `.switch` with framework equivalents
- [x] Replace `.theme-btn` with button utilities
- [x] Migrate theme-dependent border colors from inline styles to utility classes
- [x] Verify theme button appearance for all three themes

### 2.4 ZekrCounter.js
- [x] Replace `.zekr-counter`, `.counter-btn` with utilities
- [x] Replace `.bounce` animation class with framework animation
- [x] Verify pop animation works correctly

### 2.5 SubPhase.js
- [x] Replace `.sub-phrase` with utilities
- [x] **Fix bug**: Change `fontScale` to `fontSize` in inline style
- [x] Keep `fontSize` inline style for dynamic font scaling
- [x] Test subtitle rendering with font scaling

### 2.6 ContactMe.js
- [x] Review and replace any CSS classes with utilities
- [x] Migrate fadeIn animation if used

### 2.7 ErrorBoundary.js
- [x] Review and replace any CSS classes (likely minimal)

---

## Phase 3: Dynamic & Inline Styles

- [x] **3.1** Font scaling (`fontSize: ${fontScale}dvh`)
  - [x] Keep as inline style OR convert to Tailwind arbitrary values
  - [x] Test across all font scale settings (1.4-4.0)
  
- [x] **3.2** Swipe transforms and transitions
  - [x] Keep inline for performance
  - [x] Verify transform: translateX() works with framework
  
- [x] **3.3** Progress bar percentage width
  - [x] Convert to utility class with dynamic calculation
  
- [x] **3.4** Visibility/display toggles
  - [x] Use framework utilities (hidden, block, etc.) with conditional classes

---

## Phase 4: Theme System Integration

- [ ] **4.1** Verify CSS variables work with chosen framework
  - [ ] Test `:root.light`, `:root.solarized`, `:root.dark` class switching
  - [ ] Ensure theme change updates all components
  
- [ ] **4.2** Update themeSlice.js if needed for framework compatibility
  - [ ] Test theme persistence from localStorage
  - [ ] Test theme switching in SettingsPage

---

## Phase 5: Testing & Cleanup

### 5.1 Functional Testing
- [ ] Switch between all three themes - verify colors update
- [ ] Test swipe navigation on mobile and desktop
- [ ] Test font scaling across range (1.4-4.0)
- [ ] Test responsive grid at 480px breakpoint
- [ ] Verify animations (bounce, fade) work smoothly
- [ ] Test Arabic text rendering and RTL layout

### 5.2 Browser Compatibility
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Verify mobile responsiveness (iOS Safari, Chrome Mobile)
- [ ] Check for console errors or warnings

### 5.3 Performance
- [ ] Check bundle size (Tailwind vs Bootstrap)
- [ ] Verify no unused CSS (PurgeCSS for Tailwind)
- [ ] Test page load time

### 5.4 Cleanup
- [ ] Delete src/styles/App.css
- [ ] Delete src/styles/index.css
- [ ] Remove unused imports from components
- [ ] Update src/index.js if it references deleted CSS files

---

## Phase 6: Final Verification

- [ ] Run `npm start` - no errors in console
- [ ] Run `npm run build` - build completes successfully
- [ ] Test built app (`npm install -g serve` → `serve -s build`)
- [ ] Verify service worker and PWA functionality
- [ ] All features working: categories, counters, settings, themes

---

## Notes

- **Inline Styles to Keep**: Font scaling (`fontSize`), swipe transforms, dynamic widths - these are not CSS file usage
- **CSS Variables**: Maintain as part of theme system, integrate with framework
- **RTL Support**: Critical for Arabic text - verify throughout migration
- **Performance**: Tailwind preferred for smaller bundle; Bootstrap has larger CSS
- **Bootstrap Alternative**: If using Bootstrap, use CSS variable overrides instead of Tailwind arbitrary values

---

## Blockers & Considerations

- [ ] Ensure Tailwind/Bootstrap don't conflict with existing index.css global styles
- [ ] Verify theme switching doesn't have race conditions
- [ ] Check mobile responsiveness on actual devices, not just browser dev tools
- [ ] Consider performance impact of theme switching animations
