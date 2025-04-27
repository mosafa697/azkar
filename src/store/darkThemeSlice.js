import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

const darkThemeSlice = createSlice({
  name: "darkTheme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.value = !state.value;
    },
  },
});

export const { toggleTheme } = darkThemeSlice.actions;
export default darkThemeSlice.reducer;
