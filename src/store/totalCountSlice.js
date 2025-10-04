import { createSlice } from "@reduxjs/toolkit";

// Helper function to load count from localStorage
const loadTotalCountFromStorage = () => {
  try {
    const savedCount = localStorage.getItem("azkarTotalCount");
    if (savedCount) {
      const parsed = parseInt(savedCount, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  } catch (error) {
    console.error("Error loading total count from localStorage:", error);
    return 0;
  }
};

// Helper function to save count to localStorage
const saveTotalCountToStorage = (count) => {
  try {
    localStorage.setItem("azkarTotalCount", count.toString());
  } catch (error) {
    console.error("Error saving total count to localStorage:", error);
  }
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
