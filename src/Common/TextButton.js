import { Button } from "@mui/material";
import React from "react";

function TextButton(props) {
  return (
    <Button
      variant="text"
      // sx={{ fontWeight: "600", textTransform: "none" }}
      size="small"
      onClick={props.onClick}
    >
      {props.text}
    </Button>
  );
}

export default TextButton;
