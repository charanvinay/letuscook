import {
  Box,
  Card,
  Container,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { motion } from "framer-motion";

const ProfileCard = ({ username, recipesCount, favouritesCount }) => {
  const theme = useTheme();
  const bpSMd = theme.breakpoints.down("md");
  return (
    <Container>
      <Card
        sx={{
          borderRadius: "10px",
          position: "relative",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100px",
          // backgroundImage:
          //   "linear-gradient(25deg, #142374, #1922a0, #1a1ccf, #150bff)",
          backgroundImage:
            "linear-gradient(25deg, #0012d9, #1c43e6, #1f67f2, #0489ff)",
          boxShadow:
            "1px 2px 2px hsl(0deg 0% 50% / 0.2), 2px 4px 4px hsl(0deg 0% 50% / 0.2), 4px 8px 8px hsl(0deg 0% 50% / 0.2), 8px 16px 16px hsl(0deg 0% 50% / 0.2), 16px 32px 32px hsl(0deg 0% 50% / 0.2)",
        }}
      >
        <Stack sx={{ textAlign: "center" }} spacing={1} alignItems="center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ y: [20, 0], opacity: [0, 1] }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontWeight: "bold",
                color: "white",
                [bpSMd]: {
                  fontSize: "25px",
                },
              }}
            >
              {username}
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ y: [20, 0], opacity: [0, 1] }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <Stack direction="row" justifyContent="center" spacing={2}>
              <Stack>
                <Typography
                  variant="body1"
                  sx={{ textTransform: "capitalize", color: "white" }}
                >
                  Recipes
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ textTransform: "capitalize", color: "white" }}
                >
                  {recipesCount}
                </Typography>
              </Stack>
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{ borderColor: "rgba(255, 255, 255,0.1)" }}
              />
              <Stack>
                <Typography
                  variant="body1"
                  sx={{ textTransform: "capitalize", color: "white" }}
                >
                  Favourites
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ textTransform: "capitalize", color: "white" }}
                >
                  {favouritesCount}
                </Typography>
              </Stack>
            </Stack>
          </motion.div>
        </Stack>
        <Box
          sx={{
            position: "absolute",
            top: -70,
            left: -100,
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: "30px solid rgba(255, 255, 255,0.1)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -40,
            right: -40,
            width: 150,
            height: 150,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255,0.1)",
          }}
        />
      </Card>
    </Container>
  );
};

export default ProfileCard;
