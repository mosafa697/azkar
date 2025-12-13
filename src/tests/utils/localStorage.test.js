import {
  isLocalStorageAvailable,
  getItem,
  setItem,
  removeItem,
  getBooleanItem,
  setBooleanItem,
  getNumberItem,
  setNumberItem,
  getJsonItem,
  setJsonItem,
  getStorageStats,
  clearStorage,
} from '../../utils/localStorage';

describe('localStorage Utility', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('isLocalStorageAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(isLocalStorageAvailable()).toBe(true);
    });

    it('should cache availability check result', () => {
      const spy = jest.spyOn(Storage.prototype, 'setItem');
      
      // First call
      isLocalStorageAvailable();
      const firstCallCount = spy.mock.calls.length;
      
      // Second call should use cached result
      isLocalStorageAvailable();
      const secondCallCount = spy.mock.calls.length;
      
      // Should not call setItem again on second check
      expect(secondCallCount).toBe(firstCallCount);
      
      spy.mockRestore();
    });

    it('should return false when localStorage throws error', () => {
      const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      
      // Reset cache by reloading module
      jest.resetModules();
      const { isLocalStorageAvailable: freshCheck } = require('../../utils/localStorage');
      
      expect(freshCheck()).toBe(false);
      
      spy.mockRestore();
    });
  });

  describe('getItem', () => {
    it('should retrieve existing value from localStorage', () => {
      localStorage.setItem('test-key', 'test-value');
      
      expect(getItem('test-key')).toBe('test-value');
    });

    it('should return null for non-existent key', () => {
      expect(getItem('non-existent')).toBe(null);
    });

    it('should return default value when key does not exist', () => {
      expect(getItem('non-existent', 'default')).toBe('default');
    });

    it('should return default value when localStorage is unavailable', () => {
      const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });
      
      // When localStorage is unavailable AND no memory fallback exists
      const result = getItem('non-existent-key', 'fallback');
      expect(result).toBe('fallback');
      
      spy.mockRestore();
    });

    it('should use memory fallback when localStorage throws error', () => {
      // First set a value successfully
      setItem('test-key', 'memory-value');
      
      // Then make localStorage unavailable
      const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      const result = getItem('test-key');
      expect(result).toBe('memory-value');
      
      spy.mockRestore();
    });

    it('should sync memory fallback with localStorage value', () => {
      localStorage.setItem('sync-key', 'sync-value');
      
      // First get updates memory
      getItem('sync-key');
      
      // If localStorage fails, memory fallback should have the value
      const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      expect(getItem('sync-key')).toBe('sync-value');
      
      spy.mockRestore();
    });
  });

  describe('setItem', () => {
    it('should store value in localStorage', () => {
      const result = setItem('test-key', 'test-value');
      
      expect(result).toBe(true);
      expect(localStorage.getItem('test-key')).toBe('test-value');
    });

    it('should update existing value', () => {
      setItem('test-key', 'old-value');
      setItem('test-key', 'new-value');
      
      expect(localStorage.getItem('test-key')).toBe('new-value');
    });

    it('should return false when localStorage is unavailable', () => {
      const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      
      const result = setItem('test-key', 'value');
      
      expect(result).toBe(false);
      
      spy.mockRestore();
    });

    it('should update memory fallback even when localStorage fails', () => {
      const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      setItem('memory-key', 'memory-value');
      
      // Should still be retrievable from memory
      spy.mockRestore();
      const getSpy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      expect(getItem('memory-key')).toBe('memory-value');
      
      getSpy.mockRestore();
    });

    it('should handle quota exceeded error gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        const error = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      });
      
      const result = setItem('large-key', 'x'.repeat(10000000));
      
      expect(result).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalled();
      
      spy.mockRestore();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('removeItem', () => {
    it('should remove item from localStorage', () => {
      localStorage.setItem('test-key', 'test-value');
      
      const result = removeItem('test-key');
      
      expect(result).toBe(true);
      expect(localStorage.getItem('test-key')).toBe(null);
    });

    it('should remove item from memory fallback', () => {
      setItem('test-key', 'test-value');
      removeItem('test-key');
      
      // Make localStorage unavailable
      const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      expect(getItem('test-key')).toBe(null);
      
      spy.mockRestore();
    });

    it('should return false when localStorage is unavailable', () => {
      const spy = jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      const result = removeItem('test-key');
      
      expect(result).toBe(false);
      
      spy.mockRestore();
    });

    it('should handle removing non-existent key', () => {
      const result = removeItem('non-existent');
      
      expect(result).toBe(true);
    });
  });

  describe('getBooleanItem', () => {
    it('should return true for "true" string', () => {
      localStorage.setItem('bool-key', 'true');
      
      expect(getBooleanItem('bool-key')).toBe(true);
    });

    it('should return false for "false" string', () => {
      localStorage.setItem('bool-key', 'false');
      
      expect(getBooleanItem('bool-key')).toBe(false);
    });

    it('should return true for "1" string', () => {
      localStorage.setItem('bool-key', '1');
      
      expect(getBooleanItem('bool-key')).toBe(true);
    });

    it('should return false for "0" string', () => {
      localStorage.setItem('bool-key', '0');
      
      expect(getBooleanItem('bool-key')).toBe(false);
    });

    it('should return default value for non-existent key', () => {
      expect(getBooleanItem('non-existent', true)).toBe(true);
      expect(getBooleanItem('non-existent', false)).toBe(false);
    });

    it('should return default value for invalid boolean string', () => {
      localStorage.setItem('bool-key', 'invalid');
      
      expect(getBooleanItem('bool-key', true)).toBe(true);
    });

    it('should default to false when no default provided', () => {
      expect(getBooleanItem('non-existent')).toBe(false);
    });
  });

  describe('setBooleanItem', () => {
    it('should store true as "true" string', () => {
      setBooleanItem('bool-key', true);
      
      expect(localStorage.getItem('bool-key')).toBe('true');
    });

    it('should store false as "false" string', () => {
      setBooleanItem('bool-key', false);
      
      expect(localStorage.getItem('bool-key')).toBe('false');
    });

    it('should return true on successful storage', () => {
      const result = setBooleanItem('bool-key', true);
      
      expect(result).toBe(true);
    });
  });

  describe('getNumberItem', () => {
    it('should retrieve integer value', () => {
      localStorage.setItem('num-key', '42');
      
      expect(getNumberItem('num-key')).toBe(42);
    });

    it('should retrieve float value', () => {
      localStorage.setItem('num-key', '3.14');
      
      expect(getNumberItem('num-key')).toBe(3.14);
    });

    it('should retrieve negative number', () => {
      localStorage.setItem('num-key', '-10');
      
      expect(getNumberItem('num-key')).toBe(-10);
    });

    it('should retrieve scientific notation', () => {
      localStorage.setItem('num-key', '1e5');
      
      expect(getNumberItem('num-key')).toBe(100000);
    });

    it('should return default value for non-existent key', () => {
      expect(getNumberItem('non-existent', 99)).toBe(99);
    });

    it('should return default value for invalid number string', () => {
      localStorage.setItem('num-key', 'not-a-number');
      
      expect(getNumberItem('num-key', 42)).toBe(42);
    });

    it('should return default value for empty string', () => {
      localStorage.setItem('num-key', '');
      
      expect(getNumberItem('num-key', 10)).toBe(10);
    });

    it('should default to 0 when no default provided', () => {
      expect(getNumberItem('non-existent')).toBe(0);
    });

    it('should handle zero correctly', () => {
      localStorage.setItem('num-key', '0');
      
      expect(getNumberItem('num-key')).toBe(0);
    });

    it('should reject strings with letters', () => {
      localStorage.setItem('num-key', '123abc');
      
      expect(getNumberItem('num-key', 50)).toBe(50);
    });

    it('should handle whitespace in number strings', () => {
      localStorage.setItem('num-key', '  42  ');
      
      expect(getNumberItem('num-key')).toBe(42);
    });
  });

  describe('setNumberItem', () => {
    it('should store integer as string', () => {
      setNumberItem('num-key', 42);
      
      expect(localStorage.getItem('num-key')).toBe('42');
    });

    it('should store float as string', () => {
      setNumberItem('num-key', 3.14);
      
      expect(localStorage.getItem('num-key')).toBe('3.14');
    });

    it('should store negative number', () => {
      setNumberItem('num-key', -10);
      
      expect(localStorage.getItem('num-key')).toBe('-10');
    });

    it('should return true on successful storage', () => {
      const result = setNumberItem('num-key', 100);
      
      expect(result).toBe(true);
    });
  });

  describe('getJsonItem', () => {
    it('should retrieve and parse JSON object', () => {
      const obj = { name: 'test', value: 42 };
      localStorage.setItem('json-key', JSON.stringify(obj));
      
      expect(getJsonItem('json-key')).toEqual(obj);
    });

    it('should retrieve and parse JSON array', () => {
      const arr = [1, 2, 3, 4, 5];
      localStorage.setItem('json-key', JSON.stringify(arr));
      
      expect(getJsonItem('json-key')).toEqual(arr);
    });

    it('should return default value for non-existent key', () => {
      const defaultObj = { default: true };
      
      expect(getJsonItem('non-existent', defaultObj)).toEqual(defaultObj);
    });

    it('should return default value for malformed JSON', () => {
      localStorage.setItem('json-key', '{invalid json}');
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      expect(getJsonItem('json-key', { fallback: true })).toEqual({ fallback: true });
      expect(consoleWarnSpy).toHaveBeenCalled();
      
      consoleWarnSpy.mockRestore();
    });

    it('should default to null when no default provided', () => {
      expect(getJsonItem('non-existent')).toBe(null);
    });

    it('should handle nested objects', () => {
      const nested = {
        level1: {
          level2: {
            level3: 'deep'
          }
        }
      };
      localStorage.setItem('json-key', JSON.stringify(nested));
      
      expect(getJsonItem('json-key')).toEqual(nested);
    });

    it('should handle null value', () => {
      localStorage.setItem('json-key', 'null');
      
      expect(getJsonItem('json-key')).toBe(null);
    });

    it('should handle empty object', () => {
      localStorage.setItem('json-key', '{}');
      
      expect(getJsonItem('json-key')).toEqual({});
    });
  });

  describe('setJsonItem', () => {
    it('should stringify and store JSON object', () => {
      const obj = { name: 'test', value: 42 };
      
      setJsonItem('json-key', obj);
      
      expect(JSON.parse(localStorage.getItem('json-key'))).toEqual(obj);
    });

    it('should stringify and store JSON array', () => {
      const arr = [1, 2, 3];
      
      setJsonItem('json-key', arr);
      
      expect(JSON.parse(localStorage.getItem('json-key'))).toEqual(arr);
    });

    it('should return true on successful storage', () => {
      const result = setJsonItem('json-key', { test: true });
      
      expect(result).toBe(true);
    });

    it('should handle circular references gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const circular = { a: 1 };
      circular.self = circular;
      
      const result = setJsonItem('json-key', circular);
      
      expect(result).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalled();
      
      consoleWarnSpy.mockRestore();
    });

    it('should handle null value', () => {
      setJsonItem('json-key', null);
      
      expect(localStorage.getItem('json-key')).toBe('null');
    });

    it('should handle undefined by storing "undefined" string', () => {
      setJsonItem('json-key', undefined);
      
      // JSON.stringify(undefined) returns undefined, but setItem converts it to "undefined" string
      expect(localStorage.getItem('json-key')).toBe('undefined');
    });
  });

  describe('getStorageStats', () => {
    it('should return storage statistics', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      
      const stats = getStorageStats();
      
      expect(stats).toHaveProperty('isLocalStorageAvailable');
      expect(stats).toHaveProperty('memoryStorageKeys');
      expect(stats).toHaveProperty('localStorageSize');
      expect(stats).toHaveProperty('memoryStorageSize');
    });

    it('should report localStorage as available', () => {
      const stats = getStorageStats();
      
      expect(stats.isLocalStorageAvailable).toBe(true);
    });

    it('should count localStorage keys', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      localStorage.setItem('key3', 'value3');
      
      const stats = getStorageStats();
      
      expect(stats.localStorageKeys).toBe(3);
    });

    it('should calculate localStorage size', () => {
      localStorage.setItem('a', 'b');
      
      const stats = getStorageStats();
      
      expect(stats.localStorageSize).toBeGreaterThan(0);
    });

    it('should list memory storage keys', () => {
      // Force memory storage usage
      setItem('memory-key', 'value');
      
      const stats = getStorageStats();
      
      expect(Array.isArray(stats.memoryStorageKeys)).toBe(true);
    });

    it('should handle errors gracefully', () => {
      const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      const stats = getStorageStats();
      
      expect(stats).toBeDefined();
      
      spy.mockRestore();
    });
  });

  describe('clearStorage', () => {
    it('should clear all localStorage', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      
      clearStorage();
      
      expect(localStorage.length).toBe(0);
    });

    it('should clear memory storage', () => {
      setItem('memory-key', 'value');
      
      clearStorage();
      
      const stats = getStorageStats();
      expect(stats.memoryStorageSize).toBe(0);
    });

    it('should clear only keys with prefix', () => {
      localStorage.setItem('app-key1', 'value1');
      localStorage.setItem('app-key2', 'value2');
      localStorage.setItem('other-key', 'value3');
      
      clearStorage('app-');
      
      expect(localStorage.getItem('app-key1')).toBe(null);
      expect(localStorage.getItem('app-key2')).toBe(null);
      expect(localStorage.getItem('other-key')).toBe('value3');
    });

    it('should clear memory storage keys with prefix', () => {
      setItem('app-key1', 'value1');
      setItem('app-key2', 'value2');
      setItem('other-key', 'value3');
      
      clearStorage('app-');
      
      // Make localStorage unavailable to check memory fallback
      const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      expect(getItem('app-key1')).toBe(null);
      expect(getItem('other-key')).toBe('value3');
      
      spy.mockRestore();
    });

    it('should return true on successful clear', () => {
      const result = clearStorage();
      
      expect(result).toBe(true);
    });

    it('should return false when localStorage is unavailable', () => {
      const spy = jest.spyOn(Storage.prototype, 'clear').mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      const result = clearStorage();
      
      expect(result).toBe(false);
      
      spy.mockRestore();
    });
  });

  describe('Memory Fallback Integration', () => {
    it('should maintain data in memory when localStorage fails', () => {
      setItem('test-key', 'initial-value');
      
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });
      
      // Update should go to memory
      setItem('test-key', 'updated-value');
      
      setItemSpy.mockRestore();
      
      // Make getItem fail too
      const getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });
      
      expect(getItem('test-key')).toBe('updated-value');
      
      getItemSpy.mockRestore();
    });

    it('should allow multiple operations on memory fallback', () => {
      const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });
      
      setItem('key1', 'value1');
      setItem('key2', 'value2');
      setBooleanItem('key3', true);
      setNumberItem('key4', 42);
      
      spy.mockRestore();
      
      const getSpy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });
      
      expect(getItem('key1')).toBe('value1');
      expect(getItem('key2')).toBe('value2');
      expect(getBooleanItem('key3')).toBe(true);
      expect(getNumberItem('key4')).toBe(42);
      
      getSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should log warnings on localStorage errors', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Test error');
      });
      
      setItem('test-key', 'value');
      
      expect(consoleWarnSpy).toHaveBeenCalled();
      
      spy.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    it('should not throw errors when operations fail', () => {
      const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Test error');
      });
      
      expect(() => {
        setItem('test-key', 'value');
        getItem('test-key');
        removeItem('test-key');
      }).not.toThrow();
      
      spy.mockRestore();
    });
  });
});
