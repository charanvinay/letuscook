import AddIcon from "@mui/icons-material/Add";
import {
  Avatar,
  Box,
  Card,
  Container,
  Divider,
  Fab,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from "../../redux/slices/userSlice";
import UserRecipes from "./user_recipes";
// import TopCover from "../../Assets/coverblack.jpg";
import { collection, getDocs, query } from "firebase/firestore";
import { motion } from "framer-motion";
import { useState } from "react";
import { db } from "../../services/firebase";
// import RightImg from "../../Assets/chicken.png";
// import RightImg from "../../Assets/slicer.png";

const Profile = () => {
  const navigate = useNavigate();
  const loggedUser = useSelector(getLoggedUser);
  const [recipesCount, setRecipesCount] = useState(0);
  const [favouritesCount, setFavouritesCount] = useState(0);
  const theme = useTheme();
  const bpSMd = theme.breakpoints.down("md");

  useEffect(() => {
    if (loggedUser) {
      getUserRecipes();
    }
  }, [loggedUser]);
  const getUserRecipes = async () => {
    let user_ref = query(
      collection(db, "recipes")
      // where("uid", "==", user?.uid)
    );
    let user_docs = await getDocs(user_ref);
    // console.log(user_docs.docs);
    if (user_docs.docs.length > 0) {
      setFavouritesCount(0);
      user_docs.docs.map((doc) => {
        let data = doc.data();
        if (data.favouritedBy.includes(loggedUser.uid)) {
          setFavouritesCount((e) => e + 1);
        }
      });
      // console.log(recipes);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ y: [20, 0], opacity: [0, 1] }}
      transition={{
        duration: 0.6,
        ease: "easeInOut",
      }}
    >
      <Box sx={{ position: "relative", marginY: 2 }}>
        <Container>
          <Card
            sx={{
              borderRadius: "10px",
              position: "relative",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100px",
              // backgroundImage:
              //   "linear-gradient(25deg, #142374, #1922a0, #1a1ccf, #150bff)",
              backgroundImage:
                "linear-gradient(25deg, #0012d9, #1c43e6, #1f67f2, #0489ff)",
              boxShadow:
                "1px 2px 2px hsl(0deg 0% 50% / 0.2), 2px 4px 4px hsl(0deg 0% 50% / 0.2), 4px 8px 8px hsl(0deg 0% 50% / 0.2), 8px 16px 16px hsl(0deg 0% 50% / 0.2), 16px 32px 32px hsl(0deg 0% 50% / 0.2)",
            }}
          >
            <Stack
              // spacing={2}
              alignItems="center"
              flexDirection="row"
              justifyContent="center"
              sx={{
                [bpSMd]: {
                  justifyContent: "space-around",
                },
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ scale: [0, 1], opacity: [0, 1] }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    alt={loggedUser.name}
                    src={loggedUser.photoURL || "/static/images/avatar/1.jpg"}
                    sx={{
                      width: 80,
                      height: 80,
                      boxShadow: "0px 1px 30px rgba(0, 0, 0, 0.26)",
                    }}
                  />
                </Box>
              </motion.div>
              <Stack
                sx={{ textAlign: "center", marginLeft: 4 }}
                spacing={1}
                alignItems="center"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ y: [20, 0], opacity: [0, 1] }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      textTransform: "capitalize",
                      color: "white",
                      [bpSMd]: {
                        fontSize: "25px",
                      },
                    }}
                  >
                    {loggedUser.name}
                  </Typography>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ y: [20, 0], opacity: [0, 1] }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  <Stack direction="row" justifyContent="center" spacing={2}>
                    <Stack>
                      <Typography
                        variant="body1"
                        sx={{ textTransform: "capitalize", color: "white" }}
                      >
                        Recipes
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ textTransform: "capitalize", color: "white" }}
                      >
                        {recipesCount}
                      </Typography>
                    </Stack>
                    <Divider
                      orientation="vertical"
                      variant="middle"
                      flexItem
                      sx={{ borderColor: "rgba(255, 255, 255,0.2)" }}
                    />
                    <Stack>
                      <Typography
                        variant="body1"
                        sx={{ textTransform: "capitalize", color: "white" }}
                      >
                        Favourites
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ textTransform: "capitalize", color: "white" }}
                      >
                        {favouritesCount}
                      </Typography>
                    </Stack>
                  </Stack>
                </motion.div>
              </Stack>
            </Stack>
            <Box
              sx={{
                position: "absolute",
                top: -70,
                left: -100,
                width: 150,
                height: 150,
                borderRadius: "50%",
                border: "30px solid rgba(255, 255, 255,0.1)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -40,
                right: -40,
                width: 150,
                height: 150,
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255,0.1)",
              }}
            />
          </Card>
        </Container>

        <UserRecipes
          recipesData={(e) => {
            console.log(e);
            setRecipesCount(e.recipe_count);
          }}
        />
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
    </motion.div>
  );
};

export default Profile;
