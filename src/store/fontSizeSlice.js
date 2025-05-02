import { createSlice } from "@reduxjs/toolkit";
import config from "../config/config";

const initialState = {
  value: config.font.defaultSize,
};

const fontSizeSlice = createSlice({
  name: "fontSize",
  initialState,
  reducers: {
    incrementFontSize: (state) => {
      state.value = Math.min(
        state.value + config.font.increment,
        config.font.maxSize
      );
    },
    decrementFontSize: (state) => {
      state.value = Math.max(
        state.value - config.font.increment,
        config.font.minSize
      );
    },
  },
});

export const { incrementFontSize, decrementFontSize } = fontSizeSlice.actions;
export default fontSizeSlice.reducer;
