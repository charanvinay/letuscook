import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  Grid,
  IconButton,
  InputBase,
  Paper, Stack,
  Typography
} from "@mui/material";
import { grey } from "@mui/material/colors";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import NoData from "../../Assets/no_data_found.svg";
import { recipeServes, recipeTypes } from "../../Common/Constants";
import HeadingLGBlue from "../../Common/HeadingLGBlue";
import HeadingMD from "../../Common/HeadingMD";
import RecipeCardSkeleton from "../../Common/Skeletons/RecipeCard";
import {
  getFiltersState,
  setIsFiltersApplied,
  setRecipeServes,
  setRecipeType,
  setSearchText
} from "../../redux/slices/filtersSlice";
import { auth, db } from "../../services/firebase";
import RecipeCard from "./recipe_card";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Dashboard = () => {
  const [user, loading] = useAuthState(auth);
  const [recipesList, setRecipesList] = useState([]);
  const [loadding, setLoadding] = useState(true);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const filtersState = useSelector(getFiltersState);
  const [type, setType] = useState(filtersState.type);
  const [serves, setServes] = useState(filtersState.serves);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (loading) {
  //     return;
  //   }
  //   if (user) {
  //     getUserRecipes();
  //   }
  // }, [user, loading]);

  const getUserRecipes = async () => {
    setRecipesList([]);
    setLoadding(true);
    try {
      let user_ref = query(
        collection(db, "recipes"),
        where("title_keywords", "array-contains", filtersState.searchText?.toLowerCase()),
        // orderBy("type"),
        
      );
      let user_docs = await getDocs(user_ref);
      console.log(user_docs.docs);
      if (user_docs.docs.length > 0) {
        let recipes = [];
        user_docs.docs.map((doc) => {
          recipes.push({ _id: doc.id, ...doc.data() });
        });
        if (filtersState.type) {
          recipes = recipes.filter((dtype) => dtype.type == filtersState.type);
        }
        if (filtersState.serves) {
          recipes = recipes.filter(
            (dserves) => dserves.serves === filtersState.serves
          );
        }
        console.log(recipes);
        setRecipesList([...recipes]);
      }
      setLoadding(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserRecipes();
  }, [filtersState.searchText]);

  useEffect(() => {
    if (!showFiltersModal) {
      getUserRecipes();
    }
  }, [showFiltersModal, filtersState.type, filtersState.serves]);

  const handleFiltersModalClose = () => {
    handleResetType();
    handleResetServes();
    setShowFiltersModal(false);
    dispatch(setIsFiltersApplied({ isFiltersApplied: false }));
  };

  const handleFiltersModalApply = () => {
    setShowFiltersModal(false);
    setType(filtersState.type);
    setServes(filtersState.serves);
    dispatch(setIsFiltersApplied({ isFiltersApplied: true }));
  };

  const handleResetType = () => {
    setType(null);
    dispatch(setRecipeType({ type: null }));
  };
  const handleResetServes = () => {
    setServes(null);
    dispatch(setRecipeServes({ serves: null }));
  };

  const handleChanges = (val, type) => {
    let v = val;
    if (type === "image") {
      let file = val;
      // if (!file) return;
      // setShowSkeleton(true);
      // if (recipe.finish.imgSrc) {
      //   deletePreviousImage(recipe.finish.imgSrc);
      // }
      // handleUploadImage(file, type);
    } else {
      // dispatch(editFinish({ val: v, type }));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ paddingX: 3, paddingY: 4 }}>
      <HeadingLGBlue text1="Explore" text2="Recipes" />
      <input
                      id="test"
                      accept="image/*"
                      type="file"
                      capture 
                      name="imgSrc"
                      onChange={(e) => {
                        handleChanges(e.target.files[0], "image");
                      }}
                    />
      <Stack spacing={2} sx={{ marginY: 2 }}>
        <Paper
          component="form"
          elevation={0}
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Recipe"
            inputProps={{ "aria-label": "search recipe" }}
            value={filtersState.searchText}
            onChange={(e) => {
              e.preventDefault();
              console.log(e.target.value);
              dispatch(setSearchText({ searchText: e.target.value }));
            }}
          />
          {filtersState.searchText && (
            <IconButton
              type="button"
              sx={{ p: "10px" }}
              aria-label="search"
              onClick={() => dispatch(setSearchText({ searchText: "" }))}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Paper>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {filtersState.isFiltersApplied && (
            <Stack direction="row" spacing={1}>
              {Boolean(type) && (
                <Chip label={type} onDelete={handleResetType} />
              )}
              {Boolean(serves) && (
                <Chip
                  label={`Serves - ${serves}`}
                  onDelete={handleResetServes}
                />
              )}
            </Stack>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Button
              sx={{ alignItems: "start" }}
              startIcon={<FilterListIcon />}
              onClick={() => {
                setShowFiltersModal(true);
              }}
            >
              Filter
            </Button>
          </Box>
        </Box>
      </Stack>
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
          <img src={NoData} style={{ width: "150px", height: "150px" }} />
          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: grey[400] }}
          >
            No Recipes found {<br />} Click on the '+' button to add a recipe
          </Typography>
        </Box>
      )}
      <Dialog
        open={showFiltersModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleFiltersModalClose}
        aria-describedby="filters-dialog"
      >
        <DialogTitle>Select required filter</DialogTitle>
        <DialogContent>
          <HeadingMD text={"RECIPE TYPE"} width={70} />
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {recipeTypes.map((type, ind) =>
              filtersState.type == type ? (
                <Chip
                  label={type}
                  key={ind}
                  color="primary"
                  sx={{ fontFamily: "Poppins, sans-serif !important" }}
                  onClick={() => dispatch(setRecipeType({ type: type }))}
                />
              ) : (
                <Chip
                  label={type}
                  key={ind}
                  variant="outlined"
                  sx={{ fontFamily: "Poppins, sans-serif !important" }}
                  onClick={() => dispatch(setRecipeType({ type: type }))}
                />
              )
            )}
          </Stack>
          <HeadingMD text={"SERVES"} width={70} />
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {recipeServes.map((serve, ind) =>
              filtersState.serves == serve ? (
                <Chip
                  label={serve}
                  key={ind}
                  color="primary"
                  disabled={!filtersState.type}
                  sx={{ fontFamily: "Poppins, sans-serif !important" }}
                  onClick={() => dispatch(setRecipeServes({ serves: serve }))}
                />
              ) : (
                <Chip
                  label={serve}
                  key={ind}
                  variant="outlined"
                  disabled={!filtersState.type}
                  sx={{ fontFamily: "Poppins, sans-serif !important" }}
                  onClick={() => dispatch(setRecipeServes({ serves: serve }))}
                />
              )
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFiltersModalClose}>Clear</Button>
          <Button onClick={handleFiltersModalApply}>Apply</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
