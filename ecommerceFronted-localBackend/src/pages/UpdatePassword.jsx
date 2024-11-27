import React, { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

const UpdatePassword = () => {
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\s]).{8,}$/;

  const validationSchema = Yup.object({
    oldPassword: Yup.string()
      .matches(passwordRegex, {
        message:
          "Password should have at least 1 uppercase, 1 lowercase, 1 digit, 1 special character, and be at least 8 characters long.",
      })
      .required("Old Password is required"),
    newPassword: Yup.string()
      .matches(passwordRegex, {
        message:
          "Password should have at least 1 uppercase, 1 lowercase, 1 digit, 1 special character, and be at least 8 characters long.",
      })
      .required("New Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (data, { resetForm }) => {
      try {
        const response = await axios.post(
          "https://jsonplaceholder.typicode.com/posts",
          data
        );
        console.log(response.data);
        toast.success("Password updated successfully.");
        resetForm();
      } catch (error) {
        console.error("Error updating password:", error.message);
        toast.error("Failed to update password. Please try again.");
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
        sx={{ fontSize: "54px", fontWeight: 500, mb: 2, color: "#1C4771" }}
      >
        Update Password
      </Typography>
      <Box sx={{ mt: 4, width: "300px" }}>
        {/* Old Password Field */}
        <Typography sx={{ textAlign: "start", color: "#1C4771" }}>
          Old Password
        </Typography>
        <TextField
          name="oldPassword"
          type={showPassword.oldPassword ? "text" : "password"}
          variant="standard"
          fullWidth
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.oldPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility("oldPassword")}
                >
                  {showPassword.oldPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {formik.touched.oldPassword && formik.errors.oldPassword ? (
          <Typography color="error">{formik.errors.oldPassword}</Typography>
        ) : null}

        {/* New Password Field */}
        <Typography sx={{ textAlign: "start", mt: 2, color: "#1C4771" }}>
          New Password
        </Typography>
        <TextField
          name="newPassword"
          type={showPassword.newPassword ? "text" : "password"}
          variant="standard"
          fullWidth
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.newPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility("newPassword")}
                >
                  {showPassword.newPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {formik.touched.newPassword && formik.errors.newPassword ? (
          <Typography color="error">{formik.errors.newPassword}</Typography>
        ) : null}

        {/* Confirm Password Field */}
        <Typography sx={{ textAlign: "start", mt: 2, color: "#1C4771" }}>
          Confirm New Password
        </Typography>
        <TextField
          name="confirmPassword"
          type={showPassword.confirmPassword ? "text" : "password"}
          variant="standard"
          fullWidth
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                >
                  {showPassword.confirmPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
          <Typography color="error">{formik.errors.confirmPassword}</Typography>
        ) : null}
      </Box>

      <Button
        onClick={formik.handleSubmit}
        sx={{
          width: "303px",
          borderRadius: "10px",
          backgroundColor: "#1C4771",
          color: "white",
          mt: 4,
          height: "54px",
          fontSize: "18px",
          textTransform: "capitalize",
          "&:hover": {
            backgroundColor: "#1C4771",
          },
        }}
      >
        Update Password
      </Button>
    </Box>
  );
};

export default UpdatePassword;
