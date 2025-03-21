import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Auth/authSlice.js";
import userReducer from "./Users/userSlice";
import countryReducer from "./Country/CountrySlice";
import statesReducer from "./States/StatesSlice";
import citiesReducer from "./Cities/CitiesSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    country: countryReducer,
    states: statesReducer,
    cities: citiesReducer,
  },
});

export default store;
