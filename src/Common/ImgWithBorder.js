import { Box } from "@mui/material";
import React from "react";

const ImgWithBorder = (props) => {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: "grey.500",
        borderRadius: "2px",
        padding: "5px",
        marginTop: "10px",
        // height: 200,
      }}
    >
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
    </Box>
  );
};

export default ImgWithBorder;
