import React from "react";
import useAuthStatus from "../Hook/useAuthStatus";
import { Container, LinearProgress } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
  const { isLoggedIn, isChechedIn } = useAuthStatus();

  if (isChechedIn) {
    return (
      <Container sx={{ padding: "50px 0px" }}>
        <LinearProgress />
      </Container>
    );
  }

  return isLoggedIn ? <Outlet /> : <Navigate to={"/login"}  />;
};

export default PrivateRoutes;
