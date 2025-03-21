import React from "react";
import Navbar from "./Components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeroSection from "./Screen/HeroSection";
import LoginPage from "./Screen/LoginPage";
import RegisterPage from "./Screen/RegisterPage";
import ForgotPasswordPage from "./Screen/ForgotPasswordPage";
import EditCardById from "./Components/EditCardById";
import ResetPassword from "./Screen/ResetPassword";
import { ToastContainer, toast } from "react-toastify";
import PrivateRoutes from "./Components/PrivateRoutes";
import PageNotFound from "./Screen/PageNotFound/PageNotFound";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="*" element={ <PageNotFound />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/" element={<PrivateRoutes />}>
          <Route path="/" element={<HeroSection />} />
          <Route path="edit-card" element={<EditCardById />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
