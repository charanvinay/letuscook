import { IconButton, useTheme } from "@mui/material";
import React from "react";
import { BiEdit } from "react-icons/bi";
import { primary } from "./Pallete";

const EditOutlineBTN = (props) => {
  const theme = useTheme();
  const { mode, background } = theme.palette;
  return (
    <IconButton
      size="small"
      sx={{
        backgroundColor: mode === "dark" ? background.paper : "rgba(23, 110, 222, 0.08)",
        padding: "12px",
        color: primary,
      }}
      onClick={props.onClick}
    >
      <BiEdit />
    </IconButton>
  );
};

export default EditOutlineBTN;
