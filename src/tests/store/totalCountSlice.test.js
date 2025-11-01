import totalCountReducer, {
  incrementTotalCount,
  setTotalCount,
  resetTotalCount,
} from '../../store/totalCountSlice';
import { getNumberItem, setNumberItem } from '../../utils/localStorage';

// Mock the localStorage utility module
jest.mock('../../utils/localStorage', () => ({
  getNumberItem: jest.fn().mockReturnValue(0),
  setNumberItem: jest.fn().mockReturnValue(true),
}));

// Get the mocked functions
const mockGetNumberItem = getNumberItem;
const mockSetNumberItem = setNumberItem;

// Mock console.error and console.warn to avoid noise in tests
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

describe('totalCountSlice', () => {
  beforeEach(() => {
    mockGetNumberItem.mockClear();
    mockSetNumberItem.mockClear();
    mockConsoleError.mockClear();
    mockConsoleWarn.mockClear();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
    mockConsoleWarn.mockRestore();
  });

  describe('initial state', () => {
    it('should have a valid initial state structure', () => {
      const state = totalCountReducer(undefined, { type: 'unknown' });
      expect(state).toHaveProperty('value');
      expect(typeof state.value).toBe('number');
    });

    it('should properly use localStorage utilities', () => {
      // Test that the reducer works with the localStorage utility functions
      const initialState = { value: 5 };
      const action = incrementTotalCount();
      totalCountReducer(initialState, action);
      
      // Verify that setNumberItem was called for the increment
      expect(mockSetNumberItem).toHaveBeenCalled();
    });
  });

  describe('incrementTotalCount', () => {
    it('should increment count by 1', () => {
      const initialState = { value: 5 };
      
      const action = incrementTotalCount();
      const state = totalCountReducer(initialState, action);
      
      expect(state.value).toBe(6);
      expect(mockSetNumberItem).toHaveBeenCalledWith('azkarTotalCount', 6);
    });

    it('should increment from 0', () => {
      const initialState = { value: 0 };
      
      const action = incrementTotalCount();
      const state = totalCountReducer(initialState, action);
      
      expect(state.value).toBe(1);
      expect(mockSetNumberItem).toHaveBeenCalledWith('azkarTotalCount', 1);
    });

    it('should handle localStorage save errors', () => {
      mockSetNumberItem.mockReturnValue(false); // Simulate save failure
      
      const initialState = { value: 5 };
      const action = incrementTotalCount();
      const state = totalCountReducer(initialState, action);
      
      expect(state.value).toBe(6); // State should still update
      expect(mockSetNumberItem).toHaveBeenCalledWith('azkarTotalCount', 6);
    });
  });

  describe('setTotalCount', () => {
    it('should set count to specific value', () => {
      const initialState = { value: 10 };
      
      const action = setTotalCount(25);
      const state = totalCountReducer(initialState, action);
      
      expect(state.value).toBe(25);
      expect(mockSetNumberItem).toHaveBeenCalledWith('azkarTotalCount', 25);
    });

    it('should handle setting to 0', () => {
      const initialState = { value: 100 };
      
      const action = setTotalCount(0);
      const state = totalCountReducer(initialState, action);
      
      expect(state.value).toBe(0);
      expect(mockSetNumberItem).toHaveBeenCalledWith('azkarTotalCount', 0);
    });

    it('should handle negative values', () => {
      const initialState = { value: 5 };
      
      const action = setTotalCount(-10);
      const state = totalCountReducer(initialState, action);
      
      expect(state.value).toBe(-10);
      expect(mockSetNumberItem).toHaveBeenCalledWith('azkarTotalCount', -10);
    });

    it('should handle localStorage save errors on set', () => {
      mockSetNumberItem.mockReturnValue(false); // Simulate save failure
      
      const initialState = { value: 5 };
      const action = setTotalCount(42);
      const state = totalCountReducer(initialState, action);
      
      expect(state.value).toBe(42);
      expect(mockSetNumberItem).toHaveBeenCalledWith('azkarTotalCount', 42);
    });
  });

  describe('resetTotalCount', () => {
    it('should reset count to 0', () => {
      const initialState = { value: 150 };
      
      const action = resetTotalCount();
      const state = totalCountReducer(initialState, action);
      
      expect(state.value).toBe(0);
      expect(mockSetNumberItem).toHaveBeenCalledWith('azkarTotalCount', 0);
    });

    it('should handle reset from 0', () => {
      const initialState = { value: 0 };
      
      const action = resetTotalCount();
      const state = totalCountReducer(initialState, action);
      
      expect(state.value).toBe(0);
      expect(mockSetNumberItem).toHaveBeenCalledWith('azkarTotalCount', 0);
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