import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { motion } from "framer-motion";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import GradientBLACK from "../../Assets/20210113_083213.png";
import { returnType } from "../../Common/Constants";
import Serves from "../../Common/Ribbons/Serves";
import { getLoggedUser } from "../../redux/slices/userSlice";
import { db } from "../../services/firebase";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const RecipeCard = (props) => {
  let { navTo, recipe, isReloadList } = props;
  let { _id, uid, title, name, finish, serves, type, createdAt } = props.recipe;

  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [favouritedBy, setFavouritedBy] = useState(recipe.favouritedBy);

  const navigate = useNavigate();
  const location = useLocation();
  const loggedUser = useSelector(getLoggedUser);

  useEffect(() => {
    let cond = recipe.favouritedBy.includes(loggedUser.uid);
    setLiked(cond);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    if (finish.imgSrc) {
      deleteFinalImage(finish.imgSrc);
    }
    deleteRecipe();
    props.getUserRecipes();
    setOpen(false);
  };

  const deleteRecipe = async () => {
    const taskDocRef = doc(db, "recipes", _id);
    try {
      await deleteDoc(taskDocRef);
    } catch (err) {
      alert(err);
    }
  };

  const deleteFinalImage = (photo) => {
    const storage = getStorage();
    const storageRef = ref(storage, photo);
    // console.log(storageRef);
    deleteObject(storageRef)
      .then(() => {
        console.log("File deleted successfully");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleLikeRecipe = () => {
    const taskDocRef = doc(db, "recipes", recipe._id);
    // console.log(taskDocRef, recipe);
    try {
      let favourited_by = favouritedBy;
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
          setFavouritedBy(favourited_by);
          setLiked(!liked);
        })
        .catch((err) => {
          console.log(err);
        });
      if (isReloadList) {
        props.getUserRecipes();
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <motion.div
      key={recipe._id}
      initial={{ opacity: 0 }}
      whileInView={{ y: [20, 0], opacity: [0, 1] }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
    >
      <Box sx={{ position: "relative" }}>
        <Card
          sx={{
            borderRadius: "10px",
            position: "relative",
            cursor: "pointer",
          }}
          onClick={() => {
            navigate(navTo, { state: { previousRoute: location.pathname }});
          }}
        >
          <Box sx={{ height: 300 }}>
            <img
              src={
                finish.imgSrc ||
                "https://www.foodandwine.com/thmb/dMG6keGBcEF7XF8LZdR2y5dPrxc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/jamaican-jerk-chicken-FT-RECIPE0918-eabbd55da31f4fa9b74367ef47464351.jpg"
              }
              alt={"Recipe_Image"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              loading="lazy"
            />
          </Box>
          <CardContent
            sx={{
              width: "90%",
              // padding: "20px",
              zIndex: 1,
              position: "absolute",
              bottom: 0,
            }}
          >
            <Typography
              variant="h4"
              color="white"
              sx={{
                textTransform: "capitalize",
                fontFamily: "Product Sans Bold",
                fontWeight: "bold",
                letterSpacing: 1,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="subtitle2"
              color="#cbcaca"
              sx={{ textTransform: "capitalize", letterSpacing: 0.5 }}
            >
              {` by ${name} | ${moment
                .utc(createdAt)
                .local()
                .startOf("seconds")
                .fromNow()}`}
            </Typography>
          </CardContent>
          <div
            style={{
              backgroundImage:
                "linear-gradient(rgb(0 0 0 / 40%) 0%, transparent 20%)",
              height: "100%",
              position: "absolute",
              top: 0,
              zIndex: 0,
              width: "100%",
            }}
          />
          <img
            style={{
              height: "60%",
              position: "absolute",
              bottom: 0,
              zIndex: 0,
              width: "100%",
            }}
            alt={"Gradient"}
            loading="lazy"
            src={GradientBLACK}
          />
        </Card>
        {loggedUser && loggedUser.uid && <Tooltip title={props?.uid === loggedUser.uid ? "Delete Recipe" : "Add to favourite"}>
          <IconButton
            size="large"
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              backgroundColor: "rgba(0,0,0,0.2) !important",
            }}
            onClick={(e) => {
              if (props?.uid === loggedUser.uid) {
                handleClickOpen();
              } else {
                handleLikeRecipe();
              }
            }}
          >
            {props?.uid === loggedUser.uid ? (
              <DeleteIcon sx={{ fontSize: "1.5rem", color: "white" }} />
            ) : liked ? (
              <FavoriteIcon sx={{ fontSize: "1.5rem", color: "white" }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: "1.5rem", color: "white" }} />
            )}
          </IconButton>
        </Tooltip>}
        <Stack
          sx={{ position: "absolute", top: 8, left: 8 }}
          direction="row"
          spacing={1}
        >
          {returnType(type)}
          <Serves serves={serves} />
        </Stack>
        <Dialog
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure want to delete this recipe?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This process is irreversible. Once deleted, you no longer have
              this in you list.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ padding: 2 }}>
            <Button variant="contained" color="error" onClick={handleClose}>
              No
            </Button>
            <Button variant="contained" onClick={handleDelete} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
};

export default RecipeCard;
