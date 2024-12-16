import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Products from "../pages/Products";
import Contact from "../pages/Contact";
import NotFound from "../components/NotFound";
import Layout from "../components/Layout";
import Cart from "../components/Cart";
import Checkout from "../components/Checkout";
import OrderConfirmation from "../components/OrderConfirmation";
import Login from "../components/Login";
import Signup from "../components/Signup";
import ForgetPassword from "../components/ForgetPassword";
import ProductForm from "../components/Admin/ProductForm";
import OtpVerification from "../components/OtpVerification";
import ResetPassword from "../components/ResetPassword";
import ManageAccount from "../components/ManageAccount";
import EmailUs from "../components/EmailUs";
import AdminPanel from "../components/Admin/AdminPanel";
import { useSelector } from "react-redux";
import PaymentFailed from "../components/PaymentFailed";
import TrackOrder from "../components/TrackOrder";
import Chat from "../components/Chat";
import AdminChat from "../components/Admin/AdminChat";

// ProtectedRoute Component
const ProtectedRoute = ({ user, requiredRole, children }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  const userRole = storedUser.role; // Retrieve role
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  const user = useSelector((state) => state.auth.user);

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
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/admin-chat" element={<AdminChat />} />

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
