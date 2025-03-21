import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authServie from "./authService";

const userExits = JSON.parse(localStorage.getItem("user"));
const token = JSON.parse(localStorage.getItem("token"));

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userExits ? userExits : null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
    updated: token ? token : "",
  },

  reducers: {
    clearMessage: (state, action) => {
      state.message = "";
      state.errorMessage = "";
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },
    logOut: (state, action) => {
      state.user = null;
    },
    reset: (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = "";
      state.isSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.isError = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(logOutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.isError = false;
      })
      .addCase(loginUser.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.isError = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(passwordForgot.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(passwordForgot.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.updated = action.payload;
        state.isError = false;
      })
      .addCase(passwordForgot.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(passwordUpdate.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(passwordUpdate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.updated = action.payload;
        state.isError = false;
      })
      .addCase(passwordUpdate.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
    // .addCase(googleLogin.pending, (state, action) => {
    //   state.isLoading = true;
    //   state.isSuccess = false;
    //   state.isError = false;
    // })
    // .addCase(googleLogin.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.isSuccess = true;
    //   state.user = action.payload;
    //   state.isError = false;
    // })
    // .addCase(googleLogin.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.isSuccess = false;
    //   state.isError = true;
    //   state.errorMessage = action.payload;
    // });
  },
});

export const { clearMessage, setUser, logOut, reset } = authSlice.actions;
export default authSlice.reducer;

// Register User
export const registerUser = createAsyncThunk(
  "REGISTER/USER",
  async (userData, thunkAPI) => {
    try {
      console.log("authSlice", userData);
      return await authServie.userRegister(userData);
    } catch (error) {
      let message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout User
export const logOutUser = createAsyncThunk("LOGOUT/USER", async (thunkAPI) => {
  try {
    localStorage.removeItem("user");
  } catch (error) {
    let message = error.response.data.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// login user
export const loginUser = createAsyncThunk(
  "LOGIN/USER",
  async (userData, thunkAPI) => {
    try {
      return await authServie.userLogin(userData);
    } catch (error) {
      let message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Forgot Password

export const passwordForgot = createAsyncThunk(
  "FORGOT/PASSWORD",
  async (email, thunkAPI) => {
    try {
      return await authServie.forgotPassword(email);
    } catch (error) {
      let message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Updated Password

export const passwordUpdate = createAsyncThunk(
  "UPDATE/PASSWORD",
  async (formData, thunkAPI) => {
    try {
      const updatepassword = await authServie.updatedPassword(formData);
      return updatepassword;
    } catch (error) {
      let message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// // Google account login

// export const googleLogin = createAsyncThunk(
//   "GOOGLE/LOGIN",
//   async (thunkAPI) => {
//     try {
//       return await authServie.googleAuth();
//     } catch (error) {
//       let message = error.response.data.message;
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );
