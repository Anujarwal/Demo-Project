import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import citiesService from "./citiesService";

const citiesSlice = createSlice({
  name: "cities",
  initialState: {
    cities: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(citiesDataGetting.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(citiesDataGetting.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cities = action.payload;
        state.isError = false;
      })
      .addCase(citiesDataGetting.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export default citiesSlice.reducer;

export const citiesDataGetting = createAsyncThunk(
  "CITIES_DATA_GETTING",
  async (cities) => {
    try {
      return await citiesService.getCitiesData(cities);
    } catch (error) {
      console.log(error);
    }
  }
);
