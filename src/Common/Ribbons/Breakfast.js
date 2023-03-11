import { Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import { GiSlicedBread } from "react-icons/gi";

const color1 = "#00b4db";
const color2 = "#0083b0";
const Breakfast = () => {
  const theme = useTheme();
  const bpSMd = theme.breakpoints.down("sm");
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={0.5}
      sx={{
        color: "white",
        padding: "6px 8px",
        borderRadius: "10px",
        backgroundColor: color1,
        backgroundImage: `linear-gradient(133deg, ${color1} 0%, ${color2} 74%)`,
      }}
    >
      <GiSlicedBread
        color="white"
        style={{[bpSMd]: { fontSize: "0.5em" } }}
      />
      <Typography variant="body2" sx={{ [bpSMd]: { fontSize: "0.8em" } }}>
        Breakfast
      </Typography>
    </Stack>
  );
};

export default Breakfast;
