import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "@mui/material";
import { useSelector } from "react-redux";
import ProductsPage from "../pages/ProductsPage";
import CartPage from "../pages/CartPage";
import CartIcon from "../components/CartIcon.jsx";
import ProtectedRoute from "../components/ProtectedRoute";

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
        </Routes>
      </Container>
    </Router>
  );
}

export default AppRoutes;
