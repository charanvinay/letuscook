import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LogoutIcon from "@mui/icons-material/Logout";
import { Stack } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { primary } from "../Common/Pallete";
import { setSearchText } from "../redux/slices/filtersSlice";
import { getIsDarkMode, getLoggedUser, handleLoggedUser, setIsDarkMode } from "../redux/slices/userSlice";
import { auth, logOut } from "../services/firebase";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Brightness4Icon from "@mui/icons-material/Brightness4";

const pages = [{ id: 2, tooltip: "Favourites", route: "/favourites" }];
const settings = [
  {
    id: "profile",
    name: "Profile",
    icon: <AccountCircleIcon sx={{ color: primary }} />,
  },
  {
    id: "mode",
    name: "Dark Mode",
    icon: <DarkModeIcon sx={{ color: primary }} />,
  },
  {
    id: "logout",
    name: "Logout",
    icon: <LogoutIcon sx={{ color: primary }} />,
  },
];

function Navbar() {
  const [anchorElUser, setAnchorElUser] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, loading] = useAuthState(auth);
  const loggedUser = useSelector(getLoggedUser);
  const isDarkMode = useSelector(getIsDarkMode);

  useEffect(() => {
    let mode = JSON.parse(localStorage.getItem("isDarkmode"));
    dispatch(setIsDarkMode(mode))
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      localStorage.removeItem("loggedUser");
      // return navigate("/login");
    } else {
      fetchUserDetails();
    }
  }, [user, loading]);

  const fetchUserDetails = () => {
    let user_obj = JSON.parse(localStorage.getItem("loggedUser"));
    if (user_obj) {
      dispatch(handleLoggedUser(user_obj));
    } else {
      dispatch(handleLoggedUser({}));
    }
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (setting) => {
    if (setting === "profile") {
      navigate(`/profile/${loggedUser.uid}`);
    } else if (setting === "logout") {
      logOut();
      localStorage.removeItem("loggedUser");
      localStorage.setItem("isDarkmode", false);
      dispatch(setIsDarkMode(false));
      dispatch(handleLoggedUser({}));
    } else if (setting === "mode") {
      dispatch(setIsDarkMode(!isDarkMode));
      localStorage.setItem("isDarkmode", !isDarkMode);
    }
    dispatch(setSearchText({ searchText: "" }));
    setAnchorElUser(null);
  };

  return (
    <AppBar className="app__navbar" elevation={0}>
      <Toolbar
        disableGutters
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              mr: 2,
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: ".1rem",
              cursor: "pointer",
              color: primary,
              textDecoration: "none",
            }}
            onClick={() => {
              dispatch(setSearchText({ searchText: "" }));
              navigate("/home");
            }}
          >
            LetUsCook
          </Typography>
        </Box>
        {user && (
          <Stack direction="row">
            <Box
              sx={{
                display: { md: "flex" },
                justifyContent: "end",
                marginRight: "6px",
              }}
            >
              {pages.map((page) => (
                <Tooltip title={page.tooltip} key={page.tooltip}>
                  <IconButton
                    size="large"
                    onClick={() => {
                      dispatch(setSearchText({ searchText: "" }));
                      navigate(page.route);
                    }}
                  >
                    {page.id === 2 && (
                      <FavoriteBorderIcon
                        alt={page.tooltip}
                        sx={{ color: primary }}
                      />
                    )}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={"User Image"} src={loggedUser.photoURL} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{
                  mt: "40px",
                  boxShadow: "0px 1px 2px rgb(23 110 222 / 5%)",
                }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => {
                  if (setting.id == "mode") {
                    return (
                      <MenuItem
                        key={setting.id}
                        onClick={() => handleCloseUserMenu(setting.id)}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        {isDarkMode ? (
                          <Brightness4Icon sx={{ color: primary }} />
                        ) : (
                          setting.icon
                        )}
                        <Typography textAlign="center" sx={{ ml: 1 }}>
                          {isDarkMode ? "Light Mode" : setting.name}{" "}
                        </Typography>
                      </MenuItem>
                    );
                  }
                  return (
                    <MenuItem
                      key={setting.id}
                      onClick={() => handleCloseUserMenu(setting.id)}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      {setting.icon}
                      <Typography textAlign="center" sx={{ ml: 1 }}>
                        {setting.name}{" "}
                      </Typography>
                    </MenuItem>
                  );
                })}
              </Menu>
            </Box>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;
