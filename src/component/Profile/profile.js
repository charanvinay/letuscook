import AddIcon from "@mui/icons-material/Add";
import { Box, Fab } from "@mui/material";
import { collection, getDocs, query } from "firebase/firestore";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from "../../redux/slices/userSlice";
import { db } from "../../services/firebase";
import Dashboard from "../Recipe/dashboard";
import ProfileCard from "./profile_card";

const Profile = () => {
  const [recipesCount, setRecipesCount] = useState(0);
  const [favouritesCount, setFavouritesCount] = useState(0);

  const navigate = useNavigate();
  const loggedUser = useSelector(getLoggedUser);

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
        <ProfileCard
          username={loggedUser.name}
          recipesCount={recipesCount}
          favouritesCount={favouritesCount}
        />
        <Dashboard
          recipesData={(e) => {
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
