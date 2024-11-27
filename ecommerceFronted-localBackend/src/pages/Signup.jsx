import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  TextField,
  Avatar,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import api from "../../lib/services/api";
import VisibilityIcon from "@mui/icons-material/Visibility";

const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(true);
  const [patientProfilePicture, setPatientProfilePicture] = useState();
  const [file, setFile] = useState(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    const imageUrl = URL.createObjectURL(uploadedFile);
    setPatientProfilePicture(imageUrl);
  };

  const clickhandle = () => {
    navigate("/login");
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    contactNumber: Yup.string()
      .matches(
        /^[\d+_]+$/,
        "Contact number must contain only digits, '+' or '_'"
      )
      .required("Contact number is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]+$/,
        "Password must contain one uppercase, one lowercase, one digit, and one special character"
      ),
  });

  const formik = useFormik({
    initialValues: {
      profilePic: "",
      name: "",
      email: "",
      contactNumber: "",
      password: "",
      gender: "",
      age: "",
    },
    validationSchema,
    onSubmit: async (data, { resetForm }) => {
      try {
        const formData = new FormData();
        if (file) {
          formData.append("image", file);
        }

        const imageResponse = file
          ? await api.post("image/upload/single", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            })
          : { data: "" };
        console.log("Image Upload Response:", imageResponse.data);

        const imageUrl = imageResponse.data;

        const patientData = {
          ...data,
          profilePic: imageUrl || "",
        };

        const response = await api.post("patient", patientData);
        console.log(response.data);
        if (typeof window !== "undefined") {
          localStorage.setItem("userEmail", data.email);
          navigate("/otp");
        }
        resetForm();
        toast.success("Sign up successful!");
      } catch (error) {
        console.error("An error occurred:", error.message);
        toast.error("Error: Failed to sign up. Please try again later.");
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
        padding: 2, // Add some padding to the container for better spacing
      }}
    >
      {/* Sign-up Heading */}
      <Typography
        sx={{
          fontSize: "64px",
          fontWeight: 500,
          mb: 2,
          mt: 12,
          color: "#1C4771", //  replace with your desired color code
        }}
      >
        Sign Up
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Already a member?{" "}
        <span
          onClick={clickhandle}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          Log In
        </span>{" "}
      </Typography>

      {/* Profile Picture Section */}
      <Box sx={{ mt: 2 }}>
        <label htmlFor="avatarInput">
          <Avatar
            alt="Patient Profile"
            src={patientProfilePicture}
            sx={{
              width: "100px",
              height: "100px",
              cursor: "pointer",
              margin: "auto",
            }}
          />
        </label>
        <input
          id="avatarInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
      </Box>

      {/* Form Fields */}
      <Box sx={{ width: "300px", mt: 3 }}>
        <Typography sx={{ textAlign: "start" }}>Name</Typography>
        <Box sx={{ mb: 1 }}>
          <TextField
            name="name"
            variant="standard"
            fullWidth
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.email && formik.errors.name ? (
            <Typography color="error">{formik.errors.name}</Typography>
          ) : null}
        </Box>

        <Typography sx={{ textAlign: "start" }}>Email</Typography>
        <Box sx={{ mb: 1 }}>
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

        <Typography sx={{ textAlign: "start" }}>Contact Number</Typography>
        <Box sx={{ mb: 1 }}>
          <TextField
            name="contactNumber"
            variant="standard"
            fullWidth
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.contactNumber}
          />
          {formik.touched.email && formik.errors.contactNumber ? (
            <Typography color="error">{formik.errors.contactNumber}</Typography>
          ) : null}
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: "10px",
            mb: 2,
            mt: 2,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ width: "45%" }}>
            <TextField
              name="age"
              variant="standard"
              fullWidth
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.age}
              placeholder="Age"
              sx={{
                height: "45px", // Ensure equal height
                "& .MuiInputBase-root": {
                  height: "45px", // Make sure the input field is the same height as Select
                },
              }}
            />
            {formik.touched.age && formik.errors.age ? (
              <Typography color="error">{formik.errors.age}</Typography>
            ) : null}
          </Box>

          <Box sx={{ width: "45%" }}>
            <FormControl fullWidth variant="standard">
              <Select
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                displayEmpty
                fullWidth
                sx={{
                  height: "45px", // Set height for the select component
                  "& .MuiSelect-select": {
                    paddingTop: "10px", // Adjust padding if needed to center the text vertically
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Gender
                </MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            {formik.touched.gender && formik.errors.gender ? (
              <Typography color="error">{formik.errors.gender}</Typography>
            ) : null}
          </Box>
        </Box>

        {/* Password Section */}
        <Typography sx={{ textAlign: "start" }}>Password</Typography>
        <Box sx={{ mb: 1, position: "relative" }}>
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
          >
            {showPassword ? "Hide" : "Show"}
          </VisibilityIcon>
          {formik.touched.password && formik.errors.password ? (
            <Typography color="error">{formik.errors.password}</Typography>
          ) : null}
        </Box>
      </Box>

      {/* Sign-up Button */}
      <Box>
        <Button
          onClick={formik.handleSubmit}
          sx={{
            width: "303px",
            border: "1px solid #1C4771", // Change to the desired color
            borderRadius: "4px",
            color: "#1C4771", // Button text color
            mt: 2,
            fontSize: "18px",
            textTransform: "capitalize",
            "&:hover": {
              backgroundColor: "#1C4771", // Hover background color
              color: "white", // Hover text color
            },
            "&:active": {
              backgroundColor: "#1C4771", // Active background color
              color: "white", // Active text color
            },
          }}
        >
          Sign Up
        </Button>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default Signup;
