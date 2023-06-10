import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import NotFound from "../Assets/404page.png";
import HeadingXLBold from "./HeadingXLBold";
import { primary } from "./Pallete";
import HeadingMD from "./HeadingMD";
import { useNavigate } from "react-router-dom";
import RingLG from "./Shapes/RingLG";
import CircleLG from "./Shapes/CircleLG";

const PageNotFound = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const bpSMd = theme.breakpoints.down("sm"); //max-width:599.95px

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100dvh",
      }}
    >
      <RingLG d_sm_none={true}/>
      <CircleLG d_sm_none={true}/>
      <Stack
        spacing={4}
        alignItems="center"
        className="notfound-CTA"
        sx={{
          height: "100%",
          padding: "30px",
          marginTop: "30px",
          [bpSMd]: {
            marginTop: "40%",
          },
        }}
      >
        <Typography
          // gutterBottom
          variant="h1"
          sx={{
            fontSize: "60px",
            textTransform: "uppercase",
            fontWeight: "bold",
            letterSpacing: 2,
            color: primary,
            fontFamily: "Product Sans Bold",
            margin: "0px 0px 5px 0px",
          }}
        >
          OOPS!!!
        </Typography>
        <Typography
          // gutterBottom
          variant="h1"
          sx={{
            fontSize: "16px",
            color: "text.primary",
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          The page you are looking for is not in the menu.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/home")}
          sx={{
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Go to Home Screen
        </Button>
      </Stack>
      <Box className="not-found">
        <img
          src={NotFound}
          alt="Not Found"
          style={{ width: "100%", height: "100%" }}
        />
      </Box>
    </Box>
  );
};

export default PageNotFound;
