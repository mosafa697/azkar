import indexCountReducer, {
  incrementIndex,
  decrementIndex,
  setIndexCount,
  setPhasesLengthCount,
  setIsLastPhrase,
  resetIndexCount,
} from '../../store/indexCountSlice';

describe('indexCountSlice', () => {
  const initialState = {
    value: 0,
    phasesLength: 0,
    isLastPhrase: false,
  };

  describe('initial state', () => {
    it('should return initial state', () => {
      expect(indexCountReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('incrementIndex', () => {
    it('should increment index when below phasesLength', () => {
      const state = {
        value: 0,
        phasesLength: 5,
        isLastPhrase: false,
      };

      const action = incrementIndex();
      const newState = indexCountReducer(state, action);

      expect(newState.value).toBe(1);
      expect(newState.phasesLength).toBe(5);
      expect(newState.isLastPhrase).toBe(false);
    });

    it('should not increment when at phasesLength limit', () => {
      const state = {
        value: 5,
        phasesLength: 5,
        isLastPhrase: true,
      };

      const action = incrementIndex();
      const newState = indexCountReducer(state, action);

      expect(newState.value).toBe(5);
    });

    it('should increment to phasesLength when one below limit', () => {
      const state = {
        value: 4,
        phasesLength: 5,
        isLastPhrase: false,
      };

      const action = incrementIndex();
      const newState = indexCountReducer(state, action);

      expect(newState.value).toBe(5);
    });
  });

  describe('decrementIndex', () => {
    it('should decrement index when above 0', () => {
      const state = {
        value: 3,
        phasesLength: 5,
        isLastPhrase: false,
      };

      const action = decrementIndex();
      const newState = indexCountReducer(state, action);

      expect(newState.value).toBe(2);
    });

    it('should not decrement when at 0', () => {
      const state = {
        value: 0,
        phasesLength: 5,
        isLastPhrase: false,
      };

      const action = decrementIndex();
      const newState = indexCountReducer(state, action);

      expect(newState.value).toBe(0);
    });

    it('should decrement from 1 to 0', () => {
      const state = {
        value: 1,
        phasesLength: 5,
        isLastPhrase: false,
      };

      const action = decrementIndex();
      const newState = indexCountReducer(state, action);

      expect(newState.value).toBe(0);
    });
  });

  describe('setIndexCount', () => {
    it('should set index to specific value', () => {
      const state = {
        value: 0,
        phasesLength: 5,
        isLastPhrase: false,
      };

      const action = setIndexCount(3);
      const newState = indexCountReducer(state, action);

      expect(newState.value).toBe(3);
      expect(newState.phasesLength).toBe(5);
      expect(newState.isLastPhrase).toBe(false);
    });

    it('should handle negative values', () => {
      const state = {
        value: 2,
        phasesLength: 5,
        isLastPhrase: false,
      };

      const action = setIndexCount(-1);
      const newState = indexCountReducer(state, action);

      expect(newState.value).toBe(-1);
    });

    it('should handle values beyond phasesLength', () => {
      const state = {
        value: 2,
        phasesLength: 5,
        isLastPhrase: false,
      };

      const action = setIndexCount(10);
      const newState = indexCountReducer(state, action);

      expect(newState.value).toBe(10);
    });
  });

  describe('setPhasesLengthCount', () => {
    it('should set phasesLength to specific value', () => {
      const state = {
        value: 0,
        phasesLength: 0,
        isLastPhrase: false,
      };

      const action = setPhasesLengthCount(4);
      const newState = indexCountReducer(state, action);

      expect(newState.phasesLength).toBe(4);
      expect(newState.value).toBe(0);
      expect(newState.isLastPhrase).toBe(false);
    });

    it('should handle zero phasesLength', () => {
      const state = {
        value: 3,
        phasesLength: 5,
        isLastPhrase: false,
      };

      const action = setPhasesLengthCount(0);
      const newState = indexCountReducer(state, action);

      expect(newState.phasesLength).toBe(0);
    });
  });

  describe('setIsLastPhrase', () => {
    it('should set isLastPhrase to true', () => {
      const state = {
        value: 4,
        phasesLength: 5,
        isLastPhrase: false,
      };

      const action = setIsLastPhrase(true);
      const newState = indexCountReducer(state, action);

      expect(newState.isLastPhrase).toBe(true);
      expect(newState.value).toBe(4);
      expect(newState.phasesLength).toBe(5);
    });

    it('should set isLastPhrase to false', () => {
      const state = {
        value: 4,
        phasesLength: 5,
        isLastPhrase: true,
      };

      const action = setIsLastPhrase(false);
      const newState = indexCountReducer(state, action);

      expect(newState.isLastPhrase).toBe(false);
    });
  });

  describe('resetIndexCount', () => {
    it('should reset all values to initial state', () => {
      const state = {
        value: 5,
        phasesLength: 10,
        isLastPhrase: true,
      };

      const action = resetIndexCount();
      const newState = indexCountReducer(state, action);

      expect(newState).toEqual(initialState);
    });

    it('should reset from partial state', () => {
      const state = {
        value: 2,
        phasesLength: 3,
        isLastPhrase: false,
      };

      const action = resetIndexCount();
      const newState = indexCountReducer(state, action);

      expect(newState).toEqual(initialState);
    });
  });

  describe('edge cases', () => {
    it('should handle multiple operations in sequence', () => {
      let state = initialState;
      
      // Set phases length
      state = indexCountReducer(state, setPhasesLengthCount(3));
      expect(state.phasesLength).toBe(3);
      
      // Increment twice
      state = indexCountReducer(state, incrementIndex());
      state = indexCountReducer(state, incrementIndex());
      expect(state.value).toBe(2);
      
      // Set as last phrase
      state = indexCountReducer(state, setIsLastPhrase(true));
      expect(state.isLastPhrase).toBe(true);
      
      // Reset
      state = indexCountReducer(state, resetIndexCount());
      expect(state).toEqual(initialState);
    });

    it('should maintain immutability', () => {
      const state = {
        value: 2,
        phasesLength: 5,
        isLastPhrase: false,
      };
      
      const originalState = { ...state };
      const newState = indexCountReducer(state, incrementIndex());
      
      expect(state).toEqual(originalState);
      expect(newState).not.toBe(state);
      expect(newState.value).toBe(3);
    });
  });
});