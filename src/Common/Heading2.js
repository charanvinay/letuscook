import { Typography, useTheme } from "@mui/material";
import React from "react";

function Heading2(props) {
  const theme = useTheme();
  const bpSMd = theme.breakpoints.down("sm");
  return (
    <Typography
      gutterBottom
      variant="h1"
      sx={{
        fontSize: "16px",
        textTransform: "capitalize",
        color: "rgba(0, 0, 0, 0.8)",
        margin: "0px",
        marginRight: "10px",
        [bpSMd]: { fontSize: "15px" },
      }}
    >
      {props.text}
    </Typography>
  );
}

export default Heading2;
