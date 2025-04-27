import { configureStore } from "@reduxjs/toolkit";
import phasesReducer from "./phasesSlice";
import shufflePhasesReducer from "./shufflePhasesSlice";
import darkThemeReducer from "./darkThemeSlice";
import fontSizeReducer from "./fontSizeSlice";

export const store = configureStore({
  reducer: {
    phases: phasesReducer,
    shufflePhases: shufflePhasesReducer,
    darkTheme: darkThemeReducer,
    fontSize: fontSizeReducer,
  },
});
