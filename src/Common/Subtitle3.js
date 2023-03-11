import { Typography } from "@mui/material";
import React from "react";

function Subtitle3(props) {
  return (
    <Typography
      variant="subtitle2"
      color="text.primary"
      sx={{ fontSize: "14px", fontWeight: "500", letterSpacing: 0.5 }}
    >
      {props.text}
    </Typography>
  );
}

export default Subtitle3;
