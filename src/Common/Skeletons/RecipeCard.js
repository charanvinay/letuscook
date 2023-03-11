import { Skeleton, Stack } from "@mui/material";
import React from "react";

const RecipeCardSkeleton = () => {
  return (
    <Stack spacing={1}>
      <Skeleton variant="rectangular" height={230} />
      <Stack direction={"row"} justifyContent={"space-between"} sx={{padding: "0px 20px 0px 15px"}}>
        <Stack>
          <Skeleton variant="text" width={200} sx={{ width:"100%", fontSize: "1.2rem", marginBottom: "2px" }} />
          <Skeleton variant="text" width={100} sx={{ fontSize: "0.6rem" }} />
        </Stack>
        {/* <Skeleton variant="circular" width={40} height={40} /> */}
      </Stack>
    </Stack>
  );
};

export default RecipeCardSkeleton;
