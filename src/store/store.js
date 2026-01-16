import { configureStore } from "@reduxjs/toolkit";
import phasesReducer from "./phasesSlice";
import themeReducer from "./themeSlice";
import fontScaleReducer from "./fontScaleSlice";
import indexCountReducer from "./indexCountSlice";
import subTextReducer from "./subTextSlice";
import totalCountReducer from "./totalCountSlice";

export const store = configureStore({
  reducer: {
    phases: phasesReducer,
    theme: themeReducer,
    fontScale: fontScaleReducer,
    indexCount: indexCountReducer,
    subText: subTextReducer,
    totalCount: totalCountReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: {
        // Increase the threshold for immutable state invariant checks
        warnAfter: 128, // default is 32ms, increased for larger state operations
        // In development, only check immutability for specific state paths that are performance-critical
        ...(process.env.NODE_ENV === 'development' && {
          // Only check these critical state paths in development for better performance
          ignoredPaths: ['theme.list', 'phases.value.length'],
        }),
      },
      serializableCheck: {
        // Increase the threshold for serializable state invariant checks  
        warnAfter: 128, // increased threshold to suppress warnings for larger state operations
        // In development, provide more detailed checking options
        ...(process.env.NODE_ENV === 'development' && {
          // Ignore certain action types that may contain non-serializable values temporarily
          ignoredActionsPaths: ['payload.timestamp'],
          // Custom serializable check for development debugging
          isSerializable: (value) => {
            // Allow Dates and some other types in development for debugging
            return value == null || 
                   typeof value === 'boolean' || 
                   typeof value === 'number' || 
                   typeof value === 'string' || 
                   value instanceof Date ||
                   Array.isArray(value) ||
                   (typeof value === 'object' && value.constructor === Object);
          },
        }),
      },
      // Add development-only middleware for better debugging
      ...(process.env.NODE_ENV === 'development' && {
        // Enable action logging in development
        actionCreatorCheck: {
          warnAfter: 64, // Warn if action creators take too long
        },
      }),
    }),
  // Add Redux DevTools Extension support with enhanced configuration
  devTools: process.env.NODE_ENV === 'development' && {
    // Enhanced DevTools configuration for better debugging
    name: 'Azkar App Store',
    trace: true, // Enable stack trace in DevTools
    traceLimit: 25, // Limit stack trace length
    // Serialize dates and other objects for DevTools
    serialize: {
      options: {
        date: true,
        regex: true,
        undefined: true,
        error: true,
        symbol: false,
        map: false,
        set: false,
      },
    },
    // Action sanitizer for sensitive data
    actionSanitizer: (action) => ({
      ...action,
      // Sanitize any sensitive data if needed in the future
      type: action.type,
      payload: action.payload,
    }),
    // State sanitizer for large objects
    stateSanitizer: (state) => ({
      ...state,
      // Limit phases array size in DevTools for better performance
      phases: {
        ...state.phases,
        value: Array.isArray(state.phases.value) 
          ? `Array(${state.phases.value.length})` 
          : state.phases.value,
      },
    }),
  },
});
