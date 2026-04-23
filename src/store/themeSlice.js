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
      state.value = action.payload;
      setItem("theme", state.value);
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
