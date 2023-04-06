import { Box, useTheme } from "@mui/material";
// import { BookLoader } from "react-awesome-loaders";
import CTSMLoader from "../Assets/GIFS/bluemix.gif";
export const BookLoaderComponent = (props) => {
  const theme = useTheme();
  const bpSMd = theme.breakpoints.down("sm");
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100dvh",
      }}
    >
      <Box
        sx={{
          width: "10%",
          [bpSMd]: {
            width: "30%",
          },
        }}
      >
        <img src={CTSMLoader} alt="Loader" width="100%" />
      </Box>
    </Box>
  );
};
