import { Box, Container, Grid, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { collection, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NoData from "../../Assets/no_data_found.svg";
import HeadingLGBlue from "../../Common/HeadingLGBlue";
import RecipeCardSkeleton from "../../Common/Skeletons/RecipeCard";
import { getLoggedUser } from "../../redux/slices/userSlice";
import { db } from "../../services/firebase";
import RecipeCard from "../Recipe/recipe_card";
import { motion } from "framer-motion";

const Favorite = () => {
  const [recipesList, setRecipesList] = useState([]);
  const [loadding, setLoadding] = useState(true);
  const loggedUser = useSelector(getLoggedUser);

  useEffect(() => {
    if (loggedUser) {
      getUserRecipes();
    }
  }, [loggedUser]);

  const getUserRecipes = async () => {
    setRecipesList([]);
    setLoadding(true);
    let user_ref = query(
      collection(db, "recipes")
      // where("uid", "==", user?.uid)
    );
    let user_docs = await getDocs(user_ref);
    // console.log(user_docs.docs);
    if (user_docs.docs.length > 0) {
      let recipes = [];
      user_docs.docs.map((doc) => {
        let data = doc.data();
        if (data.favouritedBy.includes(loggedUser.uid)) {
          recipes.push({ _id: doc.id, ...data });
        }
      });
      // console.log(recipes);
      setRecipesList([...recipes]);
    }
    setLoadding(false);
  };

  return (
    <Container maxWidth="lg" sx={{ p: 3 }}>
      {loadding && (
        <Grid container spacing={{ xs: 6, md: 3 }}>
          {[1, 2, 3, 4, 5, 6].map((loader) => (
            <Grid item xs={12} md={4} key={loader}>
              <RecipeCardSkeleton />
            </Grid>
          ))}
        </Grid>
      )}
      {!loadding && recipesList.length > 0 ? (
        <Box sx={{ marginTop: 2 }}>
          <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1] }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      >

          <HeadingLGBlue text1="Explore" text2="Favourites" />
      </motion.div>
          <Grid container spacing={3} sx={{ marginTop: 2 }}>
            {recipesList?.map((recipe) => {
              return (
                <Grid item xs={12} md={4} key={recipe._id}>
                  <RecipeCard
                    key={recipe._id}
                    recipe={recipe}
                    navTo={`/view?id=${recipe._id}`}
                    isReloadList={true}
                    getUserRecipes={getUserRecipes}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            height: "80vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={NoData} style={{ width: "150px", height: "150px" }} alt="No data"/>
          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: grey[400] }}
          >
            No Recipes found {<br />} Click on the '+' button to add a recipe
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Favorite;
