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
import { getLoggedUser, handleLoggedUser } from "../redux/slices/userSlice";
import { auth, logOut } from "../services/firebase";

const pages = [{ id: 2, tooltip: "Favourites", route: "/favourites" }];
const settings = ["Profile", "Logout"];

function Navbar() {
  const [anchorElUser, setAnchorElUser] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, loading] = useAuthState(auth);
  const loggedUser = useSelector(getLoggedUser);

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
    // console.log(user_obj);
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
    if (setting === "Profile") {
      navigate(`/profile/${loggedUser.uid}`);
    } else if (setting === "Logout") {
      logOut();
      localStorage.removeItem("loggedUser");
      dispatch(handleLoggedUser({}));
    }
    dispatch(setSearchText({ searchText: "" }));
    setAnchorElUser(null);
  };

  return (
    <AppBar className="app__navbar" elevation={0}>
      <Container maxWidth="xl">
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
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => handleCloseUserMenu(setting)}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      {setting == "Profile" ? (
                        <AccountCircleIcon sx={{ color: primary }} />
                      ) : (
                        <LogoutIcon sx={{ color: primary }} />
                      )}
                      <Typography textAlign="center" sx={{ ml: 1 }}>
                        {setting}{" "}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Stack>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
