import {
  Avatar,
  Box,
  Container,
  Fab,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import moment from "moment";
import React, { useEffect, useState } from "react";
import HeadingMD from "../../Common/HeadingMD";
import HeadingXLBold from "../../Common/HeadingXLBold";
import ImgWithBorder from "../../Common/ImgWithBorder";
import Subtitle1 from "../../Common/Subtitle1";

import EditIcon from "@mui/icons-material/Edit";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { BookLoaderComponent } from "../../Common/BookLoader";
import { returnType } from "../../Common/Constants";
import Serves from "../../Common/Ribbons/Serves";
import { setSelectedRecipe } from "../../redux/slices/recipeSlice";
import { getLoggedUser } from "../../redux/slices/userSlice";
import { db } from "../../services/firebase";
import OtherRecipes from "./other_recipes";
import { motion } from "framer-motion";
import TopProgress from "../../Common/top_progress";

const RecipeDetails = () => {
  const [recipe, setRecipe] = useState({});
  const [loading, setLoading] = useState(true);
  const search = useLocation().search;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const bpSMd = theme.breakpoints.down("md");
  const id = new URLSearchParams(search).get("id");
  const loggedUser = useSelector(getLoggedUser);
  // const { scrollYProgress } = useScroll();

  useEffect(() => {
    // console.log(id);
    if (id) {
      viewRecipe(id);
    }
  }, [id]);

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
          <Box className="fixed-image" sx={{ width: "100%", height: 250 }}>
            <img
              src={recipe.finish.imgSrc}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              loading="lazy"
              alt="Recipe Image"
            />
          </Box>

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
                <Grid item md={12} lg={8}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    staggerChildren={0.3}
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ y: [20, 0], opacity: [0, 1] }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <Stack direction={"row"} spacing={1}>
                        <Avatar src={recipe.photoURL} />
                        <Stack>
                          <Typography
                            variant="body2"
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: "bold",
                              fontFamily: "Poppins, sans-serif !important",
                            }}
                          >
                            {recipe.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: grey[600] }}
                          >
                            posted on {moment(recipe.createdAt).format("LLL")}
                          </Typography>
                        </Stack>
                      </Stack>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ y: [20, 0], opacity: [0, 1] }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                        delay: 0.5,
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
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ y: [20, 0], opacity: [0, 1] }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                        delay: 0.8,
                      }}
                    >
                      <Box sx={{ margin: "20px 0 10px 0" }}>
                        <HeadingMD text={"INGREDIENTS"} width={70} />
                      </Box>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ y: [20, 0], opacity: [0, 1] }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                        delay: 1.2,
                      }}
                    >
                      <Stack spacing={1} sx={{ margin: "5px 10px" }}>
                        <table>
                          <thead>
                            <tr>
                              <th style={{ width: "50px" }}>S.No</th>
                              <th>Name</th>
                              <th>Units</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recipe.ingredients.map((step, skey) => {
                              return (
                                <tr key={step.id}>
                                  <td>{skey + 1}</td>
                                  <td>
                                    <Subtitle1 text={step.value} />
                                  </td>
                                  <td>
                                    <Subtitle1 text={step.units} />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </Stack>
                    </motion.div>
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
                                delay: 0.1 * skey,
                              }}
                            >
                              <li key={step.id} style={{ marginLeft: "12px" }}>
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
                        delay: 1,
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
                        delay: 1.2,
                      }}
                    >
                      <Stack direction={"column"} spacing={2}>
                        <Subtitle1 text={recipe.finish.value} />
                      </Stack>
                    </motion.div>
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
                      variant="outlined"
                      sx={{ borderRadius: "5px", overflow: "hidden" }}
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
              ></Box>
            </Container>
          </Box>
        </>
      )}
    </>
  );
};

export default RecipeDetails;
