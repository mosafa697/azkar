import { configureStore } from "@reduxjs/toolkit";
import phasesReducer from "./phasesSlice";
import themeReducer from "./themeSlice";
import fontScaleReducer from "./fontScaleSlice";
import indexCountReducer from "./indexCountSlice";
import subTextReducer from "./subTextSlice";
import totalCountReducer from "./totalCountSlice";

export const store = configureStore({
  reducer: {
    phases: phasesReducer,
    theme: themeReducer,
    fontScale: fontScaleReducer,
    indexCount: indexCountReducer,
    subText: subTextReducer,
    totalCount: totalCountReducer,
  },
});
