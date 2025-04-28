import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
  isShuffled: false,
};

const phasesSlice = createSlice({
  name: "phases",
  initialState,
  reducers: {
    shufflePhases: (state) => {
      console.log("shuffling..");

      const texts = state.value.map((p) => p.text);

      for (let i = texts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [texts[i], texts[j]] = [texts[j], texts[i]];
      }

      state.value = state.value.map((phrase, index) => ({
        ...phrase,
        text: texts[index],
      }));
    },
    setPhases: (state, action) => {
      console.log("set phases..");

      state.value = action.payload;
    },
    toggleShuffle: (state) => {
      console.log("toggle shuffle, now is ", !state.isShuffled);

      state.isShuffled = !state.isShuffled;
    },
  },
});

export const { shufflePhases, setPhases, toggleShuffle } = phasesSlice.actions;
export default phasesSlice.reducer;
