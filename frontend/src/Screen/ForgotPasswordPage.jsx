import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage, passwordForgot } from "../Features/Auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPasswordPage = () => {
  const [formData, setFormData] = useState({ email: "" });
  const { email } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, message, errorMessage } = useSelector(
    (state) => state.auth
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email!");
      return;
    }

    try {
      const resultAction = await dispatch(passwordForgot({ email })).unwrap();
      toast.success(resultAction);
      navigate(`/reset-password/${email}`);
    } catch (error) {
      toast.error(error.message || "Failed to send reset link.");
    }
  };
  const handleClear = () => {
    dispatch(clearMessage());
  };

  return (
    <Container>
      <Typography variant="h5" textAlign="center" fontFamily="cursive">
        Forgot Password Page
      </Typography>
      <Box
        mt={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
        component="form"
        onSubmit={handleSubmit}
        width="100%"
        maxWidth="400px"
        mx="auto"
      >
        <TextField
          label="Enter Your Email"
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>

        {message && (
          <Typography color="green" mt={2}>
            {}
          </Typography>
        )}
        {errorMessage && (
          <Typography color="red" mt={2}>
            {errorMessage}
          </Typography>
        )}
        {(errorMessage) && (
          <Button onClick={handleClear} color="secondary" size="small">
            Clear
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
