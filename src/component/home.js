import AddIcon from "@mui/icons-material/Add";
import { Box, Fab } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Recipe/dashboard";

const Home = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ position: "relative" }}>
      <Dashboard/>
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
