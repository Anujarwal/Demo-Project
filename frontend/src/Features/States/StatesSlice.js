import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import statesService from "./StatesService";

const statesSlice = createSlice({
  name: "states",
  initialState: {
    states: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(statesGetAll.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(statesGetAll.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.states = action.payload;
        state.isError = false;
      })
      .addCase(statesGetAll.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export default statesSlice.reducer;

export const statesGetAll = createAsyncThunk(
  "STATES_GET_ALL/FETCH",
  async (states, thunkAPI) => {
    try {
      const state = await statesService.getStateData(states);
      // console.log(state, "state");
      return state;
    } catch (error) {
      console.log(error);
    }
  }
);
