import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logOutUser } from "../Features/Auth/authSlice";
import { toast } from "react-toastify";

const Navbar = () => {
  // const { user } = useSelector((state) => state.auth);

  // const dispatch = useDispatch();

  // const handleLogout = async () => {
  //   try {
  //     const resultAction = await dispatch(logOutUser());
  //     toast.success("Logout successful!");
  //     toast.success(resultAction);
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/logout", {
        method: "GET",
        credentials: "include", // Important for session-based authentication
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      dispatch(logOutUser()); // Clear user state from Redux
      toast.success("Logout successful!");
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to={"/"}>Demo</Link>
        </Typography>
        {!user ? (
          <>
            <Box>
              <Link to={"/login"}>
                <Button color="inherit">Login</Button>
              </Link>
              <Link to={"/register"}>
                <Button color="inherit">Register</Button>
              </Link>
            </Box>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => handleLogout()}>
              Logout
            </Button>
            {/* <Link to={"/create"} >
            <Button color="inherit" >
              Create Post
            </Button>
            </Link> */}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
