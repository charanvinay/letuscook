import { Box, CircularProgress } from "@mui/material";
// import { BookLoader } from "react-awesome-loaders";
import { primary, primaryLight } from "./Pallete";
export const BookLoaderComponent = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: props.height,
      }}
    >
      {/* <BookLoader
        background={`linear-gradient(135deg, ${primaryLight}, ${primary})`}
        desktopSize={"40px"}
        mobileSize={"20px"}
        text=""
      /> */}
       <CircularProgress />
    </Box>
  );
};
