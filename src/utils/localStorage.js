// Centralized localStorage utility with error handling and fallbacks

// In-memory fallbacks for when localStorage is unavailable
const memoryStorage = new Map();

/**
 * Check if localStorage is available and working
 * @returns {boolean} true if localStorage is available
 */
let _localStorageAvailable = null;

/**
 * Check if localStorage is available and working (cached after first check)
 * @returns {boolean} true if localStorage is available
 */
export const isLocalStorageAvailable = () => {
  if (_localStorageAvailable !== null) {
    return _localStorageAvailable;
  }
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    _localStorageAvailable = true;
  } catch (error) {
    _localStorageAvailable = false;
  }
  return _localStorageAvailable;
};

/**
 * Safely get an item from localStorage with fallback to memory storage
 * @param {string} key - The localStorage key
 * @param {string|null} defaultValue - Default value if key doesn't exist
 * @returns {string|null} The stored value or default value
 */
export const getItem = (key, defaultValue = null) => {
  try {
    if (!isLocalStorageAvailable()) {
      // Use memory fallback
      return memoryStorage.get(key) ?? defaultValue;
    }
    
    const value = localStorage.getItem(key);
    // Update memory fallback with current value
    if (value !== null) {
      memoryStorage.set(key, value);
    }
    return value ?? defaultValue;
  } catch (error) {
    console.warn(`Error reading from localStorage key "${key}":`, error.message);
    return memoryStorage.get(key) ?? defaultValue;
  }
};

/**
 * Safely set an item in localStorage with fallback to memory storage
 * @param {string} key - The localStorage key
 * @param {string} value - The value to store
 * @returns {boolean} true if successfully stored in localStorage, false if using fallback
 */
export const setItem = (key, value) => {
  try {
    // Always update memory fallback
    memoryStorage.set(key, value);
    
    if (!isLocalStorageAvailable()) {
      // localStorage unavailable, but memory fallback is updated
      return false;
    }
    
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`Error saving to localStorage key "${key}":`, error.message);
    // Memory fallback was already updated above
    return false;
  }
};

/**
 * Safely remove an item from localStorage and memory storage
 * @param {string} key - The localStorage key
 * @returns {boolean} true if successfully removed from localStorage
 */
export const removeItem = (key) => {
  try {
    // Remove from memory fallback
    memoryStorage.delete(key);
    
    if (!isLocalStorageAvailable()) {
      return false;
    }
    
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Error removing from localStorage key "${key}":`, error.message);
    return false;
  }
};

/**
 * Get a boolean value from localStorage
 * @param {string} key - The localStorage key
 * @param {boolean} defaultValue - Default value if key doesn't exist
 * @returns {boolean} The stored boolean value or default
 */
export const getBooleanItem = (key, defaultValue = false) => {
  const value = getItem(key);
  if (value === null) return defaultValue;
  if (value === 'true') return true;
  if (value === 'false') return false;
  // Accept "1" or "0" as boolean values
  if (value === '1') return true;
  if (value === '0') return false;
  return defaultValue;
}

/**
 * Get a number value from localStorage
 * @param {string} key - The localStorage key
 * @param {number} defaultValue - Default value if key doesn't exist or is invalid
 * @returns {number} The stored number value or default
 */
export const getNumberItem = (key, defaultValue = 0) => {
  const value = getItem(key);
  if (value === null) return defaultValue;
  // Only accept strings that represent a valid number (integer or float)
  if (!/^[-+]?\d*\.?\d+(e[-+]?\d+)?$/.test(value.trim())) return defaultValue;
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Set a boolean value in localStorage
 * @param {string} key - The localStorage key
 * @param {boolean} value - The boolean value to store
 * @returns {boolean} true if successfully stored
 */
export const setBooleanItem = (key, value) => {
  return setItem(key, value.toString());
};

/**
 * Set a number value in localStorage
 * @param {string} key - The localStorage key
 * @param {number} value - The number value to store
 * @returns {boolean} true if successfully stored
 */
export const setNumberItem = (key, value) => {
  return setItem(key, value.toString());
};

/**
 * Get a JSON object from localStorage
 * @param {string} key - The localStorage key
 * @param {*} defaultValue - Default value if key doesn't exist or parsing fails
 * @returns {*} The parsed object or default value
 */
export const getJsonItem = (key, defaultValue = null) => {
  const value = getItem(key);
  if (value === null) return defaultValue;
  
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn(`Error parsing JSON from localStorage key "${key}":`, error.message);
    return defaultValue;
  }
};

/**
 * Set a JSON object in localStorage
 * @param {string} key - The localStorage key
 * @param {*} value - The object to store as JSON
 * @returns {boolean} true if successfully stored
 */
export const setJsonItem = (key, value) => {
  try {
    const jsonString = JSON.stringify(value);
    return setItem(key, jsonString);
  } catch (error) {
    console.warn(`Error stringifying JSON for localStorage key "${key}":`, error.message);
    // Still update memory fallback with original value if possible
    if (isLocalStorageAvailable()) {
      memoryStorage.set(key, value);
    }
    return false;
  }
};

/**
 * Get storage statistics (for debugging and monitoring)
 * @returns {Object} Storage usage information
 */
export const getStorageStats = () => {
  const stats = {
    isLocalStorageAvailable: isLocalStorageAvailable(),
    memoryStorageKeys: Array.from(memoryStorage.keys()),
    localStorageSize: 0,
    memoryStorageSize: memoryStorage.size,
  };

  if (stats.isLocalStorageAvailable) {
    try {
      // Estimate localStorage usage
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += key.length + (localStorage[key] || '').length;
        }
      }
      stats.localStorageSize = totalSize;
      stats.localStorageKeys = Object.keys(localStorage).length;
    } catch (error) {
      stats.localStorageError = error.message;
    }
  }

  return stats;
};

/**
 * Clear all storage (both localStorage and memory fallback)
 * @param {string} prefix - Optional prefix to clear only keys starting with this
 * @returns {boolean} true if localStorage clear succeeded
 */
export const clearStorage = (prefix = '') => {
  let localStorageCleared = true;

  // Clear memory storage
  if (prefix) {
    for (const [key] of memoryStorage) {
      if (key.startsWith(prefix)) {
        memoryStorage.delete(key);
      }
    }
  } else {
    memoryStorage.clear();
  }

  // Clear localStorage
  if (isLocalStorageAvailable()) {
    try {
      if (prefix) {
        // Clear keys with prefix
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      } else {
        localStorage.clear();
      }
    } catch (error) {
      console.warn('Error clearing localStorage:', error.message);
      localStorageCleared = false;
    }
  } else {
    localStorageCleared = false;
  }

  return localStorageCleared;
};

const storageUtils = {
  getItem,
  setItem,
  removeItem,
  getBooleanItem,
  getNumberItem,
  setBooleanItem,
  setNumberItem,
  getJsonItem,
  setJsonItem,
  getStorageStats,
  clearStorage,
  isLocalStorageAvailable
};

export default storageUtils;