import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Auth/Login";
import ForgetPasswordPage from "../pages/Auth/ForgetPassword";
import Dashboard from "../pages/Dashboard";
import Category from "../pages/Category/Category";
import NotFound from "../pages/NotFound/NotFound";
import Product from "../pages/Product/Product";
import AddProduct from "../pages/Product/AddProduct";

const AppRoutes = () => {
  const isAuthenticated = !!localStorage.getItem("adminToken");
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgetPasswordPage />} />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/category"
        element={isAuthenticated ? <Category /> : <Navigate to="/login" />}
      />

      <Route path="*" element={<NotFound />} />
      <Route path="/product" element={<Product />} />
      <Route path="/addproduct" element={<AddProduct />} />
    </Routes>
  );
};

export default AppRoutes;
