import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CSTMSelect from "../../Common/CSTMSelect";
import CSTMTextField from "../../Common/CSTMTextField";
import {
  bottomButtonsStyle,
  getUniqueId,
  recipeServes,
  recipeTypes,
} from "../../Common/Constants";
import ErrorAlert from "../../Common/ErrorAlert";
import HeadingMD from "../../Common/HeadingMD";
import {
  addItem,
  deleteItem,
  editItem,
  getRecipe,
  handlePrimitiveState,
  initialState,
  setSelectedRecipe,
} from "../../redux/slices/recipeSlice";
import { getIsMobile, handleNext } from "../../redux/slices/userSlice";

const PrimaryDetails = (props) => {
  const [errorText, setErrorText] = useState(false);
  const [snackopen, setsnackOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recipe = useSelector(getRecipe);
  const isMobile = useSelector(getIsMobile);
  // console.log(recipe);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setsnackOpen(false);
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    dispatch(handlePrimitiveState({ name, value }));
  };

  const handleIngredientChanges = (id, e, name, type) => {
    const { value } = e.target;
    dispatch(editItem({ id, name, value, type }));
  };

  const handleAdd = () => {
    let newStep = {
      id: getUniqueId(),
      errors: [],
      units: "",
      value: "",
    };
    dispatch(addItem({ name: "ingredients", value: newStep }));
  };

  const handleValidation = (values) => {
    const errors = {};
    if (!values.title) {
      errors.title = "Please enter the title of your recipe";
    }
    if (!values.type) {
      errors.type = "Please select the type of your recipe";
    }
    if (!values.serves) {
      errors.serves = "Please select the serves of your recipe";
    }
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
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(handleValidation(recipe)).length !== 0) {
      setErrorText(Object.values(handleValidation(recipe))[0]);
      setsnackOpen(true);
    } else {
      dispatch(handlePrimitiveState({ name: "id", value: getUniqueId() }));
      dispatch(
        handlePrimitiveState({ name: "createdAt", value: moment().format() })
      );
      dispatch(handleNext());
    }
  };

  return (
    <Box component="main" sx={{ px: 1, py: 2 }}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={4}>
          <HeadingMD text={"Title"} width={20} />
          <CSTMTextField
            placeholder="Eg: Chicken Biryani "
            name="title"
            value={recipe.title}
            onChange={handleChanges}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HeadingMD text={"Type"} width={20} />
          <CSTMSelect
            placeholder="Eg: NonVeg"
            name="type"
            value={recipe.type}
            onChange={handleChanges}
            options={recipeTypes}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HeadingMD text={"Serves"} width={20} />
          <CSTMSelect
            placeholder="Eg: 4"
            name="serves"
            value={recipe.serves}
            onChange={handleChanges}
            options={recipeServes}
          />
        </Grid>
      </Grid>
      <Box sx={{ height: "10px" }}></Box>
      <HeadingMD text={"Ingredients"} width={60} />
      <Grid container spacing={1}>
        {recipe.ingredients.length > 0 &&
          recipe.ingredients.map((ingredient, ikey) => {
            return (
              <Grid item xs={12} md={12} key={ingredient.id}>
                {ikey > 0 && (
                  <Box sx={{ marginY: "15px", position: "relative" }}>
                    <Divider textAlign="left">Ingredient {ikey + 1}</Divider>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      sx={{ position: "absolute", right: 0, top: -5 }}
                      startIcon={<DeleteIcon />}
                      onClick={() =>
                        dispatch(
                          deleteItem({ name: "ingredients", id: ingredient.id })
                        )
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
                      name="title"
                      value={ingredient.value}
                      onChange={(e) =>
                        handleIngredientChanges(
                          ingredient.id,
                          e,
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
                      placeholder="Eg: 1 tbspn "
                      name="title"
                      value={ingredient.units}
                      onChange={(e) =>
                        handleIngredientChanges(
                          ingredient.id,
                          e,
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
          onClick={handleAdd}
          color="success"
          sx={{ lineHeight: 0 }}
          startIcon={<AddCircleOutlineIcon />}
        >
          Add Ingredient
        </Button>
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
            startIcon={<HighlightOffIcon />}
            sx={{ lineHeight: 0 }}
            onClick={() => {
              navigate("/home");
              dispatch(setSelectedRecipe(initialState));
            }}
          >
            Cancel
          </Button>
          <Button
            fullWidth={isMobile}
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={handleSubmit}
          >
            Next
          </Button>
        </Stack>
      </Box>
      <ErrorAlert
        snackopen={snackopen}
        handleClose={handleCloseSnackbar}
        text={errorText}
      />
    </Box>
  );
};

export default PrimaryDetails;
