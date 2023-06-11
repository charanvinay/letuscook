import { Visibility } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import LoopIcon from "@mui/icons-material/Loop";
import SaveIcon from "@mui/icons-material/Save";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Slide,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { bottomButtonsStyle, getAllSubstrings, getUniqueId } from "../../Common/Constants";
import CustomBackdrop from "../../Common/CustomBackdrop";
import ErrorAlert from "../../Common/ErrorAlert";
import ImgWithLabelCard from "../../Common/ImgWithLabelCard";
import CKeditor from "../../Common/Skeletons/CKeditor";
import Step from "../../Common/Skeletons/Step";
import SuccessAlert from "../../Common/SuccessAlert";
import deletePreviousImage from "../../Common/deletePreviousImage";
import {
  editFinish,
  getRecipe,
  initialState,
  setSelectedRecipe,
} from "../../redux/slices/recipeSlice";
import {
  getIsMobile,
  getLoggedUser,
  handleBack,
  handleReset,
} from "../../redux/slices/userSlice";
import { db, storage } from "../../services/firebase";
import CompleteRecipe from "./complete_recipe";

const CKeditorRender = lazy(() => import("../../Common/CKEditorComp.js"));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Finish = (props) => {
  const [loading, setLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const [successText, setSuccessText] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [displayEditors, setDisplayEditors] = useState(false);
  const [errorSnackOpen, setErrorSnackOpen] = useState(false);
  const [successSnackOpen, setSuccessSnackOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const recipe = useSelector(getRecipe);
  const isMobile = useSelector(getIsMobile);
  const loggedUser = useSelector(getLoggedUser);

  const handleClose = () => setModalOpen(false);
  const handleClickOpen = () => setModalOpen(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayEditors(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorSnackOpen(false);
    setSuccessSnackOpen(false);
  };

  const handleChanges = (val, type) => {
    let v = val;
    if (type === "image") {
      let file = val;
      if (!file) return;
      // setShowSkeleton(true);
      alert("Added")
      // if (recipe.finish.imgSrc) {
      //   deletePreviousImage(recipe.finish.imgSrc);
      // }
      // handleUploadImage(file, type);
    } else {
      dispatch(editFinish({ val: v, type }));
    }
  };

  const handleUploadImage = (file, type) => {
    const storageRef = ref(storage, `images/${loggedUser.uid}/${getUniqueId()}`);
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            // console.log(url);
            dispatch(editFinish({ val: url, type }));
            setShowSkeleton(false);
          })
          .catch((error) => {
            console.log(error.message);
            setShowSkeleton(false);
          });
      })
      .catch((error) => {
        console.log(error.message);
        setShowSkeleton(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(handleValidation()).length !== 0) {
      setErrorText(Object.values(handleValidation())[0]);
      setErrorSnackOpen(true);
    } else {
      goToNextPage();
    }
  };

  const goToPreviousPage = () => {
    dispatch(handleBack());
  };

  const goToNextPage = () => {
    handleClickOpen();
  };

  const customSetTimeout = (navTo) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      navigate(navTo);
      dispatch(handleReset());
      dispatch(setSelectedRecipe(initialState));
      handleClose();
    }, 1500);

    setTimeoutId(newTimeoutId);
  };

  const handleValidation = () => {
    let errors = {};
    if (!Boolean(recipe.finish.value)) {
      errors["Value"] = "Please fill the final step";
    }
    if (!Boolean(recipe.finish.imgSrc)) {
      errors["imageSrc"] = "Please upload the final image";
    }
    return errors;
  };

  const handleSave = () => {
    setLoading(true);
    try {
      let recipe_obj = {
        uid: loggedUser.uid,
        name: loggedUser.name,
        email: loggedUser.email,
        photoURL: loggedUser.photoURL,
        ...recipe,
        title_keywords: getAllSubstrings(recipe?.title),
      };
      // console.log(recipe_obj);
      addDoc(collection(db, "recipes"), recipe_obj)
        .then((res) => {
          setSuccessSnackOpen(true);
          setSuccessText("Created Successfully!!!");
          setLoading(false);
          customSetTimeout("/home");
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = () => {
    setLoading(true);
    const taskDocRef = doc(db, "recipes", recipe._id);
    // console.log(taskDocRef);
    try {
      let recipe_obj = {
        _id: recipe._id,
        uid: loggedUser.uid,
        name: loggedUser.name,
        email: loggedUser.email,
        photoURL: loggedUser.photoURL,
        ...recipe,
        title_keywords: getAllSubstrings(recipe?.title),
      };
      updateDoc(taskDocRef, recipe_obj)
        .then((res) => {
          setSuccessSnackOpen(true);
          setSuccessText("Updated Successfully!!!");
          setLoading(false);
          customSetTimeout("/profile");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box component="main" sx={{ px: 1, py: 2 }}>
      {displayEditors ? (
        <>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ margin: "10px 0px", letterSpacing: 0.6 }}
            >
              Final Step
            </Typography>
            <Suspense fallback={<CKeditor />}>
              <div className="ckeditor" style={{ position: "relative" }}>
                <CKeditorRender
                  value={recipe.finish.value}
                  id={recipe.finish.id}
                  handleChanges={(val) => {
                    handleChanges(val);
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    position: "absolute",
                    top: 9,
                    right: 9,
                  }}
                >
                  <input
                    accept="image/*"
                    type="file"
                    capture
                    id="upload-image"
                    name="imgSrc"
                    style={{display: "none"}}
                    onChange={(e) => {
                      e.preventDefault();
                      alert(e.target.files[0].name);
                      // handleChanges(e.target.files[0], "image")
                    }}
                  />
                  <label htmlFor="upload-image">
                    <Button
                      component="span"
                      sx={{
                        minWidth: "20px",
                        color: grey[700],
                        padding: "0px 6px",
                        zIndex: 2,
                      }}
                    >
                      <ImageIcon color="black" />
                    </Button>
                  </label>
                  {/* <Button
                    component="label"
                    sx={{
                      minWidth: "20px",
                      padding: "1px 0px 0px 0px",
                      color: grey[700],
                    }}
                  >
                    <CameraAltIcon color="black" />
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      id="uploadPhotoInput"
                      name="uploadPhotoInput"
                      capture="environment"
                      value=""
                      onChange={(e) => {
                        e.preventDefault();
                        alert(e.target.files[0].name);
                        // handleChanges(e.target.files[0], "image");
                      }}
                      onClick={handleClick}
                    />
                  </Button> */}
                </Box>
              </div>
            </Suspense>
            <Box sx={{ marginY: "15px" }}>
              {recipe.finish.imgSrc && <Divider />}
            </Box>
            {showSkeleton ? (
              <Skeleton
                variant="rectangular"
                animation="wave"
                width={"100%"}
                height={120}
              />
            ) : (
              <Grid container spacing={2}>
                {recipe.finish.imgSrc && (
                  <Grid item xs={12} md>
                    <ImgWithLabelCard
                      imgSrc={recipe.finish.imgSrc}
                      title={`Final Image`}
                    />
                  </Grid>
                )}
              </Grid>
            )}
          </Box>
          <Box
            sx={
              !isMobile
                ? {
                    margin: "20px 0px 10px 0px",
                    ...bottomButtonsStyle,
                  }
                : { margin: "20px 0px 10px 0px" }
            }
          >
            <Stack direction="row" spacing={2}>
              <Button
                fullWidth={isMobile}
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={goToPreviousPage}
              >
                Previous
              </Button>
              <Button
                fullWidth={isMobile}
                variant="contained"
                endIcon={<Visibility />}
                onClick={handleSubmit}
              >
                Preview
              </Button>
            </Stack>
          </Box>
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
        </>
      ) : (
        <Step />
      )}
      <Dialog
        fullScreen
        open={modalOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography
              sx={{ ml: 2, flex: 1, textAlign: "center" }}
              variant="h6"
              component="div"
            >
              Preview
            </Typography>
            {location.pathname === "/add" ? (
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleSave}
                endIcon={<SaveIcon />}
              >
                Save
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleUpdate}
                endIcon={<LoopIcon />}
              >
                Update
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <Toolbar />
        <CompleteRecipe />
      </Dialog>
      <CustomBackdrop loading={loading} />
    </Box>
  );
};

export default Finish;
