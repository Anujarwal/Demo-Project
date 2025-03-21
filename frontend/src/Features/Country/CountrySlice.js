import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import countryService from "./CountryService";

const countrySlice = createSlice({
  name: "country",
  initialState: {
    countries: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(countryGetAll.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(countryGetAll.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.countries = action.payload;
        state.isError = false;
      })
      .addCase(countryGetAll.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export default countrySlice.reducer;

export const countryGetAll = createAsyncThunk(
  "COUNTRY_GET_ALL",
  async (country) => {
    try {
      return await countryService.getCountryData(country);
    } catch (error) {
      console.log(error);
    }
  }
);
