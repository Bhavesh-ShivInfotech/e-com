import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import ForgetPasswordPage from "../pages/auth/ForgetPassword";
import Dashboard from "../pages/Dashboard";
import Category from "../pages/Category/Category";
import AddCategory from "../pages/Category/AddCategory";
import EditCategory from "../pages/Category/EditCategory";
import Product from "../pages/Product/Product";
import AddProduct from "../pages/Product/AddProduct";
import Report from "../pages/Report";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgetPasswordPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/category" element={<Category />} />
      <Route path="/addcategory" element={<AddCategory />} />
      <Route path="/editcategory/:id" element={<EditCategory />} />
      <Route path="/product" element={<Product />} />
      <Route path="/addproduct" element={<AddProduct />} />
      <Route path="/report" element={<Report />} />
    </Routes>
  );
};

export default AppRoutes;
