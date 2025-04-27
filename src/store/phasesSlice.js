import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

const phasesSlice = createSlice({
  name: "phases",
  initialState,
  reducers: {
    shuffle: (state) => {
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
    set: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { shuffle, set } = phasesSlice.actions;
export default phasesSlice.reducer;
