import axios from "axios";

const API_URL = "/api";
const getStateData = async (states) => {
//   console.log(states);
  const response = await axios.get(API_URL + "/states", states);
  // console.log(response.data);
  return response.data;
};

const statesService = {
  getStateData,
};


export default statesService;
