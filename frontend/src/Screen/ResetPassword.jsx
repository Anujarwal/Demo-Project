import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { passwordUpdate } from "../Features/Auth/authSlice";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const { updated } = useSelector((state) => state.auth);

  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { password, confirmPassword } = passwords;

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("All fields are required!");
      return;
    }

    
    const token = await updated.message;


    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const resultAction = await dispatch(passwordUpdate({ password, token }));
      toast.success("Password has been reset successfully")
      toast.success(resultAction);
      navigate(`/login`);
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  return (
    <Container>
      <Typography variant="h5" textAlign="center" fontFamily="cursive">
        Reset Password Page
      </Typography>
      <Box
        component="form"
        display="flex"
        onSubmit={handleSubmit}
        flexDirection="column"
        alignItems="center"
        mt={4}
        maxHeight="400px"
        mx="auto"
      >
        <TextField
          label="New Password"
          type="password"
          value={password}
          name="password"
          onChange={handleChange}
          required
          margin="normal"
          fullWidth
        />
        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          name="confirmPassword"
          onChange={handleChange}
          required
          margin="normal"
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">
          Reset Password
        </Button>
      </Box>
    </Container>
  );
};

export default ResetPassword;
