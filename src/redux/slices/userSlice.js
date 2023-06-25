import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeStep: 0,
  isMobile: true,
  isDarkMode: false,
  activeTab: 1,
  loggedUser: {},
};
export const userSlice = createSlice({
  name: "user_slice",
  initialState: initialState,
  reducers: {
    handleNext: (state) => {
      state.activeStep += 1;
    },
    handleBack: (state) => {
      state.activeStep -= 1;
    },
    handleReset: (state) => {
      state.activeStep = 0;
    },
    handleLoggedUser: (state, action) => {
      state.loggedUser = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload
    },
    setIsDarkMode: (state, action) => {
      state.isDarkMode = action.payload
    }
  },
});

export const getIsMobile = (state) => state.userReducer.isMobile;
export const getIsDarkMode = (state) => state.userReducer.isDarkMode;
export const getActiveStep = (state) => state.userReducer.activeStep;
export const getActiveTab = (state) => state.userReducer.activeTab;
export const getLoggedUser = (state) => state.userReducer.loggedUser;
export const { handleNext, handleBack, handleReset, handleLoggedUser, setIsMobile, setIsDarkMode, setActiveTab } = userSlice.actions;
export default userSlice.reducer;
