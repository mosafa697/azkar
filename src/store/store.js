import { configureStore } from "@reduxjs/toolkit";
import phasesReducer from "./phasesSlice";
import themeReducer from "./themeSlice";
import fontSizeReducer from "./fontSizeSlice";
import indexCountReducer from "./indexCountSlice";

export const store = configureStore({
  reducer: {
    phases: phasesReducer,
    theme: themeReducer,
    fontSize: fontSizeReducer,
    indexCount: indexCountReducer,
  },
});
