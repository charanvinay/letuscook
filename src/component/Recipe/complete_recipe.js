import { Box, Container, Stack } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import HeadingLG from "../../Common/HeadingLG";
import HeadingMD from "../../Common/HeadingMD";
import ImgWithBorder from "../../Common/ImgWithBorder";
import Subtitle1 from "../../Common/Subtitle1";
import { getRecipe } from "../../redux/slices/recipeSlice";

const CompleteRecipe = () => {
  const recipe = useSelector(getRecipe);
  return (
    <Container maxWidth="xl" sx={{ marginTop: 2, marginBottom: 5 }}>
      <Box sx={{ textAlign: "center" }}>
        <HeadingLG text={recipe.title} />
        <Subtitle1 text={recipe.type + " | Serves - " + recipe.serves} />
      </Box>
      <Box sx={{ margin: "20px 0 10px 0" }}>
        <HeadingMD text={"INGREDIENTS"} width={70} />
      </Box>
      <Stack spacing={1} sx={{ margin: "5px 10px" }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: "50px" }}>S.No</th>
              <th>Name</th>
              <th>Units</th>
            </tr>
          </thead>
          <tbody>
            {recipe.ingredients.map((step, skey) => {
              return (
                <tr key={step.id}>
                  <td>{skey + 1}</td>
                  <td>
                    <Subtitle1 text={step.value} />
                  </td>
                  <td>
                    <Subtitle1 text={step.units} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Stack>
      <Box sx={{ margin: "25px 0px 15px 0px" }}>
        <HeadingMD text={"STEPS"} width={35} />
      </Box>
      <Stack spacing={1} sx={{ margin: "5px 10px" }}>
        <ol type="1">
          {recipe.steps.map((step, skey) => {
            return (
              <li key={step.id} style={{ marginLeft: "12px" }}>
                <Subtitle1 text={step.value} />
              </li>
            );
          })}
        </ol>
      </Stack>
      <Box sx={{ margin: "20px 0 10px 0" }}>
        <HeadingMD text={"FINAL STEP"} width={50} />
      </Box>
      <Stack direction={"column"} spacing={2}>
        <Subtitle1 text={recipe.finish.value} />
        {recipe.finish.imgSrc && (
          <ImgWithBorder imgSrc={recipe.finish.imgSrc} />
        )}
      </Stack>
    </Container>
  );
};

export default CompleteRecipe;
