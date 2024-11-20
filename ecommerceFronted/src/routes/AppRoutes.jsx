import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Products from "../pages/Products";
import NotFound from "../pages/NotFound";
import ProductDetails from "../pages/ProductDetails";
import Layout from "../components/Layout";

function AppRoutes() {
  return (
    <BrowserRouter
    //  basename={process.env.PUBLIC_URL}
    >
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          {/* <Route path="/products/:id" element={<ProductDetails />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default AppRoutes;
