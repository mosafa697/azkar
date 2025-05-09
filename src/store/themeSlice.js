import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: localStorage.getItem("theme") || "solarized",
  list: ["light", "solarized", "dark"],
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, index) => {
      state.value = index.payload;

      localStorage.setItem("theme", state.value);
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
