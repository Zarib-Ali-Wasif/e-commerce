import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Products from "../pages/Products";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Layout from "../components/Layout";
import Cart from "../components/Cart";
import Checkout from "../components/Checkout";
import OrderConfirmation from "../components/OrderConfirmation";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgetPassword from "../pages/ForgetPassword";
import ProductForm from "../components/Admin/ProductForm";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import ManageAccount from "../components/ManageAccount";
import EmailUs from "../components/EmailUs";
import AdminPanel from "../components/Admin/AdminPanel";

// ProtectedRoute Component
const ProtectedRoute = ({ user, requiredRole, children }) => {
  // Check if user is logged in and if the role matches the required role
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role; // Assuming 'role' is stored in user object
  if (requiredRole && userRole !== requiredRole) {
    // If the role does not match, redirect to not found page or home
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  const user = JSON.parse(localStorage.getItem("user")); // Assuming user data is stored in localStorage

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<Products showModal={true} />} />
          <Route path="/add-product" element={<ProductForm />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/otp-verification" element={<OtpVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/email-us" element={<EmailUs />} />

          {/* Protected Routes */}

          <Route
            path="/order-confirmation"
            element={
              <ProtectedRoute user={user}>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />

          {/* User Protected Route */}
          <Route
            path="/manage-account"
            element={
              <ProtectedRoute user={user} requiredRole="User">
                <ManageAccount />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Route */}
          <Route
            path="/admin-panel"
            element={
              <ProtectedRoute user={user} requiredRole="Admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default AppRoutes;
