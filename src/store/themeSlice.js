import { createSlice } from "@reduxjs/toolkit";
import { LightBulb, MoonIcon, SunIcon } from "../icons/iconRepo";

const initialState = {
  value: "light",
  list: [
    // { name: "light", icon: <LightBulb /> },
    { name: "dark", icon: <MoonIcon /> },
    // { name: "solarized", icon: <SunIcon /> },
    { name: "light", icon: <SunIcon /> },
  ],
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, index) => {
      state.value = index.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
