import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "@mui/material";
import { useSelector } from "react-redux";
import ProductsPage from "../pages/ProductsPage";
import CartPage from "../pages/CartPage";
import CartIcon from "../components/CartIcon.jsx";
import ProtectedRoute from "../components/ProtectedRoute";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import Navbar from "../components/Navbar";

function AppRoutes() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Mock auth state

  return (
    // <Router
    // future={{
    //   v7_startTransition: true,
    //   v7_relativeSplatPath: true,
    // }}
    // >
    <Router>
      <Container>
        <Navbar />
        <CartIcon />
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default AppRoutes;
