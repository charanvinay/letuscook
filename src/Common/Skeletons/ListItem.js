import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const ListItem = ({ key }) => {
  return (
    <Stack spacing={2} direction="row" key={key} alignItems="center" sx={{padding:"10px 15px"}}>
      <Skeleton animation="wave" variant="circular" width={40} height={40} />
      <Stack spacing={1}>
        <Skeleton animation="wave" height={25} width={200} />
        <Skeleton animation="wave" height={18} width={60} />
      </Stack>
    </Stack>
  );
};

export default ListItem;
