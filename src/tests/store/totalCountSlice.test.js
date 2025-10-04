import totalCountReducer, {
  incrementTotalCount,
  setTotalCount,
  resetTotalCount,
} from '../../store/totalCountSlice';

// Mock localStorage
const mockSetItem = jest.fn();
const mockGetItem = jest.fn();

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: mockGetItem,
    setItem: mockSetItem,
  },
});

// Mock console.error to avoid noise in tests
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('totalCountSlice', () => {
  beforeEach(() => {
    mockSetItem.mockClear();
    mockGetItem.mockClear();
    mockConsoleError.mockClear();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  describe('initial state', () => {
    it('should load count from localStorage', () => {
      mockGetItem.mockReturnValue('42');
      
      // We need to reimport to get fresh initial state
      jest.resetModules();
      const freshReducer = require('../../store/totalCountSlice').default;
      
      const state = freshReducer(undefined, { type: 'unknown' });
      expect(state.value).toBe(42);
    });

    it('should default to 0 when localStorage is empty', () => {
      mockGetItem.mockReturnValue(null);
      
      jest.resetModules();
      const freshReducer = require('../../store/totalCountSlice').default;
      
      const state = freshReducer(undefined, { type: 'unknown' });
      expect(state.value).toBe(0);
    });

    it('should handle localStorage errors gracefully', () => {
      mockGetItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      jest.resetModules();
      const freshReducer = require('../../store/totalCountSlice').default;
      
      const state = freshReducer(undefined, { type: 'unknown' });
      expect(state.value).toBe(0);
      // Note: console.error is called but filtered by setupTests.js
    });

    it('should handle invalid localStorage data', () => {
      mockGetItem.mockReturnValue('invalid-number');
      
      jest.resetModules();
      const freshReducer = require('../../store/totalCountSlice').default;
      
      const state = freshReducer(undefined, { type: 'unknown' });
      expect(state.value).toBe(0); // isNaN(parseInt('invalid-number')) returns true, should default to 0
    });
  });

  describe('incrementTotalCount', () => {
    it('should increment count by 1', () => {
      const initialState = { value: 5 };
      
      const action = incrementTotalCount();
      const state = totalCountReducer(initialState, action);
      
      expect(state.value).toBe(6);
      expect(mockSetItem).toHaveBeenCalledWith('azkarTotalCount', '6');
    });

    it('should increment from 0', () => {
      const initialState = { value: 0 };
      
      const action = incrementTotalCount();
      const state = totalCountReducer(initialState, action);
      
      expect(state.value).toBe(1);
      expect(mockSetItem).toHaveBeenCalledWith('azkarTotalCount', '1');
    });

    it('should handle localStorage save errors', () => {
      mockSetItem.mockImplementation(() => {
        throw new Error('localStorage save error');
      });
      
      const initialState = { value: 5 };
      const action = incrementTotalCount();
      const state = totalCountReducer(initialState, action);
      
      expect(state.value).toBe(6); // State should still update
      // Note: console.error is called but filtered by setupTests.js
    });
  });

  describe('setTotalCount', () => {
    it('should set count to specific value', () => {
      const initialState = { value: 10 };
      
      const action = setTotalCount(25);
      const state = totalCountReducer(initialState, action);
      
      expect(state.value).toBe(25);
      expect(mockSetItem).toHaveBeenCalledWith('azkarTotalCount', '25');
    });

    it('should handle setting to 0', () => {
      const initialState = { value: 100 };
      
      const action = setTotalCount(0);
      const state = totalCountReducer(initialState, action);
      
      expect(state.value).toBe(0);
      expect(mockSetItem).toHaveBeenCalledWith('azkarTotalCount', '0');
    });

    it('should handle negative values', () => {
      const initialState = { value: 5 };
      
      const action = setTotalCount(-10);
      const state = totalCountReducer(initialState, action);
      
      expect(state.value).toBe(-10);
      expect(mockSetItem).toHaveBeenCalledWith('azkarTotalCount', '-10');
    });

    it('should handle localStorage save errors on set', () => {
      mockSetItem.mockImplementation(() => {
        throw new Error('localStorage save error');
      });
      
      const initialState = { value: 5 };
      const action = setTotalCount(42);
      const state = totalCountReducer(initialState, action);
      
      expect(state.value).toBe(42);
      // Note: console.error is called but filtered by setupTests.js
    });
  });

  describe('resetTotalCount', () => {
    it('should reset count to 0', () => {
      const initialState = { value: 150 };
      
      const action = resetTotalCount();
      const state = totalCountReducer(initialState, action);
      
      expect(state.value).toBe(0);
      expect(mockSetItem).toHaveBeenCalledWith('azkarTotalCount', '0');
    });

    it('should handle reset from 0', () => {
      const initialState = { value: 0 };
      
      const action = resetTotalCount();
      const state = totalCountReducer(initialState, action);
      
      expect(state.value).toBe(0);
      expect(mockSetItem).toHaveBeenCalledWith('azkarTotalCount', '0');
    });
  });

  describe('immutability', () => {
    it('should not mutate original state', () => {
      const initialState = { value: 10 };
      const originalState = { ...initialState };
      
      const action = incrementTotalCount();
      const newState = totalCountReducer(initialState, action);
      
      expect(initialState).toEqual(originalState);
      expect(newState).not.toBe(initialState);
      expect(newState.value).toBe(11);
    });
  });

  describe('multiple operations', () => {
    it('should handle sequence of operations', () => {
      let state = { value: 0 };
      
      // Increment 3 times
      state = totalCountReducer(state, incrementTotalCount());
      state = totalCountReducer(state, incrementTotalCount());
      state = totalCountReducer(state, incrementTotalCount());
      expect(state.value).toBe(3);
      
      // Set to specific value
      state = totalCountReducer(state, setTotalCount(10));
      expect(state.value).toBe(10);
      
      // Reset
      state = totalCountReducer(state, resetTotalCount());
      expect(state.value).toBe(0);
    });
  });
});