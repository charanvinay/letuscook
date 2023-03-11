import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeStep: 2,
  isMobile: true,
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
    setIsMobile: (state, action) => {
      state.isMobile = action.payload
    }
  },
});

export const getIsMobile = (state) => state.userReducer.isMobile;
export const getActiveStep = (state) => state.userReducer.activeStep;
export const getLoggedUser = (state) => state.userReducer.loggedUser;
export const { handleNext, handleBack, handleReset, handleLoggedUser, setIsMobile } = userSlice.actions;
export default userSlice.reducer;
