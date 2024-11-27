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
import Signup from "../pages/Signup"; // Import Signup page
import ForgetPassword from "../pages/ForgetPassword";
import AddProduct from "../pages/AddProduct";
import OtpVerification from "../pages/OtpVerification";
import UpdatePassword from "../pages/UpdatePassword";
import ResetPassword from "../pages/ResetPassword";
// import { AuthContext } from "../context/AuthContext";

// ProtectedRoute Component
// const ProtectedRoute = ({ user, children }) => {
//   return user ? children : <Navigate to="/login" replace />;
// };

function AppRoutes() {
  // const { user } = useContext(AuthContext); // Fetch authenticated user from context

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
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />

            {/* Protected Routes */}
            <Route
              path="/cart"
              element={
                // <ProtectedRoute user={user}>
                <Cart />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                // <ProtectedRoute user={user}>
                <Checkout />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/order-confirmation"
              element={
                // <ProtectedRoute user={user}>
                <OrderConfirmation />
                // </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </CartProvider>
  );
}

export default AppRoutes;
