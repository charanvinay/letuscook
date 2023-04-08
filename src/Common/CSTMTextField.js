import { TextField } from "@mui/material";
import React from "react";

const CSTMTextField = (props) => {
  return (
    <TextField
      inputProps={{
        maxLength: 20,
      }}
      InputProps={{
        style: {
          letterSpacing: 0.6,
        },
        placeholder: props.placeholder,
      }}
      fullWidth
      variant="outlined"
      name={props.name}
      value={props.value}
      onChange={props.onChange}
    />
  );
};

export default CSTMTextField;
