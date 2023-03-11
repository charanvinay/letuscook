import AddIcon from "@mui/icons-material/Add";
import { Box, Fab } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Favorite from "./Profile/favourites";
import Dashboard from "./Recipe/dashboard";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Box sx={{ position: "relative" }}>
      {location.pathname === "/home" && <Dashboard/>}
      {location.pathname === "/favourites" && <Favorite/>}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        onClick={() => navigate("/add")}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default Home;
