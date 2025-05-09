import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: localStorage.getItem("showSubText") === "true",
};

const subTextSlice = createSlice({
  name: "subText",
  initialState,
  reducers: {
    toggleAppearance: (state) => {
      state.value = !state.value;

      localStorage.setItem("showSubText", state.value);
    },
  },
});

export const { toggleAppearance } = subTextSlice.actions;
export default subTextSlice.reducer;
