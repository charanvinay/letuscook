import { ThemeProvider, Toolbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { theme } from "./Common/Constants";
import Profile from "./component/Profile/profile";
import RecipeDetails from "./component/Profile/recipe_details";
import AddRecipe from "./component/Recipe/add";
import Home from "./component/home";
import Login from "./component/login";
import Navbar from "./component/navbar";
import { store } from "./redux/store";

function App() {
  const location = useLocation();
  const isMobile = window.innerWidth < 800;
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    handleShownav();
  }, [location.pathname]);

  const handleShownav = () => {
    if (location.pathname === "/") {
      setShowNav(false);
    } else if (location.pathname.includes("/view")) {
      setShowNav(!isMobile);
    } else {
      setShowNav(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        {showNav && <Navbar />}
        {showNav && <Toolbar />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/favourites" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add" element={<AddRecipe />} />
          <Route path="/edit" element={<AddRecipe />} />
          <Route path="/view" element={<RecipeDetails />} />
        </Routes>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
