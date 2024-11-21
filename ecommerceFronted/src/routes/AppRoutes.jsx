import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Products from "../pages/Products";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Layout from "../components/Layout";
import Cart from "../components/Cart";
import CartProvider from "../context/CartContext";
import CheckoutPage from "../pages/CheckoutPage";
import OrderConfirmation from "../pages/OrderConfirmation";

function AppRoutes() {
  return (
    <CartProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
        //  basename={process.env.PUBLIC_URL}
      >
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route
              path="/products/:id"
              element={<Products showModal={true} />}
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </CartProvider>
  );
}

export default AppRoutes;
