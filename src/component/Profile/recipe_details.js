import {
  Box,
  Container,
  Fab,
  Grid,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import HeadingMD from "../../Common/HeadingMD";
import HeadingXLBold from "../../Common/HeadingXLBold";
import Subtitle1 from "../../Common/Subtitle1";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import GradientBLACK from "../../Assets/20210113_083213.png";
import { BookLoaderComponent } from "../../Common/BookLoader";
import { returnType } from "../../Common/Constants";
import Serves from "../../Common/Ribbons/Serves";
import ToggleSwitch from "../../Common/toggle_switch";
import TopProgress from "../../Common/top_progress";
import { setSelectedRecipe } from "../../redux/slices/recipeSlice";
import {
  getActiveTab,
  getIsMobile,
  setActiveTab,
} from "../../redux/slices/userSlice";
import { db } from "../../services/firebase";
import OtherRecipes from "./other_recipes";

const RecipeDetails = () => {
  const [recipe, setRecipe] = useState({});
  const [loading, setLoading] = useState(true);
  const search = useLocation().search;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [liked, setLiked] = useState(false);
  const bpSMd = theme.breakpoints.down("md");
  const id = new URLSearchParams(search).get("id");
  const isMobile = useSelector(getIsMobile);
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const activeTab = useSelector(getActiveTab);
  // const { scrollYProgress } = useScroll();

  useEffect(() => {
    // console.log(id);
    if (id) {
      viewRecipe(id);
      dispatch(setActiveTab(1));
    }
  }, [id]);

  useEffect(() => {
    if (recipe && recipe.favouritedBy) {
      console.log(recipe.favouritedBy, loggedUser.uid);
      let cond = recipe.favouritedBy.includes(loggedUser.uid);
      console.log(cond);
      setLiked(cond);
    }
  }, [recipe]);

  const handleLikeRecipe = () => {
    const taskDocRef = doc(db, "recipes", recipe._id);
    // console.log(taskDocRef, recipe);
    try {
      let favourited_by = recipe.favouritedBy;
      if (liked) {
        favourited_by = favourited_by.filter((id) => id !== loggedUser.uid);
      } else {
        favourited_by = [...favourited_by, loggedUser.uid];
      }
      let recipe_obj = {
        favouritedBy: favourited_by,
      };
      updateDoc(taskDocRef, recipe_obj)
        .then((res) => {
          // console.log(res);
          setLiked(!liked);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const handleGoBack = () => navigate(-1);

  const viewRecipe = (id) => {
    setLoading(true);
    const docRef = doc(db, "recipes", id);
    try {
      getDoc(docRef)
        .then((docSnap) => {
          // console.log(docSnap.data());
          setRecipe({ _id: id, ...docSnap.data() });
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <>
      {loading ? (
        <BookLoaderComponent height={"90vh"} />
      ) : (
        <>
          <Box
            className="fixed-image"
            sx={{ width: "100%", height: isMobile ? 300 : 250 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              style={{ height: "100%", width: "100%" }}
              whileInView={{ y: [-5, 0], opacity: [1] }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
            >
              <img
                src={recipe.finish.imgSrc}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
                alt="Recipe Image"
              />
            </motion.div>
            <Box
              sx={{
                position: "absolute",
                transform: "rotate(180deg)",
                top: -150,
                left: 0,
                // display: "none",
                [bpSMd]: { top: -10 },
              }}
            >
              <img
                style={{
                  width: "100%",
                }}
                alt={"Gradient"}
                loading="lazy"
                src={GradientBLACK}
              />
            </Box>
            <Tooltip title="Go Back">
              <IconButton
                size="large"
                sx={{
                  position: "absolute",
                  top: 5,
                  left: 5,
                  backgroundColor: "rgba(0,0,0,0.2) !important",
                }}
                onClick={handleGoBack}
              >
                <ArrowBackIcon sx={{ fontSize: "1.5rem", color: "white" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add to favourite">
              <IconButton
                size="large"
                sx={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  backgroundColor: "rgba(0,0,0,0.2) !important",
                }}
                onClick={(e) => handleLikeRecipe()}
              >
                {liked ? (
                  <FavoriteIcon sx={{ fontSize: "1.5rem", color: "white" }} />
                ) : (
                  <FavoriteBorderIcon
                    sx={{ fontSize: "1.5rem", color: "white" }}
                  />
                )}
              </IconButton>
            </Tooltip>
            <Box
              sx={{
                position: "absolute",
                top: 10,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <Stack direction={"row"} spacing={1}>
                <Stack justifyContent="center" alignItems="center">
                  <Typography
                    variant="body2"
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: "bold",
                      color: "white",
                      fontFamily: "Poppins, sans-serif !important",
                    }}
                  >
                    {recipe.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "white" }}>
                    {moment(recipe.createdAt).format("LLL")}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ y: [20, 0], opacity: [1] }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
          >
            <Box
              sx={{
                position: "relative",
                borderRadius: "15px 15px 0px 0px",
                backgroundColor: "#EDF2F8",
                boxShadow: " 0 -10px 20px 0px rgba(0, 0, 0, 0.6)",
              }}
            >
              {/* <motion.div className="progress-bar" style={{ scaleX: scrollYProgress }} />  */}
              <TopProgress />
              <Container sx={{ position: "relative" }}>
                <Grid
                  container
                  spacing={{ xs: 6, md: 3 }}
                  sx={{
                    paddingTop: 3,
                    paddingBottom: 4,
                    [bpSMd]: { paddingTop: 1 },
                  }}
                >
                  <Grid
                    item
                    md={12}
                    lg={8}
                    sx={{
                      width: "100%",
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      staggerChildren={0.3}
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ y: [20, 0], opacity: [0, 1] }}
                        transition={{
                          duration: 0.5,
                          ease: "easeInOut",
                        }}
                      >
                        <Box>
                          <HeadingXLBold text={recipe.title} />
                          <Stack
                            direction={"row"}
                            spacing={0.5}
                            alignItems="center"
                          >
                            {returnType(recipe.type)}
                            <Serves serves={recipe.serves} />
                          </Stack>
                        </Box>
                      </motion.div>
                      <Box
                        sx={{
                          display: "none",
                          [bpSMd]: { display: "block" },
                        }}
                      >
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ y: [20, 0], opacity: [0, 1] }}
                          transition={{
                            duration: 0.5,
                            ease: "easeInOut",
                          }}
                        >
                          <ToggleSwitch />
                        </motion.div>
                      </Box>
                      <Box
                        sx={{
                          [bpSMd]: { display: "none" },
                        }}
                      >
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ y: [20, 0], opacity: [0, 1] }}
                          transition={{
                            duration: 0.5,
                            ease: "easeInOut",
                          }}
                        >
                          <Box sx={{ margin: "20px 0 10px 0" }}>
                            <HeadingMD text={"INGREDIENTS"} width={70} />
                          </Box>
                        </motion.div>
                      </Box>
                      <Box
                        sx={{
                          [bpSMd]: {
                            display: activeTab == 2 ? "none" : "block",
                          },
                        }}
                      >
                        <Grid container spacing={{ xs: 1, md: 3 }}>
                          {recipe.ingredients.map((step, skey) => {
                            return (
                              <Grid
                                item
                                md={6}
                                lg={6}
                                sx={{
                                  width: "100%",
                                }}
                              >
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  key={skey}
                                  whileInView={{ y: [20, 0], opacity: [0, 1] }}
                                  transition={{
                                    duration: 0.5,
                                    ease: "easeInOut",
                                  }}
                                >
                                  <Stack
                                    direction={"row"}
                                    justifyContent="space-between"
                                    className="row-item"
                                  >
                                    <Subtitle1 text={step.value} />
                                    <Subtitle1
                                      text={step.units}
                                      color={"rgb(46 103 175)"}
                                      fontWeight="bold"
                                    />
                                  </Stack>
                                </motion.div>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>
                      <Box
                        sx={{
                          [bpSMd]: {
                            display: activeTab == 1 ? "none" : "block",
                          },
                        }}
                      >
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ y: [20, 0], opacity: [0, 1] }}
                          transition={{
                            duration: 0.5,
                            ease: "easeInOut",
                          }}
                        >
                          <Box sx={{ margin: "25px 0px 15px 0px" }}>
                            <HeadingMD text={"STEPS"} width={35} />
                          </Box>
                        </motion.div>
                        <Stack spacing={1} sx={{ margin: "5px 10px" }}>
                          <ol type="1">
                            {recipe.steps.map((step, skey) => {
                              return (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  whileInView={{ y: [20, 0], opacity: [0, 1] }}
                                  transition={{
                                    duration: 0.5,
                                    ease: "easeInOut",
                                  }}
                                >
                                  <li
                                    key={step.id}
                                    style={{ marginLeft: "12px" }}
                                  >
                                    <Subtitle1 text={step.value} />
                                  </li>
                                </motion.div>
                              );
                            })}
                          </ol>
                        </Stack>
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ y: [20, 0], opacity: [0, 1] }}
                          transition={{
                            duration: 0.5,
                            ease: "easeInOut",
                          }}
                        >
                          <Box sx={{ margin: "20px 0 10px 0" }}>
                            <HeadingMD text={"FINAL STEP"} width={50} />
                          </Box>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ y: [20, 0], opacity: [0, 1] }}
                          transition={{
                            duration: 0.5,
                            ease: "easeInOut",
                          }}
                        >
                          <Stack direction={"column"} spacing={2}>
                            <Subtitle1 text={recipe.finish.value} />
                          </Stack>
                        </motion.div>
                      </Box>
                      {loggedUser.uid === recipe.uid && (
                        <Fab
                          color="primary"
                          aria-label="add"
                          sx={{
                            position: "fixed",
                            bottom: 16,
                            right: 16,
                          }}
                          onClick={() => {
                            navigate("/edit");
                            dispatch(setSelectedRecipe(recipe));
                          }}
                        >
                          <EditIcon />
                        </Fab>
                      )}
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ y: [20, 0], opacity: [0, 1] }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                      }}
                    >
                      <Paper
                        sx={{
                          borderRadius: "8px",
                          padding: "10px",
                          overflow: "hidden",
                          boxShadow: "0px 1px 8px rgb(23 110 222 / 10%)",
                        }}
                      >
                        <OtherRecipes uid={recipe.uid} name={recipe.name} />
                      </Paper>
                    </motion.div>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "none",
                    position: "absolute",
                    top: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "50px",
                    height: "8px",
                    borderRadius: "5px",
                    backgroundColor: "rgb(0 0 0 / 12%)",
                    [bpSMd]: { display: "block" },
                  }}
                />
              </Container>
            </Box>
          </motion.div>
        </>
      )}
    </>
  );
};

export default RecipeDetails;
