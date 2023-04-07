import { Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import { primary } from "./Pallete";

function HeadingLGBlue(props) {
  const theme = useTheme();
  const bpSMd = theme.breakpoints.down("sm"); //max-width:599.95px
  return (
    <Stack
      direction="row"
      spacing={1}
      justifyContent="center"
      alignItems="center"
      sx={{ marginBottom: 3 }}
    >
      <Typography
        // gutterBottom
        variant="h1"
        sx={{
          fontSize: "40px",
          textTransform: "uppercase",
          fontWeight: "bold",
          letterSpacing: 2,
          color: primary,
          [bpSMd]: { fontSize: "20px" },
        }}
      >
        {props.text1}
      </Typography>
      <Typography
        // gutterBottom
        variant="h1"
        sx={{
          fontSize: "40px",
          textTransform: "uppercase",
          fontWeight: "bold",
          letterSpacing: 2,
          color: "text.primary",
          [bpSMd]: { fontSize: "20px" },
        }}
      >
        {props.text2}
      </Typography>
    </Stack>
  );
}

export default HeadingLGBlue;
