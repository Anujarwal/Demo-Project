import axios from "axios";

const API_URL = "/api";
const getCountryData = async (country) => {
  const response = await axios.get(API_URL + "/countries", country);
  // console.log(response.data);
  return response.data;
};

const countryService = {
  getCountryData,
};

export default countryService;
