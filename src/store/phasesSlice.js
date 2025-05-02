import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
  shuffle: false,
  wasShuffled: false,
};

const phasesSlice = createSlice({
  name: "phases",
  initialState,
  reducers: {
    shufflePhases: (state) => {
      state.value = [...state.value].sort(() => Math.random() - 0.5);
      state.wasShuffled = true;
    },
    setPhases: (state, action) => {
      state.value = action.payload;
    },
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
      if (!state.shuffle) {
        state.wasShuffled = false;
      }
    },
  },
});

export const { shufflePhases, setPhases, toggleShuffle } = phasesSlice.actions;
export default phasesSlice.reducer;
