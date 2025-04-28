import { configureStore } from "@reduxjs/toolkit";
import phasesReducer from "./phasesSlice";
import darkThemeReducer from "./darkThemeSlice";
import fontSizeReducer from "./fontSizeSlice";
import indexCountReducer from "./indexCountSlice";

export const store = configureStore({
  reducer: {
    phases: phasesReducer,
    darkTheme: darkThemeReducer,
    fontSize: fontSizeReducer,
    indexCount: indexCountReducer,
  },
});
