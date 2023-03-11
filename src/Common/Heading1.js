import { Typography, useTheme } from "@mui/material";
import React from "react";

function Heading1(props) {
  const theme = useTheme();
  const bpSMd = theme.breakpoints.down("sm"); //max-width:599.95px
  return (
    <Typography
      // gutterBottom
      variant="h1"
      sx={{
        fontSize: "18px",
        textTransform: "capitalize",
        marginRight: "10px",
        [bpSMd]: { fontSize: "16px" },
      }}
    >
      {props.text}
    </Typography>
  );
}

export default Heading1;
