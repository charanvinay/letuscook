import { Typography, useTheme } from "@mui/material";
import React from "react";

function HeadingXLBold(props) {
  const theme = useTheme();
  const bpSMd = theme.breakpoints.down("sm"); //max-width:599.95px
  return (
    <Typography
      // gutterBottom
      variant="h1"
      sx={{
        fontSize: "50px",
        textTransform: "uppercase",
        fontWeight: "bold",
        letterSpacing: 2,
        color: "text.primary",
        fontFamily: "Product Sans Bold",
        margin: "20px 0px 5px 0px",
        [bpSMd]: { fontSize: "35px", margin:"20px 0px 10px 0px" },
      }}
    >
      {props.text}
    </Typography>
  );
}

export default HeadingXLBold;
