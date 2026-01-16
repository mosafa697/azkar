import subTextReducer, {
  toggleAppearance,
} from '../../store/subTextSlice';

describe('subTextSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('initial state', () => {
    it('should return false when localStorage is empty', () => {
      const state = subTextReducer(undefined, { type: 'unknown' });
      
      expect(state.value).toBe(false);
    });

    it('should return true when localStorage has "true"', () => {
      localStorage.setItem('showSubText', 'true');
      
      jest.resetModules();
      const { default: freshReducer } = require('../../store/subTextSlice');
      
      const state = freshReducer(undefined, { type: 'unknown' });
      
      expect(state.value).toBe(true);
    });

    it('should return false when localStorage has "false"', () => {
      localStorage.setItem('showSubText', 'false');
      
      jest.resetModules();
      const { default: freshReducer } = require('../../store/subTextSlice');
      
      const state = freshReducer(undefined, { type: 'unknown' });
      
      expect(state.value).toBe(false);
    });

    it('should return false for invalid localStorage value', () => {
      localStorage.setItem('showSubText', 'invalid');
      
      jest.resetModules();
      const { default: freshReducer } = require('../../store/subTextSlice');
      
      const state = freshReducer(undefined, { type: 'unknown' });
      
      expect(state.value).toBe(false);
    });
  });

  describe('toggleAppearance', () => {
    it('should toggle from false to true', () => {
      const initialState = { value: false };
      
      const action = toggleAppearance();
      const newState = subTextReducer(initialState, action);
      
      expect(newState.value).toBe(true);
    });

    it('should toggle from true to false', () => {
      const initialState = { value: true };
      
      const action = toggleAppearance();
      const newState = subTextReducer(initialState, action);
      
      expect(newState.value).toBe(false);
    });

    it('should save true to localStorage when toggled on', () => {
      const initialState = { value: false };
      
      const action = toggleAppearance();
      subTextReducer(initialState, action);
      
      expect(localStorage.getItem('showSubText')).toBe('true');
    });

    it('should save false to localStorage when toggled off', () => {
      const initialState = { value: true };
      
      const action = toggleAppearance();
      subTextReducer(initialState, action);
      
      expect(localStorage.getItem('showSubText')).toBe('false');
    });

    it('should maintain immutability', () => {
      const initialState = { value: false };
      
      const action = toggleAppearance();
      const newState = subTextReducer(initialState, action);
      
      expect(newState).not.toBe(initialState);
      expect(initialState.value).toBe(false);
    });

    it('should handle multiple toggles correctly', () => {
      let state = { value: false };
      
      // Toggle on
      state = subTextReducer(state, toggleAppearance());
      expect(state.value).toBe(true);
      
      // Toggle off
      state = subTextReducer(state, toggleAppearance());
      expect(state.value).toBe(false);
      
      // Toggle on again
      state = subTextReducer(state, toggleAppearance());
      expect(state.value).toBe(true);
    });
  });

  describe('localStorage persistence', () => {
    it('should persist false value', () => {
      const state = { value: true };
      
      subTextReducer(state, toggleAppearance());
      
      expect(localStorage.getItem('showSubText')).toBe('false');
    });

    it('should persist true value', () => {
      const state = { value: false };
      
      subTextReducer(state, toggleAppearance());
      
      expect(localStorage.getItem('showSubText')).toBe('true');
    });

    it('should update localStorage on each toggle', () => {
      let state = { value: false };
      
      state = subTextReducer(state, toggleAppearance());
      expect(localStorage.getItem('showSubText')).toBe('true');
      
      state = subTextReducer(state, toggleAppearance());
      expect(localStorage.getItem('showSubText')).toBe('false');
      
      state = subTextReducer(state, toggleAppearance());
      expect(localStorage.getItem('showSubText')).toBe('true');
    });

    it('should store boolean as string in localStorage', () => {
      const state = { value: false };
      
      subTextReducer(state, toggleAppearance());
      
      const storedValue = localStorage.getItem('showSubText');
      expect(typeof storedValue).toBe('string');
      expect(storedValue).toBe('true');
    });
  });

  describe('toggle sequence', () => {
    it('should maintain correct state through multiple toggles', () => {
      let state = { value: false };
      const toggles = [true, false, true, false, true];
      
      toggles.forEach((expectedValue) => {
        state = subTextReducer(state, toggleAppearance());
        expect(state.value).toBe(expectedValue);
      });
    });

    it('should alternate correctly starting from true', () => {
      let state = { value: true };
      const toggles = [false, true, false, true, false];
      
      toggles.forEach((expectedValue) => {
        state = subTextReducer(state, toggleAppearance());
        expect(state.value).toBe(expectedValue);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle undefined state gracefully', () => {
      const state = subTextReducer(undefined, toggleAppearance());
      
      // Should toggle from initial false to true
      expect(state.value).toBe(true);
    });

    it('should load and toggle correctly', () => {
      localStorage.setItem('showSubText', 'true');
      
      jest.resetModules();
      const { default: freshReducer, toggleAppearance: freshToggle } = require('../../store/subTextSlice');
      
      const initialState = freshReducer(undefined, { type: 'unknown' });
      expect(initialState.value).toBe(true);
      
      const toggledState = freshReducer(initialState, freshToggle());
      expect(toggledState.value).toBe(false);
    });
  });
});
