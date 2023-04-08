import { MenuItem, Select } from "@mui/material";
import React from "react";

const CSTMSelect = (props) => {
  return (
    <Select
      value={props.value || ""}
      displayEmpty
      name={props.name}
      sx={{ width: "100%" }}
      renderValue={(selected) => {
        if (!Boolean(selected)) {
          return (
            <p style={{ color: "rgb(191 191 191)" }}>{props.placeholder}</p>
          );
        }
        return selected;
      }}
      onChange={props.onChange}
    >
      {props.options.map((type, ind) => (
        <MenuItem value={type} key={ind}>
          {type}
        </MenuItem>
      ))}
    </Select>
  );
};

export default CSTMSelect;
