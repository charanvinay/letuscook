import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { motion } from "framer-motion";
import moment from "moment";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import GradientBLACK from "../../Assets/20210113_083213.png";
import { BookLoaderComponent } from "../../Common/BookLoader";
import CSTMSelect from "../../Common/CSTMSelect";
import CSTMTextField from "../../Common/CSTMTextField";
import {
  capitalize,
  getAllSubstrings,
  getUniqueId,
  recipeServes,
  recipeTypes,
  returnType,
} from "../../Common/Constants";
import CustomBackdrop from "../../Common/CustomBackdrop";
import EditOutlineBTN from "../../Common/EditOutlineBTN";
import ErrorAlert from "../../Common/ErrorAlert";
import HeadingMD from "../../Common/HeadingMD";
import HeadingXLBold from "../../Common/HeadingXLBold";
import Serves from "../../Common/Ribbons/Serves";
import CKeditor from "../../Common/Skeletons/CKeditor";
import Step from "../../Common/Skeletons/Step";
import Subtitle1 from "../../Common/Subtitle1";
import SuccessAlert from "../../Common/SuccessAlert";
import deletePreviousImage from "../../Common/deletePreviousImage";
import ToggleSwitch from "../../Common/toggle_switch";
import TopProgress from "../../Common/top_progress";
import {
  addItem,
  deleteItem,
  editFinish,
  editItem,
  getRecipe,
  handlePrimitiveState,
  setSelectedRecipe,
} from "../../redux/slices/recipeSlice";
import {
  getActiveTab,
  getIsMobile,
  setActiveTab,
} from "../../redux/slices/userSlice";
import { db, storage } from "../../services/firebase";
import OtherRecipes from "./other_recipes";
const CKeditorRender = lazy(() => import("../../Common/CKEditorComp.js"));

const RecipeDetails = () => {
  const [open, setOpen] = useState(false);
  const [recipe, setRecipe] = useState({});
  const [liked, setLiked] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState(false);
  const [successText, setSuccessText] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [errorSnackOpen, setErrorSnackOpen] = useState(false);
  const [displayEditors, setDisplayEditors] = useState(false);
  const [successSnackOpen, setSuccessSnackOpen] = useState(false);

  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const search = useLocation().search;

  const isMobile = useSelector(getIsMobile);
  const activeTab = useSelector(getActiveTab);
  const selectedRecipe = useSelector(getRecipe);

  const bpSMd = theme.breakpoints.down("md");
  const id = new URLSearchParams(search).get("id");
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  // useEffect(() => {
  //   if (!loggedUser) {
  //     return navigate("/login");
  //   }
  // }, [loggedUser]);

  useEffect(() => {
    // console.log(id);
    if (id) {
      getRecipeDetails(id);
    }
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayEditors(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (recipe && recipe.favouritedBy) {
      console.log(recipe.favouritedBy, loggedUser?.uid);
      let cond = recipe.favouritedBy.includes(loggedUser?.uid);
      console.log(cond);
      setLiked(cond);
    }
  }, [recipe]);

  const getRecipeDetails = (id) => {
    setLoading(true);
    const docRef = doc(db, "recipes", id);
    try {
      getDoc(docRef)
        .then((docSnap) => {
          // console.log(docSnap.data());
          dispatch(setActiveTab(1));
          setRecipe({ _id: id, ...docSnap.data() });
          dispatch(setSelectedRecipe({ _id: id, ...docSnap.data() }));
          document.title = `${capitalize(docSnap.data().title)} | LetUsCook`;
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

  const handleAdd = (name) => {
    let obj;
    if (name === "ingredients") {
      obj = {
        id: getUniqueId(),
        errors: [],
        units: "",
        value: "",
      };
      dispatch(addItem({ name: "ingredients", value: obj }));
    } else if (name === "steps") {
      obj = {
        id: getUniqueId(),
        errors: [],
        value: null,
      };
      dispatch(addItem({ name: "steps", value: obj }));
    }
  };

  const handleEditRecipe = (field) => {
    setOpen(true);
    setSelectedField(field);
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    dispatch(handlePrimitiveState({ name, value }));
  };

  const handleListChanges = (id, value, name, type) => {
    dispatch(editItem({ id, name, value, type }));
  };

  const handleFinish = (val, type) => {
    let v = val;
    if (type === "image") {
      let file = val;
      if (!file) return;
      setLoader(true);
      if (selectedRecipe.finish.imgSrc) {
        deletePreviousImage(selectedRecipe.finish.imgSrc);
      }
      handleUploadImage(file, type);
    } else {
      dispatch(editFinish({ val: v, type }));
    }
  };

  const handleUploadImage = (file, type) => {
    const storageRef = ref(
      storage,
      `images/${loggedUser.uid}/${getUniqueId()}`
    );
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            console.log(url);
            dispatch(editFinish({ val: url, type }));
            handleUpdate(type, url);
          })
          .catch((error) => {
            console.log(error.message);
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handledeleteItem = (name, _id) => {
    dispatch(deleteItem({ name: name, id: _id }));
  };

  const handleValidation = (values) => {
    const errors = {};
    if (selectedField == "Title" && !values.title) {
      errors.title = "Please enter the title of your recipe";
    } else if (selectedField == "Type & Serves") {
      if (!values.type) {
        errors.type = "Please select the type of your recipe";
      }
      if (!values.serves) {
        errors.serves = "Please select the serves of your recipe";
      }
    } else if (selectedField == "Ingredients") {
      if (values.ingredients.length < 1) {
        errors.description = "Add minimum one ingredient";
      } else {
        values.ingredients.map((ingredient, ikey) => {
          if (!Boolean(ingredient.value)) {
            errors[
              `Ingredient ${ikey + 1}`
            ] = `Please enter the name of Ingredient ${ikey + 1}`;
          } else if (!Boolean(ingredient.units)) {
            errors[
              `Ingredient ${ikey + 1}`
            ] = `Please enter the units of Ingredient ${ikey + 1}`;
          }
        });
      }
    } else if (selectedField == "Steps") {
      values.steps.map((step, skey) => {
        if (!Boolean(step.value)) {
          errors[`Step ${skey + 1}`] = `Please fill Step ${skey + 1}`;
        }
      });
    } else if (selectedField == "Final Step") {
      if (!Boolean(selectedRecipe.finish.value)) {
        errors[`Value`] = `Please fill the final step`;
      }
    }
    return errors;
  };

  const handleUpdate = (type, val) => {
    const taskDocRef = doc(db, "recipes", recipe._id);
    console.log(selectedField, selectedRecipe.finish);
    try {
      if (Object.values(handleValidation(selectedRecipe)).length !== 0) {
        setErrorText(Object.values(handleValidation(selectedRecipe))[0]);
        setErrorSnackOpen(true);
      } else {
        setLoader(true);
        let recipe_obj = null;
        if (selectedField == "Title") {
          recipe_obj = {
            title: selectedRecipe.title,
            title_keywords: getAllSubstrings(selectedRecipe?.title),
          };
        } else if (selectedField == "Type & Serves") {
          recipe_obj = {
            type: selectedRecipe.type,
            serves: selectedRecipe.serves,
          };
        } else if (selectedField == "Ingredients") {
          recipe_obj = {
            ingredients: [...selectedRecipe.ingredients],
          };
        } else if (selectedField == "Steps") {
          recipe_obj = {
            steps: [...selectedRecipe.steps],
          };
        } else if (selectedField == "Final Step" || type == "image") {
          recipe_obj = {
            finish: { ...selectedRecipe.finish },
          };
          if (type == "image") {
            recipe_obj = {
              finish: { ...selectedRecipe.finish, imgSrc: val },
            };
          }
        }
        console.log(recipe_obj);
        if (recipe_obj) {
          updateDoc(taskDocRef, recipe_obj)
            .then((res) => {
              setSuccessSnackOpen(true);
              setSuccessText("Updated Successfully!!!");
              setLoader(false);
              getRecipeDetails(id);
              handleClose();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(setSelectedRecipe({ ...recipe }));
    setSelectedField(null);
    // getRecipeDetails(id);
  };

  const returnModalBody = () => {
    if (selectedField == "Title") {
      return (
        <CSTMTextField
          placeholder="Eg: Chicken Biryani "
          name="title"
          value={selectedRecipe.title}
          onChange={handleChanges}
        />
      );
    } else if (selectedField == "Type & Serves") {
      return (
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <HeadingMD text={"Type"} width={20} />
            <CSTMSelect
              placeholder="Eg: NonVeg"
              name="type"
              value={selectedRecipe.type}
              onChange={handleChanges}
              options={recipeTypes}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <HeadingMD text={"Serves"} width={20} />
            <CSTMSelect
              placeholder="Eg: 4"
              name="serves"
              value={selectedRecipe.serves}
              onChange={handleChanges}
              options={recipeServes}
            />
          </Grid>
        </Grid>
      );
    } else if (selectedField == "Ingredients") {
      return (
        <>
          <Grid container spacing={1}>
            {selectedRecipe.ingredients.length > 0 &&
              selectedRecipe.ingredients.map((ingredient, ikey) => {
                return (
                  <Grid item xs={12} md={12} key={ingredient.id}>
                    {ikey > 0 && (
                      <Box sx={{ marginY: "15px", position: "relative" }}>
                        <Divider textAlign="left">
                          Ingredient {ikey + 1}
                        </Divider>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          sx={{ position: "absolute", right: 0, top: -5 }}
                          startIcon={<DeleteIcon />}
                          onClick={() =>
                            handledeleteItem("ingredients", ingredient.id)
                          }
                        >
                          Delete
                        </Button>
                      </Box>
                    )}
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="subtitle2"
                          sx={{ margin: "10px 0px", letterSpacing: 0.6 }}
                        >
                          Name
                        </Typography>
                        <CSTMTextField
                          placeholder="Eg: Salt "
                          name="value"
                          value={ingredient.value}
                          onChange={(e) =>
                            handleListChanges(
                              ingredient.id,
                              e.target.value,
                              "ingredients",
                              "value"
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="subtitle2"
                          sx={{ margin: "10px 0px", letterSpacing: 0.6 }}
                        >
                          Units
                        </Typography>
                        <CSTMTextField
                          placeholder="Eg: 1 tbsp "
                          name="units"
                          value={ingredient.units}
                          onChange={(e) =>
                            handleListChanges(
                              ingredient.id,
                              e.target.value,
                              "ingredients",
                              "units"
                            )
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                );
              })}
          </Grid>
          <Box sx={{ margin: "20px 0px 10px 0px" }}>
            <Button
              fullWidth={true}
              onClick={() => handleAdd("ingredients")}
              color="success"
              sx={{ lineHeight: 0 }}
              startIcon={<AddCircleOutlineIcon />}
            >
              Add Ingredient
            </Button>
          </Box>
        </>
      );
    } else if (selectedField == "Steps") {
      return (
        <>
          {displayEditors ? (
            <>
              {selectedRecipe.steps?.map((step, skey) => {
                return (
                  <Box key={step.id}>
                    {skey === 0 ? (
                      <Typography
                        variant="subtitle2"
                        sx={{ margin: "10px 0px", letterSpacing: 0.6 }}
                      >
                        {`Step ${skey + 1}`}
                      </Typography>
                    ) : (
                      <Box sx={{ marginY: "25px", position: "relative" }}>
                        <Divider textAlign="left">Step {skey + 1}</Divider>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          sx={{ position: "absolute", right: 0, top: -5 }}
                          startIcon={<DeleteIcon />}
                          onClick={() => handledeleteItem("steps", step.id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    )}
                    <Suspense fallback={<CKeditor />}>
                      <div
                        className="ckeditor"
                        style={{ position: "relative" }}
                      >
                        <CKeditorRender
                          value={step.value}
                          id={step.id}
                          handleChanges={(e) =>
                            handleListChanges(step.id, e, "steps", "value")
                          }
                        />
                      </div>
                    </Suspense>
                  </Box>
                );
              })}
              <Box sx={{ margin: "20px 0px 10px 0px" }}>
                <Button
                  fullWidth={true}
                  onClick={() => handleAdd("steps")}
                  color="success"
                  sx={{ lineHeight: 0 }}
                  startIcon={<AddCircleOutlineIcon />}
                >
                  Add Step
                </Button>
              </Box>
            </>
          ) : (
            <Step />
          )}
        </>
      );
    } else if (selectedField == "Final Step") {
      return (
        <>
          {displayEditors ? (
            <>
              <Suspense fallback={<CKeditor />}>
                <div className="ckeditor" style={{ position: "relative" }}>
                  <CKeditorRender
                    value={selectedRecipe.finish.value}
                    id={selectedRecipe.finish.id}
                    handleChanges={(e) => handleFinish(e, "finish")}
                  />
                </div>
              </Suspense>
            </>
          ) : (
            <Step />
          )}
        </>
      );
    }
  };

  const handleGoBack = () => navigate(-1);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorSnackOpen(false);
    setSuccessSnackOpen(false);
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
            <Stack
              sx={{
                display: "flex",
                gap: "5px",
                flexDirection: "row-reverse",
                alignItems: "center",
                position: "absolute",
                top: 5,
                right: 5,
                [bpSMd]: {
                  flexDirection: "column",
                },
              }}
            >
              <Tooltip title="Add to favourite">
                <IconButton
                  size="large"
                  sx={{
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
              {loggedUser?.uid === recipe?.uid && (
                <Tooltip title="Change Image">
                  <IconButton
                    component="label"
                    size="large"
                    sx={{
                      backgroundColor: "rgba(0,0,0,0.2) !important",
                    }}
                  >
                    <CameraAltIcon sx={{ color: "white" }} />
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      name="imgSrc"
                      onChange={(e) => handleFinish(e.target.files[0], "image")}
                    />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
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
                boxShadow: "0 -18px 15px 1px rgb(0 0 0 / 43%)",
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
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <HeadingXLBold text={recipe.title} />
                            {loggedUser?.uid === recipe?.uid && (
                              <EditOutlineBTN
                                onClick={() => handleEditRecipe("Title")}
                              />
                            )}
                          </Stack>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Stack
                              direction={"row"}
                              spacing={0.5}
                              alignItems="center"
                            >
                              {returnType(recipe.type)}
                              <Serves serves={recipe.serves} />
                            </Stack>
                            {loggedUser?.uid === recipe?.uid && (
                              <EditOutlineBTN
                                onClick={() =>
                                  handleEditRecipe("Type & Serves")
                                }
                              />
                            )}
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
                          <Box
                            className="d-flex"
                            sx={{ margin: "20px 0 10px 0" }}
                          >
                            <HeadingMD text={"INGREDIENTS"} width={70} />
                            {loggedUser?.uid === recipe?.uid && (
                              <EditOutlineBTN
                                onClick={() => handleEditRecipe("Ingredients")}
                              />
                            )}
                          </Box>
                        </motion.div>
                      </Box>
                      <Box
                        sx={{
                          display: "none",
                          [bpSMd]: {
                            display: activeTab == 2 ? "none" : "block",
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
                          <Box
                            className="d-flex"
                            sx={{ margin: "0px 0 10px 0" }}
                          >
                            <HeadingMD
                              text={"LIST OF INGREDIENTS"}
                              width={70}
                            />
                            {loggedUser?.uid === recipe?.uid && (
                              <EditOutlineBTN
                                onClick={() => handleEditRecipe("Ingredients")}
                              />
                            )}
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
                          {recipe.ingredients.map((ingredient, skey) => {
                            return (
                              <Grid
                                item
                                md={6}
                                lg={6}
                                sx={{
                                  width: "100%",
                                }}
                                key={skey}
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
                                    <Subtitle1 text={ingredient.value} />
                                    <Subtitle1
                                      text={ingredient.units}
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
                          <Box
                            className="d-flex"
                            sx={{ margin: "25px 0px 15px 0px" }}
                          >
                            <HeadingMD text={"STEPS"} width={35} />
                            {loggedUser?.uid === recipe?.uid && (
                              <EditOutlineBTN
                                onClick={() => handleEditRecipe("Steps")}
                              />
                            )}
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
                                  key={skey}
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
                          <Box
                            className="d-flex"
                            sx={{ margin: "20px 0 10px 0" }}
                          >
                            <HeadingMD text={"FINAL STEP"} width={50} />
                            {loggedUser?.uid === recipe?.uid && (
                              <EditOutlineBTN
                                onClick={() => handleEditRecipe("Final Step")}
                              />
                            )}
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
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <OtherRecipes id={id} uid={recipe.uid} name={recipe.name} />
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
          <ErrorAlert
            snackopen={errorSnackOpen}
            handleClose={handleCloseSnackbar}
            text={errorText}
          />
          <SuccessAlert
            snackopen={successSnackOpen}
            handleClose={handleCloseSnackbar}
            text={successText}
          />
          <Dialog
            open={open}
            // onClose={handleClose}
            scroll="paper"
            fullWidth={true}
            maxWidth="md"
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
          >
            <DialogTitle id="scroll-dialog-title">
              Edit {selectedField}
            </DialogTitle>
            <DialogContent dividers={true}>{returnModalBody()}</DialogContent>
            <DialogActions sx={{ padding: 2 }}>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleUpdate}>
                Update
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      <CustomBackdrop loading={loader} />
    </>
  );
};

export default RecipeDetails;
