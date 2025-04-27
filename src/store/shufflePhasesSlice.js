import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

const shufflePhasesSlice = createSlice({
  name: "shufflePhases",
  initialState,
  reducers: {
    toggleShuffle: (state) => {
      state.value = !state.value;
    },
  },
});

export const { toggleShuffle } = shufflePhasesSlice.actions;
export default shufflePhasesSlice.reducer;
