import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: true,
};

const subTextSlice = createSlice({
  name: "subText",
  initialState,
  reducers: {
    toggleAppearance: (state) => {
      state.value = !state.value;
    },
  },
});

export const { toggleAppearance } = subTextSlice.actions;
export default subTextSlice.reducer;
