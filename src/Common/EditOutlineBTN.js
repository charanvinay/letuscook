import { IconButton } from "@mui/material";
import React from "react";
import { BiEdit } from "react-icons/bi";
import { primary } from "./Pallete";

const EditOutlineBTN = (props) => {
  return (
    <IconButton
      size="small"
      sx={{
        backgroundColor: "rgba(23, 110, 222, 0.08)",
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
