import { CssBaseline, ThemeProvider, Toolbar, createTheme, useMediaQuery } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import "react-quill/dist/quill.snow.css";
import { Provider } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import { capitalize, getDesignTokens } from "./Common/Constants";
import Profile from "./component/Profile/profile";
import RecipeDetails from "./component/Profile/recipe_details";
import AddRecipe from "./component/Recipe/add";
import Home from "./component/home";
import Login from "./component/login";
import Navbar from "./component/navbar";
import { store } from "./redux/store";
import PageNotFound from "./Common/PageNotFound";
import { useState } from "react";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const isLoggedIn = Boolean(loggedUser) && Boolean(loggedUser.uid);

  const authentication = (path) => {
    if (["/add", "/profile", "/favourites"].includes(path)) {
      if (!isLoggedIn) {
        navigate("/login");
      }
    } else if (path === "/") {
      navigate("/home");
    } else if (path === "/login") {
      if (isLoggedIn) {
        navigate("/home");
      }
    }
  };

  useEffect(() => {
    authentication(location.pathname);
    const titles = {
      "/home": "LetUsCook",
      "/login": "LetUsCook",
      "/favourites": "Favourites | LetUsCook",
      "/add": "Add Recipe | LetUsCook",
    };
    document.title = titles[location.pathname] || "LetUsCook";
    if (location.pathname === "/profile") {
      if (isLoggedIn) {
        console.log(loggedUser);
        document.title = `${capitalize(loggedUser.name)} | LetUsCook`;
      } else {
        navigate("/login");
      }
    } else if (location.pathname === "/") {
      navigate("/home");
    } else if (location.pathname === "/login") {
      if (isLoggedIn) {
        navigate("/home");
      }
    }
  }, [location.pathname]);
  
  const showNav = ["", "home", "favourites", "profile", "add"].includes(location.pathname.split("/")[1]);

  const cstm_theme = useMemo(() => createTheme(getDesignTokens(prefersDarkMode)), [prefersDarkMode]);
  
  return (
    <ThemeProvider theme={cstm_theme}>
      <CssBaseline />
      <Provider store={store}>
        {showNav && <Navbar />}
        {showNav && <Toolbar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          {isLoggedIn && <Route path="/favourites" element={<Home />} />}
          {isLoggedIn && <Route path="/profile/:id" element={<Profile />} />}
          {isLoggedIn && <Route path="/add" element={<AddRecipe />} />}
          <Route path="/view" element={<RecipeDetails />} />
          {location.pathname && <Route path="*" element={<PageNotFound/>}/>}
        </Routes>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
