import { Box, Button, Container } from "@mui/material";
import { useTheme } from "@mui/system";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import dotsb from "../Assets/dotsb.png";
import dotscross from "../Assets/dotscross.png";
import login from "../Assets/login.png";
import { BookLoaderComponent } from "../Common/BookLoader";
import CustomBackdrop from "../Common/CustomBackdrop";
import { bgSecondary, primary } from "../Common/Pallete";
import { auth, signInWithGoogle } from "../services/firebase";

function Login() {
  const [user, loading] = useAuthState(auth);
  const [pageLoading, setPageLoading] = useState(false);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [loadBackdrop, setLoadBackdrop] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const bpSMd = theme.breakpoints.down("sm"); //max-width:599.95px
  const bpXLd = theme.breakpoints.down("xl"); //max-width:1535.95px

  useEffect(() => {
    if (loading) {
      setPageLoading(true);
      return;
    }
    // console.log(user);
    if (isLoggedin && user) {
      customSetTimeout("/home");
    } else if (user) {
      navigate("/home");
    }
    setPageLoading(false);
  }, [user, loading, isLoggedin]);

  const customSetTimeout = (navTo) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setLoadBackdrop(true);
    const newTimeoutId = setTimeout(() => {
      navigate(navTo);
      setLoadBackdrop(false);
    }, 1500);

    setTimeoutId(newTimeoutId);
  };

  return (
    <>
      {pageLoading ? (
        <BookLoaderComponent height={"100vh"} />
      ) : (
        <Box
          height="100vh"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            backgroundColor: bgSecondary,
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: [0.9, 1] }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                bottom: -60,
                left: -100,
                width: 200,
                height: 200,
                borderRadius: "50%",
                border: "50px solid " + primary,
              }}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: [0.9, 1] }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: -150,
                right: -150,
                width: 400,
                height: 400,
                borderRadius: "50%",
                backgroundColor: primary,
              }}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ y: [20, 0], opacity: [1] }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
          >
            <Container maxWidth="md" sx={{ zIndex: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  backgroundColor: "#fff",
                  boxShadow: "0 0 20px -2px #d1e3fa",
                  [bpXLd]: {
                    boxShadow: "0 0 20px -16px #000",
                  },
                  [bpSMd]: { boxShadow: "0 0 10px -6px #000" },
                }}
              >
                {/* left */}
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    padding: "20px",
                    height: "70vh",
                    overflow: "hidden",
                    backgroundColor: primary,
                  }}
                >
                  <Box
                    sx={{
                      overflow: "hidden",
                      position: "absolute",
                      top: -25,
                      right: -120,
                      opacity: 0.5,
                      filter: "invert(100%)",
                    }}
                  >
                    <img src={dotscross} alt={"dotswhite"} width="400px" />
                  </Box>
                  <Box sx={{ width: "50%" }}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ scale: [0.5, 1], opacity: [0, 1] }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                      }}
                    >
                      <img
                        src={login}
                        alt={"login_image"}
                        width="100%"
                        loading="lazy"
                      />
                    </motion.div>
                  </Box>
                  <Box sx={{ margin: "20px 0px 10px 0px" }}>
                  <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ y: [20, 0], opacity: [0, 1] }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    >
                    <Button
                      variant="contained"
                      fullWidth={true}
                      onClick={() => {
                        const isloggedin = signInWithGoogle();
                        if (isloggedin) {
                          setIsLoggedin(isloggedin);
                        }
                      }}
                      sx={{
                        backgroundColor: "white",
                        color: primary,
                        fontWeight: "bold",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "white",
                        },
                      }}
                      startIcon={<FcGoogle />}
                    >
                      Sign In With Google
                    </Button>
                      </motion.div>
                  </Box>
                  <Box
                    sx={{
                      overflow: "hidden",
                      position: "absolute",
                      bottom: -70,
                      left: -10,
                      opacity: 0.5,
                      filter: "invert(100%)",
                    }}
                  >
                    <img src={dotsb} alt={"dotswhite"} width="200px" />
                  </Box>
                </Box>
              </Box>
            </Container>
          </motion.div>
          <CustomBackdrop loading={loadBackdrop} />
        </Box>
      )}
    </>
  );
}

export default Login;
