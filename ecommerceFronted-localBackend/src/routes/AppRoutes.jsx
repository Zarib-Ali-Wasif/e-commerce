import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Products from "../pages/Products";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Layout from "../components/Layout";
import Cart from "../components/Cart";
import CartProvider from "../context/CartContext";
import Checkout from "../components/Checkout";
import OrderConfirmation from "../components/OrderConfirmation";
import Login from "../pages/Login";
import { AuthContext } from "../context/AuthContext";
import Signup from "../pages/Signup"; // Import Signup page

// ProtectedRoute Component
const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  const { user } = useContext(AuthContext); // Fetch authenticated user from context

  return (
    <CartProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route
              path="/products/:id"
              element={<Products showModal={true} />}
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />

            {/* Protected Routes */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute user={user}>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute user={user}>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-confirmation"
              element={
                <ProtectedRoute user={user}>
                  <OrderConfirmation />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </CartProvider>
  );
}

export default AppRoutes;
