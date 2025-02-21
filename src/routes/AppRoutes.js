import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Auth/Login";
import ForgetPasswordPage from "../pages/Auth/ForgetPassword";
import Dashboard from "../pages/Dashboard";
import Category from "../pages/Category/Category";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgetPasswordPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/category" element={<Category />} />
    </Routes>
  );
};

export default AppRoutes;
