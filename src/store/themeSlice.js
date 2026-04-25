import { createSlice } from "@reduxjs/toolkit";
import { getItem, setItem } from "../utils/localStorage";

const initialState = {
  value: getItem("theme", "solarized"),
  list: ["light", "solarized", "dark"],
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      const success = setItem("theme", action.payload);
      if (success) {
        state.value = action.payload;
      } else {
        console.warn("Failed to persist theme to localStorage, state not updated");
      }
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
