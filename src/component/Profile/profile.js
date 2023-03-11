import { Avatar, Box, Fab, Stack, Typography } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import UserRecipes from "./user_recipes";
import { useSelector } from "react-redux";
import { getLoggedUser } from "../../redux/slices/userSlice";
// import TopCover from "../../Assets/coverblack.jpg";
import TopCover from "../../Assets/coverslate.jpg";
import { bgBody, primary } from "../../Common/Pallete";

const Profile = () => {
  const navigate = useNavigate();
  const loggedUser = useSelector(getLoggedUser);

  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={{ width: "100%", height: 150, backgroundColor: bgBody }}>
        <img
          src={TopCover}
          alt="Cover Photo"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>
      <Box sx={{ height: 50, position: "relative" }}>
        <Avatar
          alt={loggedUser.name}
          src={loggedUser.photoURL || "/static/images/avatar/1.jpg"}
          sx={{
            width: 100,
            height: 100,
            position: "absolute",
            left: "50%",
            top: "-50%",
            border:"5px solid white",
            transform: "translate(-50%, -25%)",
          }}
        />
      </Box>
      <Stack sx={{textAlign:"center",margin:"15px 0px 0px 0px"}} spacing={1} >
        <Typography variant="h4" sx={{textTransform: "capitalize"}}>{loggedUser.name}</Typography>
      </Stack>
      <UserRecipes />
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

export default Profile;
