import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { loginUserAsync } from "../../lib/redux/slices/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Check if user is already logged in
    if (storedUser?.token && storedUser?.role) {
      if (storedUser.role === "Admin") {
        navigate("/adminpanel");
      } else if (storedUser.role === "User") {
        navigate("/");
      }
    }
  }, [storedUser, navigate]);

  const clickhandle = () => {
    navigate("/signup");
  };

  const handleForgetPassword = () => {
    navigate("/forget-password");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .matches(
        /^([0-9]+|[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
        "Invalid email or phone number format"
      )
      .required("Username is required"),
    password: Yup.string().required("Password is required"),
    role: Yup.string().required("Role is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: "",
    },
    validationSchema,
    onSubmit: async (data, { resetForm }) => {
      try {
        localStorage.setItem("role", data.role);
        const resultAction = await dispatch(loginUserAsync(data)).unwrap();
        if (resultAction) {
          resetForm();
          setTimeout(() => {
            navigate(
              localStorage.getItem("role")?.role === "Admin"
                ? "/adminpanel"
                : "/"
            );
          }, 1000);
        }
      } catch (error) {
        toast.error("Login failed. Please check your credentials.");
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
          fontSize: { xs: "42px", sm: "54px" },
          fontWeight: 500,
          mb: 2,
          color: "#1C4771",
        }}
      >
        Log In
      </Typography>
      <Typography>
        New to this site?
        <span
          onClick={clickhandle}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          {" "}
          Sign Up
        </span>
      </Typography>
      <Box sx={{ mt: 4, width: "300px" }}>
        <Typography sx={{ textAlign: "start" }}>Username</Typography>
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
        <Typography sx={{ textAlign: "start" }}>Password</Typography>

        <Box sx={{ mb: 2, position: "relative" }}>
          <TextField
            name="password"
            variant="standard"
            fullWidth
            type={showPassword ? "text" : "password"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          <Box
            sx={{
              position: "absolute",
              right: "5px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <VisibilityOff sx={{ color: "gray" }} />
            ) : (
              <Visibility sx={{ color: "gray" }} />
            )}
          </Box>
          {formik.touched.password && formik.errors.password ? (
            <Typography color="error">{formik.errors.password}</Typography>
          ) : null}
        </Box>
        {/* <Typography sx={{ textAlign: "start" }}>Role</Typography> */}
        <Box sx={{ mb: 2, mt: 4.6, textAlign: "start" }}>
          <Select
            name="role"
            variant="standard"
            fullWidth
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.role}
            displayEmpty
          >
            <MenuItem value="" disabled sx={{ display: "none" }}>
              <Typography color="textSecondary">Role</Typography>
            </MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="User">User</MenuItem>
          </Select>
          {formik.touched.role && formik.errors.role ? (
            <Typography color="error">{formik.errors.role}</Typography>
          ) : null}
        </Box>
      </Box>
      <Box sx={{ cursor: "pointer" }} onClick={handleForgetPassword}>
        <Typography sx={{ textDecoration: "underline" }}>
          Forgot Password?
        </Typography>
      </Box>

      <Button
        type="submit"
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
        Log In
      </Button>
      <ToastContainer />
    </Box>
  );
};

export default Login;
