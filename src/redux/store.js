import { configureStore } from "@reduxjs/toolkit";
import RecipeReducer from "./slices/recipeSlice";
import FiltersReducer from "./slices/filtersSlice";
import UserReducer from "./slices/userSlice";

export const store = configureStore({
    reducer:{
        recipeReducer: RecipeReducer,
        filtersReducer: FiltersReducer,
        userReducer: UserReducer,
    }
})