import { Typography, useTheme } from "@mui/material";
import React from "react";

function SubtitleLG(props) {
  const theme = useTheme();
  const bpSMd = theme.breakpoints.down("sm"); //max-width:599.95px
  return (
    <Typography
      // gutterBottom
      variant="h1"
      sx={{
        fontSize: "20px",
        textTransform: "capitalise",
        letterSpacing: 1,
        color: "text.primary",
        margin: "5px 0px",
        [bpSMd]: { fontSize: "16px" },
      }}
    >
      {props.text}
    </Typography>
  );
}

export default SubtitleLG;
