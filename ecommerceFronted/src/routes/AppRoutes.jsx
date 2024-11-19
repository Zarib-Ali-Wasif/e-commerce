import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "@mui/material";
import About from "../pages/About.jsx";
import CartIcon from "../components/CartIcon.jsx";
import ProductsPage from "../pages/ProductsPage";
import CartPage from "../pages/CartPage";
function AppRoutes() {
  return (
    <Router
    // future={{
    //   v7_startTransition: true,
    //   v7_relativeSplatPath: true,
    // }}
    >
      <Container>
        <CartIcon />
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default AppRoutes;
