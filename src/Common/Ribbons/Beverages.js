import { Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import { GiCoffeeCup } from "react-icons/gi";

const color1 = "#F2C17D";
const color2 = "#A44200";
const Beverages = () => {
  const theme = useTheme();
  const bpSMd = theme.breakpoints.down("sm");
  return (
    <Stack
      direction="row"
      alignItems="flex-start"
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
      <GiCoffeeCup
        color="white"
        style={{[bpSMd]: { fontSize: "0.5em" } }}
      />
      <Typography variant="body2" sx={{ [bpSMd]: { fontSize: "0.8em" } }}>
        Beverage
      </Typography>
    </Stack>
  );
};

export default Beverages;
