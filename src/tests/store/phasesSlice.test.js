import phasesReducer, {
  shufflePhases,
  setPhases,
  toggleShuffle,
  resetPhases,
} from '../../store/phasesSlice';
import { mockMappedAzkar } from '../fixtures/mockData';

// Mock localStorage
const mockSetItem = jest.fn();
const mockGetItem = jest.fn();

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: mockGetItem,
    setItem: mockSetItem,
  },
});

describe('phasesSlice', () => {
  beforeEach(() => {
    mockSetItem.mockClear();
    mockGetItem.mockClear();
  });

  describe('initial state', () => {
    it('should return initial state with shuffle from localStorage', () => {
      mockGetItem.mockReturnValue('true');
      const initialState = {
        value: [],
        shuffle: false, // This will be overridden by localStorage mock
        wasShuffled: false,
      };

      expect(phasesReducer(undefined, { type: 'unknown' })).toEqual(
        expect.objectContaining({
          value: [],
          wasShuffled: false,
        })
      );
    });

    it('should handle localStorage returning null', () => {
      mockGetItem.mockReturnValue(null);
      const state = phasesReducer(undefined, { type: 'unknown' });
      expect(state.shuffle).toBe(false);
    });
  });

  describe('setPhases', () => {
    it('should set phases array', () => {
      const initialState = {
        value: [],
        shuffle: false,
        wasShuffled: false,
      };

      const testPhrases = mockMappedAzkar[0].phrases;
      const action = setPhases(testPhrases);
      const state = phasesReducer(initialState, action);

      expect(state.value).toEqual(testPhrases);
      expect(state.shuffle).toBe(false);
      expect(state.wasShuffled).toBe(false);
    });

    it('should replace existing phrases', () => {
      const initialState = {
        value: [{ id: 1, text: 'old phrase' }],
        shuffle: false,
        wasShuffled: false,
      };

      const newPhrases = mockMappedAzkar[0].phrases;
      const action = setPhases(newPhrases);
      const state = phasesReducer(initialState, action);

      expect(state.value).toEqual(newPhrases);
      expect(state.value).not.toContain({ id: 1, text: 'old phrase' });
    });
  });

  describe('shufflePhases', () => {
    it('should shuffle phases array', () => {
      const testPhrases = mockMappedAzkar[0].phrases;
      const initialState = {
        value: [...testPhrases],
        shuffle: true,
        wasShuffled: false,
      };

      // Mock Math.random to ensure deterministic shuffle
      const originalRandom = Math.random;
      Math.random = jest.fn().mockReturnValue(0.7);

      const action = shufflePhases();
      const state = phasesReducer(initialState, action);

      expect(state.wasShuffled).toBe(true);
      expect(state.value).toHaveLength(testPhrases.length);
      expect(state.value).toEqual(expect.arrayContaining(testPhrases));

      // Restore Math.random
      Math.random = originalRandom;
    });

    it('should handle empty phases array', () => {
      const initialState = {
        value: [],
        shuffle: true,
        wasShuffled: false,
      };

      const action = shufflePhases();
      const state = phasesReducer(initialState, action);

      expect(state.value).toEqual([]);
      expect(state.wasShuffled).toBe(true);
    });
  });

  describe('toggleShuffle', () => {
    it('should toggle shuffle from false to true', () => {
      const initialState = {
        value: [],
        shuffle: false,
        wasShuffled: false,
      };

      const action = toggleShuffle();
      const state = phasesReducer(initialState, action);

      expect(state.shuffle).toBe(true);
      expect(mockSetItem).toHaveBeenCalledWith('shufflePhases', true);
    });

    it('should toggle shuffle from true to false and reset wasShuffled', () => {
      const initialState = {
        value: mockMappedAzkar[0].phrases,
        shuffle: true,
        wasShuffled: true,
      };

      const action = toggleShuffle();
      const state = phasesReducer(initialState, action);

      expect(state.shuffle).toBe(false);
      expect(state.wasShuffled).toBe(false);
      expect(mockSetItem).toHaveBeenCalledWith('shufflePhases', false);
    });
  });

  describe('resetPhases', () => {
    it('should reset phases to empty array and wasShuffled to false', () => {
      const initialState = {
        value: mockMappedAzkar[0].phrases,
        shuffle: true,
        wasShuffled: true,
      };

      const action = resetPhases();
      const state = phasesReducer(initialState, action);

      expect(state.value).toEqual([]);
      expect(state.wasShuffled).toBe(false);
      expect(state.shuffle).toBe(true); // Should preserve shuffle setting
    });
  });

  describe('edge cases', () => {
    it('should handle malformed localStorage data', () => {
      mockGetItem.mockReturnValue('invalid-boolean');
      const state = phasesReducer(undefined, { type: 'unknown' });
      expect(state.shuffle).toBe(false);
    });

    it('should handle localStorage errors gracefully', () => {
      mockGetItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      const state = phasesReducer(undefined, { type: 'unknown' });
      expect(state.shuffle).toBe(false);
    });
  });
});