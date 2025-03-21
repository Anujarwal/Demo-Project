import React from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import { Link } from "react-router-dom";
import "./style.css"; // Import the CSS for animation

const PageNotFound = () => {
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", pt: 10 }}>
      <Box className="page-not-found-container">
        <Typography variant="h1" sx={{ fontSize: "5rem", fontWeight: "bold" }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mt: 2, fontWeight: "medium" }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, mb: 3 }}>
          Oops! The page you are looking for doesn't exist.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/login"
          sx={{ fontSize: "1rem" }}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default PageNotFound;