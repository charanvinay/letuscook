import { Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import { RiLeafLine } from "react-icons/ri";

const color1 = "#74D680";
const color2 = "#378B29";
const Veg = () => {
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
      <RiLeafLine
        color="white"
        style={{[bpSMd]: { fontSize: "0.5em" } }}
      />
      <Typography variant="body2" sx={{ [bpSMd]: { fontSize: "0.8em" } }}>
        Veg
      </Typography>
    </Stack>
  );
};

export default Veg;
