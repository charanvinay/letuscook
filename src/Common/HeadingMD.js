import { Box, Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import { primary } from "./Pallete";

function HeadingMD(props) {
  const theme = useTheme();
  const bpSMd = theme.breakpoints.down("sm"); //max-width:599.95px
  return (
    <Stack sx={{ marginY: "15px" }} spacing={0.2}>
      <Typography
        // gutterBottom
        variant="h1"
        sx={{
          fontSize: "20px",
          textTransform: "capitalize",
          marginY: props.width && "3px",
          color: props.color || "text.primary",
          letterSpacing: 1,
          [bpSMd]: { fontSize: "16px" },
        }}
      >
        {props.text}
      </Typography>
      {props.width && (
        <Box sx={{ width: props.width, height: 2, backgroundColor: primary }} />
      )}
      {props.width && (
        <Box
          sx={{ width: props.width / 2, height: 2, backgroundColor: primary }}
        />
      )}
    </Stack>
  );
}

export default HeadingMD;
