import React from "react";
import { Typography, Box, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Use React Router's useNavigate
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

// The ForgetPassword component allows users to request a password reset and receive an OTP for verification
const ForgetPassword = () => {
  const navigate = useNavigate(); // Initialize navigate

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (data, { resetForm }) => {
      try {
        const response = await axios.post(
          "https://jsonplaceholder.typicode.com/posts",
          data
        );
        console.log(response.data);
        toast.success(
          "OTP has been sent to your email. Please check your inbox."
        );
        resetForm();

        // Pass `redirectTo` as 'reset-password' to know the flow context
        navigate("/otp-verification", {
          state: { redirectTo: "reset-password" },
        });
      } catch (error) {
        console.error("An error occurred:", error.message);
        toast.error("Something went wrong, please try again.");
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
        Enter your login email and we’ll send you an OTP to reset your password.
      </Typography>
      <Box sx={{ mt: 4, width: "300px" }}>
        <Typography sx={{ textAlign: "start", color: "#1C4771" }}>
          Email
        </Typography>
        <Box sx={{ mb: 2 }}>
          <TextField
            name="email"
            variant="standard"
            fullWidth
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <Typography color="error">{formik.errors.email}</Typography>
          ) : null}
        </Box>
      </Box>
      <Box>
        <Button
          onClick={formik.handleSubmit}
          sx={{
            width: "303px",
            borderRadius: "10px",
            backgroundColor: "#1C4771", // Primary color for button background
            color: "white",
            mt: 2,
            height: "54px",
            fontSize: "18px",
            textTransform: "capitalize",
            "&:hover": {
              backgroundColor: "#1C4771", // Hover state with primary color
            },
            "&:active": {
              backgroundColor: "#1C4771", // Active state with primary color
            },
          }}
        >
          Send OTP
        </Button>
      </Box>
    </Box>
  );
};

export default ForgetPassword;
