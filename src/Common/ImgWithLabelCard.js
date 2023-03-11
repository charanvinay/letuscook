import { Box, Card, Stack, Typography } from "@mui/material";
import React from "react";

const ImgWithLabelCard = (props) => {
  return (
    <Card sx={{ width: "100%" }}>
      <Stack
        direction="column"
        spacing={1}
        height={120}
        sx={{ position: "relative" }}
      >
        <Box sx={{ width: "100%", height: "100%" }}>
          <img
            src={props.imgSrc}
            alt={props.imgSrc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            loading="lazy"
          />
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              position: "absolute",
              bottom: 0,
              width: "100%",
              textAlign: "center",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "1",
              WebkitBoxOrient: "vertical",
            }}
          >
            {props.title}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
};

export default ImgWithLabelCard;
