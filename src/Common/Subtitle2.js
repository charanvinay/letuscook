import { Typography, useTheme } from "@mui/material";
import React from "react";

function Subtitle2(props) {
  const theme = useTheme();
  const bpSMd = theme.breakpoints.down("sm");
  return (
    <Typography
      variant="subtitle2"
      color="text.secondary"
      sx={{ [bpSMd]: { fontSize: "12px" } }}
    >
      {props.text}
    </Typography>
  );
}

export default Subtitle2;
