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
import { useDispatch, useSelector } from "react-redux";
import { loginUserAsync } from "../../lib/redux/slices/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const data = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data.token && data.role) {
      if (data.role === "Admin") {
        navigate("/adminpanel");
      } else if (data.role === "User") {
        navigate("/");
      }
    }
  }, [data, navigate]);

  const clickhandle = () => {
    navigate("/signup");
  };

  const handleForgetPassword = () => {
    navigate("/forgetpassword");
  };

  const [showPassword, setShowPassword] = useState(true);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .matches(
        /^([0-9]+|[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
        "Invalid email or phone number format"
      )
      .required("Username is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      role: "",
    },
    validationSchema,
    onSubmit: (data, { resetForm }) => {
      try {
        dispatch(loginUserAsync(data));
        toast.success("Login successful!");
        resetForm();
      } catch (e) {
        toast.error("Login failed, please try again.");
        console.log(e.message);
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
        sx={{ fontSize: "64px", fontWeight: 500, mb: 2, color: "#1C4771" }}
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
            name="username"
            variant="standard"
            fullWidth
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
          {formik.touched.username && formik.errors.username ? (
            <Typography color="error">{formik.errors.username}</Typography>
          ) : null}
        </Box>
        <Typography sx={{ textAlign: "start" }}>Password</Typography>
        {/* <Box sx={{ mb: 2, position: "relative" }}>
          <TextField
            name="password"
            variant="standard"
            fullWidth
            type={showPassword ? "password" : "text"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          <VisibilityIcon
            sx={{
              position: "absolute",
              right: "5px",
              top: "35%",
              transform: "translateY(-50%)",
              border: "none",
              cursor: "pointer",
              color: "gray",
            }}
            onClick={togglePasswordVisibility}
          />
          {formik.touched.password && formik.errors.password ? (
            <Typography color="error">{formik.errors.password}</Typography>
          ) : null}
        </Box> */}
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
            // textAlign="start"
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
          Forget Password?
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
