import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "../pages/About.jsx";
import Product from "../pages/Product.jsx";

function AppRoutes() {
  return (
    <div>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/product" element={<Product />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default AppRoutes;
