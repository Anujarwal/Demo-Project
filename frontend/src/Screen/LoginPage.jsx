import React, { useEffect, useState } from "react";
import { Button, Card, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, setUser } from "../Features/Auth/authSlice";
import { toast } from "react-toastify";

const LoginPage = () => {
  // const { user } = useSelector((state) => state.auth);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  // const [form, setForm] = useState({ email: "", password: "" });
  // const { email, password } = form;

  // const handleChange = (e) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const resultAction = await dispatch(loginUser(form));
  //     if (loginUser.fulfilled.match(resultAction)) {
  //       toast.success("Login successful!");
  //     } else if (loginUser.rejected.match(resultAction)) {
  //       toast.error(resultAction.payload || "Invalid login details.");
  //     }
  //   } catch (error) {
  //     toast.error(error.message || "Something went wrong.");
  //   }
  // };

  // const loginWithGoogle = () => {
  //   window.open("http://localhost:8000/api/googleLogin" , "_self");
  // };

  // useEffect(() => {
  //   if (user) {
  //     navigate("/");
  //   }
  // }, [user]);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // console.log("user", user);
  // console.log("loginUser", loginUser);

  const [form, setForm] = useState({ email: "", password: "" });
  const { email, password } = form;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginUser(form));
      if (loginUser.fulfilled.match(resultAction)) {
        toast.success("Login successful!");
        navigate("/");
      } else if (loginUser.rejected.match(resultAction)) {
        toast.error(resultAction.payload || "Invalid login details.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  const loginWithGoogle = () => {
    window.open("http://localhost:8000/api/googleLogin", "_self");
    setTimeout(() => {
      fetch("http://localhost:8000/api/auth/me", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            dispatch(setUser(data?.user)); // Update Redux
            navigate("/");
          }
        })
        .catch((error) => console.error("Error fetching user:", error));
    }, 3000); // Delay to wait for login process
  };

  // const handleSuccess = (credentialResponse) => {
  //   alert("Google Sign in Success");
  //   console.log(credentialResponse);
  // };
  // const handleError = () => {
  //   console.log("Google Sign in Error");
  //   alert("Google Sign in Error");
  // };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/auth/me", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        if (data?.user) {
          dispatch(setUser(data?.user));
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    if (!user) {
      checkUser();
    }
  }, [user]);

  return (
    <Card sx={{ padding: "20px", margin: "20px 0px" }}>
      <Typography align="center" variant="h5" sx={{ margin: "20px 0px" }}>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          fullWidth
          sx={{ margin: "10px 0px" }}
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          fullWidth
          sx={{ margin: "10px 0px" }}
        />
        <Link to="/forgot-password">
          <Typography align="left" sx={{ margin: "10px 0px" }}>
            Forgot Password?
          </Typography>
        </Link>
        <Button fullWidth variant="contained" color="success" type="submit">
          Submit
        </Button>
      </form>

      <Button
        fullWidth
        sx={{ margin: "10px 0px" }}
        onClick={loginWithGoogle}
        type="submit"
      >
        Sign in With Google
      </Button>
    </Card>
  );
};

export default LoginPage;
