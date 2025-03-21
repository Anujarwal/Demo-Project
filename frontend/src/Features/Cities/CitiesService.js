import axios from "axios";

const API_URL = "/api";
const getCitiesData = async (cities) => {
  const response = await axios.get(API_URL + "/cities", cities);
  // console.log(response.data);
  return response.data;
};

const citiesService = {
  getCitiesData,
};

export default citiesService;
