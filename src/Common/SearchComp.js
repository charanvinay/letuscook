import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import {
    Box,
    Button,
    Chip,
    Dialog,
    IconButton,
    InputBase,
    Paper,
    Slide,
    Stack,
} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
    getFiltersState,
    setIsFiltersApplied,
    setRecipeServes,
    setRecipeType,
    setSearchText,
} from "../redux/slices/filtersSlice";
import { getLoggedUser } from "../redux/slices/userSlice";
import { recipeServes, recipeTypes } from "./Constants";
import HeadingMD from "./HeadingMD";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const SearchComp = (props) => {
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const filtersState = useSelector(getFiltersState);
  const [type, setType] = useState(filtersState.type);
  const [serves, setServes] = useState(filtersState.serves);
  const loggedUser = useSelector(getLoggedUser);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    let debounceTimer;
    if (filtersState.searchText == "") {
      props.getUserRecipes();
    } else {
      debounceTimer = setTimeout(() => {
        console.log(filtersState.searchText);
        props.getUserRecipes();
      }, 400);
    }
    return () => clearTimeout(debounceTimer);
  }, [filtersState.searchText]);
  useEffect(() => {
    if (loggedUser) {
      // handleFiltersModalClose();
      props.getUserRecipes();
    }
  }, [location.pathname, loggedUser]);
  useEffect(() => {
    if (!showFiltersModal) {
      props.getUserRecipes();
    }
  }, [showFiltersModal, filtersState.type, filtersState.serves]);
  const handleFiltersModalApply = () => {
    setShowFiltersModal(false);
    setType(filtersState.type);
    setServes(filtersState.serves);
    dispatch(setIsFiltersApplied({ isFiltersApplied: true }));
  };

  const handleFiltersModalClose = () => {
    handleResetType();
    handleResetServes();
    setShowFiltersModal(false);
    dispatch(setIsFiltersApplied({ isFiltersApplied: false }));
  };

  const handleResetType = () => {
    setType(null);
    dispatch(setRecipeType({ type: null }));
  };
  const handleResetServes = () => {
    setServes(null);
    dispatch(setRecipeServes({ serves: null }));
  };
  return (
    <Stack spacing={2} sx={{ marginY: 1 }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1] }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
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
            onKeyUp={(e) => {
              dispatch(setSearchText({ searchText: e.target.value }));
            }}
            onChange={(e) => {
              e.preventDefault();
              // console.log(e.target.value);
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
      </motion.div>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {filtersState.isFiltersApplied && (
          <Stack direction="row" spacing={1}>
            {Boolean(type) && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ scale: [0, 1], opacity: [0, 1] }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
              >
                <Chip label={type} onDelete={handleResetType} />
              </motion.div>
            )}
            {Boolean(serves) && (
              <Chip label={`Serves - ${serves}`} onDelete={handleResetServes} />
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
              filtersState.type === type ? (
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
              filtersState.serves === serve ? (
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
    </Stack>
  );
};

export default SearchComp;
