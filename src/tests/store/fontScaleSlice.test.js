import fontScaleReducer, {
  incrementFontScale,
  decrementFontScale,
} from '../../store/fontScaleSlice';
import config from '../../config/config';

describe('fontScaleSlice', () => {
  let initialState;

  beforeEach(() => {
    localStorage.clear();
    // Reset to default state
    initialState = {
      value: config.font.defaultScale,
    };
  });

  describe('initial state', () => {
    it('should return default scale when localStorage is empty', () => {
      const state = fontScaleReducer(undefined, { type: 'unknown' });
      
      expect(state.value).toBe(config.font.defaultScale);
    });

    it('should load scale from localStorage if available', () => {
      localStorage.setItem('fontScale', '3.0');
      
      // Need to reload the module to pick up localStorage value
      jest.resetModules();
      const { default: freshReducer } = require('../../store/fontScaleSlice');
      
      const state = freshReducer(undefined, { type: 'unknown' });
      
      expect(state.value).toBe(3.0);
    });

    it('should use default scale for invalid localStorage value', () => {
      localStorage.setItem('fontScale', 'invalid');
      
      jest.resetModules();
      const { default: freshReducer } = require('../../store/fontScaleSlice');
      
      const state = freshReducer(undefined, { type: 'unknown' });
      
      expect(state.value).toBe(config.font.defaultScale);
    });

    it('should use default scale for NaN localStorage value', () => {
      localStorage.setItem('fontScale', 'NaN');
      
      jest.resetModules();
      const { default: freshReducer } = require('../../store/fontScaleSlice');
      
      const state = freshReducer(undefined, { type: 'unknown' });
      
      expect(state.value).toBe(config.font.defaultScale);
    });
  });

  describe('incrementFontScale', () => {
    it('should increment font scale by config increment', () => {
      const state = { value: 2.0 };
      const action = incrementFontScale();
      const newState = fontScaleReducer(state, action);
      
      expect(newState.value).toBe(2.0 + config.font.scaleIncrement);
    });

    it('should save new value to localStorage', () => {
      const state = { value: 2.0 };
      const action = incrementFontScale();
      fontScaleReducer(state, action);
      
      expect(localStorage.getItem('fontScale')).toBe((2.0 + config.font.scaleIncrement).toString());
    });

    it('should not exceed max scale', () => {
      const state = { value: config.font.maxScale };
      const action = incrementFontScale();
      const newState = fontScaleReducer(state, action);
      
      expect(newState.value).toBe(config.font.maxScale);
    });

    it('should cap at max scale when increment would exceed', () => {
      const state = { value: config.font.maxScale - 0.1 };
      const action = incrementFontScale();
      const newState = fontScaleReducer(state, action);
      
      expect(newState.value).toBe(config.font.maxScale);
    });

    it('should handle multiple increments correctly', () => {
      let state = { value: config.font.minScale };
      
      // Increment 3 times
      state = fontScaleReducer(state, incrementFontScale());
      state = fontScaleReducer(state, incrementFontScale());
      state = fontScaleReducer(state, incrementFontScale());
      
      expect(state.value).toBeCloseTo(config.font.minScale + (config.font.scaleIncrement * 3), 5);
    });

    it('should maintain immutability', () => {
      const state = { value: 2.0 };
      const action = incrementFontScale();
      const newState = fontScaleReducer(state, action);
      
      expect(newState).not.toBe(state);
      expect(state.value).toBe(2.0);
    });
  });

  describe('decrementFontScale', () => {
    it('should decrement font scale by config increment', () => {
      const state = { value: 3.0 };
      const action = decrementFontScale();
      const newState = fontScaleReducer(state, action);
      
      expect(newState.value).toBe(3.0 - config.font.scaleIncrement);
    });

    it('should save new value to localStorage', () => {
      const state = { value: 3.0 };
      const action = decrementFontScale();
      fontScaleReducer(state, action);
      
      expect(localStorage.getItem('fontScale')).toBe((3.0 - config.font.scaleIncrement).toString());
    });

    it('should not go below min scale', () => {
      const state = { value: config.font.minScale };
      const action = decrementFontScale();
      const newState = fontScaleReducer(state, action);
      
      expect(newState.value).toBe(config.font.minScale);
    });

    it('should cap at min scale when decrement would go below', () => {
      const state = { value: config.font.minScale + 0.1 };
      const action = decrementFontScale();
      const newState = fontScaleReducer(state, action);
      
      expect(newState.value).toBe(config.font.minScale);
    });

    it('should handle multiple decrements correctly', () => {
      let state = { value: config.font.maxScale };
      
      // Decrement 3 times
      state = fontScaleReducer(state, decrementFontScale());
      state = fontScaleReducer(state, decrementFontScale());
      state = fontScaleReducer(state, decrementFontScale());
      
      expect(state.value).toBeCloseTo(config.font.maxScale - (config.font.scaleIncrement * 3), 5);
    });

    it('should maintain immutability', () => {
      const state = { value: 3.0 };
      const action = decrementFontScale();
      const newState = fontScaleReducer(state, action);
      
      expect(newState).not.toBe(state);
      expect(state.value).toBe(3.0);
    });
  });

  describe('boundary conditions', () => {
    it('should handle increment at exactly max scale', () => {
      const state = { value: config.font.maxScale };
      
      const newState = fontScaleReducer(state, incrementFontScale());
      
      expect(newState.value).toBe(config.font.maxScale);
    });

    it('should handle decrement at exactly min scale', () => {
      const state = { value: config.font.minScale };
      
      const newState = fontScaleReducer(state, decrementFontScale());
      
      expect(newState.value).toBe(config.font.minScale);
    });

    it('should handle value between min and max', () => {
      const midValue = (config.font.minScale + config.font.maxScale) / 2;
      const state = { value: midValue };
      
      const incrementedState = fontScaleReducer(state, incrementFontScale());
      const decrementedState = fontScaleReducer(state, decrementFontScale());
      
      expect(incrementedState.value).toBe(midValue + config.font.scaleIncrement);
      expect(decrementedState.value).toBe(midValue - config.font.scaleIncrement);
    });
  });

  describe('localStorage persistence', () => {
    it('should persist incremented value', () => {
      const state = { value: 2.5 };
      
      fontScaleReducer(state, incrementFontScale());
      
      expect(parseFloat(localStorage.getItem('fontScale'))).toBe(2.5 + config.font.scaleIncrement);
    });

    it('should persist decremented value', () => {
      const state = { value: 2.5 };
      
      fontScaleReducer(state, decrementFontScale());
      
      expect(parseFloat(localStorage.getItem('fontScale'))).toBe(2.5 - config.font.scaleIncrement);
    });

    it('should persist max scale when capped', () => {
      const state = { value: config.font.maxScale };
      
      fontScaleReducer(state, incrementFontScale());
      
      expect(parseFloat(localStorage.getItem('fontScale'))).toBe(config.font.maxScale);
    });

    it('should persist min scale when capped', () => {
      const state = { value: config.font.minScale };
      
      fontScaleReducer(state, decrementFontScale());
      
      expect(parseFloat(localStorage.getItem('fontScale'))).toBe(config.font.minScale);
    });
  });

  describe('config integration', () => {
    it('should use config values for boundaries', () => {
      expect(config.font.minScale).toBeDefined();
      expect(config.font.maxScale).toBeDefined();
      expect(config.font.minScale).toBeLessThan(config.font.maxScale);
    });

    it('should use config value for increment', () => {
      expect(config.font.scaleIncrement).toBeDefined();
      expect(config.font.scaleIncrement).toBeGreaterThan(0);
    });

    it('should respect config default scale', () => {
      localStorage.clear();
      const state = fontScaleReducer(undefined, { type: 'unknown' });
      
      expect(state.value).toBe(config.font.defaultScale);
    });
  });
});
