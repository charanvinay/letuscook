import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import { useState } from "react";
import { useEffect } from "react";
import PrimaryDetails from "./primary_details";
import RecipeSteps from "./steps";
import Finish from "./finish";
import { useDispatch, useSelector } from "react-redux";
import { getActiveStep, getIsMobile, setIsMobile } from "../../redux/slices/userSlice";

const steps = [
  {
    label: "Title & Ingredients",
  },
  {
    label: "Step by Step Procedure",
  },
  {
    label: "Finishing touch",
  },
];

export default function AddRecipe() {
  const isMobile = useSelector(getIsMobile);
  const activeStep = useSelector(getActiveStep);
  const dispatch = useDispatch();

  // create an event listener
  useEffect(() => {
    dispatch(setIsMobile(window.innerWidth < 800));
  }, []);

  const cmp_PrimaryDetails = () => <PrimaryDetails />;
  const cmp_RecipeSteps = () => <RecipeSteps />;
  const cmp_Finish = () => <Finish />;

  return (
    <Box component="main" sx={{ paddingX: 3, paddingY: 6 }}>
      <Stepper
        activeStep={activeStep}
        orientation={isMobile ? "vertical" : "horizontal"}
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            {isMobile && (
              <StepContent>
                {activeStep === 0 && cmp_PrimaryDetails()}
                {activeStep === 1 && cmp_RecipeSteps()}
                {activeStep === 2 && cmp_Finish()}
              </StepContent>
            )}
          </Step>
        ))}
      </Stepper>
      {!isMobile && activeStep === 0 && cmp_PrimaryDetails()}
      {!isMobile && activeStep === 1 && cmp_RecipeSteps()}
      {!isMobile && activeStep === 2 && cmp_Finish()}
    </Box>
  );
}
