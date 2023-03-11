import { Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import { BiCookie } from "react-icons/bi";

const color1 = "#B91372";
const color2 = "#6B0F1A";
const Snacks = () => {
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
      <BiCookie
        color="white"
        style={{[bpSMd]: { fontSize: "0.5em" } }}
      />
      <Typography variant="body2" sx={{ [bpSMd]: { fontSize: "0.8em" } }}>
        Snacks
      </Typography>
    </Stack>
  );
};

export default Snacks;
