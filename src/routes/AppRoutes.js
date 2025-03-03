import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard";
import Category from "../pages/Category/Category";
import NotFound from "../pages/NotFound/NotFound";
import Product from "../pages/Product/Product";
import AddProduct from "../pages/Product/AddProduct";
import Report from "../pages/Report/Report";

const AppRoutes = () => {
  const isAuthenticated = !!localStorage.getItem("adminToken");
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/category"
        element={isAuthenticated ? <Category /> : <Navigate to="/login" />}
      />

      <Route path="*" element={<NotFound />} />
      <Route path="/product" element={<Product />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/edit-product/:id" element={<AddProduct />} />
      <Route path="/report" element={<Report />} />
    </Routes>
  );
};

export default AppRoutes;
