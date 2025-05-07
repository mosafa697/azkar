import { createSlice } from "@reduxjs/toolkit";
import config from "../config/config";

const initialState = {
  value: localStorage.getItem("fontScale") || config.font.defaultScale,
};

const fontScaleSlice = createSlice({
  name: "fontScale",
  initialState,
  reducers: {
    incrementFontScale: (state) => {
      state.value = Math.min(
        state.value + config.font.scaleIncrement,
        config.font.maxScale
      );

      localStorage.setItem("fontScale", state.value);
    },
    decrementFontScale: (state) => {
      state.value = Math.max(
        state.value - config.font.scaleIncrement,
        config.font.minScale
      );

      localStorage.setItem("fontScale", state.value);
    },
  },
});

export const { incrementFontScale, decrementFontScale } =
  fontScaleSlice.actions;
export default fontScaleSlice.reducer;
