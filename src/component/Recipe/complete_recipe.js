import { Box, Container, Stack } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { useSelector } from "react-redux";
import HeadingLG from "../../Common/HeadingLG";
import HeadingMD from "../../Common/HeadingMD";
import ImgWithBorder from "../../Common/ImgWithBorder";
import Subtitle1 from "../../Common/Subtitle1";
import { getRecipe } from "../../redux/slices/recipeSlice";
const CompleteRecipe = () => {
  const recipe = useSelector(getRecipe);

  const returnMotionDiv = (comp) => (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ y: [20, 0], opacity: [0, 1] }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      {comp}
    </motion.div>
  );
  return (
    <Container maxWidth="xl" sx={{ paddingTop: 2, paddingBottom: 5 }}>
      <Box sx={{ textAlign: "center" }}>
        {returnMotionDiv(<HeadingLG text={recipe.title} />)}
        {returnMotionDiv(
          <Subtitle1 text={recipe.type + " | Serves - " + recipe.serves} />
        )}
      </Box>
      <Box sx={{ margin: "20px 0 10px 0" }}>
        {returnMotionDiv(<HeadingMD text={"INGREDIENTS"} width={70} />)}
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {recipe.ingredients.map((step, skey) => {
          return returnMotionDiv(
            <Stack
              direction={"row"}
              spacing={1}
              justifyContent="space-between"
              className="row-item"
              sx={{ marginRight: 1, marginBottom:1 }}
            >
              <Subtitle1 text={step.value} />
              <Subtitle1
                text={step.units}
                color={"rgb(46 103 175)"}
                fontWeight="bold"
              />
            </Stack>
          );
        })}
      </Box>
      <Box sx={{ margin: "25px 0px 15px 0px" }}>
        {returnMotionDiv(<HeadingMD text={"STEPS"} width={35} />)}
      </Box>
      <Stack spacing={1} sx={{ margin: "5px 10px" }}>
        <ol type="1">
          {recipe.steps.map((step, skey) => {
            return returnMotionDiv(
              <li key={step.id} style={{ marginLeft: "12px" }}>
                <Subtitle1 text={step.value} />
              </li>
            );
          })}
        </ol>
      </Stack>
      <Box sx={{ margin: "20px 0 10px 0" }}>
        {returnMotionDiv(<HeadingMD text={"FINAL STEP"} width={50} />)}
      </Box>
      <Stack direction={"column"} spacing={2}>
        {returnMotionDiv(<Subtitle1 text={recipe.finish.value} />)}
        {recipe.finish.imgSrc &&
          returnMotionDiv(<ImgWithBorder imgSrc={recipe.finish.imgSrc} />)}
      </Stack>
    </Container>
  );
};

export default CompleteRecipe;
