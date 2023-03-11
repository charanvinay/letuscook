import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bottomButtonsStyle, getUniqueId } from "../../Common/Constants";
import ErrorAlert from "../../Common/ErrorAlert";
import CKeditor from "../../Common/Skeletons/CKeditor";
import Step from "../../Common/Skeletons/Step";
import {
  addItem,
  deleteItem,
  editItem,
  getRecipe
} from "../../redux/slices/recipeSlice";
import {
  getIsMobile,
  handleBack,
  handleNext
} from "../../redux/slices/userSlice";
const CKeditorRender = lazy(() => import("../../Common/CKEditorComp.js"));

const RecipeSteps = (props) => {
  const [snackopen, setsnackOpen] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const [displayEditors, setDisplayEditors] = useState(false);

  const recipe = useSelector(getRecipe);
  const isMobile = useSelector(getIsMobile);
  console.log(recipe);

  const dispatch = useDispatch();

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
    setsnackOpen(false);
  };

  const handleChanges = (id, value, name, type) => {
    dispatch(editItem({ id, name, value, type }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(handleValidation()).length !== 0) {
      setErrorText(Object.values(handleValidation())[0]);
      setsnackOpen(true);
    } else {
      goToNextPage();
    }
  };

  const goToPreviousPage = () => {
    dispatch(handleBack());
  };

  const goToNextPage = () => {
    dispatch(handleNext());
  };

  const handleAdd = () => {
    let newStep = {
      id: getUniqueId(),
      errors: [],
      value: null,
    };
    dispatch(addItem({ name: "steps", value: newStep }));
  };

  const handleValidation = () => {
    let errors = {};
    recipe.steps.map((step, skey) => {
      if (!Boolean(step.value)) {
        errors[`Step ${skey + 1}`] = `Please fill Step ${skey + 1}`;
      }
    });
    return errors;
  };
  return (
    <Box component="main" sx={{ px: 1, py: 2 }}>
      {displayEditors ? (
        <>
          {recipe.steps?.map((step, skey) => {
            return (
              <Box key={step.id}>
                {skey == 0 ? (
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
                      onClick={() =>
                        dispatch(deleteItem({ name: "steps", id: step.id }))
                      }
                    >
                      Delete
                    </Button>
                  </Box>
                )}
                <Suspense fallback={<CKeditor />}>
                  <div className="ckeditor" style={{ position: "relative" }}>
                    <CKeditorRender
                      value={step.value}
                      id={step.id}
                      handleChanges={(e) =>
                        handleChanges(step.id, e, "steps", "value")
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
              onClick={handleAdd}
              color="success"
              sx={{ lineHeight: 0 }}
              startIcon={<AddCircleOutlineIcon />}
            >
              Add Step
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
                startIcon={<ArrowBackIcon />}
                onClick={goToPreviousPage}
              >
                Previous
              </Button>
              <Button
                fullWidth={isMobile}
                variant="contained"
                sx={{ lineHeight: 0 }}
                endIcon={<ArrowForwardIcon />}
                onClick={handleSubmit}
              >
                Next
              </Button>
            </Stack>
          </Box>
        </>
      ) : (
        <Step />
      )}
      <ErrorAlert
        snackopen={snackopen}
        handleClose={handleCloseSnackbar}
        text={errorText}
      />
    </Box>
  );
};

export default RecipeSteps;
