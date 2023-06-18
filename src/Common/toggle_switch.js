import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setActiveTab } from "../redux/slices/userSlice";
import { primary } from "./Pallete";
import { Typography, useTheme } from "@mui/material";

const ToggleSwitch = () => {
  const [selectedOption, setSelectedOption] = useState(1);
  const dispatch = useDispatch();
  const theme = useTheme();
  const { mode, background } = theme.palette;

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    dispatch(setActiveTab(option));
  };

  const options = [
    {
      id: 1,
      label: "Ingredients",
    },
    {
      id: 2,
      label: "Instructions",
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          backgroundColor: mode === "dark" ? background.paper : "rgb(215 230 249)",
          borderRadius: "10px",
          padding: 6,
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        {options.map((option) => (
          <motion.div
            key={option.id}
            style={{
              padding: 15,
              width: "100%",
              textAlign: "center",
              borderRadius: "10px",
              cursor: "pointer",
              position: "relative",
            }}
            animate={{
              color: selectedOption === option.id ? "white" : mode === "dark" ? "white" : "black",
            }}
            onClick={() => handleOptionChange(option.id)}
          >
            <p style={{ position: "relative", zIndex: 1 }}>{option.label}</p>
            <motion.div
              style={{
                position: "absolute",
                borderRadius: "10px",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor:
                  selectedOption === option.id ? primary : "transparent",
              }}
              animate={{
                x:
                  selectedOption === option.id
                    ? 0
                    : option.id == 1
                    ? "100%"
                    : "-100%",
              }}
              transition={{ type: "tween", duration: 0.3 }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ToggleSwitch;
