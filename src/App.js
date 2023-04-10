import { ThemeProvider, Toolbar } from "@mui/material";
import React, { useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import { Provider } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import { capitalize, theme } from "./Common/Constants";
import Profile from "./component/Profile/profile";
import RecipeDetails from "./component/Profile/recipe_details";
import AddRecipe from "./component/Recipe/add";
import Home from "./component/home";
import Login from "./component/login";
import Navbar from "./component/navbar";
import { store } from "./redux/store";

function App() {
  const location = useLocation();
  const navigate = useNavigate()
  const showNav = !["/", "/view"].includes(location.pathname);
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  useEffect(() => {
    if (!loggedUser) {
      navigate("/");
    }
  }, [loggedUser]);

  useEffect(() => {
    if(location.pathname=="/favourites"){
      document.title = "Favourites | LetUsCook"
    }else if(location.pathname=="/add"){
      document.title = "Add Recipe | LetUsCook"
    }else if(location.pathname == "/profile"){
      document.title = `${capitalize(loggedUser.name)} | LetUsCook`
    }
    else{
      document.title = "LetUsCook"
    }
  }, [location.pathname])
  
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
          <Route path="/view" element={<RecipeDetails />} />
        </Routes>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
