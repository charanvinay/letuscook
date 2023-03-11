import { Typography, useTheme } from "@mui/material";
import React from "react";

function HeadingLG(props) {
  const theme = useTheme();
  const bpSMd = theme.breakpoints.down("sm"); //max-width:599.95px
  return (
    <Typography
      // gutterBottom
      variant="h1"
      sx={{
        fontSize: "40px",
        textTransform: "uppercase",
        fontWeight: "bold",
        letterSpacing: 2,
        color: "text.primary",
        margin: "20px 0px 5px 0px",
        [bpSMd]: { fontSize: "20px" },
      }}
    >
      {props.text}
    </Typography>
  );
}

export default HeadingLG;
