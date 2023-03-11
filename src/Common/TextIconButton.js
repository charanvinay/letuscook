import { Button } from "@mui/material";
import React from "react";

function TextIconButton(props) {
  return (
    <Button
      variant="text"
      sx={{ fontWeight: "600", textTransform: "none", marginTop: "10px" }}
      size="small"
      onClick={props.onClick}
      endIcon={props.endIcon}
    >
      {props.text}
    </Button>
  );
}

export default TextIconButton;
