import { Stack, Typography, useTheme } from "@mui/material";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import React from "react";

const Serves = (props) => {
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
        backgroundColor: "#485461",
        backgroundImage: "linear-gradient(133deg, #485461 0%, #28313B 74%)",
      }}
    >
      <LocalDiningIcon color="white" sx={{fontSize: "1em", [bpSMd]: { fontSize: "1em" }}}/>
      <Typography variant="body2" sx={{[bpSMd]: { fontSize: "0.8em" }}}>Serves - {props.serves}</Typography>
    </Stack>
  );
};

export default Serves;
