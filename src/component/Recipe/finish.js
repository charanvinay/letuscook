import { Visibility } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import LoopIcon from "@mui/icons-material/Loop";
import SaveIcon from "@mui/icons-material/Save";
import {
  AppBar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
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
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { bottomButtonsStyle, getAllSubstrings } from "../../Common/Constants";
import ErrorAlert from "../../Common/ErrorAlert";
import ImgWithLabelCard from "../../Common/ImgWithLabelCard";
import { primary } from "../../Common/Pallete";
import CKeditor from "../../Common/Skeletons/CKeditor";
import Step from "../../Common/Skeletons/Step";
import SuccessAlert from "../../Common/SuccessAlert";
import Uploadbutton from "../../Common/uploadbutton";
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
  const [modalOpen, setModalOpen] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const [successText, setSuccessText] = useState(false);
  const [errorSnackOpen, setErrorSnackOpen] = useState(false);
  const [successSnackOpen, setSuccessSnackOpen] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [displayEditors, setDisplayEditors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
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
      // if (!file) return;
      setShowSkeleton(true);
      // if (recipe.finish.imgSrc) {
      //   deletePreviousImage(recipe.finish.imgSrc);
      // }
      // handleUploadImage(file, type);
    } else {
      dispatch(editFinish({ val: v, type }));
    }
  };

  const handleUploadImage = (file, type) => {
    const storageRef = ref(storage, `images/${loggedUser.uid}/${file.name}`);
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            console.log(url);
            alert(url);
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

  const deletePreviousImage = (photo) => {
    const storage = getStorage();
    const storageRef = ref(storage, photo);
    console.log(storageRef);
    deleteObject(storageRef)
      .then(() => {
        console.log("File deleted successfully");
      })
      .catch((error) => {
        console.log(error.message);
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
      console.log(recipe_obj);
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
    console.log(taskDocRef);
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

  const handleClick = (e) => {
    e.preventDefault();
  };
  return (
    <Box component="main" sx={{ px: 1, py: 2 }}>
      <input
                      id="test"
                      accept="image/*"
                      type="file"
                      name="imgSrc"
                      onChange={(e) => {
                        handleChanges(e.target.files[0], "image");
                      }}
                    />
    </Box>
  );
};

export default Finish;
