import { Box, Container, Grid, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { collection, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import NoData from "../../Assets/no_data_found.svg";
import HeadingLGBlue from "../../Common/HeadingLGBlue";
import SearchComp from "../../Common/SearchComp";
import RecipeCardSkeleton from "../../Common/Skeletons/RecipeCard";
import { getFiltersState } from "../../redux/slices/filtersSlice";
import { getLoggedUser } from "../../redux/slices/userSlice";
import { db } from "../../services/firebase";
import RecipeCard from "./recipe_card";

const Dashboard = (props) => {
  const [recipesList, setRecipesList] = useState([]);
  const [loadding, setLoadding] = useState(true);
  const filtersState = useSelector(getFiltersState);
  const loggedUser = useSelector(getLoggedUser);
  const location = useLocation();

  const getUserRecipes = async () => {
    setRecipesList([]);
    setLoadding(true);
    try {
      let user_ref = query(
        collection(db, "recipes"),
        where(
          "title_keywords",
          "array-contains",
          filtersState.searchText?.toLowerCase()
        )
      );
      let user_docs = await getDocs(user_ref);
      if (user_docs.docs.length > 0) {
        let recipes = [];
        user_docs.docs.map((doc) => {
          if (location.pathname == "/home") {
            recipes.push({ _id: doc.id, ...doc.data() });
          } else if (location.pathname == "/favourites") {
            let data = doc.data();
            if (data.favouritedBy.includes(loggedUser.uid)) {
              recipes.push({ _id: doc.id, ...data });
            }
          } else if (location.pathname == "/profile") {
            let data = doc.data();
            if (data.uid == loggedUser.uid) {
              recipes.push({ _id: doc.id, ...data });
            }
          }
        });
        if (location.pathname == "/profile") {
          props.recipesData({ recipe_count: recipes.length });
        }
        if (filtersState.type) {
          recipes = recipes.filter((dtype) => dtype.type === filtersState.type);
        }
        if (filtersState.serves) {
          recipes = recipes.filter(
            (dserves) => dserves.serves === filtersState.serves
          );
        }
        // console.log(recipes);
        setRecipesList([...recipes]);
      }
      setLoadding(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ paddingX: 3, paddingY: 4 }}>
      {location.pathname != "/profile" && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: [0, 1] }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        >
          <HeadingLGBlue
            text1="Explore"
            text2={
              location.pathname == "/home"
                ? "Recipes"
                : location.pathname == "/favourites"
                ? "Favourites"
                : ""
            }
          />
        </motion.div>
      )}
      <SearchComp getUserRecipes={getUserRecipes} />
      {loadding ? (
        <Grid container spacing={{ xs: 6, md: 3 }}>
          {[1, 2, 3].map((loader) => (
            <Grid item xs={12} md={4} key={loader}>
              <RecipeCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : recipesList.length > 0 ? (
        <Box sx={{ marginTop: 2 }}>
          <Grid container spacing={3}>
            {recipesList?.map((recipe) => {
              return (
                <Grid item xs={12} md={4} key={recipe._id}>
                  <RecipeCard
                    key={recipe._id}
                    recipe={recipe}
                    uid={location.pathname == "/profile" ? loggedUser.uid : null}
                    navTo={`/view?id=${recipe._id}`}
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
            height: "50vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={NoData}
            style={{ width: "150px", height: "150px" }}
            alt="No data"
            loading="lazy"
          />
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

export default Dashboard;
