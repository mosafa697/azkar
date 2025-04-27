import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
  phasesLength: 0,
  isLastPhrase: false,
};

const indexCountSlice = createSlice({
  name: "indexCount",
  initialState,
  reducers: {
    increamentIndex: (state) => {
      if (state.value < state.phasesLength) {
        state.value += 1;
      }
    },
    decreamentIndex: (state) => {
      if (state.value > 0) {
        state.value -= 1;
      }
    },
    setIndexCount: (state, index) => {
      state.value = index.payload;
    },
    setPhasesLengthCount: (state, index) => {
      state.phasesLength = index.payload;
    },
    setIsLastPhrase: (state, value) => {
      state.isLastPhrase = value.payload;
    },
  },
});

export const {
  increamentIndex,
  decreamentIndex,
  setIndexCount,
  setPhasesLengthCount,
  setIsLastPhrase,
} = indexCountSlice.actions;
export default indexCountSlice.reducer;
