import axios from "axios";

const API_URL = "/api";

const userRegister = async (userData) => {
  console.log("userData", userData);
  const response = await axios.post(API_URL + "/register", userData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  localStorage.setItem("user", JSON.stringify(response.data));
  return response.data;
  //   console.log(response);
};

const userLogin = async (userData) => {
  const response = await axios.post(API_URL + "/login", userData);
  localStorage.setItem("user", JSON.stringify(response.data));
  return response.data;
};

const forgotPassword = async (email) => {
  // console.log(email)
  const response = await axios.post(API_URL + "/forgot-password", email);
  return response.data;
};

const updatedPassword = async (formData) => {
  const response = await axios.post(API_URL + `/reset-password`, formData);
  return response;
};

const googleAuth = async () => {
  const response = await axios.post(API_URL + "/google");
  localStorage.setItem("user", JSON.stringify(response.data));
  return response.data;
};

const authServie = {
  userRegister,
  userLogin,
  forgotPassword,
  updatedPassword,
  googleAuth,
};

export default authServie;
