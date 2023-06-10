import { createTheme } from "@mui/material";
import { bgSecondary, primary } from "./Pallete";
import Beverages from "./Ribbons/Beverages";
import Breakfast from "./Ribbons/Breakfast";
import Egg from "./Ribbons/Egg";
import NonVeg from "./Ribbons/NonVeg";
import Snacks from "./Ribbons/Snacks";
import Veg from "./Ribbons/Veg";

export const getUniqueId = () =>
  new Date().getTime().toString(36) +
  "_" +
  (Date.now() + Math.random().toString()).split(".").join("_");

export const colourStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = primary;
    return {
      ...styles,
      fontSize: "14px",
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? bgSecondary
        : isFocused
        ? bgSecondary
        : undefined,
      color: isDisabled ? "#ccc" : isSelected ? bgSecondary : data.color,
      cursor: isDisabled ? "not-allowed" : "default",
      ":active": {
        ...styles[":active"],
        color: "#fff",
        backgroundColor: color,
      },
    };
  },
  multiValue: (styles, { data }) => {
    return {
      ...styles,
      backgroundColor: primary,
      color: "#fff",
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: "#fff",
  }),

  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data,
    opacity: 0.7,
    ":hover": {
      backgroundColor: data,
      color: "white",
      opacity: 1,
    },
  }),
};

export const theme = createTheme({
  palette: {
    primary: {
      main: primary,
    },
    secondary: {
      main: "#ffa500",
    },
  },
  typography: {
    subtitle1: {
      fontSize: "14px",
      letterSpacing: 0.5,
      fontWeight: "500",
    },
    subtitle2: {
      fontSize: "14px",
    },
    body1: {
      fontSize: "16px",
      letterSpacing: 0.4,
    },
    h1: {
      fontSize: "18px",
      fontWeight: "bold",
      letterSpacing: 0.5,
    },
  },
  components: {
    FormControlLabel: {
      root: {
        fontWeight: "400",
        color: "#ff0000",
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: "text" },
          style: {
            fontWeight: "600",
            letterSpacing: 0.7,
            fontSize: "14px",
            textTransform: "none",
          },
        },
        {
          props: { variant: "contained" },
          style: {
            textTransform: "none",
            // fontWeight: "600",
            fontFamily: "Poppins, sans-serif !important",
            // fontSize: "16px",
            letterSpacing: 0,
          },
        },
        {
          props: { variant: "outlined" },
          style: {
            textTransform: "none",
            // fontWeight: "600",
            fontFamily: "Poppins, sans-serif !important",
            // fontSize: "16px",
            letterSpacing: 0,
          },
        },
      ],
    },
    MuiChip: {
      styles: {
        fontSize: "20px",
      },
    },
    MuiStepper: {
      styles: {
        fontSize: "20px",
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: "Poppins, sans-serif !important"
        },
      },
    },
  },
});

export const bottomButtonsStyle = {
  display: "flex",
  justifyContent: "end",
  alignItems: "end",
};

export const returnType = (type) => {
  const obj = {
    Veg: <Veg />,
    NonVeg: <NonVeg />,
    Snacks: <Snacks />,
    Breakfast: <Breakfast />,
    Beverage: <Beverages />,
    Egg: <Egg />
  };
  return obj[type];
};

export const recipeTypes = ["Veg", "NonVeg", "Egg", "Breakfast", "Snacks", "Beverage"]

export const recipeServes = ["1", "2", "3", "4", "5", "6", "7", "8"];

export const getAllSubstrings= (str) => {
	str = str.toLowerCase();
  var res = [""];
  for (let i = 0; i < str.length; i++) {
    for (let j = i + 1; j <= str.length; j++) {
      res.push(str.substring(i, j));
    }
  }
  return res;
}

export const steps = [
  {
    label: "Title & Ingredients",
  },
  {
    label: "Step by Step Procedure",
  },
  {
    label: "Finishing touch",
  },
];

export const capitalize = (str)=>{
  return str?.toLowerCase().replace(/(^|\s)\S/g, (letter) => letter?.toUpperCase());
}