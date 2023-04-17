import AddIcon from "@mui/icons-material/Add";
import { Box, Fab } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { initialState, setSelectedRecipe } from "../redux/slices/recipeSlice";
import Dashboard from "./Recipe/dashboard";
import { getLoggedUser } from "../redux/slices/userSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedUser = useSelector(getLoggedUser);

  return (
    <Box sx={{ position: "relative" }}>
      <Dashboard />
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        onClick={() => {
          if (loggedUser && loggedUser.uid) {
            dispatch(setSelectedRecipe(initialState));
            navigate("/add");
          } else {
            navigate("/login");
          }
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default Home;
