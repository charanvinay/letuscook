import { createSlice } from "@reduxjs/toolkit";
import { getUniqueId } from "../../Common/Constants";

export const initialState = {
  id: "",
  title: "",
  type: "",
  serves: "",
  ingredients: [
    {
      id: getUniqueId(),
      errors: [],
      units: "",
      value: "",
    },
  ],
  steps: [
    {
      id: getUniqueId(),
      errors: [],
      value: "",
    },
  ],
  finish: { errors: [], imgSrc: "", value: "" },
  favouritedBy: [],
  createdAt: "",
};
export const recipeSlice = createSlice({
  name: "recipe_slice",
  initialState: initialState,
  reducers: {
    handlePrimitiveState: (state, action) => {
      let { name, value } = action.payload;
      state[name] = value;
    },
    addItem: (state, action) => {
      let { name, value } = action.payload;
      state[name].push(value);
    },
    editItem: (state, action) => {
      let { id, name, value, type } = action.payload;
      state[name].map((item, ind) => {
        if (item.id === id) {
          state[name][ind][type] = value;
        }
      });
    },
    editFinish: (state, action) => {
      let { val, type } = action.payload;
      if (type === "image") {
        state.finish["imgSrc"] = val;
      } else {
        state.finish["value"] = val;
      }
    },
    deleteItem: (state, action) => {
      let { name, id } = action.payload;
      let filteredItems = state[name].filter((item) => item.id !== id);
      state[name] = filteredItems;
    },
    handleFinishValidation: (state, action) => {
      state.finish["errors"] = [];
      if (!Boolean(state.finish.value)) {
        state.finish["errors"].push({
          message: "Please fill the final step",
        });
      }
      if (!Boolean(state.finish.imgSrc)) {
        state.finish["errors"].push({
          message: "Please Upload the final image",
        });
      }
    },
    setSelectedRecipe: (state, action)=>{
      return {...action.payload};
    }
  },
});

export const getRecipe = (state) => state.recipeReducer;
export const {
  addItem,
  editItem,
  editFinish,
  deleteItem,
  setSelectedRecipe,
  handlePrimitiveState,
  handleFinishValidation,
} = recipeSlice.actions;
export default recipeSlice.reducer;
