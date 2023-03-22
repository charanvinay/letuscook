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
  Typography
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import moment from 'moment';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GradientBLACK from "../../Assets/20210113_083213.png";
import Serves from "../../Common/Ribbons/Serves";
import { db } from "../../services/firebase";
import Slide from "@mui/material/Slide";
import { returnType } from "../../Common/Constants";
import { getLoggedUser } from "../../redux/slices/userSlice";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const RecipeCard = (props) => {
  let { navTo, recipe, isReloadList } = props;
  let { _id, uid, title, name, finish, serves, type, createdAt } = props.recipe;
  const [liked, setLiked] = useState(false);
  const [favouritedBy, setFavouritedBy] = useState(recipe.favouritedBy);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedUser = useSelector(getLoggedUser);
  const [open, setOpen] = React.useState(false);

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
        if(isReloadList){
          props.getUserRecipes();
        }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Card
        sx={{
          borderRadius: "10px",
          position: "relative",
          cursor: "pointer",
          boxShadow:
            "1px 2px 2px hsl(0deg 0% 50% / 0.2), 2px 4px 4px hsl(0deg 0% 50% / 0.2), 4px 8px 8px hsl(0deg 0% 50% / 0.2), 8px 16px 16px hsl(0deg 0% 50% / 0.2), 16px 32px 32px hsl(0deg 0% 50% / 0.2)",
        }}
        onClick={() => {
          navigate(navTo);
        }}
      >
        <Box sx={{ height: 300 }}>
          <img
            src={
              finish.imgSrc ||
              "https://www.foodandwine.com/thmb/dMG6keGBcEF7XF8LZdR2y5dPrxc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/jamaican-jerk-chicken-FT-RECIPE0918-eabbd55da31f4fa9b74367ef47464351.jpg"
            }
            alt={"Recipe Image"}
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
            {` by ${name} | ${moment.utc(createdAt).local().startOf('seconds').fromNow()}`}
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
          src={GradientBLACK}
        />
      </Card>
      <Tooltip title="Add to favourite">
        <IconButton
          size="large"
          sx={{
            position: "absolute",
            top: 5,
            right: 5,
            backgroundColor: "rgba(0,0,0,0.2) !important",
          }}
          onClick={(e) => {
            if (props?.uid === uid) {
              handleClickOpen();
            } else {
              handleLikeRecipe();
            }
          }}
        >
          {props?.uid === uid ? (
            <DeleteIcon sx={{ fontSize: "1.5rem", color: "white" }} />
          ) : liked ? (
            <FavoriteIcon sx={{ fontSize: "1.5rem", color: "white" }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: "1.5rem", color: "white" }} />
          )}
        </IconButton>
      </Tooltip>
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
            This process is irreversible. Once deleted, you no longer have this
            in you list.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleClose}>
            No
          </Button>
          <Button variant="contained" onClick={handleDelete} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecipeCard;
