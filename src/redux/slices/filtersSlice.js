import { createSlice } from "@reduxjs/toolkit";

let initialState = {
    searchText: '',
    type: null,
    serves: null,
    isFiltersApplied: false,
};

export const filtersSlice = createSlice({
    name: "filters_slice",
    initialState: initialState,
    reducers: {
        setSearchText:(state, action)=>{
            state.searchText = action.payload.searchText;
        },
        setRecipeType:(state, action)=>{
            state.type = action.payload.type;
        },
        setRecipeServes:(state, action)=>{
            state.serves = action.payload.serves;
        },
        setIsFiltersApplied: (state, action) => {
            state.isFiltersApplied = action.payload.isFiltersApplied
        }
    }
})

export const getFiltersState = (state) => state.filtersReducer;
export const { setSearchText, setRecipeType, setRecipeServes, setIsFiltersApplied } = filtersSlice.actions;
export default filtersSlice.reducer;