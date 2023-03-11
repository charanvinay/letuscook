import { Button } from "@mui/material";
import React from "react";

function PrimaryButton(props) {
  return (
    <Button
      variant="contained"
      disableElevation
      sx={{ marginRight: "5px" }}
      size="small"
      onClick={props.onClick}
    >
      {props.text}
    </Button>
  );
}

export default PrimaryButton;
