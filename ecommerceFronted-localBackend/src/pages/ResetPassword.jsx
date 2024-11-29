import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Use navigate
import { Box, TextField, Typography, Button } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import api from "../../lib/services/api";

// This ResetPassword component allows users to reset their password after OTP verification
const ResetPassword = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]+$/,
        "Password must contain one uppercase, one lowercase, one digit, and one special character"
      ),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"), // Validation to check if passwords match
  });

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (data, { resetForm }) => {
      try {
        const email = localStorage.getItem("email");
        const response = await api.post(
          `auth/resetPassword`, // Replace with your actual API endpoint
          {
            email: email,
            newPassword: data.newPassword,
          }
        );
        resetForm();
        toast.success("Password reset successful. Please log in.");
        setTimeout(() => {
          navigate("/login"); // Redirect to login page after successful password reset
        }, 2000);
      } catch (error) {
        console.error("An error occurred:", error.message);
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
        textAlign: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "32px", sm: "54px" },
          fontWeight: 500,
          m: 2,
          color: "#1C4771",
        }}
      >
        Reset Your Password
      </Typography>
      <Typography sx={{ width: "280px" }}>
        Please enter your new password and confirm it to reset your password.
      </Typography>
      <Box sx={{ mt: 4, width: "300px" }}>
        {/* Password Section */}
        <Typography sx={{ textAlign: "start" }}>Password</Typography>

        <Box sx={{ mb: 1, position: "relative" }}>
          <TextField
            name="newPassword"
            variant="standard"
            fullWidth
            type={showNewPassword ? "text" : "password"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
          />
          <Box
            sx={{
              position: "absolute",
              right: "5px",
              top: "35%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "gray",
            }}
            onClick={togglePasswordVisibility}
          >
            {showNewPassword ? (
              <VisibilityOff sx={{ color: "gray" }} />
            ) : (
              <Visibility sx={{ color: "gray" }} />
            )}
          </Box>
          {formik.touched.newPassword && formik.errors.newPassword ? (
            <Typography color="error">{formik.errors.newPassword}</Typography>
          ) : null}
        </Box>

        <Typography sx={{ textAlign: "start" }}>Confirm Password</Typography>

        <Box sx={{ mb: 2, position: "relative" }}>
          <TextField
            name="confirmPassword"
            variant="standard"
            fullWidth
            type={showConfirmPassword ? "text" : "password"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
          <Box
            sx={{
              position: "absolute",
              right: "5px",
              top: "35%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "gray",
            }}
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? (
              <VisibilityOff sx={{ color: "gray" }} />
            ) : (
              <Visibility sx={{ color: "gray" }} />
            )}
          </Box>
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <Typography color="error">
              {formik.errors.confirmPassword}
            </Typography>
          ) : null}
        </Box>
      </Box>
      <Box>
        <Button
          onClick={formik.handleSubmit}
          sx={{
            width: "303px",
            borderRadius: "10px",
            backgroundColor: "#1C4771",
            color: "white",
            mt: 2,
            height: "54px",
            fontSize: "18px",
            textTransform: "capitalize",
            "&:hover": {
              backgroundColor: "#1C4771",
            },
            "&:active": {
              backgroundColor: "#1C4771",
            },
          }}
        >
          Reset Password
        </Button>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default ResetPassword;
