import React, { useState, useEffect } from "react";
import { Typography, Box, TextField, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom"; // React Router's useNavigate and useLocation
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import api from "../lib/services/api";

const OtpVerification = () => {
  const [resendDisabled, setResendDisabled] = useState(false); // For resend button state
  const navigate = useNavigate(); // Initialize navigate
  const location = useLocation(); // Get current location
  const [redirectTo, setRedirectTo] = useState("login"); // Default redirect to login

  // Check if redirectTo exists in the state passed during navigation
  useEffect(() => {
    if (location.state && location.state.redirectTo) {
      setRedirectTo(location.state.redirectTo); // Set the redirect destination if provided
    }
  }, [location]);

  // OTP validation schema (4 digits)
  const validationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^\d{4}$/, "OTP must be exactly 4 digits")
      .required("OTP is required"),
  });

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema,
    onSubmit: async (data, { resetForm }) => {
      try {
        const email = localStorage.getItem("email");
        const fullData = {
          email,
          ...data,
        };

        // Determine the correct API endpoint
        const endpoint =
          redirectTo === "reset-password"
            ? "auth/verifyForgetPasswordOTP"
            : "auth/verifyUser";

        // Make the request to the selected endpoint
        const response = await api.post(endpoint, fullData);
        toast.success("OTP verified successfully.");
        resetForm();
        setTimeout(() => navigate(`/${redirectTo}`), 1000); // Redirect based on the flow (e.g., reset-password or login)
      } catch (error) {
        console.error("An error occurred:", error.message);
        toast.error("Invalid OTP, please try again.");
      }
    },
  });

  // Handle Resend OTP
  const handleResendOtp = async () => {
    setResendDisabled(true);
    try {
      const email = localStorage.getItem("email");
      await api.post("auth/resendEmailOTP", {
        email,
      });
      toast.success("OTP has been resent to your email.");
      setTimeout(() => setResendDisabled(false), 60000); // Re-enable after 1 min
    } catch (error) {
      console.error("Resend OTP failed:", error.message);
      toast.error("Failed to resend OTP, please try again.");
      setResendDisabled(false);
    }
  };

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
          fontSize: { xs: "42px", sm: "54px" },
          fontWeight: 500,
          mb: 2,
          color: "#1C4771",
        }}
      >
        OTP Verification
      </Typography>
      <Typography sx={{ width: "280px" }}>
        Enter the 4-digit OTP sent to your email to verify your identity.
      </Typography>
      <Box sx={{ mt: 4, width: "300px" }}>
        <Typography sx={{ textAlign: "start", color: "#1C4771" }}>
          OTP
        </Typography>
        <Box sx={{ mb: 2 }}>
          <TextField
            name="otp"
            variant="standard"
            fullWidth
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.otp}
            inputProps={{ maxLength: 4 }} // Restrict to 4 characters
          />
          {formik.touched.otp && formik.errors.otp ? (
            <Typography color="error">{formik.errors.otp}</Typography>
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
          Verify OTP
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography sx={{ color: "#1C4771", cursor: "pointer" }}>
          Didn't receive the OTP?{" "}
          <Button
            onClick={handleResendOtp}
            disabled={resendDisabled}
            sx={{
              textTransform: "capitalize",
              fontWeight: "bold",
              color: resendDisabled ? "grey" : "#1C4771",
            }}
          >
            Resend OTP
          </Button>
        </Typography>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default OtpVerification;
