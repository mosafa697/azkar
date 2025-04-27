import { createSlice } from "@reduxjs/toolkit";
import config from "../config/config";

const initialState = {
  value: config.font.defaultSize,
};

const fontSizeSlice = createSlice({
  name: "fontSize",
  initialState,
  reducers: {
    increament: (state) => {
      state.value = Math.min(
        state.value + config.font.increment,
        config.font.maxSize
      );
    },
    decreament: (state) => {
      state.value = Math.max(
        state.value - config.font.increment,
        config.font.minSize
      );
    },
  },
});

export const { increament, decreament } = fontSizeSlice.actions;
export default fontSizeSlice.reducer;
