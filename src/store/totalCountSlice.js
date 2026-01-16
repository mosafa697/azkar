import { createSlice } from "@reduxjs/toolkit";
import { getNumberItem, setNumberItem } from "../utils/localStorage";

// Helper function to load count from localStorage with enhanced error handling
const loadTotalCountFromStorage = () => {
  return getNumberItem("azkarTotalCount", 0);
};

// Helper function to save count to localStorage with enhanced error handling
const saveTotalCountToStorage = (count) => {
  setNumberItem("azkarTotalCount", count);
};

const initialState = {
  value: loadTotalCountFromStorage(),
};

const totalCountSlice = createSlice({
  name: "totalCount",
  initialState,
  reducers: {
    incrementTotalCount: (state) => {
      state.value += 1;
      saveTotalCountToStorage(state.value);
    },
    setTotalCount: (state, action) => {
      state.value = action.payload;
      saveTotalCountToStorage(state.value);
    },
    resetTotalCount: (state) => {
      state.value = 0;
      saveTotalCountToStorage(state.value);
    },
  },
});

export const {
  incrementTotalCount,
  setTotalCount,
  resetTotalCount,
} = totalCountSlice.actions;

export default totalCountSlice.reducer;
