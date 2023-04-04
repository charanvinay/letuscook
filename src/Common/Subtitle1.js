import { Typography, useTheme } from "@mui/material";
import React from "react";

function Subtitle1(props) {
  const theme = useTheme();
  return (
    <Typography
      variant="subtitle1"
      color={props.color || "text.primary"}
      className="custom-subtitle1"
      sx={{ fontSize: "18px", fontWeight: props.fontWeight || "normal" }}
    >
      <div dangerouslySetInnerHTML={{ __html: props.text }} />
    </Typography>
  );
}

export default Subtitle1;
