import themeReducer, {
  setTheme,
} from '../../store/themeSlice';

describe('themeSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('initial state', () => {
    it('should return default theme "solarized" when localStorage is empty', () => {
      const state = themeReducer(undefined, { type: 'unknown' });
      
      expect(state.value).toBe('solarized');
      expect(state.list).toEqual(['light', 'solarized', 'dark']);
    });

    it('should load theme from localStorage if available', () => {
      localStorage.setItem('theme', 'dark');
      
      jest.resetModules();
      const { default: freshReducer } = require('../../store/themeSlice');
      
      const state = freshReducer(undefined, { type: 'unknown' });
      
      expect(state.value).toBe('dark');
    });

    it('should include theme list in initial state', () => {
      const state = themeReducer(undefined, { type: 'unknown' });
      
      expect(state.list).toEqual(['light', 'solarized', 'dark']);
    });
  });

  describe('setTheme', () => {
    it('should set theme to light', () => {
      const initialState = {
        value: 'solarized',
        list: ['light', 'solarized', 'dark'],
      };
      
      const action = setTheme('light');
      const newState = themeReducer(initialState, action);
      
      expect(newState.value).toBe('light');
    });

    it('should set theme to dark', () => {
      const initialState = {
        value: 'solarized',
        list: ['light', 'solarized', 'dark'],
      };
      
      const action = setTheme('dark');
      const newState = themeReducer(initialState, action);
      
      expect(newState.value).toBe('dark');
    });

    it('should set theme to solarized', () => {
      const initialState = {
        value: 'light',
        list: ['light', 'solarized', 'dark'],
      };
      
      const action = setTheme('solarized');
      const newState = themeReducer(initialState, action);
      
      expect(newState.value).toBe('solarized');
    });

    it('should save theme to localStorage', () => {
      const initialState = {
        value: 'solarized',
        list: ['light', 'solarized', 'dark'],
      };
      
      const action = setTheme('dark');
      themeReducer(initialState, action);
      
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('should allow setting same theme again', () => {
      const initialState = {
        value: 'dark',
        list: ['light', 'solarized', 'dark'],
      };
      
      const action = setTheme('dark');
      const newState = themeReducer(initialState, action);
      
      expect(newState.value).toBe('dark');
    });

    it('should maintain theme list unchanged', () => {
      const initialState = {
        value: 'light',
        list: ['light', 'solarized', 'dark'],
      };
      
      const action = setTheme('dark');
      const newState = themeReducer(initialState, action);
      
      expect(newState.list).toEqual(['light', 'solarized', 'dark']);
    });

    it('should maintain immutability', () => {
      const initialState = {
        value: 'light',
        list: ['light', 'solarized', 'dark'],
      };
      
      const action = setTheme('dark');
      const newState = themeReducer(initialState, action);
      
      expect(newState).not.toBe(initialState);
      expect(initialState.value).toBe('light');
    });
  });

  describe('theme switching sequence', () => {
    it('should handle switching through all themes', () => {
      let state = {
        value: 'light',
        list: ['light', 'solarized', 'dark'],
      };
      
      // Switch to solarized
      state = themeReducer(state, setTheme('solarized'));
      expect(state.value).toBe('solarized');
      
      // Switch to dark
      state = themeReducer(state, setTheme('dark'));
      expect(state.value).toBe('dark');
      
      // Switch back to light
      state = themeReducer(state, setTheme('light'));
      expect(state.value).toBe('light');
    });

    it('should persist each theme change to localStorage', () => {
      let state = {
        value: 'light',
        list: ['light', 'solarized', 'dark'],
      };
      
      state = themeReducer(state, setTheme('solarized'));
      expect(localStorage.getItem('theme')).toBe('solarized');
      
      state = themeReducer(state, setTheme('dark'));
      expect(localStorage.getItem('theme')).toBe('dark');
      
      state = themeReducer(state, setTheme('light'));
      expect(localStorage.getItem('theme')).toBe('light');
    });
  });

  describe('localStorage persistence', () => {
    it('should save light theme to localStorage', () => {
      const state = {
        value: 'solarized',
        list: ['light', 'solarized', 'dark'],
      };
      
      themeReducer(state, setTheme('light'));
      
      expect(localStorage.getItem('theme')).toBe('light');
    });

    it('should save solarized theme to localStorage', () => {
      const state = {
        value: 'light',
        list: ['light', 'solarized', 'dark'],
      };
      
      themeReducer(state, setTheme('solarized'));
      
      expect(localStorage.getItem('theme')).toBe('solarized');
    });

    it('should save dark theme to localStorage', () => {
      const state = {
        value: 'light',
        list: ['light', 'solarized', 'dark'],
      };
      
      themeReducer(state, setTheme('dark'));
      
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('should overwrite previous theme in localStorage', () => {
      const state = {
        value: 'light',
        list: ['light', 'solarized', 'dark'],
      };
      
      themeReducer(state, setTheme('dark'));
      expect(localStorage.getItem('theme')).toBe('dark');
      
      themeReducer(state, setTheme('light'));
      expect(localStorage.getItem('theme')).toBe('light');
    });
  });

  describe('edge cases', () => {
    it('should handle setting theme when list is present', () => {
      const state = {
        value: 'light',
        list: ['light', 'solarized', 'dark'],
      };
      
      const newState = themeReducer(state, setTheme('dark'));
      
      expect(newState.list).toEqual(['light', 'solarized', 'dark']);
    });

    it('should accept any string as theme value', () => {
      const state = {
        value: 'light',
        list: ['light', 'solarized', 'dark'],
      };
      
      // Even though 'custom' is not in the list, the reducer accepts it
      const newState = themeReducer(state, setTheme('custom'));
      
      expect(newState.value).toBe('custom');
    });
  });

  describe('theme list', () => {
    it('should contain exactly three themes', () => {
      const state = themeReducer(undefined, { type: 'unknown' });
      
      expect(state.list).toHaveLength(3);
    });

    it('should include light theme', () => {
      const state = themeReducer(undefined, { type: 'unknown' });
      
      expect(state.list).toContain('light');
    });

    it('should include solarized theme', () => {
      const state = themeReducer(undefined, { type: 'unknown' });
      
      expect(state.list).toContain('solarized');
    });

    it('should include dark theme', () => {
      const state = themeReducer(undefined, { type: 'unknown' });
      
      expect(state.list).toContain('dark');
    });
  });
});
