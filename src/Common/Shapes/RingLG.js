import React from "react";
import { motion } from "framer-motion";
import { Box, useTheme } from "@mui/material";
import { primary } from "../Pallete";

const RingLG = (props) => {
  const theme = useTheme();
  const bpSMd = theme.breakpoints.down("sm"); //max-width:599.95px

  return (
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
          [bpSMd]: {
            display: props.d_sm_none ? "none" : "block",
          },
        }}
      />
    </motion.div>
  );
};

export default RingLG;
