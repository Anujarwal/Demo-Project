import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "./userService";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
    edit: {
      edit: {},
      isEdit: false,
    },
  },

  reducers: {
    // remove Card by Id
    removeCard: (state, action) => {
      return {
        ...state,
        users: state.users.filter((user) => user._id !== action.payload),
      };
    },

    // edit Card By Id
    editCard: (state, action) => {
      return {
        ...state,
        edit: {
          isEdit: true,
          edit: action.payload,
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = -false;
        state.isError = false;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
        state.isError = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(deleteUserID.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(deleteUserID.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = state.users.filter((user) => user._id !== action.payload);
        state.isError = false;
      })
      .addCase(deleteUserID.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(updateUser.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userCard = action.payload;
        state.isError = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { removeCard, editCard } = userSlice.actions;
export default userSlice.reducer;

// get all users
export const fetchUsers = createAsyncThunk("USERS/FETCH", async () => {
  try {
    return await userService.userGetAll();
  } catch (error) {
    let message = error.response.data.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Delete User
export const deleteUserID = createAsyncThunk(
  "USER/DELETE",
  async (_id, thunkAPI) => {
    try {
      return await userService.deleteUserById(_id);
    } catch (error) {
      let message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// updated User

// export const updateUser = createAsyncThunk("USER/EDIT", async (_id, formData) => {
//   try {
//     return await userService.updateUserById(_id, formData);
//   } catch (error) {
//     console.log(error);
//   }
// });

// export const updateUser = createAsyncThunk(
//   "USER/EDIT",
//   async ({ formData }, { rejectWithValue }) => {
//     console.log("formData: " + formData);

//     try {
//       console.log("formData: " + formData);
//       // return await userService.updateUserById(formData);
//     } catch (error) {
//       console.log("error: " + error);
//       return rejectWithValue(
//         error.response?.data?.message || "Something went wrong"
//       );
//     }
//   }
// );

export const updateUser = createAsyncThunk(
  "USER/EDIT",
  async ({ formData }, { rejectWithValue }) => {
    try {
      // console.log("formData [updateUser.userSlice]:", formData);
      const response = await userService.updateUserById(formData);
      // console.log("Updated user response:", response);
      return response;
    } catch (error) {
      console.log("Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// // Pagination

// export const updatePagination = createAsyncThunk(
//   "PAGINATION/PAGES",
//   async (pages, thunkAPI) => {
//     try {
//       // return await userService.getUsersByPage(pages);
//       console.log(pages);
//     } catch (error) {
//       let message = error.response.data.message;
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );
