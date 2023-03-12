import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";
import { primary } from "./Pallete";

const CustomBackdrop = ({loading}) => {
  return (
    <Backdrop sx={{ color: primary, zIndex: 10000 }} open={loading}>
      <CircularProgress sx={{ color: "white" }} />
    </Backdrop>
  );
};

export default CustomBackdrop;
