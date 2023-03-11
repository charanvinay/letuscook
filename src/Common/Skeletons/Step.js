import { Box, Skeleton } from "@mui/material";
import React from "react";
import CKeditor from "./CKeditor";

const Step = () => {
  return (
    <Box sx={{ padding: 0, margin: 0 }}>
      <Skeleton variant="rounded" animation="wave" width={40} sx={{marginY: "13px"}} height={15} />
      <CKeditor />
    </Box>
  );
};

export default Step;
