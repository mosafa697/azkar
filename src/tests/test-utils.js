import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

// Import all reducers
import phasesReducer from '../store/phasesSlice';
import themeReducer from '../store/themeSlice';
import fontScaleReducer from '../store/fontScaleSlice';
import indexCountReducer from '../store/indexCountSlice';
import subTextReducer from '../store/subTextSlice';
import totalCountReducer from '../store/totalCountSlice';

// Default state for testing
export const defaultState = {
  phases: {
    value: [],
    shuffle: false,
    wasShuffled: false,
  },
  theme: {
    value: 'light',
    list: ['light', 'solarized', 'dark'],
  },
  fontScale: {
    value: 2.8,
  },
  indexCount: {
    value: 0,
    phasesLength: 0,
    isLastPhrase: false,
  },
  subText: {
    value: false,
  },
  totalCount: {
    value: 0,
  },
};

// Custom render function with Redux Provider and Router
function render(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        phases: phasesReducer,
        theme: themeReducer,
        fontScale: fontScaleReducer,
        indexCount: indexCountReducer,
        subText: subTextReducer,
        totalCount: totalCountReducer,
      },
      preloadedState: { ...defaultState, ...preloadedState },
    }),
    initialEntries = ['/'],
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>
          {children}
        </MemoryRouter>
      </Provider>
    );
  }
  return { 
    ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
    store 
  };
}

// Create a test store with specific state
export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      phases: phasesReducer,
      theme: themeReducer,
      fontScale: fontScaleReducer,
      indexCount: indexCountReducer,
      subText: subTextReducer,
      totalCount: totalCountReducer,
    },
    preloadedState: { ...defaultState, ...preloadedState },
  });
}

// Re-export everything
export * from '@testing-library/react';
export { render };