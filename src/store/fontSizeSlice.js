import { createSlice } from "@reduxjs/toolkit";
import config from "../config/config";

const initialState = {
  value: localStorage.getItem("fontScale") || config.font.defaultSize,
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

      localStorage.setItem("fontScale", state.value);
    },
    decrementFontSize: (state) => {
      state.value = Math.max(
        state.value - config.font.increment,
        config.font.minSize
      );

      localStorage.setItem("fontScale", state.value);
    },
  },
});

export const { incrementFontSize, decrementFontSize } = fontSizeSlice.actions;
export default fontSizeSlice.reducer;
