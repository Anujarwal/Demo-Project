import axios from "axios";

const API_URL = "/api";

const userGetAll = async (userData) => {
  const response = await axios.get(API_URL + "/getAllUser", userData);
  // console.log("response", response);
  return response.data;
};

// Delete user form Datbase by id

const deleteUserById = async (_id, token) => {
  const options = {
    Headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + "/" + _id, options);
  return response.data;
};

// edit user form Datbase by id

const updateUserById = async (formData) => {
  const response = await axios.put(API_URL + "/updateUser", formData);
  return response.data;
};

// pagination

const getUsersByPage = async (page, limit) => {
  try {
    const response = await axios.get(`${API_URL}/post?page=${page}&limit=${limit}`);
    if (response.data && Array.isArray(response.data.posts)) {
      return {
        data: response.data.posts,
        total: response.data.total || 0, // Use the correct key from backend
      };
    } else {
      console.warn("Unexpected API response format:", response);
      return { data: [], total: 0 };
    }
  } catch (error) {
    console.error("Error in getUsersByPage:", error.response || error.message);
    return { data: [], total: 0 };
  }
};

const userGetGooleLogin = async () => {
  const response = await axios.get(API_URL + "/users");
  // console.log(response);
  return response.data;
}


const userService = {
  userGetAll,
  deleteUserById,
  updateUserById,
  getUsersByPage,
  userGetGooleLogin
};

export default userService;
